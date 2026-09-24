'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Repeat,
  Radio,
  Loader2,
} from 'lucide-react'

export interface AudioReciterProps {
  surah: number
  ayah: number
  surahName?: string
  totalAyahs?: number
  onAyahChange?: (newAyah: number) => void
  className?: string
}

interface ReciterConfig {
  id: string
  name: string
  folder: string
  bitrate: string
}

const RECITERS: ReciterConfig[] = [
  {
    id: 'alafasy',
    name: 'مشاري العفاسي',
    folder: 'Alafasy_128kbps',
    bitrate: '128kbps',
  },
  {
    id: 'husary',
    name: 'محمود خليل الحصري',
    folder: 'Husary_128kbps',
    bitrate: '128kbps',
  },
  {
    id: 'abdulbasit',
    name: 'عبد الباسط (مرتل)',
    folder: 'Abdul_Basit_Murattal_192kbps',
    bitrate: '192kbps',
  },
]

export function AudioReciter({
  surah,
  ayah,
  surahName,
  totalAyahs = 286,
  onAyahChange,
  className = '',
}: AudioReciterProps) {
  const [selectedReciter, setSelectedReciter] = useState<ReciterConfig>(RECITERS[0])
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Format 3-digit zero-padded string e.g. 021033.mp3
  function getAudioUrl(s: number, a: number, reciter: ReciterConfig): string {
    const padSurah = String(s).padStart(3, '0')
    const padAyah = String(a).padStart(3, '0')
    return `https://everyayah.com/data/${reciter.folder}/${padSurah}${padAyah}.mp3`
  }

  const currentAudioUrl = getAudioUrl(surah, ayah, selectedReciter)

  // Reload audio when surah, ayah, or reciter changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setCurrentTime(0)
      if (isPlaying) {
        setIsLoading(true)
        audioRef.current.load()
        audioRef.current
          .play()
          .then(() => {
            setIsLoading(false)
            setIsPlaying(true)
          })
          .catch(() => {
            setIsLoading(false)
            setIsPlaying(false)
          })
      }
    }
  }, [surah, ayah, selectedReciter])

  function togglePlay() {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      setIsLoading(true)
      audioRef.current
        .play()
        .then(() => {
          setIsLoading(false)
          setIsPlaying(true)
        })
        .catch(() => {
          setIsLoading(false)
          setIsPlaying(false)
        })
    }
  }

  function handleNextAyah() {
    if (ayah < totalAyahs) {
      onAyahChange?.(ayah + 1)
    }
  }

  function handlePrevAyah() {
    if (ayah > 1) {
      onAyahChange?.(ayah - 1)
    }
  }

  function handleSpeedChange(newSpeed: number) {
    setPlaybackSpeed(newSpeed)
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed
    }
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = val
      setCurrentTime(val)
    }
  }

  function formatAudioTime(seconds: number): string {
    if (isNaN(seconds) || seconds === 0) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div
      className={`p-3 bg-[#020e1f] border border-cyan-900/60 rounded-xl flex flex-col gap-2 shadow-lg backdrop-blur-sm ${className}`}
      dir="rtl"
    >
      <audio
        ref={audioRef}
        src={currentAudioUrl}
        preload="metadata"
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime)
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration)
            setIsLoading(false)
          }
        }}
        onEnded={() => {
          setIsPlaying(false)
          if (autoAdvance && ayah < totalAyahs) {
            onAyahChange?.(ayah + 1)
            setIsPlaying(true)
          }
        }}
      />

      {/* Top Row: Info and Reciter Picker */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
            <Radio className={`w-3.5 h-3.5 ${isPlaying ? 'animate-pulse text-emerald-400' : ''}`} />
            تلاوة صوتية متزامنة
          </span>
          {surahName && (
            <span className="text-[11px] text-slate-400">
              سورة {surahName} · الآية {ayah}
            </span>
          )}
        </div>

        {/* Reciter Selector */}
        <select
          value={selectedReciter.id}
          onChange={(e) => {
            const found = RECITERS.find((r) => r.id === e.target.value)
            if (found) setSelectedReciter(found)
          }}
          className="bg-[#041a31] border border-slate-700 text-slate-200 text-[11px] rounded-lg px-2 py-1 outline-none cursor-pointer"
        >
          {RECITERS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* Center Controls & Progress */}
      <div className="flex items-center gap-3">
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="w-8 h-8 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center shrink-0 shadow transition disabled:opacity-50"
          title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>

        {/* Prev Verse */}
        <button
          onClick={handlePrevAyah}
          disabled={ayah <= 1}
          className="text-slate-400 hover:text-white disabled:opacity-30 p-1"
          title="الآية السابقة"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        {/* Next Verse */}
        <button
          onClick={handleNextAyah}
          disabled={ayah >= totalAyahs}
          className="text-slate-400 hover:text-white disabled:opacity-30 p-1"
          title="الآية التالية"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        {/* Progress Timeline */}
        <div className="flex-1 flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-mono w-7 text-left">
            {formatAudioTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="text-[10px] text-slate-400 font-mono w-7 text-right">
            {formatAudioTime(duration)}
          </span>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-0.5 text-[10px]">
          {[1, 1.25, 1.5].map((spd) => (
            <button
              key={spd}
              onClick={() => handleSpeedChange(spd)}
              className={`px-1.5 py-0.5 rounded transition ${
                playbackSpeed === spd
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Auto Advance Toggle */}
        <button
          onClick={() => setAutoAdvance(!autoAdvance)}
          className={`p-1.5 rounded text-xs transition ${
            autoAdvance ? 'text-cyan-400' : 'text-slate-500'
          }`}
          title={autoAdvance ? 'الانتقال التلقائي للآية التالية مفعّل' : 'الانتقال التلقائي معطل'}
        >
          <Repeat className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
