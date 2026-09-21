# Kawar Copart Cloud Server

سيرفر Express مع تطبيق Electron لسطح المكتب ودعم PWA للآيفون وأجهزة الهاتف.

## استخدامه على iPhone كـ PWA

1. انشر الخدمة على Render باستخدام `render.yaml`.
2. افتح رابط الخدمة في Safari، ويجب أن يبدأ بـ `https://`.
3. اضغط زر المشاركة في Safari.
4. اختر **إضافة إلى الشاشة الرئيسية**.
5. افتح التطبيق من الأيقونة ليعمل بواجهة مستقلة تشبه التطبيق الأصلي.

يدعم المشروع `manifest.webmanifest` و`sw.js` ووسم Apple الخاص بالتثبيت، ويعمل دون الحاجة إلى Xcode أو حساب Apple Developer عند استخدامه كـ PWA.

## تشغيل Electron

```bash
npm install
npm run desktop
```

## بناء تطبيق سطح المكتب

```bash
npm run dist
```

## حماية الجلب اليدوي

أضف `ADMIN_API_KEY` في متغيرات Render. لا تضع المفتاح في GitHub. الزر داخل الواجهة يطلب المفتاح ويحفظه مؤقتًا في `sessionStorage`.

## ملاحظات PWA

- يجب استخدام HTTPS؛ Render يوفر HTTPS تلقائيًا.
- لا يمكن لـ PWA تجاوز CAPTCHA أو تسجيل الدخول في Copart.
- بيانات `/api` لا تُخزّن في Service Worker حتى تبقى النتائج حديثة.
- أي تغيير كبير على الواجهة يستحسن أن يرفع رقم `CACHE_NAME` في `public/sw.js`.
