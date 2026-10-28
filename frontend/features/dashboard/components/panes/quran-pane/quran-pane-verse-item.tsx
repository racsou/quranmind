'use client'

import React from 'react'
import { Play, Pause, BrainCircuit, Copy, Check } from 'lucide-react'
import type { QuranVerse } from '@/lib/quran/quran-data'

interface QuranPaneVerseItemProps {
  verse: QuranVerse
  isSelected: boolean
  isPlaying: boolean
  copied: boolean
  onSelect: () => void
  onPlay: () => void
  onAttachAgent: () => void
  onCopy: () => void
}

export function QuranPaneVerseItem({
  verse,
  isSelected,
  isPlaying,
  copied,
  onSelect,
  onPlay,
  onAttachAgent,
  onCopy,
}: QuranPaneVerseItemProps) {
  return (
    <article
      onClick={onSelect}
      className={`quran-verse-card ${isSelected ? 'selected' : ''}`}
    >
      <div className="verse-arabic-text" dir="rtl">
        <span className="ayah-num-badge">{verse.ayah}</span>
        {verse.text}
      </div>

      <div className="verse-actions-bar">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onPlay()
          }}
          className="verse-action-btn"
          title={isPlaying ? 'إيقاف التلاوة' : 'استماع للتلاوة'}
        >
          {isPlaying ? <Pause className="w-3 h-3 text-cyan-600" /> : <Play className="w-3 h-3" />}
          <span>{isPlaying ? 'جاري التلاوة' : 'تلاوة'}</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onAttachAgent()
          }}
          className="verse-action-btn"
          title="تحليل في الوكيل الذكي"
        >
          <BrainCircuit className="w-3 h-3 text-cyan-600" />
          <span>تحليل الآية</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onCopy()
          }}
          className="verse-action-btn"
          title="نسخ الآية"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
        </button>
      </div>
    </article>
  )
}
