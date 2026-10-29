'use client'

import React from 'react'
import { Sparkles, Play, Pause, X } from 'lucide-react'
import type { QuranVerse, SurahMeta } from '@/lib/quran/quran-data'

interface QuranPaneVerseListProps {
  mushafSurah: number
  currentSurahMeta: SurahMeta
  displayedVerses: QuranVerse[]
  selectedVerse: QuranVerse | null
  attachedVerse: QuranVerse | null
  playingAyahKey: string | null
  onSelectVerse: (v: QuranVerse | null) => void
  onPlayVerse: (v: QuranVerse) => void
  onAttachAgent: (v: QuranVerse) => void
}

export function QuranPaneVerseList({
  mushafSurah,
  currentSurahMeta,
  displayedVerses,
  selectedVerse,
  attachedVerse,
  playingAyahKey,
  onSelectVerse,
  onPlayVerse,
  onAttachAgent,
}: QuranPaneVerseListProps) {
  const firstVerse = displayedVerses[0]
  const juzNumber = firstVerse?.juz || (mushafSurah === 1 ? 1 : 1)
  const hizbNumber = Math.ceil(juzNumber * 2)

  return (
    <div className="mushaf-real-page" onClick={() => onSelectVerse(null)}>
      <div className="mushaf-page-topbar">
        <span className="mushaf-juz-tag">الجزء {juzNumber}</span>
        <div className="mushaf-surah-plaque">
          <span className="plaque-title">سُورَةُ {currentSurahMeta.name}</span>
          <span className="plaque-subtitle">
            {currentSurahMeta.revelationType === 'Meccan' ? 'مَكِّيَّةٌ' : 'مَدَنِيَّةٌ'} · {currentSurahMeta.numberOfAyahs} آيَاتٍ
          </span>
        </div>
        <span className="mushaf-hizb-tag">الحزب {hizbNumber}</span>
      </div>

      {mushafSurah !== 9 && mushafSurah !== 1 && (
        <div className="mushaf-basmalah-box">
          <div className="mushaf-basmalah-ornament font-serif">
            <span>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
          </div>
        </div>
      )}

      <div className="mushaf-page-body">
        <div className="mushaf-flowing-text font-serif">
          {displayedVerses.map((verse) => {
            const isSelected = selectedVerse?.id === verse.id
            const isContextAttached = attachedVerse?.id === verse.id
            const isPlaying = playingAyahKey === `${verse.surah}:${verse.ayah}`

            return (
              <span
                key={verse.id}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectVerse(isSelected ? null : verse)
                }}
                className={`mushaf-verse-span ${isSelected ? 'is-selected' : ''} ${
                  isContextAttached ? 'is-attached' : ''
                } ${isPlaying ? 'is-playing' : ''}`}
                title={`انقر لتحديد الآية ${verse.ayah} وإضافتها للوكيل الذكي`}
              >
                <span className="verse-arabic-words">{verse.text}</span>
                <span className="mushaf-ayah-medallion">﴿{verse.ayah}﴾</span>
              </span>
            )
          })}
        </div>
      </div>

      {selectedVerse && (
        <div className="mushaf-selected-dock" onClick={(e) => e.stopPropagation()}>
          <div className="dock-verse-info">
            <span className="dock-ayah-badge">
              سورة {selectedVerse.surahName} [الآية {selectedVerse.ayah}]
            </span>
            <button
              type="button"
              onClick={() => onSelectVerse(null)}
              className="text-[10px] text-slate-500 hover:text-rose-600 transition cursor-pointer"
            >
              إلغاء التحديد ✕
            </button>
          </div>

          <div className="dock-actions-row">
            <button
              type="button"
              onClick={() => onAttachAgent(selectedVerse)}
              className={`dock-btn-add-agent cursor-pointer ${attachedVerse?.id === selectedVerse.id ? 'is-active-context' : ''}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {attachedVerse?.id === selectedVerse.id ? 'الآية في سياق الوكيل ✓' : 'إضافة الآية إلى الوكيل الذكي'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onPlayVerse(selectedVerse)}
              className="dock-btn-secondary cursor-pointer"
            >
              {playingAyahKey === `${selectedVerse.surah}:${selectedVerse.ayah}` ? (
                <>
                  <Pause className="w-3 h-3" /> <span>إيقاف</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" /> <span>تلاوة</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
