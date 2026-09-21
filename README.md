# Kawar Copart Cloud Server

سيرفر Express يعرض واجهة كاوار ويجلب HTML العام من رابط Copart مُحدد في `COPART_SEARCH_URL`، ثم يقدمه عبر `/api/lots`.

## مهم
هذا الإصدار لا يتجاوز تسجيل الدخول أو CAPTCHA أو الحظر، ولا يجلب صفحات غير مصرح بها. يجب استخدام رابط عام مسموح به والالتزام بشروط Copart. تغيّر بنية Copart قد يتطلب تعديل `copart-fetcher.js`.

## التشغيل

```bash
npm install
cp .env.example .env
# ضع رابط بحث/قائمة عامة مصرحًا بها في COPART_SEARCH_URL
npm start
```

افتح `http://localhost:3000`.

## API

- `GET /health`
- `GET /api/lots`
- `GET /api/settings`
- `POST /api/settings`
- `POST /api/admin/fetch`

## Render

اختر **New → Blueprint** ثم هذا المستودع. أضف قيمة `COPART_SEARCH_URL` في Environment Variables. لا تضع كلمات مرور Gmail أو أي مفاتيح في GitHub. خدمة Render المجانية قد تتوقف عند عدم الاستخدام، والبيانات الحالية في الذاكرة ستُفقد عند إعادة التشغيل؛ للإنتاج أضف PostgreSQL أو Redis.

## التنبيهات والبريد

تم تجهيز متغيرات SMTP في `.env.example` فقط. لم نفعّل إرسال البريد قبل إضافة قاعدة بيانات وتحديد قواعد التنبيه؛ لا تحفظ كلمة مرور Gmail في الواجهة.
