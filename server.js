require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { fetchCopartLots } = require('./copart-fetcher');

const app = express();
const port = Number(process.env.PORT) || 3000;
const db = { lots: [], settings: { MIN_YEAR: 2018, SALE_TYPE: 'PURE SALE', TOP_N: 50, MAKES: [], EMAIL_TO: '' }, lastFetch: null, fetchError: null };
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '*').split(',').map(x => x.trim()).filter(Boolean);

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors({ origin: allowedOrigins.includes('*') ? '*' : allowedOrigins }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
app.use(express.static(path.join(__dirname, 'public')));

function publicSettings() { return { ...db.settings }; }
function applyFilters(lots) {
  const s = db.settings;
  return lots.filter(l => (!s.MIN_YEAR || Number(l.year) >= s.MIN_YEAR) && (!s.MAKES.length || s.MAKES.includes(String(l.make).toUpperCase())) && (s.SALE_TYPE === 'ALL' || !s.SALE_TYPE || String(l.saleType).toUpperCase() === String(s.SALE_TYPE).toUpperCase())).slice(0, Math.max(1, s.TOP_N || 50));
}

app.get('/health', (req, res) => res.json({ status: 'ok', lots: db.lots.length, lastFetch: db.lastFetch, fetchError: db.fetchError }));
app.get('/api/lots', (req, res) => res.json({ lots: applyFilters(db.lots), lastFetch: db.lastFetch, error: db.fetchError }));
app.get('/api/settings', (req, res) => res.json(publicSettings()));
app.post('/api/settings', (req, res) => {
  const b = req.body || {};
  db.settings = { ...db.settings, MIN_YEAR: Number(b.MIN_YEAR) || 0, SALE_TYPE: String(b.SALE_TYPE || 'ALL'), TOP_N: Math.min(500, Math.max(1, Number(b.TOP_N) || 50)), MAKES: Array.isArray(b.MAKES) ? b.MAKES.map(String) : [], EMAIL_TO: String(b.EMAIL_TO || '') };
  res.json({ success: true, settings: publicSettings() });
});
app.post('/api/admin/fetch', async (req, res) => { const result = await runFetch(); res.status(result.ok ? 200 : 502).json(result); });
app.get('/api/status', (req, res) => res.json({ configured: Boolean(process.env.COPART_SEARCH_URL), lastFetch: db.lastFetch, count: applyFilters(db.lots).length, error: db.fetchError }));
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

async function runFetch() {
  try {
    if (!process.env.COPART_SEARCH_URL) throw new Error('COPART_SEARCH_URL is not configured');
    const lots = await fetchCopartLots(process.env.COPART_SEARCH_URL);
    db.lots = lots;
    db.lastFetch = new Date().toISOString();
    db.fetchError = null;
    return { ok: true, count: lots.length, lastFetch: db.lastFetch };
  } catch (error) {
    db.fetchError = error.message;
    console.error('Copart fetch failed:', error.message);
    return { ok: false, error: error.message };
  }
}

const server = app.listen(port, '0.0.0.0', () => console.log(`Server listening on ${port}`));
if (process.env.COPART_SEARCH_URL) { runFetch(); setInterval(runFetch, Math.max(5, Number(process.env.FETCH_INTERVAL_MINUTES) || 15) * 60 * 1000); }
function shutdown() { server.close(() => process.exit(0)); setTimeout(() => process.exit(1), 10000).unref(); }
process.once('SIGTERM', shutdown); process.once('SIGINT', shutdown);
