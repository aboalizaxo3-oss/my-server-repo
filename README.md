# Kawar Copart Cloud Server

سيرفر Express يعرض واجهة كاوار ويجلب HTML العام من رابط Copart محدد في `COPART_SEARCH_URL`.

## تطبيق سطح المكتب Electron

تمت إضافة دعم تطبيق سطح المكتب. الآن يمكن تشغيل التطبيق كواجهة Desktop باستخدام:

```bash
npm install
npm run desktop
```

هذا يبدأ السيرفر الداخلي داخل التطبيق ثم يفتح واجهة الويب داخل نافذة Electron.

## البناء إلى ملف EXE أو AppImage

لتجميع التطبيق إلى ملف_installable:

```bash
npm run dist
```

- على Windows ستنتج ملف `.exe` عبر NSIS
- على Linux ستنتج `AppImage`
- على macOS ستنتج `dmg`

## حماية الجلب اليدوي

المسار `POST /api/admin/fetch` محمي بمفتاح موجود في متغير البيئة `ADMIN_API_KEY`.

## التشغيل المحلي

```bash
npm install
cp .env.example .env
npm run desktop
```

## ملاحظات

- لا تضع أي مفاتيح أو كلمات مرور داخل GitHub.
- استخدم Render أو متغيرات البيئة في التشغيل السحابي.
- بالنسبة لـ `.exe` الحقيقي، تحتاج أن تقوم ببناء الملف على جهاز Windows فعليًا.
