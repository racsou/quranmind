'use client'

import React from 'react'
import { BookOpen, Play, Pause, Maximize2 } from 'lucide-react'
import { SURAHS_META, type QuranVerse } from '@/lib/quran/quran-data'

interface QuranPaneHeaderProps {
  currentSurah: number
  mushafPageSize: number
  playingAyahKey: string | null
  selectedVerse: QuranVerse | null
  displayedVerses: QuranVerse[]
  onSurahChange: (surahNum: number) => void
  onPageSizeChange: (size: number) => void
  onTogglePlayAudio: () => void
  onOpenFullView: () => void
}

export function QuranPaneHeader({
  currentSurah,
  mushafPageSize,
  playingAyahKey,
  selectedVerse,
  displayedVerses,
  onSurahChange,
  onPageSizeChange,
  onTogglePlayAudio,
  onOpenFullView,
}: QuranPaneHeaderProps) {
  return (
    <header className="exact-quran-header">
      <div className="flex items-center gap-2">
        <BookOpen className="text-teal-700 w-4 h-4 shrink-0" />
        <span className="font-bold text-xs text-slate-800 hidden sm:inline">المصحف الشريف</span>
      </div>

      <div className="quran-toolbar flex items-center gap-1.5 flex-wrap">
        <select
          value={currentSurah}
          onChange={(e) => onSurahChange(Number(e.target.value))}
          className="surah-select-box text-xs bg-slate-50 border border-slate-300 rounded px-2 py-1 outline-none text-slate-800"
          aria-label="اختر السورة"
        >
          {SURAHS_META.map((s) => (
            <option key={s.number} value={s.number}>
              {s.number}. سورة {s.name} ({s.revelationType === 'Meccan' ? 'مكية' : 'مدنية'})
            </option>
          ))}
        </select>

        <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded border border-slate-200 text-[10px]">
          <button
            type="button"
            onClick={() => onPageSizeChange(3)}
            className={`px-1.5 py-0.5 rounded transition cursor-pointer ${mushafPageSize === 3 ? 'bg-teal-700 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            3
          </button>
          <button
            type="button"
            onClick={() => onPageSizeChange(4)}
            className={`px-1.5 py-0.5 rounded transition cursor-pointer ${mushafPageSize === 4 ? 'bg-teal-700 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            4
          </button>
          <button
            type="button"
            onClick={() => onPageSizeChange(7)}
            className={`px-1.5 py-0.5 rounded transition cursor-pointer ${mushafPageSize === 7 ? 'bg-teal-700 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            صفحة
          </button>
        </div>

        <button
          type="button"
          onClick={onTogglePlayAudio}
          className={`text-xs px-2 py-1 rounded border flex items-center gap-1 transition font-semibold cursor-pointer ${
            playingAyahKey ? 'bg-amber-600 text-white border-amber-500 animate-pulse' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
          }`}
          title={playingAyahKey ? 'إيقاف التلاوة' : 'استماع متصل'}
        >
          {playingAyahKey ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span className="text-[10px] hidden sm:inline">
            {playingAyahKey ? 'إيقاف' : selectedVerse ? `استماع (${selectedVerse.ayah})` : 'تلاوة'}
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenFullView}
          className="p-1 text-slate-500 hover:text-teal-700 rounded transition cursor-pointer"
          title="عرض كامل في تبويب مستقل"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  )
}
