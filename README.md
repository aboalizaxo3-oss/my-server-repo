# Kawar Copart Cloud Server

سيرفر Express يعرض واجهة كاوار ويجلب HTML العام من رابط Copart محدد في `COPART_SEARCH_URL`.

## حماية الجلب اليدوي

المسار `POST /api/admin/fetch` محمي بمفتاح موجود في متغير البيئة `ADMIN_API_KEY`. لا تضع المفتاح داخل GitHub أو داخل الكود. من Render افتح **Environment → Environment Variables** وأضف:

```env
ADMIN_API_KEY=ضع_مفتاحًا_سريًا_قويًا_هنا
```

يمكن إرسال المفتاح بإحدى الطريقتين:

```bash
curl -X POST https://YOUR-SERVICE.onrender.com/api/admin/fetch -H "x-admin-key: YOUR_SECRET"
curl -X POST https://YOUR-SERVICE.onrender.com/api/admin/fetch -H "Authorization: Bearer YOUR_SECRET"
```

الواجهة تطلب المفتاح عند الضغط على زر الجلب وتحفظه مؤقتًا في `sessionStorage` فقط.

## التشغيل

```bash
npm install
cp .env.example .env
# أضف COPART_SEARCH_URL و ADMIN_API_KEY في .env
npm start
```

## الأمان

لا تستخدم مفتاحًا قصيرًا أو منشورًا في المحادثات العامة. بما أن المفتاح `123654` ظهر في المحادثة، يُنصح بتغييره إلى قيمة عشوائية طويلة قبل النشر. لا يتجاوز هذا المشروع تسجيل الدخول أو CAPTCHA أو الحظر في Copart.
