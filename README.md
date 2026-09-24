<div align="center">

# 📖 QuranMind — منصة البحث القرآني والحديثي المعززة بالذكاء الاصطناعي
### AI-Powered Quranic & Hadith Academic Research Workspace & Public REST API

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![OpenAPI 3.1](https://img.shields.io/badge/OpenAPI-3.1-green?style=for-the-badge&logo=openapi-initiative)](http://localhost:3000/v1/openapi.json)
[![SlickPay](https://img.shields.io/badge/Payments-SlickPay%20%28SATIM%20DZD%29-orange?style=for-the-badge)](https://slick-pay.com)
[![Stripe](https://img.shields.io/badge/Payments-Stripe%20%28USD%2FEUR%29-purple?style=for-the-badge&logo=stripe)](https://stripe.com)
[![License](https://img.shields.io/badge/License-MIT-teal?style=for-the-badge)](LICENSE)

<p align="center">
  <strong>منظومة أكاديمية متكاملة لدراسة القرآن الكريم والحديث الشريف عبر التحليل النصي، الصرفي، اللغوي، شبكات الأسانيد، وعلم المصطلح، مع واجهة برمجية RESTful مفتوحة وتوثيق تفاعلي متقدم.</strong>
</p>

[استكشف واجهة الباحث التفاعلية](http://localhost:3000/workspace) • [لوحة التحكم](http://localhost:3000/dashboard) • [توثيق الـ API المباشر](http://localhost:3000/dashboard/api-docs) • [مواصفة OpenAPI](http://localhost:3000/v1/openapi.json)

---

</div>

## 📑 فهرس المحتويات (Table of Contents)

1. [نظرة عامة على المشروع (Project Overview)](#-نظرة-عامة-على-المشروع-project-overview)
2. [المعمارية المعرفية والمنهجية العلمية (Epistemological Framework)](#-المعمارية-المعرفية-والمنهجية-العلمية)
3. [المكونات والوحدات الرئيسية (Core Features & Modules)](#-المكونات-والوحدات-الرئيسية)
   - [مختبر البحث ثلاثي الألواح (3-Pane Research Workspace)](#1-مختبر-البحث-ثلاثي-الألواح-workspace)
   - [المصحف الشريف الرقمي التفاعلي (Authentic Mushaf Reader)](#2-المصحف-الشريف-الرقمي-التفاعلي)
   - [شريط التبويبات المتعدد (Multi-Tab Navigation Strip)](#3-شريط-التبويبات-المتعدد-navigation-strip)
   - [محرك علم المصطلح وتتبع الأسانيد (Mustalah & Isnad Engine)](#4-محرك-علم-المصطلح-وتتبع-الأسانيد)
   - [دفتر الملاحظات والتدوين الذكي (Personal Study Notes)](#5-دفتر-الملاحظات-والتدوين-الذكي)
   - [إعدادات الحساب والمحركات الذكية (User Settings & Inference)](#6-إعدادات-الحساب-والمحركات-الذكية)
   - [لوحة الإدارة المركزية والمدفوعات (Admin Portal & Gateways)](#7-لوحة-الإدارة-المركزية-والمدفوعات)
4. [دليل الواجهة البرمجية العامة الكامل (Public REST API Reference)](#-دليل-الواجهة-البرمجية-العامة-الكامل-public-rest-api-v1)
   - [القواعد العامة والتهيئة (Base URL, Rate Limits & ID Format)](#قواعد-الـ-api-العامة)
   - [نقاط نهاية القرآن الكريم (Quran Endpoints)](#1-نقاط-نهاية-القرآن-الكريم-quran)
   - [نقاط نهاية الحديث الشريف والرواة (Hadith & Narrators Endpoints)](#2-نقاط-نهاية-الحديث-الشريف-والرواة-hadith--narrators)
   - [نقاط نهاية المصطلح والعوائل (Mustalah & Hadith Families)](#3-نقاط-نهاية-علم-المصطلح-والعوائل-mustalah--families)
   - [البحث الشامل والاستعلام التوليدي المباشر (Search & Streaming Ask)](#4-البحث-الشامل-والاستعلام-التوليدي-search--streaming-ask)
   - [المكتبة التراثية وإحصائيات النظام (Books & System Meta)](#5-المكتبة-التراثية-وإحصائيات-النظام-books--meta)
5. [بوابات الدفع الإلكتروني (Payment Gateways Integration)](#-بوابات-الدفع-الإلكتروني)
   - [بوابة SlickPay (البطاقة الذهبية / CIB - الجزائر)](#-بوابة-slickpay-الجزائر---dzd)
   - [بوابة Stripe (البطاقات العالمية والدولية)](#-بوابة-stripe-الدولية---usdeur)
6. [التكنولوجيا المستخدمة (Tech Stack)](#-التكنولوجيا-المستخدمة-tech-stack)
7. [التشغيل والتثبيت المحلي (Installation & Setup)](#-التشغيل-والتثبيت-المحلي)
8. [فريق العمل والترخيص (License & Authors)](#-الترخيص)

---

## 🌟 نظرة عامة على المشروع (Project Overview)

**QuranMind** ليس مجرد قارئ للقرآن أو روبوت دردشة تقليدي؛ بل هو **بيئة بحثية متقدمة (Academic Research Workspace)** تدمج بين نصوص القرآن الكريم، أمهات كتب الحديث، دواوين السنة، تراجم الرواة، كتب الجرح والتعديل، ومناهج علم المصطلح، مدعومة بمحركات حسابية قطعية ونماذج ذكاء اصطناعي متخصصة.

### الأهداف الأساسية للمنصة:
1. **التحقيق المعرفي المنضبط**: الربط المباشر بين الآيات والأحاديث المسندة والتفاسير المعتمدة دون اختلاق أو تزييف.
2. **الشفافية المعرفية الصارمة**: الفصل الحاسم بين النص القرآني الموثق، الملاحظة الإحصائية المحسوبة، والتفسير أو الفرضية البحثية.
3. **تتبع شبكات الأسانيد (Graph RAG & Isnad Topology)**: تحويل السند الإسنادي إلى رسم بياني معرفي تفاعلي يوضح اتصال الرواة، مراتبهم عند نقاد الحديث (البخاري، مسلم، ابن حجر، الذهبي)، ومواضع التحويل والانقطاع.
4. **خدمة الباحثين والمطورين**: توفير واجهة برمجية كاملة `v1` متوافقة مع معيار `ilm` ومواصفة `OpenAPI 3.1` لتمكين التطبيقات الخارجية والباحثين من الاستفادة من قاعدة البيانات المرقمنة.

---

## 🧭 المعمارية المعرفية والمنهجية العلمية

تعتمد المنصة تصنيفاً رباعي الطبقات لكل معلومة أو استنتاج بحثي، مما يحمي المستخدم من الخلط بين الحقائق القطعية والاجتهادات الشخصية:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        المراتب المعرفية لمنصة QuranMind                │
├────────────────────────────────┬───────────────────────────────────────┤
│ 1. النص القطعي الموثق          │ نص القرآن الكريم برسم المصحف العثماني   │
│   (Verified Divine Text)       │ ومتون الأحاديث النبوية المسندة.        │
├────────────────────────────────┼───────────────────────────────────────┤
│ 2. الملاحظة الحسابية المباشرة  │ الإحصاء الدقيق للأحرف، الجذور اللغوية، │
│   (Empirical Observation)      │ وتراكيب الكلمات المتطابقة والمتقابلة.  │
├────────────────────────────────┼───────────────────────────────────────┤
│ 3. الحساب والتحليل الإحصائي    │ نسب التكرار، مصفوفات التناظر،         │
│   (Mathematical Calculation)   │ ودرجات اتساع المرويات وطرق الحديث.     │
├────────────────────────────────┼───────────────────────────────────────┤
│ 4. الفرضية والتأويل الاستنباطي │ التفسير المقارن، الربط المعنوي،       │
│   (Scholarly Hypothesis)       │ واستخلاص الدلالات التي تحتمل النقاش.   │
└────────────────────────────────┴───────────────────────────────────────┘
```

---

## 🧩 المكونات والوحدات الرئيسية

### 1. مختبر البحث ثلاثي الألواح (`/workspace`)
بيئة عمل تفاعلية علمية مصممة للباحثين، تتألف من 3 أعمدة رئيسية متكاملة:
- **اللوح الأيمن (شريط الأدوات والفهرس)**: يتيح التنقل السريع بين السور والأجزاء، إدارة الفرضيات البحثية، وحفظ المشاريع.
- **اللوح الأوسط (شاشة المصحف والتحليل البصري)**: يتيح قراءة القرآن، عرض شجرة الجذور الصرفية، فحص الآيات المتشابهة، وتصور شبكات الأسانيد التفاعلية.
- **اللوح الأيسر (الوكيل الذكي وسلسلة الأدلة)**: محادثة ذكية تفاعلية موجهة للبحث القرآني، تقوم باستخراج الأدلة وربطها بالآيات تلقائياً.

### 2. المصحف الشريف الرقمي التفاعلي
- محاكاة دقيقة للمصحف الشريف الورقي بإطار ذهبي مزخرف، ترويسات السور، وعلامات الآيات العثمانية (`﴿١﴾`).
- **إضافة فورية إلى الوكيل الذكي**: بمجرد النقر على أي آية يظهر شريط التحكم الفوري الذي يتضمن زر **«إضافة الآية إلى الوكيل الذكي»**، ليتم تضمين الآية مباشرة كمرجع وسياق في محادثة الذكاء الاصطناعي الجانبية.
- الاستماع الصوتي بأصوات كبار القراء (الحصري، المنشاوي، عبد الباسط، العفاسي) مع تمييز الكلمات المرتلة.

### 3. شريط التبويبات المتعدد (Navigation Strip)
يقع أسفل شريط التنقل العلوي في `/dashboard`، ويتيح فتح الأدوات في تبويبات مستقلة ومتزامنة دون فقدان السياق:
- **الرئيسية (Dashboard)**: الإحصاءات العامة والوصول السريع ومصحف الصفحة الرئيسية.
- **المصحف الشريف (Quran)**: المصحف الكامل مع خيارات الاستماع والبحث.
- **مختبر التحليل (Analysis Workbench)**: حساب تكرار الأحرف والجذور وتحليل التناظر العددي.
- **استكشاف الأسانيد (Isnad Graph)**: استعراض شجرة الرواة ومسارات النقل.
- **علم المصطلح (Mustalah)**: كشف المتابعات والشواهد وتصنيف درجات الحديث (متواتر، مشهور، عزيز، غريب).
- **الملاحظات (Notes)**: دفتر التدوين الأكاديمي مع دعم الوسوم و `@mention`.
- **التوثيق البرمجي (API Docs)**: كونسول تجربة واجهة الـ REST API مباشرة من المتصفح.
- **إعدادات الحساب (Settings)**: التحكم في الحساب والموديلات والاشتراكات.

### 4. محرك علم المصطلح وتتبع الأسانيد
- **كشف المتابعات والشواهد (Corroboration Detection)**:
  - **المتابعة (Mutaba'ah)**: مروية أخرى لنفس الحديث عن نفس الصحابي من طريق آخر، لتقوية السند واكتشاف الرواة المتفردين.
  - **الشاهد (Shahid)**: مروية توافق الحديث في المعنى أو اللفظ لكن عن صحابي آخر.
- **تصنيف اتساع الحديث (Breadth Levels)**: تصنيف تلقائي للحديث بناءً على عدد الطرق في كل طبقة (متواتر، مشهور، عزيز، غريب).
- **مقارنة المتون الدقيقة (Word-Level Matn Diffing)**: تلوين الزيادات والاختلافات اللفظية بين روايات الحديث الواحد (مثلاً رواية الزهري عن أنس مقارنة برواية قتادة).

### 5. دفتر الملاحظات والتدوين الذكي
- نظام تدوين غني يدعم Markdown.
- **التضمين التلقائي بالإشارة (`@mentions`)**: كتابة `@ayah:36:40` أو `@hadith:bukhari:1` تقوم بتضمين بطاقة الآية أو الحديث مع ترجمتها وتخريجها تلقائياً داخل الملاحظة.
- تنظيم بالمجلدات والوسوم والتصنيف اللوني، مع إمكانية تصدير الملاحظات إلى PDF أو Markdown.

### 6. إعدادات الحساب والمحركات الذكية (`/dashboard/settings`)
تتضمن 5 أقسام رئيسية متكاملة:
1. **الملف الشخصي (Profile)**: إدارة الاسم، البريد، المؤسسة البحثية، والاهتمامات العلمية.
2. **الأمان وكلمة المرور (Security & 2FA)**: تغيير كلمة المرور، تفعيل التحقق الثنائي بخطوتين، وسجل الجلسات النشطة.
3. **الاشتراكات والفوترة (Billing & Plans)**: عرض الخطة الحالية، تجديد الاشتراك عبر SlickPay أو Stripe، وتحميل فواتير الدفع الرسمية.
4. **محركات الذكاء الاصطناعي (AI Model Setup)**:
   - التبديل بين النماذج الرائدة: `GPT-4o`, `Claude 3.5 Sonnet`, `DeepSeek R1 (Reasoning)`, `Llama 3.3 70B`.
   - ميزة **BYOK (Bring Your Own Key)**: للباحثين الراغبين في استخدام مفاتيح API الخاصة بهم بأمان وتشفير محلي.
5. **تفضيلات المصحف والبحث (Preferences)**: اختيار التفسير الافتراضي، الخط العثماني، القارئ المفضل، ودرجة التدقيق الإسنادي.

### 7. لوحة الإدارة المركزية والمدفوعات (`/admin`)
- مسار محمي ومعزول بالكامل عن لوحة المستخدمين العامة، مع شاشة دخول خاصة به (`/admin/login`).
- إدارة كافة المستخدمين، حظر وتفعيل الحسابات، وترقية الرتب (مجاني، باحث، مؤسسي).
- لوحة مراقبة المعاملات المالية الموحدة للبوابتين (SlickPay بالدينار الجزائري و Stripe بالدولار).
- إدارة السجلات والنشاط والعمليات المجهدة للنظام.

---

## 🔌 دليل الواجهة البرمجية العامة الكامل (Public REST API /v1/*)

تم تصميم وتطبيق الواجهة البرمجية لتطابق تماماً مواصفة **Ilm API** القياسية المذكورة في [`context/API.md`](file:///home/parzival/Desktop/projects/quranmind/context/API.md).

### قواعد الـ API العامة:
- **Base URL**: `http://localhost:3000/v1` (المسار المحلي) أو `https://api.quranmind.ai/v1` (المسار الإنتاجي).
- **الوصول والتوثيق (Auth)**: وصول عام ومفتوح دون الحاجة إلى مفاتيح خاصة للعمليات العامة.
- **حدود الاستخدام (Rate Limiting)**:
  - عمليات القراءة والبحث: **60 طلب/دقيقة لكل IP**.
  - عمليات الاستعلام التوليدي والذكاء (`/v1/ask/*`): **10 طلبات/دقيقة لكل IP**.
- **صيغة المعرفات (ID Conventions)**:
  - الأحاديث: `{collection_code}:{number}`، مثال: `bukhari:1`, `muslim:42`, `abudawud:1`.
  - الآيات: `/v1/quran/ayahs/{surah_number}/{ayah_number}/...`، مثال: `/v1/quran/ayahs/36/40/words`.
  - الكتب التراثية: معرف رقمي يطابق معرّفات المكتبة الشاملة (مثل `104` لصحيح البخاري).
- **التصفح (Pagination)**: تدعم جميع نقاط القوائم المعاملات `?page=1&limit=20` مع استجابة موحدة تحتوي `{ data, page, limit, has_more, total }`.

---

### 1. نقاط نهاية القرآن الكريم (Quran)

| المسار | الطريقة | الوصف | مثال استعلام cURL |
| :--- | :---: | :--- | :--- |
| `/v1/quran/surahs` | `GET` | قائمة السور الـ 114 مع معلومات النزول وعدد الآيات | `curl 'http://localhost:3000/v1/quran/surahs?limit=5'` |
| `/v1/quran/surahs/{n}` | `GET` | تفاصيل السورة الكاملة مع جميع نصوص آياتها | `curl 'http://localhost:3000/v1/quran/surahs/1'` |
| `/v1/quran/meta` | `GET` | إحصائيات القرآن الشاملة (الأحرف، الكلمات، المكي والمدني) | `curl 'http://localhost:3000/v1/quran/meta'` |
| `/v1/quran/ayahs` | `GET` | استعلام مفهرس للآيات مع التصفح | `curl 'http://localhost:3000/v1/quran/ayahs?page=1&limit=10'` |
| `/v1/quran/ayahs/{s}/{a}/words` | `GET` | التحليل الصرفي الدقيق كلمة بكلمة والجذور والإعراب | `curl 'http://localhost:3000/v1/quran/ayahs/2/255/words'` |
| `/v1/quran/ayahs/{s}/{a}/similar` | `GET` | الآيات المتشابهة لفظياً (المتشابهات) ونسب التطابق | `curl 'http://localhost:3000/v1/quran/ayahs/36/40/similar'` |
| `/v1/quran/ayahs/{s}/{a}/tafsir` | `GET` | تفاسير الآية المعتمدة (ابن كثير، الطبري، الجلالين) | `curl 'http://localhost:3000/v1/quran/ayahs/36/40/tafsir'` |
| `/v1/quran/ayahs/{s}/{a}/hadiths` | `GET` | الأحاديث النبوية المسندة المرتبطة بتفسير الآية | `curl 'http://localhost:3000/v1/quran/ayahs/36/40/hadiths'` |
| `/v1/quran/reciters` | `GET` | قائمة القراء المعتمدين مع روابط البث الصوتي CDN | `curl 'http://localhost:3000/v1/quran/reciters'` |

#### مثال تطبيقي: التحليل الصرفي لآية الكرسي
```bash
curl 'http://localhost:3000/v1/quran/ayahs/2/255/words' | jq '.[0]'
```
**الاستجابة:**
```json
{
  "position": 1,
  "text": "ٱللَّهُ",
  "transliteration": "Allahu",
  "root": "أله",
  "pos": "اسم علم مذكر",
  "translation": "Allah"
}
```

---

### 2. نقاط نهاية الحديث الشريف والرواة (Hadith & Narrators)

| المسار | الطريقة | الوصف | مثال استعلام cURL |
| :--- | :---: | :--- | :--- |
| `/v1/collections` | `GET` | قائمة كتب السنة الستة والمسانيد والسنن | `curl 'http://localhost:3000/v1/collections'` |
| `/v1/hadiths` | `GET` | تصفح الأحاديث النبوية مع خيارات التصفية | `curl 'http://localhost:3000/v1/hadiths?limit=10'` |
| `/v1/hadiths/{id}` | `GET` | استعلام الحديث بالمعرف الدائم (مثال `bukhari:1`) | `curl 'http://localhost:3000/v1/hadiths/bukhari:1'` |
| `/v1/hadiths/{id}/chain` | `GET` | شبكة الإسناد الكاملة (العقد والروابط والرواة) | `curl 'http://localhost:3000/v1/hadiths/bukhari:1/chain'` |
| `/v1/hadiths/{id}/gradings` | `GET` | أقوال ونقاد الحديث المتعددة مع أرقام كتب الشاملة | `curl 'http://localhost:3000/v1/hadiths/abudawud:1/gradings'` |
| `/v1/scholars` | `GET` | قائمة أئمة الجرح والتعديل ونقاد الحديث | `curl 'http://localhost:3000/v1/scholars'` |
| `/v1/narrators` | `GET` | معجم الرواة الموثق مع طبقاتهم ورتبهم | `curl 'http://localhost:3000/v1/narrators?limit=10'` |
| `/v1/narrators/{id}` | `GET` | السيرة الإسنادية والمرويات لراوٍ محدد | `curl 'http://localhost:3000/v1/narrators/umar_ibn_khattab'` |
| `/v1/isnad/search` | `POST` | البحث عن المسارات التي تربط بين راويين | `curl -X POST 'http://localhost:3000/v1/isnad/search' -H 'content-type: application/json' -d '{"from":"bukhari","to":"umar"}'` |

> [!NOTE]
> **قاعدة البخاري ومسلم في أحكام الحديث**: عند طلب `/v1/hadiths/bukhari:1/gradings` أو أي حديث في الصحيحين، تقوم الواجهة تلقائياً بإدراج سطر اصطلاحي افتراضي `{ scholar_key: "bukhari", grade_normalized: "sahih", notes: "consensus sahih" }` مع ربطه بكتاب الأصل في الشاملة.

---

### 3. نقاط نهاية علم المصطلح والعوائل (Mustalah & Families)

| المسار | الطريقة | الوصف | مثال استعلام cURL |
| :--- | :---: | :--- | :--- |
| `/v1/families` | `GET` | عوائل الأحاديث المتقاربة في المعنى والمخرج | `curl 'http://localhost:3000/v1/families'` |
| `/v1/families/{id}` | `GET` | تفاصيل عائلة حديثية محددة وشواهدها | `curl 'http://localhost:3000/v1/families/fam-niyyah'` |
| `/v1/families/{id}/mustalah` | `GET` | تحليل المتابعات والشواهد واتساع الحديث | `curl 'http://localhost:3000/v1/families/fam-niyyah/mustalah'` |
| `/v1/mustalah/stats` | `GET` | الإحصائيات العامة لتوزيع درجات الحديث | `curl 'http://localhost:3000/v1/mustalah/stats'` |

---

### 4. البحث الشامل والاستعلام التوليدي (Search & Streaming Ask)

| المسار | الطريقة | الوصف | مثال استعلام cURL |
| :--- | :---: | :--- | :--- |
| `/v1/search/all` | `GET` | بحث هجين متزامن في القرآن والحديث مع الترتيب الدلالي | `curl 'http://localhost:3000/v1/search/all?q=الصبر&type=hybrid&limit=5'` |
| `/v1/search/quran` | `GET` | البحث النصي الدقيق في آيات القرآن الكريم | `curl 'http://localhost:3000/v1/search/quran?q=الشمس'` |
| `/v1/search/hadith` | `GET` | البحث المتقدم في متون وأسانيد الأحاديث النبوية | `curl 'http://localhost:3000/v1/search/hadith?q=النية'` |
| `/v1/ask/{target}` | `POST` | مساعد البحث الذكي المتدفق عبر Server-Sent Events | `curl -N -X POST 'http://localhost:3000/v1/ask/quran' -H 'content-type: application/json' -d '{"question":"ما فضل الصبر؟"}'` |

#### مثال: الاستعلام التوليدي المتدفق (Streaming Q&A via SSE)
```bash
curl -N -X POST 'http://localhost:3000/v1/ask/quran' \
  -H 'Content-Type: application/json' \
  -d '{"question":"ما هو تفسير آية الكرسي ودلالاتها؟"}'
```
- الحدث الأول يتضمن مصفوفة المصادر المستخرجة: `{"quran_sources": [{"surah": 2, "ayah": 255, ...}]}`.
- الأحداث التالية تبث الكلمات تباعاً: `{"token": "تدل"}`, `{"token": " آية"}`, `{"token": " الكرسي..."}`.
- الحدث الختامي ينهي التدفق: `{"done": true}`.

---

### 5. المكتبة التراثية وإحصائيات النظام (Books & Meta)

| المسار | الطريقة | الوصف | مثال استعلام cURL |
| :--- | :---: | :--- | :--- |
| `/v1/books` | `GET` | كتب التراث المعتمدة مع إمكانية الفرز حسب الفئة | `curl 'http://localhost:3000/v1/books?category=hadith_grading'` |
| `/v1/books/{id}` | `GET` | بيانات كتاب تراثي معين ومؤلفه وعدد صفحاته | `curl 'http://localhost:3000/v1/books/104'` |
| `/v1/books/{id}/pages` | `GET` | استرجاع نصوص الصفحات الأصلية برقم المجلد والصفحة | `curl 'http://localhost:3000/v1/books/104/pages?start=1&size=3'` |
| `/v1/config` | `GET` | إعدادات الـ API وقواعد معدل الطلبات والميزات المفعلة | `curl 'http://localhost:3000/v1/config'` |
| `/v1/stats` | `GET` | إجمالي أعداد الآيات، الأحاديث، الرواة، والكتب | `curl 'http://localhost:3000/v1/stats'` |
| `/v1/openapi.json` | `GET` | مواصفة OpenAPI 3.1 الكاملة لتوليد الـ SDKs | `curl 'http://localhost:3000/v1/openapi.json'` |

#### توليد عملاء برمجية تلقائياً (SDK Generation)
يمكنك توليد عميل TypeScript أو Python أو Go أو Dart فوراً باستخدام OpenAPI Generator:
```bash
npx @openapitools/openapi-generator-cli generate \
  -i http://localhost:3000/v1/openapi.json \
  -g typescript-fetch \
  -o ./quranmind-sdk
```

---

## 💳 بوابات الدفع الإلكتروني

تم تجهيز المنصة بدعم متكامل ومزدوج للمدفوعات المحلية والدولية، مع توثيق تفصيلي في [`context/slickpay-integration-guide.md`](file:///home/parzival/Desktop/projects/quranmind/context/slickpay-integration-guide.md):

### 🇩🇿 بوابة SlickPay (الجزائر - DZD)
- **البطاقات المدعومة**: البطاقة الذهبية (بريد الجزائر) وبطاقة CIB (شبكة البنوك الجزائرية SATIM).
- **بيئة العمل**:
  - تجريبية (Sandbox): `https://devapi.slick-pay.com/api/v2`
  - إنتاجية (Production): `https://prodapi.slick-pay.com/api/v2`
- **دورة الدفع**:
  1. استعلام الحساب الافتراضي للمتجر `GET /users/accounts`.
  2. إنشاء الفاتورة `POST /users/invoices` واستلام رابط الدفع المباشر (`payment_url`).
  3. توجيه المستخدم لإتمام عملية الدفع بأمان على بوابة SATIM المعتمدة.
  4. استقبال Webhook تلقائي للتحقق من الحالة وتفعيل اشتراك المستخدم فوراً.

### 🌐 بوابة Stripe (الدولية - USD/EUR)
- **البطاقات المدعومة**: Visa, MasterCard, American Express, Apple Pay, Google Pay.
- **الميزات**: إدارة الاشتراكات الدورية، تجديد الفواتير التلقائي، وبوابة العميل الذاتية (Stripe Customer Portal).

---

## 💻 التكنولوجيا المستخدمة (Tech Stack)

- **Frontend & Framework**: [Next.js 15](https://nextjs.org/) (App Router), React 19, TypeScript.
- **Styling & UI**: TailwindCSS, Vanilla CSS Design System, Lucide Icons, Cairo & Amiri Quran Fonts.
- **Visualization**: Recharts, SVG Topological Graphs, Force-Directed Graph Layout.
- **API Engine**: Next.js Route Handlers, Server-Sent Events (SSE) Streaming.
- **API Documentation**: Interactive Console at `/dashboard/api-docs`, [Scalar](https://github.com/scalar/scalar) at `/docs`, OpenAPI 3.1.
- **Payments**: SlickPay SDK (DZD / SATIM) & Stripe SDK (USD).

---

## 🚀 التشغيل والتثبيت المحلي

### المتطلبات الأساسية
- Node.js الإصدار 18.18 أو أحدث.
- npm أو pnpm أو yarn.

### خطوات التثبيت:

1. **استنساخ المستودع (Clone Repo)**:
   ```bash
   git clone https://github.com/racsou/quranmind.git
   cd quranmind
   ```

2. **تثبيت الحزم والاعتماديات**:
   ```bash
   npm install
   ```

3. **إعداد متغيرات البيئة (`.env.local`)**:
   قم بإنشاء ملف `.env.local` في جذر المشروع وأضف المفاتيح التالية:
   ```env
   # إعدادات النظام
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # بوابة SlickPay (الجزائر)
   SLICKPAY_PUBLIC_KEY=your_slickpay_public_key_here
   SLICKPAY_SANDBOX=true

   # بوابة Stripe (الدولية)
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

   # مفاتيح الذكاء الاصطناعي (اختياري، يدعم BYOK)
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-ant-...
   DEEPSEEK_API_KEY=sk-...
   ```

4. **تشغيل الخادم في بيئة التطوير**:
   ```bash
   npm run dev
   ```

5. **فتح التطبيق في المتصفح**:
   - واجهة الباحث: [http://localhost:3000/workspace](http://localhost:3000/workspace)
   - لوحة التحكم: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
   - توثيق الـ API: [http://localhost:3000/dashboard/api-docs](http://localhost:3000/dashboard/api-docs)
   - لوحة الإدارة: [http://localhost:3000/admin](http://localhost:3000/admin)

6. **التحقق من سلامة البناء (Build Verification)**:
   ```bash
   npx tsc --noEmit
   npm run build
   ```

---

## 📜 الترخيص (License)

هذا المشروع مرخص تحت رخصة **MIT** — يحق لأي باحث أو مؤسسة استخدام الأكواد والمساهمة في تطوير المنظومة بما يخدم دراسات القرآن الكريم والسنة النبوية الشريفة.

---

<div align="center">
  <p><strong>QuranMind Academic Lab — نحو بحث قرآني وحديثي رقمي دقيق وموثق</strong></p>
</div>
