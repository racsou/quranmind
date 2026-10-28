'use client'

import { useState, useRef, useMemo } from 'react'
import {
  SURAHS_META,
  getSurahVerses,
  type QuranVerse,
} from '@/lib/quran/quran-data'

export function useSurahLoader() {
  const [mushafSurah, setMushafSurah] = useState<number>(1)
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number>(0)
  const mushafPageSize = 4

  const surahsCache = useRef<Map<number, QuranVerse[]>>(new Map())
  const [isLoadingSurah, setIsLoadingSurah] = useState<boolean>(false)

  const [currentSurahVerses, setCurrentSurahVerses] = useState<QuranVerse[]>(() => {
    const fatihah = getSurahVerses(1)
    surahsCache.current.set(1, fatihah)
    return fatihah
  })

  const [selectedVerse, setSelectedVerse] = useState<QuranVerse | null>(() => {
    return currentSurahVerses[0] || null
  })

  const currentSurahMeta = useMemo(() => {
    return SURAHS_META.find((s) => s.number === mushafSurah) || SURAHS_META[0]
  }, [mushafSurah])

  const displayedVerses = useMemo(() => {
    if (!currentSurahVerses.length) return []
    return currentSurahVerses.slice(currentAyahIndex, currentAyahIndex + mushafPageSize)
  }, [currentSurahVerses, currentAyahIndex, mushafPageSize])

  const loadSurah = async (targetSurah: number, targetAyahIndex: number = 0) => {
    if (targetSurah < 1 || targetSurah > 114) return

    if (surahsCache.current.has(targetSurah)) {
      const cached = surahsCache.current.get(targetSurah)!
      setCurrentSurahVerses(cached)
      setMushafSurah(targetSurah)
      setCurrentAyahIndex(targetAyahIndex)
      if (cached[targetAyahIndex]) setSelectedVerse(cached[targetAyahIndex])
      return
    }

    setIsLoadingSurah(true)
    try {
      const verses = getSurahVerses(targetSurah)
      surahsCache.current.set(targetSurah, verses)
      setCurrentSurahVerses(verses)
      setMushafSurah(targetSurah)
      setCurrentAyahIndex(targetAyahIndex)
      if (verses[targetAyahIndex]) setSelectedVerse(verses[targetAyahIndex])
    } finally {
      setIsLoadingSurah(false)
    }
  }

  const handleNextAyahOrPage = async () => {
    if (isLoadingSurah) return
    const total = currentSurahVerses.length || currentSurahMeta.numberOfAyahs
    const nextIdx = currentAyahIndex + mushafPageSize

    if (nextIdx < total) {
      setCurrentAyahIndex(nextIdx)
      if (currentSurahVerses[nextIdx]) setSelectedVerse(currentSurahVerses[nextIdx])
    } else if (mushafSurah < 114) {
      await loadSurah(mushafSurah + 1, 0)
    }
  }

  const handlePrevAyahOrPage = async () => {
    if (isLoadingSurah) return
    const prevIdx = currentAyahIndex - mushafPageSize
    if (prevIdx >= 0) {
      setCurrentAyahIndex(prevIdx)
      if (currentSurahVerses[prevIdx]) setSelectedVerse(currentSurahVerses[prevIdx])
    } else if (mushafSurah > 1) {
      await loadSurah(mushafSurah - 1, 0)
    }
  }

  return {
    mushafSurah,
    setMushafSurah,
    currentAyahIndex,
    setCurrentAyahIndex,
    mushafPageSize,
    currentSurahVerses,
    currentSurahMeta,
    displayedVerses,
    selectedVerse,
    setSelectedVerse,
    isLoadingSurah,
    loadSurah,
    handleNextAyahOrPage,
    handlePrevAyahOrPage,
  }
}
