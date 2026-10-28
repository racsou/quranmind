'use client'

import React from 'react'
import { EvidenceCard } from './evidence-card'

export function EvidenceList() {
  return (
    <div className="space-y-2">
      <EvidenceCard
        title="التناظر اللفظي (Palindrome)"
        tag="ملاحظة قطعية مؤكدة"
        classification="verified"
        explanation="تطابق الحروف بالأمام والعكس في «كل في فلك»"
        letterCount={7}
        wordCount={3}
      />

      <EvidenceCard
        title="حساب الجمل ونسب الحروف"
        tag="محسوب رياضياً"
        classification="verified"
        explanation="القيمة العددية التراكمية في سورة الأنبياء"
        letterCount={46}
        wordCount={11}
        letters={['ش', 'م', 'س', 'ق', 'م', 'ر', 'ف', 'ل', 'ك']}
      />

      <EvidenceCard
        title="المواضع الدلالية المشتركة"
        tag="استئناس ودراسة فرضية"
        classification="hypothesis"
        explanation="تقاطع مسار الأجرام مع سورة يس الآية 40"
        letterCount={14}
        wordCount={4}
      />
    </div>
  )
}
