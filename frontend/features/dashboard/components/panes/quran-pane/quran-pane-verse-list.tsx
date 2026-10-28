'use client'

import React, { useState } from 'react'
import type { QuranVerse } from '@/lib/quran/quran-data'
import { QuranPaneVerseItem } from './quran-pane-verse-item'

interface QuranPaneVerseListProps {
  displayedVerses: QuranVerse[]
  selectedVerse: QuranVerse | null
  playingAyahKey: string | null
  onSelectVerse: (v: QuranVerse) => void
  onPlayVerse: (v: QuranVerse) => void
  onAttachAgent: (v: QuranVerse) => void
}

export function QuranPaneVerseList({
  displayedVerses,
  selectedVerse,
  playingAyahKey,
  onSelectVerse,
  onPlayVerse,
  onAttachAgent,
}: QuranPaneVerseListProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopy = (verse: QuranVerse) => {
    const key = `${verse.surah}:${verse.ayah}`
    navigator.clipboard.writeText(`﴿${verse.text}﴾ [سورة ${verse.surahName}: ${verse.ayah}]`)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <div className="quran-verses-scroll">
      {displayedVerses.map((verse) => {
        const isSelected = selectedVerse?.ayah === verse.ayah && selectedVerse?.surah === verse.surah
        const isPlaying = playingAyahKey === `${verse.surah}:${verse.ayah}`
        const isCopied = copiedKey === `${verse.surah}:${verse.ayah}`

        return (
          <QuranPaneVerseItem
            key={`${verse.surah}:${verse.ayah}`}
            verse={verse}
            isSelected={isSelected}
            isPlaying={isPlaying}
            copied={isCopied}
            onSelect={() => onSelectVerse(verse)}
            onPlay={() => onPlayVerse(verse)}
            onAttachAgent={() => onAttachAgent(verse)}
            onCopy={() => handleCopy(verse)}
          />
        )
      })}
    </div>
  )
}
