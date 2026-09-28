'use client'

import React, { useEffect, useState } from 'react'
import {
  X,
  Search,
  BookOpen,
  Calculator,
  Compass,
  Layers,
  ArrowRight,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import { analyzeWordToken, type WordAnalysis } from '@/lib/quran/morphology'

interface WordConcordanceModalProps {
  word: string | null
  onClose: () => void
  onSelectVerse?: (surah: number, ayah: number) => void
}

export function WordConcordanceModal({
  word,
  onClose,
  onSelectVerse,
}: WordConcordanceModalProps) {
  const [data, setData] = useState<WordAnalysis | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!word) {
      setData(null)
      return
    }

    setLoading(true)
    fetch(`/api/quran/roots?word=${encodeURIComponent(word)}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setData(res.data)
        } else {
          // Fallback to local analysis
          setData(analyzeWordToken(word))
        }
      })
      .catch(() => {
        setData(analyzeWordToken(word))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [word])

  if (!word) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      dir="rtl"
    >
      <div className="bg-[#031527] border border-cyan-700/60 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <header className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#041d36]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                المعجم الصرفي والتوافق اللغوي <em>(Root Concordance)</em>
              </h2>
              <p className="text-xs text-slate-400">
                استخراج الجذر اللغوي، حساب الجمل، ومواضع الورود في المصحف
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-cyan-400 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs text-slate-300">
                جاري استخراج الجذر وفحص المصحف الشريف كاملاً (6,236 آية)...
              </span>
            </div>
          ) : data ? (
            <>
              {/* Word Card */}
              <div className="p-4 bg-[#020b18] border border-cyan-800/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-right">
                  <span className="text-[11px] text-slate-400">الكلمة المحددة:</span>
                  <div className="text-2xl font-serif font-bold text-white tracking-wide mt-0.5">
                    {data.originalWord}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-2 bg-cyan-950/70 border border-cyan-700/50 rounded-lg text-center">
                    <span className="text-[10px] text-cyan-300 block">الجذر المستخرج</span>
                    <strong className="text-base text-cyan-200 font-bold font-mono">
                      {data.root}
                    </strong>
                  </div>

                  <div className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-center">
                    <span className="text-[10px] text-slate-400 block">حساب الجمل</span>
                    <strong className="text-base text-amber-300 font-bold font-mono">
                      {data.abjadValue}
                    </strong>
                  </div>

                  <div className="px-3 py-2 bg-emerald-950/60 border border-emerald-700/50 rounded-lg text-center">
                    <span className="text-[10px] text-emerald-300 block">مواضع الورود</span>
                    <strong className="text-base text-emerald-300 font-bold font-mono">
                      {data.occurrencesCount}+
                    </strong>
                  </div>
                </div>
              </div>

              {/* Verses Concordance List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    مواضع ورود مشتقات الجذر في القرآن الكريم:
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    عرض حتى {data.sampleVerses.length} موضعاً
                  </span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {data.sampleVerses.map((v, i) => (
                    <div
                      key={`${v.surah}-${v.ayah}-${i}`}
                      className="p-3 bg-[#020e1d] hover:bg-[#03172b] border border-slate-800 rounded-xl transition flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-cyan-300">
                          سورة {v.surahName} · الآية {v.ayah}
                        </span>
                        {onSelectVerse && (
                          <button
                            onClick={() => {
                              onSelectVerse(v.surah, v.ayah)
                              onClose()
                            }}
                            className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                          >
                            عرض في مساحة العمل <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed text-slate-200 font-serif" dir="rtl">
                        {v.verseText}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
