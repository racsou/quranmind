'use client'

import { useState, useRef } from 'react'
import type { QuranVerse } from '@/lib/quran/quran-data'

export function useAudioReciter(
  currentAyahIndex: number,
  mushafPageSize: number,
  setCurrentAyahIndex: (idx: number | ((prev: number) => number)) => void,
  currentSurahVerses: QuranVerse[],
  loadSurah: (surah: number, ayahIdx?: number) => Promise<void>
) {
  const [playingAyahKey, setPlayingAyahKey] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playVerseContinuous = (surahNum: number, ayahNum: number) => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    const ayahKey = `${surahNum}:${ayahNum}`
    setPlayingAyahKey(ayahKey)

    const targetIdx = ayahNum - 1
    if (targetIdx < currentAyahIndex || targetIdx >= currentAyahIndex + mushafPageSize) {
      const newStart = Math.floor(targetIdx / mushafPageSize) * mushafPageSize
      setCurrentAyahIndex(newStart)
    }

    const padSurah = String(surahNum).padStart(3, '0')
    const padAyah = String(ayahNum).padStart(3, '0')
    const audioUrl = `https://everyayah.com/data/Alafasy_128kbps/${padSurah}${padAyah}.mp3`

    const newAudio = new Audio(audioUrl)
    audioRef.current = newAudio

    newAudio.play().catch((err) => {
      console.warn('Audio playback error:', err)
      setPlayingAyahKey(null)
    })

    newAudio.onended = async () => {
      const totalAyahs = currentSurahVerses.length
      if (ayahNum < totalAyahs) {
        const nextAyah = ayahNum + 1
        if (nextAyah - 1 >= currentAyahIndex + mushafPageSize) {
          setCurrentAyahIndex((prev) => prev + mushafPageSize)
        }
        playVerseContinuous(surahNum, nextAyah)
      } else if (surahNum < 114) {
        const nextSurah = surahNum + 1
        await loadSurah(nextSurah, 0)
        playVerseContinuous(nextSurah, 1)
      } else {
        setPlayingAyahKey(null)
      }
    }
  }

  const handleTogglePlayAudio = (targetVerse?: QuranVerse | null) => {
    if (playingAyahKey) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      setPlayingAyahKey(null)
      return
    }

    if (targetVerse) {
      playVerseContinuous(targetVerse.surah, targetVerse.ayah)
    }
  }

  return {
    playingAyahKey,
    playVerseContinuous,
    handleTogglePlayAudio,
  }
}
