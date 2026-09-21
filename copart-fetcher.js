const cheerio = require('cheerio');

// This fetcher reads publicly accessible Copart HTML only. It does not bypass
// authentication, CAPTCHA, robots controls, or other access restrictions.
async function fetchCopartLots(url) {
  const response = await fetch(url, { headers: { 'User-Agent': process.env.HTTP_USER_AGENT || 'KawarAuctionMonitor/1.0 (+contact-admin)' } });
  if (!response.ok) throw new Error(`Copart returned HTTP ${response.status}`);
  const html = await response.text();
  const $ = cheerio.load(html);
  const lots = [];
  $('[data-lot-number], .search-results-card, [class*="vehicle-card"], [class*="lot-card"]').each((_, el) => {
    const root = $(el);
    const text = root.text().replace(/\s+/g, ' ').trim();
    const link = root.find('a[href*="lot"], a[href*="vehicle"], a').first().attr('href');
    const image = root.find('img').first().attr('src') || root.find('img').first().attr('data-src');
    const lot = root.attr('data-lot-number') || text.match(/(?:lot|لوت)\s*[:#]?\s*(\d{4,})/i)?.[1];
    if (!lot && !link) return;
    const year = text.match(/\b(19|20)\d{2}\b/)?.[0] || '';
    const bid = Number((text.match(/(?:\$|USD\s*)([\d,]+)/i)?.[1] || '0').replace(/,/g, '')) || 0;
    lots.push({ lot: String(lot || ''), year: Number(year) || 0, make: '', model: '', bid, saleType: '', text, image: image ? new URL(image, url).href : '', url: link ? new URL(link, url).href : url });
  });
  return [...new Map(lots.map(l => [l.lot || l.url, l])).values()];
}
module.exports = { fetchCopartLots };
