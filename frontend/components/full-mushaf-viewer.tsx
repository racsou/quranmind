'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  BookOpen,
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Volume2,
  Copy,
  Check,
  Sparkles,
  Maximize2,
  ChevronRight,
  ChevronLeft,
  Search,
  Languages,
  Eye,
  CheckCircle2,
  FileCheck,
  Bookmark,
  Share2,
} from 'lucide-react'
import {
  SURAHS_META,
  getPageVerses,
  getSurahStartPage,
  getJuzForPage,
  getHizbForPage,
  lookupVerse,
  type QuranVerse,
} from '@/lib/quran/quran-data'

export interface Reciter {
  id: string
  name: string
  subname: string
  urlPrefix: string
}

export const RECITERS: Reciter[] = [
  {
    id: 'alafasy',
    name: 'الشيخ مشاري بن راشد العفاسي',
    subname: 'Mishary Alafasy (مرتل)',
    urlPrefix: 'https://everyayah.com/data/Alafasy_128kbps/',
  },
  {
    id: 'abdulbasit',
    name: 'الشيخ عبد الباسط عبد الصمد',
    subname: 'Abdul Basit (مجود)',
    urlPrefix: 'https://everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/',
  },
  {
    id: 'husary',
    name: 'الشيخ محمود خليل الحصري',
    subname: 'Al-Husary (مرتل ومجود)',
    urlPrefix: 'https://everyayah.com/data/Husary_128kbps/',
  },
  {
    id: 'ghamadi',
    name: 'الشيخ سعد الغامدي',
    subname: 'Saad Al-Ghamdi (مرتل)',
    urlPrefix: 'https://everyayah.com/data/Ghamadi_40kbps/',
  },
  {
    id: 'muaiqly',
    name: 'الشيخ ماهر المعيقلي',
    subname: 'Maher Al-Muaiqly (مرتل)',
    urlPrefix: 'https://everyayah.com/data/MaherAlMuaiqly128kbps/',
  },
]

export function FullMushafViewer() {
  // Current 2-page spread index: Spread 1 = Page 1 (Right) & Page 2 (Left)
  // Spread S has Right Page = (S * 2) - 1, and Left Page = S * 2
  const [currentSpread, setCurrentSpread] = useState<number>(1)

  // Audio & Reciter State
  const [activeReciterId, setActiveReciterId] = useState<string>('alafasy')
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false)
  const [playingVerseKey, setPlayingVerseKey] = useState<string | null>(null)
  const [continuousPlay, setContinuousPlay] = useState<boolean>(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Selected Verse State (clicking a verse selects it; clicking outside / away deselects)
  const [selectedVerse, setSelectedVerse] = useState<QuranVerse | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [showTranslation, setShowTranslation] = useState<boolean>(false)
  const [fontSize, setFontSize] = useState<number>(20)

  // Calculate current right & left page numbers
  const rightPageNum = (currentSpread * 2) - 1
  const leftPageNum = currentSpread * 2

  // Fetch verses for the two open pages
  const rightPageVerses = useMemo(() => {
    return getPageVerses(rightPageNum)
  }, [rightPageNum])

  const leftPageVerses = useMemo(() => {
    return getPageVerses(leftPageNum)
  }, [leftPageNum])

  // Primary Surah for each page
  const rightSurahNum = rightPageVerses[0]?.surah || 1
  const leftSurahNum = leftPageVerses[0]?.surah || (rightPageNum === 1 ? 2 : rightSurahNum)

  const rightSurahMeta = useMemo(() => {
    return SURAHS_META.find((s) => s.number === rightSurahNum) || SURAHS_META[0]
  }, [rightSurahNum])

  const leftSurahMeta = useMemo(() => {
    return SURAHS_META.find((s) => s.number === leftSurahNum) || SURAHS_META[1]
  }, [leftSurahNum])

  // Active Reciter Object
  const currentReciter = useMemo(() => {
    return RECITERS.find((r) => r.id === activeReciterId) || RECITERS[0]
  }, [activeReciterId])

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Continuous Audio Player Function
  const playVerseByKey = (verseKey: string) => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    const [sStr, aStr] = verseKey.split(':')
    const surahNum = Number(sStr)
    const ayahNum = Number(aStr)

    setPlayingVerseKey(verseKey)
    setIsPlayingAudio(true)

    const padSurah = String(surahNum).padStart(3, '0')
    const padAyah = String(ayahNum).padStart(3, '0')
    const audioUrl = `${currentReciter.urlPrefix}${padSurah}${padAyah}.mp3`

    const audio = new Audio(audioUrl)
    audioRef.current = audio

    audio.play().catch((err) => {
      console.warn('Audio playback error:', err)
      setIsPlayingAudio(false)
      setPlayingVerseKey(null)
    })

    audio.onended = () => {
      if (!continuousPlay) {
        setIsPlayingAudio(false)
        setPlayingVerseKey(null)
        return
      }

      // Calculate next verse key
      const currentMeta = SURAHS_META.find((s) => s.number === surahNum)
      const maxAyahs = currentMeta?.numberOfAyahs || 7

      let nextSurah = surahNum
      let nextAyah = ayahNum + 1

      if (nextAyah > maxAyahs) {
        if (surahNum < 114) {
          nextSurah = surahNum + 1
          nextAyah = 1
        } else {
          // Finished entire Quran
          setIsPlayingAudio(false)
          setPlayingVerseKey(null)
          return
        }
      }

      const nextKey = `${nextSurah}:${nextAyah}`

      // Check if next verse is on the currently visible two pages
      const isVisibleOnRight = rightPageVerses.some((v) => v.id === nextKey)
      const isVisibleOnLeft = leftPageVerses.some((v) => v.id === nextKey)

      if (!isVisibleOnRight && !isVisibleOnLeft) {
        // Next verse is on the next page / spread -> Flip the spread automatically!
        setCurrentSpread((prev) => Math.min(302, prev + 1))
      }

      playVerseByKey(nextKey)
    }
  }

  // Handle Play / Pause Toggle
  const handleTogglePlay = (targetVerse?: QuranVerse | null) => {
    if (isPlayingAudio) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      setIsPlayingAudio(false)
      setPlayingVerseKey(null)
      return
    }

    // Determine starting verse:
    // 1. targetVerse if passed
    // 2. selectedVerse if user clicked a verse
    // 3. Or first visible verse on the two pages (Right Page first, then Left Page)
    const verseToPlay =
      targetVerse || selectedVerse || rightPageVerses[0] || leftPageVerses[0]

    if (verseToPlay) {
      playVerseByKey(verseToPlay.id)
    }
  }

  // Stop Audio
  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsPlayingAudio(false)
    setPlayingVerseKey(null)
  }

  // Next / Previous Ayah manual skip
  const handleSkipNextAyah = () => {
    const currentKey = playingVerseKey || selectedVerse?.id || rightPageVerses[0]?.id || '1:1'
    const [sStr, aStr] = currentKey.split(':')
    const s = Number(sStr)
    const a = Number(aStr)
    const meta = SURAHS_META.find((m) => m.number === s)
    if (a < (meta?.numberOfAyahs || 7)) {
      playVerseByKey(`${s}:${a + 1}`)
    } else if (s < 114) {
      playVerseByKey(`${s + 1}:1`)
    }
  }

  const handleSkipPrevAyah = () => {
    const currentKey = playingVerseKey || selectedVerse?.id || rightPageVerses[0]?.id || '1:1'
    const [sStr, aStr] = currentKey.split(':')
    const s = Number(sStr)
    const a = Number(aStr)
    if (a > 1) {
      playVerseByKey(`${s}:${a - 1}`)
    } else if (s > 1) {
      const prevMeta = SURAHS_META.find((m) => m.number === s - 1)
      playVerseByKey(`${s - 1}:${prevMeta?.numberOfAyahs || 1}`)
    }
  }

  // Copy Ayah Text
  const handleCopyAyah = (verse: QuranVerse) => {
    navigator.clipboard.writeText(`﴿${verse.text}﴾ [سورة ${verse.surahName}: ${verse.ayah}]`)
    setCopiedKey(verse.id)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Add Verse to AI Agent
  const handleAddToAgent = (verse: QuranVerse) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(
        'qm_agent_context_verse',
        JSON.stringify({
          surah: verse.surah,
          surahName: verse.surahName,
          ayah: verse.ayah,
          text: verse.text,
        })
      )
      alert(`تم ربط الآية [${verse.surahName}: ${verse.ayah}] بسياق الوكيل الذكي بنجاح!`)
    }
  }

  // Jump to Surah
  const handleJumpToSurah = (surahNum: number) => {
    const page = getSurahStartPage(surahNum)
    const spread = Math.ceil(page / 2)
    setCurrentSpread(Math.max(1, Math.min(302, spread)))
    setSelectedVerse(null)
  }

  // Jump to Page
  const handleJumpToPage = (pageNum: number) => {
    const p = Math.max(1, Math.min(604, pageNum))
    const spread = Math.ceil(p / 2)
    setCurrentSpread(spread)
    setSelectedVerse(null)
  }

  // Jump to Juz
  const handleJumpToJuz = (juzNum: number) => {
    const approxPage = Math.max(1, Math.min(604, (juzNum - 1) * 20 + 2))
    handleJumpToPage(approxPage)
  }

  return (
    <div className="full-mushaf-container" dir="rtl">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & TOOLBAR                                                  */}
      {/* ========================================================================= */}
      <div className="full-mushaf-header">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <span>المصحف الشريف الملكي (عرض صفحتين متقابلتين)</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono">
                مصحف المدينة النبوية · 604 صفحات
              </span>
            </h1>
          </div>
        </div>

        {/* Quick Spread & Font Controls */}
        <div className="flex items-center gap-2">
          {/* Translation Toggle */}
          <button
            type="button"
            onClick={() => setShowTranslation(!showTranslation)}
            className={`text-xs px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition ${
              showTranslation
                ? 'bg-cyan-900/60 border-cyan-400 text-cyan-200'
                : 'bg-[#031c33] border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="عرض / إخفاء الترجمة الإنجليزية للآيات"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{showTranslation ? 'إخفاء الترجمة' : 'عرض الترجمة'}</span>
          </button>

          {/* Font Size Adjusters */}
          <div className="flex items-center bg-[#021324] border border-cyan-900/60 rounded-md p-0.5 text-xs text-slate-300">
            <button
              type="button"
              onClick={() => setFontSize((f) => Math.max(16, f - 2))}
              className="px-2 py-0.5 hover:text-white"
              title="تصغير خط المصحف"
            >
              A-
            </button>
            <span className="px-1 text-[10px] text-cyan-400 font-mono">{fontSize}px</span>
            <button
              type="button"
              onClick={() => setFontSize((f) => Math.min(28, f + 2))}
              className="px-2 py-0.5 hover:text-white"
              title="تكبير خط المصحف"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN LAYOUT: LEFT SIDEBAR + TWO-PAGE OPEN MUSHAF                      */}
      {/* ========================================================================= */}
      <div className="full-mushaf-layout">
        {/* ----------------------------------------------------------------------- */}
        {/* LEFT SIDEBAR: Audio Player, Reciter Selector, Controls, Verse Info      */}
        {/* ----------------------------------------------------------------------- */}
        <aside className="mushaf-sidebar-left">
          {/* Audio Player Card */}
          <div className="sidebar-card audio-player-box">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>مشغل التلاوة القرآنية</span>
              </span>
              <span
                className={`text-[9.5px] px-2 py-0.5 rounded-full font-mono flex items-center gap-1 ${
                  isPlayingAudio
                    ? 'bg-amber-950 text-amber-300 border border-amber-600/50 animate-pulse'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {isPlayingAudio ? '▶ جاري التلاوة' : '⏹ متوقف'}
              </span>
            </div>

            {/* Reciter Selector */}
            <div className="mb-3">
              <label className="text-[10.5px] text-slate-400 block mb-1">القارئ المعتمد:</label>
              <select
                value={activeReciterId}
                onChange={(e) => {
                  setActiveReciterId(e.target.value)
                  if (isPlayingAudio && playingVerseKey) {
                    handleStopAudio()
                  }
                }}
                className="w-full bg-[#021324] border border-cyan-800/60 rounded-md px-2 py-1.5 text-xs text-white outline-none focus:border-cyan-400 transition"
              >
                {RECITERS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Master Controls: Play / Pause, Prev, Next, Stop */}
            <div className="audio-control-buttons">
              <button
                type="button"
                onClick={handleSkipPrevAyah}
                className="audio-btn-step"
                title="الآية السابقة"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleTogglePlay()}
                className={`audio-btn-main ${isPlayingAudio ? 'is-playing' : ''}`}
                title={
                  isPlayingAudio
                    ? 'إيقاف مؤقت'
                    : selectedVerse
                    ? `استماع من الآية [${selectedVerse.ayah}]`
                    : 'استماع من أول آية ظاهرة بالصفحة'
                }
              >
                {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                <span>
                  {isPlayingAudio
                    ? 'إيقاف التلاوة'
                    : selectedVerse
                    ? `استماع (الآية ${selectedVerse.ayah})`
                    : 'استماع متصل'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleSkipNextAyah}
                className="audio-btn-step"
                title="الآية التالية"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleStopAudio}
                className="audio-btn-stop"
                title="إيقاف تام"
              >
                <Square className="w-3.5 h-3.5 text-slate-400 hover:text-rose-400" />
              </button>
            </div>

            {/* Continuous Playback Checkbox */}
            <label className="flex items-center gap-2 mt-3 pt-2 border-t border-cyan-900/40 text-[11px] text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={continuousPlay}
                onChange={(e) => setContinuousPlay(e.target.checked)}
                className="rounded accent-cyan-500 cursor-pointer"
              />
              <span>تلاوة متصلة تلقائياً مع تقليب الصفحات</span>
            </label>

            {/* Currently Playing Status Badge */}
            {playingVerseKey && (
              <div className="mt-2.5 p-2 bg-[#02182c] border border-amber-500/40 rounded-lg text-xs text-amber-200 flex items-center justify-between">
                <span className="font-semibold">
                  تلاوة: آية {playingVerseKey}
                </span>
                <span className="text-[10px] text-amber-400 animate-pulse font-mono">
                  {currentReciter.subname.split(' ')[0]}
                </span>
              </div>
            )}
          </div>

          {/* Selected Verse Info & AI Agent Dock */}
          <div className="sidebar-card selected-verse-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-cyan-400" />
                <span>الآية المحددة</span>
              </span>
              {selectedVerse && (
                <button
                  type="button"
                  onClick={() => setSelectedVerse(null)}
                  className="text-[10px] text-slate-400 hover:text-rose-400 transition"
                  title="إلغاء التحديد (انقر بعيداً)"
                >
                  إلغاء التحديد ✕
                </button>
              )}
            </div>

            {selectedVerse ? (
              <div className="space-y-2.5">
                <div className="p-2.5 bg-[#021324] border border-cyan-800/50 rounded-lg">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-cyan-300 mb-1">
                    <span>
                      سورة {selectedVerse.surahName} [الآية {selectedVerse.ayah}]
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {selectedVerse.id}
                    </span>
                  </div>
                  <p
                    className="text-xs text-white leading-relaxed font-serif line-clamp-3"
                    style={{ fontFamily: "'UthmanicHafs', serif" }}
                  >
                    «{selectedVerse.text}»
                  </p>
                  {showTranslation && (
                    <p className="text-[10.5px] text-slate-400 italic mt-1.5 pt-1.5 border-t border-slate-800 line-clamp-2">
                      {selectedVerse.translation}
                    </p>
                  )}
                </div>

                {/* Verse Action Buttons */}
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleTogglePlay(selectedVerse)}
                    className="sidebar-action-btn bg-cyan-900/60 hover:bg-cyan-800 border-cyan-700/60 text-cyan-200"
                  >
                    <Play className="w-3 h-3 text-cyan-400" />
                    <span>استماع للآية</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyAyah(selectedVerse)}
                    className="sidebar-action-btn bg-[#031d33] hover:bg-[#062c4e] border-slate-700 text-slate-300"
                  >
                    {copiedKey === selectedVerse.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-400" />
                    )}
                    <span>نسخ الآية</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddToAgent(selectedVerse)}
                    className="col-span-2 sidebar-action-btn bg-gradient-to-r from-cyan-950 to-blue-950 border-cyan-600/60 text-cyan-100 hover:from-cyan-900 hover:to-blue-900 font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                    <span>إضافة الآية للوكيل الذكي للتحليل</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-[#021324] border border-cyan-900/40 rounded-lg text-center text-slate-400 text-xs space-y-2">
                <p className="text-[11px] leading-relaxed">
                  💡 انقر على أي آية في أيٍّ من الصفحتين لتحديدها وتشغيلها أو نسخها أو إرسالها للوكيل.
                </p>
                <p className="text-[10px] text-cyan-400/80">
                  عند النقر بعيداً وبدء التلاوة، ستبدأ تلقائياً من أول آية ظاهرة بالصفحة اليمنى.
                </p>
                <button
                  type="button"
                  onClick={() => handleTogglePlay()}
                  className="w-full py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>بدء التلاوة من الصفحة المفتوحة</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Jump & Navigation Card */}
          <div className="sidebar-card navigation-jump-card">
            <span className="text-xs font-bold text-white block mb-2">التنقل السريع في المصحف:</span>

            {/* Jump to Surah */}
            <div className="mb-2">
              <label className="text-[10px] text-slate-400 block mb-1">الانتقال إلى سورة:</label>
              <select
                value={rightSurahNum}
                onChange={(e) => handleJumpToSurah(Number(e.target.value))}
                className="w-full bg-[#021324] border border-cyan-800/60 rounded px-2 py-1 text-xs text-white outline-none"
              >
                {SURAHS_META.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. سورة {s.name} ({s.numberOfAyahs} آية)
                  </option>
                ))}
              </select>
            </div>

            {/* Jump to Juz */}
            <div className="mb-2">
              <label className="text-[10px] text-slate-400 block mb-1">الانتقال إلى جزء:</label>
              <select
                value={getJuzForPage(rightPageNum)}
                onChange={(e) => handleJumpToJuz(Number(e.target.value))}
                className="w-full bg-[#021324] border border-cyan-800/60 rounded px-2 py-1 text-xs text-white outline-none"
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
                  <option key={j} value={j}>
                    الجزء {j}
                  </option>
                ))}
              </select>
            </div>

            {/* Jump to Page Number */}
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-slate-400 whitespace-nowrap">رقم الصفحة:</label>
              <input
                type="number"
                min={1}
                max={604}
                value={rightPageNum}
                onChange={(e) => handleJumpToPage(Number(e.target.value))}
                className="w-20 bg-[#021324] border border-cyan-800/60 rounded px-2 py-1 text-xs text-center text-white outline-none"
              />
              <span className="text-[10px] text-slate-500">/ 604</span>
            </div>
          </div>
        </aside>

        {/* ----------------------------------------------------------------------- */}
        {/* MAIN OPEN BOOK: TWO PAGES SIDE BY SIDE                                 */}
        {/* In RTL: Right Page is on the Right, Left Page is on the Left           */}
        {/* ----------------------------------------------------------------------- */}
        <div className="mushaf-spread-wrapper">
          {/* The Open Hardcover Book Container */}
          <div
            className="mushaf-open-book"
            onClick={() => {
              // Click away outside verse spans -> Deselect active verse!
              setSelectedVerse(null)
            }}
          >
            {/* =================================================================== */}
            {/* RIGHT PAGE (الصفحة اليمنى): Page (currentSpread * 2 - 1)           */}
            {/* =================================================================== */}
            <div className="mushaf-page-container is-right-page">
              {/* Page Topbar */}
              <div className="mushaf-page-topbar">
                <span className="mushaf-juz-tag">الجزء {getJuzForPage(rightPageNum)}</span>

                <div className="mushaf-surah-plaque">
                  <span className="plaque-title">سُورَةُ {rightSurahMeta.name}</span>
                  <span className="plaque-subtitle">
                    {rightSurahMeta.revelationType === 'Meccan' ? 'مَكِّيَّةٌ' : 'مَدَنِيَّةٌ'} · {rightSurahMeta.numberOfAyahs} آيَاتٍ
                  </span>
                </div>

                <span className="mushaf-hizb-tag">الحزب {getHizbForPage(rightPageNum)}</span>
              </div>

              {/* Basmalah Cartouche (if page starts a Surah other than Tawbah & Fatihah) */}
              {rightPageVerses.some((v) => v.ayah === 1 && v.surah !== 9 && v.surah !== 1) && (
                <div className="mushaf-basmalah-box">
                  <div className="mushaf-basmalah-ornament">
                    <span>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
                  </div>
                </div>
              )}

              {/* Continuous Flowing Arabic Text for Right Page */}
              <div className="mushaf-page-body" style={{ minHeight: '520px' }}>
                <div
                  className="mushaf-flowing-text font-serif"
                  style={{ fontSize: `${fontSize}px`, lineHeight: 2.3 }}
                >
                  {rightPageVerses.map((verse) => {
                    const isSelected = selectedVerse?.id === verse.id
                    const isPlaying = playingVerseKey === verse.id

                    return (
                      <span
                        key={verse.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedVerse(verse)
                        }}
                        className={`mushaf-verse-span ${
                          isSelected ? 'is-selected' : ''
                        } ${isPlaying ? 'is-playing' : ''}`}
                        title={`[سورة ${verse.surahName}: آية ${verse.ayah}] — انقر لتحديدها أو تشغيلها`}
                      >
                        <span className="verse-arabic-words">{verse.text}</span>
                        <span className="mushaf-ayah-medallion">
                          ﴿{verse.ayah}﴾
                        </span>
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Page Number Medallion at Bottom */}
              <div className="mushaf-page-bottom-number">
                <span className="page-medallion-badge">{rightPageNum}</span>
              </div>
            </div>

            {/* Central Book Spine Crease Effect */}
            <div className="mushaf-book-spine" />

            {/* =================================================================== */}
            {/* LEFT PAGE (الصفحة اليسرى): Page (currentSpread * 2)                 */}
            {/* =================================================================== */}
            <div className="mushaf-page-container is-left-page">
              {/* Page Topbar */}
              <div className="mushaf-page-topbar">
                <span className="mushaf-juz-tag">الجزء {getJuzForPage(leftPageNum)}</span>

                <div className="mushaf-surah-plaque">
                  <span className="plaque-title">سُورَةُ {leftSurahMeta.name}</span>
                  <span className="plaque-subtitle">
                    {leftSurahMeta.revelationType === 'Meccan' ? 'مَكِّيَّةٌ' : 'مَدَنِيَّةٌ'} · {leftSurahMeta.numberOfAyahs} آيَاتٍ
                  </span>
                </div>

                <span className="mushaf-hizb-tag">الحزب {getHizbForPage(leftPageNum)}</span>
              </div>

              {/* Basmalah Cartouche (if left page starts a Surah other than Tawbah) */}
              {(leftPageNum === 2 || leftPageVerses.some((v) => v.ayah === 1 && v.surah !== 9 && v.surah !== 1)) && (
                <div className="mushaf-basmalah-box">
                  <div className="mushaf-basmalah-ornament">
                    <span>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
                  </div>
                </div>
              )}

              {/* Continuous Flowing Arabic Text for Left Page */}
              <div className="mushaf-page-body" style={{ minHeight: '520px' }}>
                <div
                  className="mushaf-flowing-text font-serif"
                  style={{ fontSize: `${fontSize}px`, lineHeight: 2.3 }}
                >
                  {leftPageVerses.map((verse) => {
                    const isSelected = selectedVerse?.id === verse.id
                    const isPlaying = playingVerseKey === verse.id

                    return (
                      <span
                        key={verse.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedVerse(verse)
                        }}
                        className={`mushaf-verse-span ${
                          isSelected ? 'is-selected' : ''
                        } ${isPlaying ? 'is-playing' : ''}`}
                        title={`[سورة ${verse.surahName}: آية ${verse.ayah}] — انقر لتحديدها أو تشغيلها`}
                      >
                        <span className="verse-arabic-words">{verse.text}</span>
                        <span className="mushaf-ayah-medallion">
                          ﴿{verse.ayah}﴾
                        </span>
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Page Number Medallion at Bottom */}
              <div className="mushaf-page-bottom-number">
                <span className="page-medallion-badge">{leftPageNum}</span>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* SPREAD BOTTOM NAVIGATION CONTROLS                                    */}
          {/* ===================================================================== */}
          <div className="mushaf-spread-navigation">
            <button
              type="button"
              disabled={currentSpread <= 1}
              onClick={() => {
                setCurrentSpread((s) => Math.max(1, s - 1))
                setSelectedVerse(null)
              }}
              className="spread-nav-btn"
            >
              <ChevronRight className="w-4 h-4" />
              <span>الصفحتان السابقتان ({rightPageNum - 2} و {leftPageNum - 2})</span>
            </button>

            <div className="spread-indicator">
              <span className="text-amber-400 font-bold">
                الصفحتان {rightPageNum} و {leftPageNum}
              </span>
              <span className="text-slate-400 text-xs">من 604 صفحة</span>
            </div>

            <button
              type="button"
              disabled={leftPageNum >= 604}
              onClick={() => {
                setCurrentSpread((s) => Math.min(302, s + 1))
                setSelectedVerse(null)
              }}
              className="spread-nav-btn"
            >
              <span>الصفحتان التاليتان ({rightPageNum + 2} و {leftPageNum + 2})</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. STYLES (Royal Madani Mushaf Aesthetic matching Home Page)             */}
      {/* ========================================================================= */}
      <style jsx>{`
        .full-mushaf-container {
          display: flex;
          flex-direction: column;
          gap: 14px;
          min-height: calc(100vh - 120px);
        }

        .full-mushaf-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #03172b;
          border: 1px solid #144f7a;
          border-radius: 12px;
          padding: 10px 16px;
        }

        .full-mushaf-layout {
          display: grid;
          grid-template-columns: 290px 1fr;
          gap: 16px;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .full-mushaf-layout {
            grid-template-columns: 1fr;
          }
        }

        /* ---------------------------------------------------- */
        /* Left Sidebar Styling                                 */
        /* ---------------------------------------------------- */
        .mushaf-sidebar-left {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sidebar-card {
          background: #03172b;
          border: 1px solid #144f7a;
          border-radius: 12px;
          padding: 14px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
        }

        .audio-control-buttons {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .audio-btn-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: linear-gradient(90deg, #0284c7, #0369a1);
          border: 1px solid #38bdf8;
          border-radius: 8px;
          padding: 8px 12px;
          color: #ffffff;
          font-size: 11px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 2px 10px rgba(2, 132, 199, 0.3);
        }

        .audio-btn-main:hover {
          background: linear-gradient(90deg, #0ea5e9, #0284c7);
        }

        .audio-btn-main.is-playing {
          background: linear-gradient(90deg, #d97706, #b45309);
          border-color: #f59e0b;
          box-shadow: 0 2px 12px rgba(217, 119, 6, 0.4);
          animation: pulse-amber 2s infinite ease-in-out;
        }

        .audio-btn-step,
        .audio-btn-stop {
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          background: #021324;
          border: 1px solid #144f7a;
          border-radius: 8px;
          color: #cbd5e1;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .audio-btn-step:hover,
        .audio-btn-stop:hover {
          background: #062b49;
          color: #ffffff;
        }

        .sidebar-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 6px 8px;
          border-radius: 6px;
          border: 1px solid transparent;
          font-size: 10.5px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        /* ---------------------------------------------------- */
        /* Open Book Spread & Two-Page Styling                  */
        /* ---------------------------------------------------- */
        .mushaf-spread-wrapper {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mushaf-open-book {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          background: #020f1c;
          border: 3px solid #b89130;
          outline: 2px solid #144a73;
          outline-offset: -7px;
          border-radius: 14px;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.7), inset 0 0 60px rgba(0, 0, 0, 0.6);
          overflow: hidden;
          position: relative;
        }

        @media (max-width: 768px) {
          .mushaf-open-book {
            grid-template-columns: 1fr;
          }
          .mushaf-book-spine {
            display: none;
          }
        }

        .mushaf-book-spine {
          width: 14px;
          background: linear-gradient(
            90deg,
            rgba(0, 0, 0, 0.45) 0%,
            rgba(184, 145, 48, 0.25) 50%,
            rgba(0, 0, 0, 0.45) 100%
          );
          box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.8);
          border-left: 1px solid rgba(184, 145, 48, 0.2);
          border-right: 1px solid rgba(184, 145, 48, 0.2);
        }

        .mushaf-page-container {
          background: radial-gradient(circle at 50% 30%, #062540, #031628);
          display: flex;
          flex-direction: column;
          position: relative;
          padding: 8px 14px 14px;
        }

        .mushaf-page-container.is-right-page {
          border-left: 1px solid rgba(184, 145, 48, 0.15);
        }

        .mushaf-page-container.is-left-page {
          border-right: 1px solid rgba(184, 145, 48, 0.15);
        }

        .mushaf-page-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 12px 4px;
          border-bottom: 1px solid rgba(184, 145, 48, 0.35);
        }

        .mushaf-juz-tag,
        .mushaf-hizb-tag {
          font-size: 11px;
          color: #d1b46a;
          font-weight: bold;
        }

        .mushaf-surah-plaque {
          border: 1.5px solid #d1b46a;
          background: linear-gradient(180deg, #093357 0%, #041f36 100%);
          border-radius: 6px;
          padding: 3px 20px;
          text-align: center;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .plaque-title {
          display: block;
          font-size: 14px;
          font-weight: bold;
          color: #ffe699;
          font-family: 'Amiri', 'UthmanicHafs', serif;
        }

        .plaque-subtitle {
          display: block;
          font-size: 9px;
          color: #7dd3fc;
        }

        .mushaf-basmalah-box {
          text-align: center;
          padding: 8px 12px 2px;
        }

        .mushaf-basmalah-ornament {
          display: inline-block;
          color: #e0f2fe;
          font-size: 16px;
          letter-spacing: 1px;
          text-shadow: 0 0 12px rgba(255, 230, 153, 0.35);
          font-family: 'UthmanicHafs', serif;
        }

        .mushaf-page-body {
          padding: 12px 10px;
          flex: 1;
        }

        .mushaf-flowing-text {
          text-align: justify;
          text-align-last: center;
          color: #f0f9ff;
          direction: rtl;
        }

        .mushaf-verse-span {
          display: inline;
          padding: 2px 4px;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .mushaf-verse-span:hover {
          background: rgba(0, 212, 255, 0.15);
          text-shadow: 0 0 8px rgba(0, 212, 255, 0.5);
        }

        .mushaf-verse-span.is-selected {
          background: rgba(0, 212, 255, 0.25);
          box-shadow: 0 0 0 1.5px #00d4ff, 0 0 12px rgba(0, 212, 255, 0.35);
          color: #ffffff;
        }

        /* Continuous Playback Glowing Highlight */
        .mushaf-verse-span.is-playing {
          background: rgba(234, 179, 8, 0.28) !important;
          box-shadow: 0 0 0 2px #f59e0b, 0 0 18px rgba(245, 158, 11, 0.5) !important;
          border-radius: 6px;
          animation: pulse-amber 2s infinite ease-in-out;
          color: #ffffff !important;
        }

        .verse-arabic-words {
          font-family: 'UthmanicHafs', 'Amiri Quran', serif;
        }

        .mushaf-ayah-medallion {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #d1b46a;
          font-size: 14px;
          font-weight: bold;
          margin: 0 4px;
          text-shadow: 0 0 4px rgba(209, 180, 106, 0.4);
        }

        .mushaf-page-bottom-number {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 6px;
          border-top: 1px dashed rgba(184, 145, 48, 0.25);
        }

        .page-medallion-badge {
          display: inline-block;
          border: 1px solid #b89130;
          background: #021221;
          color: #ffe699;
          font-size: 11px;
          font-weight: bold;
          border-radius: 50%;
          width: 26px;
          height: 26px;
          line-height: 24px;
          text-align: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
        }

        /* ---------------------------------------------------- */
        /* Spread Navigation Bar                                */
        /* ---------------------------------------------------- */
        .mushaf-spread-navigation {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #03172b;
          border: 1px solid #144f7a;
          border-radius: 10px;
          padding: 8px 16px;
        }

        .spread-nav-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #062b49;
          border: 1px solid #124f7e;
          border-radius: 6px;
          padding: 6px 14px;
          color: #84d8f0;
          font-size: 11px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .spread-nav-btn:hover:not(:disabled) {
          background: #0a3d66;
          color: #ffffff;
        }

        .spread-nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .spread-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
        }

        @keyframes pulse-amber {
          0%, 100% {
            box-shadow: 0 0 0 2px #f59e0b, 0 0 12px rgba(245, 158, 11, 0.3);
          }
          50% {
            box-shadow: 0 0 0 2.5px #fbbf24, 0 0 22px rgba(251, 191, 36, 0.6);
          }
        }
      `}</style>
    </div>
  )
}
