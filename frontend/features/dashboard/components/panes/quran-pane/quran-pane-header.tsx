'use client'

import React from 'react'
import { BookOpen } from 'lucide-react'
import { SURAHS_META } from '@/lib/quran/quran-data'

interface QuranPaneHeaderProps {
  currentSurah: number
  onSurahChange: (surahNum: number) => void
}

export function QuranPaneHeader({
  currentSurah,
  onSurahChange,
}: QuranPaneHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-cyan-600" />
        <span className="font-bold text-xs text-slate-800">النص القرآني الموثق</span>
      </div>

      <div className="quran-header-select">
        <select
          value={currentSurah}
          onChange={(e) => onSurahChange(Number(e.target.value))}
          aria-label="اختر السورة"
        >
          {SURAHS_META.map((meta) => (
            <option key={meta.number} value={meta.number}>
              {meta.number}. سورة {meta.name} ({meta.numberOfAyahs} آية)
            </option>
          ))}
        </select>
      </div>
    </header>
  )
}
