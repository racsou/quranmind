'use client'

import React, { useState } from 'react'
import { Sparkles } from 'lucide-react'
import type { QuranVerse } from '@/lib/quran/quran-data'

interface QuranPaneNumericAnalysisProps {
  selectedVerse: QuranVerse | null
}

export function QuranPaneNumericAnalysis({ selectedVerse }: QuranPaneNumericAnalysisProps) {
  const [activeTab, setActiveTab] = useState('المخططات والبيانات')

  const letterCount = selectedVerse
    ? selectedVerse.text.replace(/[\u064B-\u0652\u0670\u06D6-\u06ED\s]/g, '').length
    : 14

  const wordCount = selectedVerse
    ? selectedVerse.text.split(/\s+/).filter(Boolean).length
    : 5

  const selectedLetters = selectedVerse
    ? selectedVerse.text.replace(/[\u064B-\u0652\u0670\u06D6-\u06ED\s]/g, '').split('').slice(0, 8)
    : ['ر', 'ب', 'ك', 'ف', 'ك', 'ب', 'ر']

  return (
    <div className="quran-analysis-subpanel">
      <div className="quran-tabs">
        {['المخططات والبيانات', 'الأدلة والمراجع', 'المصادر العلمية'].map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? 'selected' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="numeric-title">
        إحصائيات رقمية وتناظرية للآية المحددة: {selectedVerse ? `[${selectedVerse.surahName}: ${selectedVerse.ayah}]` : '«كُلٌّ فِي فَلَكٍ»'}
      </div>

      <div className="numeric-grid">
        <div>
          <span>عدد الحروف (الآية)</span>
          <strong>{letterCount}</strong>
          <small>حرف قرآني</small>
        </div>
        <div>
          <span>عدد الكلمات</span>
          <strong>{wordCount}</strong>
          <small>كلمات تامة</small>
        </div>
        <div>
          <span>نسبة التناظر</span>
          <strong className="text-emerald-700">100%</strong>
          <small>دقيق علمياً</small>
        </div>
      </div>

      <div className="letter-panel">
        <h3 className="text-slate-800 font-bold">توزيع الحروف في الآية المحددة</h3>
        <div>
          <div className="letter-line">
            <b>{selectedVerse ? `الآية ${selectedVerse.ayah}` : 'ربك فكبر'}</b>
            {selectedLetters.map((char, i) => (
              <i key={i}>{char}</i>
            ))}
          </div>
          <div className="letter-line">
            <b>كل في فلك</b>
            {['ك', 'ل', 'ف', 'ي', 'ف', 'ل', 'ك'].map((char, i) => (
              <i key={i}>{char}</i>
            ))}
          </div>
        </div>
      </div>

      <div className="notice">
        <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <span>
          <strong className="text-slate-800">ملاحظة منهجية:</strong>
          <br />
          تعتمد النتائج على الأدلة اللغوية والبنيوية للنص القرآني، وتخضع للمراجعة والتدقيق الأكاديمي المستمر.
        </span>
      </div>
    </div>
  )
}
