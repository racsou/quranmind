import { type DetailedAnalysisResult } from '@/lib/quran/analysis'
import { type QuranVerse } from '@/lib/quran/quran-data'
import { getTafsirForVerse, type TafsirEntry } from '@/lib/quran/tafsir-hadith'

export interface DossierExportOptions {
  projectTitle: string
  hypothesis?: string
  verse: QuranVerse
  analysis: DetailedAnalysisResult
  tafsir?: TafsirEntry
  notes?: string
  authorName?: string
}

/**
 * Generate an academic, publication-ready research dossier in Markdown.
 */
export function generateMarkdownDossier(options: DossierExportOptions): string {
  const { projectTitle, hypothesis, verse, analysis, tafsir, notes, authorName } = options
  const dateStr = new Date().toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const classificationArabic =
    analysis.classification === 'verified'
      ? '✓ ملاحظة مؤكدة نصياً (Verified Invariant)'
      : analysis.classification === 'scientifically_supported'
      ? '✦ توافق علمي مدعوم بالأدلة (Scientifically Supported)'
      : analysis.classification === 'possible_correspondence'
      ? '◎ توافق واستئناس محتمل (Possible Correspondence)'
      : '؟ فرضية بحثية قيد التحقق (Hypothesis)'

  let md = `# ملف بحثي تحليلي: ${projectTitle}
**المنصة**: QuranMind — مختبر البحث القرآني العلمي والتحليل الرقمي  
**التاريخ**: ${dateStr}  
**الباحث / المحقق**: ${authorName || 'باحث مستقل'}  
**التصنيف الإبستيمي**: ${classificationArabic}  

---

## 1. الفرضية البحثية (Hypothesis)
${hypothesis || 'تحليل البنية الرياضية واللغوية والتناظرية للنص القرآني في ضوء المنهج الاستقرائي الصارم.'}

---

## 2. النص القرآني الموثق
> **سورة ${verse.surahName} (${verse.surahEnglishName}) — الآية ${verse.ayah}**  
> الجزء: ${verse.juz} | الصفحة: ${verse.page} | نوع النزول: ${verse.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}

### النص بالرسم العثماني الملكي (Hafs)
\`\`\`text
${verse.text}
\`\`\`

**الترجمة الإنجليزية المعتمدة (Sahih International):**  
*${verse.translation}*

---

## 3. التحليل الرياضي والعددي
- **نمط التطبيع المستخدم**: ${analysis.mode}
- **النص المطبع المجرد**: \`${analysis.normalizedText}\`
- **إجمالي عدد الحروف**: ${analysis.letterCount}
- **إجمالي عدد الكلمات**: ${analysis.wordCount}
- **عدد الحروف الفريدة**: ${analysis.uniqueLettersCount}
- **القيمة الحسابية لحساب الجمل (Abjad)**: **${analysis.abjadValue}**

### تكرار الحروف الأكثر وروداً
| الحرف | التكرار | النسبة المئوية |
| :---: | :---: | :---: |
`

  analysis.letterFrequencies.slice(0, 10).forEach((f) => {
    md += `| ${f.letter} | ${f.count} | ${f.percentage}% |\n`
  })

  md += `
---

## 4. محرك التناظر البنيوي واللفظي (Symmetry & Palindrome Engine)
- **نسبة التناظر المحسوبة**: **${Math.round(analysis.symmetry.symmetryRatio * 100)}%**
- **هل هو تناظر تام (Palindrome)؟**: ${analysis.symmetry.isPalindrome ? 'نعم (100% تطابق حرفي عكسي تام)' : 'لا'}
- **القراءة من الأمام**: \`${analysis.symmetry.forwardText}\`
- **القراءة من الخلف**: \`${analysis.symmetry.reversedText}\`

${
  analysis.symmetry.isPalindrome
    ? `> **ملاحظة إعجازية**: تتميز هذه الآية بظاهرة التناظر الحرفي التام، حيث تتطابق سلسلة الحروف عند القراءة من اليمين إلى اليسار مع القراءة من اليسار إلى اليمين، وهو نسق بلاغي نادر جداً يعبر عن المفهوم الكوني الدائري بدقة.`
    : ''
}

---

## 5. التفسير الأثري والشواهد الحديثية
`

  const activeTafsir = tafsir || getTafsirForVerse(verse.surah, verse.ayah)

  if (activeTafsir) {
    md += `### تفسير ابن كثير
${activeTafsir.ibnKathir}

`
    if (activeTafsir.jalalayn) {
      md += `### تفسير الجلالين
${activeTafsir.jalalayn}

`
    }

    if (activeTafsir.asbabNuzul) {
      md += `### أسباب النزول والسياق التاريخي
${activeTafsir.asbabNuzul}

`
    }

    if (activeTafsir.hadithCitations && activeTafsir.hadithCitations.length > 0) {
      md += `### الشواهد الحديثية المسندة
`
      activeTafsir.hadithCitations.forEach((h) => {
        md += `- **${h.source} (رقم ${h.number})** [درجة الإسناد: **${h.isnadGrade}**]:  
  *«${h.text}»*  
  **سلسلة السند**: ${h.narratorChain}  
  **وجه الدلالة**: ${h.relevanceNote}  
`
      })
    }

    if (activeTafsir.scientificNotes) {
      md += `
### الملاحظات العلمية والاستقرائية
${activeTafsir.scientificNotes}
`
    }
  }

  md += `
---

## 6. ملاحظات التحقيق وحدود الموثوقية
> **معيار QuranMind العلمي**: ${analysis.evidenceStatement}

${notes ? `### ملاحظات الباحث الإضافية\n${notes}\n` : ''}

---
*تم إنشاء هذا الملف تلقائياً بواسطة منصة QuranMind السحابية — جميع النصوص القرآنية مطابقة لمصحف المدينة النبوية برواية حفص.*
`

  return md
}

/**
 * Generate an academic HTML document suitable for browser preview and print-to-PDF.
 */
export function generateHtmlDossier(options: DossierExportOptions): string {
  const { projectTitle, hypothesis, verse, analysis, tafsir, notes, authorName } = options
  const dateStr = new Date().toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const activeTafsir = tafsir || getTafsirForVerse(verse.surah, verse.ayah)

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>ملف بحثي — ${projectTitle}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cairo:wght@400;600;700;800&family=Fira+Code:wght@400;600&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Cairo', system-ui, sans-serif;
      background: #030d1b;
      color: #e2e8f0;
      padding: 40px;
      line-height: 1.8;
      font-size: 14px;
    }
    .dossier-container {
      max-width: 900px;
      margin: 0 auto;
      background: #04172c;
      border: 1px solid #1e3a5f;
      border-radius: 16px;
      padding: 48px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .header {
      border-bottom: 2px solid #00d4ff33;
      padding-bottom: 24px;
      margin-bottom: 32px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand {
      font-size: 24px;
      font-weight: 800;
      color: #fff;
    }
    .brand span {
      color: #00d4ff;
    }
    .brand small {
      display: block;
      font-size: 12px;
      font-weight: 400;
      color: #94a3b8;
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      background: ${analysis.classification === 'verified' ? '#064e3b' : '#78350f'};
      color: ${analysis.classification === 'verified' ? '#34d399' : '#fbbf24'};
      border: 1px solid ${analysis.classification === 'verified' ? '#059669' : '#d97706'};
    }
    h1 {
      font-size: 26px;
      color: #ffffff;
      margin: 16px 0 8px 0;
      font-weight: 800;
    }
    h2 {
      font-size: 18px;
      color: #38bdf8;
      margin: 32px 0 16px 0;
      border-bottom: 1px solid #1e3a5f;
      padding-bottom: 8px;
    }
    h3 {
      font-size: 15px;
      color: #e2e8f0;
      margin: 16px 0 8px 0;
    }
    .meta-box {
      background: #020b18;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 24px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      font-size: 12px;
    }
    .meta-item strong {
      display: block;
      color: #94a3b8;
      font-size: 11px;
    }
    .meta-item span {
      color: #f1f5f9;
      font-weight: 600;
    }
    .verse-card {
      background: #020b18;
      border: 1px solid #0284c7;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      margin: 20px 0;
    }
    .verse-text {
      font-family: 'Amiri', serif;
      font-size: 26px;
      color: #f8fafc;
      line-height: 2.2;
      margin-bottom: 16px;
    }
    .verse-translation {
      font-size: 13px;
      color: #cbd5e1;
      font-style: italic;
      border-top: 1px solid #1e293b;
      padding-top: 12px;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin: 20px 0;
    }
    .metric-card {
      background: #020b18;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 16px;
      text-align: center;
    }
    .metric-card strong {
      display: block;
      font-size: 22px;
      color: #38bdf8;
      font-family: 'Fira Code', monospace;
    }
    .metric-card span {
      font-size: 11px;
      color: #94a3b8;
    }
    .code-box {
      font-family: 'Fira Code', monospace;
      background: #01060f;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 12px;
      font-size: 12px;
      color: #38bdf8;
      word-break: break-all;
    }
    .symmetry-banner {
      background: ${analysis.symmetry.isPalindrome ? 'rgba(5, 150, 105, 0.2)' : 'rgba(30, 41, 59, 0.5)'};
      border: 1px solid ${analysis.symmetry.isPalindrome ? '#10b981' : '#334155'};
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 12px;
    }
    th, td {
      border: 1px solid #1e293b;
      padding: 8px 12px;
      text-align: center;
    }
    th {
      background: #020b18;
      color: #38bdf8;
    }
    .hadith-card {
      background: #020b18;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 16px;
      margin: 12px 0;
    }
    .hadith-text {
      font-size: 13px;
      color: #f1f5f9;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .hadith-chain {
      font-size: 11px;
      color: #94a3b8;
    }
    .print-button {
      position: fixed;
      top: 20px;
      left: 20px;
      background: #0284c7;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-family: 'Cairo', sans-serif;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    }
    @media print {
      body {
        background: white;
        color: black;
        padding: 0;
      }
      .dossier-container {
        border: none;
        box-shadow: none;
        background: white;
        padding: 20px;
      }
      .header {
        border-bottom: 2px solid #000;
      }
      .brand {
        color: #000;
      }
      .brand span {
        color: #0284c7;
      }
      h1, h2, h3 {
        color: #000;
      }
      .meta-box, .verse-card, .metric-card, .hadith-card, .code-box {
        background: #f8fafc;
        border: 1px solid #cbd5e1;
        color: #000;
      }
      .verse-text {
        color: #000;
      }
      .print-button {
        display: none;
      }
      th {
        background: #e2e8f0;
        color: #000;
      }
    }
  </style>
</head>
<body>
  <button class="print-button" onclick="window.print()">طباعة / حفظ كـ PDF</button>

  <div class="dossier-container">
    <div class="header">
      <div class="brand">
        Quran<span>Mind</span>
        <small>مختبر البحث القرآني العلمي والتحليل الرقمي</small>
      </div>
      <div class="badge">
        ${analysis.classification === 'verified' ? '✓ ملاحظة مؤكدة نصياً' : 'توافق محتمل / فرضية'}
      </div>
    </div>

    <h1>${projectTitle}</h1>
    <p style="color: #94a3b8; font-size: 13px; margin-bottom: 20px;">
      ${hypothesis || 'تحليل علمي وبنيوي استقرائي وفق قواعد التحقق الإبستيمي.'}
    </p>

    <div class="meta-box">
      <div class="meta-item">
        <strong>تاريخ الإصدار:</strong>
        <span>${dateStr}</span>
      </div>
      <div class="meta-item">
        <strong>الباحث / المحقق:</strong>
        <span>${authorName || 'باحث مستقل'}</span>
      </div>
      <div class="meta-item">
        <strong>المصحف المعتمد:</strong>
        <span>مصحف المدينة الملكي (حفص)</span>
      </div>
    </div>

    <h2>1. النص القرآني الموثق</h2>
    <div class="verse-card">
      <div style="font-size: 12px; color: #38bdf8; margin-bottom: 8px;">
        سورة ${verse.surahName} (${verse.surahEnglishName}) — الآية ${verse.ayah}
      </div>
      <div class="verse-text">${verse.text}</div>
      <div class="verse-translation">${verse.translation}</div>
    </div>

    <h2>2. القياسات الرياضية والعددية</h2>
    <div class="metrics-grid">
      <div class="metric-card">
        <strong>${analysis.letterCount}</strong>
        <span>عدد الحروف</span>
      </div>
      <div class="metric-card">
        <strong>${analysis.wordCount}</strong>
        <span>عدد الكلمات</span>
      </div>
      <div class="metric-card">
        <strong>${analysis.uniqueLettersCount}</strong>
        <span>حروف فريدة</span>
      </div>
      <div class="metric-card">
        <strong>${analysis.abjadValue}</strong>
        <span>حساب الجمل</span>
      </div>
    </div>

    <div style="margin: 12px 0;">
      <span style="font-size: 11px; color: #94a3b8; display: block; margin-bottom: 4px;">النص المطبع المجرد (${analysis.mode}):</span>
      <div class="code-box">${analysis.normalizedText}</div>
    </div>

    <h2>3. فحص التناظر البنيوي واللفظي (Palindrome Test)</h2>
    <div class="symmetry-banner">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-weight: 700; color: #38bdf8;">نسبة التطابق العكسي: ${Math.round(analysis.symmetry.symmetryRatio * 100)}%</span>
        <span>${analysis.symmetry.isPalindrome ? 'تناظر تام 100%' : 'تناظر نسبي'}</span>
      </div>
      <div style="font-size: 12px; margin-bottom: 8px;">
        <span style="color: #94a3b8;">القراءة من اليمين (Forward):</span>
        <span class="code-box" style="display: inline-block; margin-right: 8px;">${analysis.symmetry.forwardText}</span>
      </div>
      <div style="font-size: 12px;">
        <span style="color: #94a3b8;">القراءة من اليسار (Reversed):</span>
        <span class="code-box" style="display: inline-block; margin-right: 8px;">${analysis.symmetry.reversedText}</span>
      </div>
    </div>

    <h2>4. الشواهد التفسيرية والحديثية</h2>
    <div style="margin: 16px 0;">
      <h3>تفسير ابن كثير:</h3>
      <p style="font-size: 13px; color: #cbd5e1; background: #020b18; padding: 16px; border-radius: 8px; border: 1px solid #1e293b;">
        ${activeTafsir.ibnKathir}
      </p>
    </div>

    ${
      activeTafsir.hadithCitations && activeTafsir.hadithCitations.length > 0
        ? `<div>
            <h3>الشواهد الحديثية المسندة:</h3>
            ${activeTafsir.hadithCitations
              .map(
                (h) => `
              <div class="hadith-card">
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: #38bdf8; margin-bottom: 6px;">
                  <span>${h.source} (حديث رقم ${h.number})</span>
                  <span style="color: #34d399; font-weight: 700;">درجة السند: ${h.isnadGrade}</span>
                </div>
                <div class="hadith-text">«${h.text}»</div>
                <div class="hadith-chain"><strong>السند:</strong> ${h.narratorChain}</div>
                <div style="font-size: 11px; color: #cbd5e1; margin-top: 6px;"><strong>وجه الدلالة:</strong> ${h.relevanceNote}</div>
              </div>
            `
              )
              .join('')}
          </div>`
        : ''
    }

    <h2>5. حدود الاستنتاج والموثوقية العلمية</h2>
    <div style="background: rgba(14, 165, 233, 0.1); border: 1px solid #0284c7; padding: 16px; border-radius: 8px; font-size: 12px; color: #7dd3fc;">
      ${analysis.evidenceStatement}
    </div>

    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #1e293b; font-size: 11px; color: #64748b;">
      QuranMind Platform — صادر وموثق رقمياً وفق منهجية التدقيق العلمي الصارم
    </div>
  </div>
</body>
</html>`
}
