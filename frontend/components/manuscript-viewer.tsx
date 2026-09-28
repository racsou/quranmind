'use client'

import React, { useState } from 'react'
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  BookOpen,
  Calendar,
  MapPin,
  FileCheck,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import { EARLY_MANUSCRIPTS, type QuranManuscript } from '@/lib/quran/manuscripts'

interface ManuscriptViewerProps {
  isOpen: boolean
  onClose: () => void
  currentSurahName?: string
  currentAyah?: number
}

export function ManuscriptViewer({ isOpen, onClose, currentSurahName, currentAyah }: ManuscriptViewerProps) {
  const [selectedManuscript, setSelectedManuscript] = useState<QuranManuscript>(EARLY_MANUSCRIPTS[0])
  const [zoomLevel, setZoomLevel] = useState<number>(1)

  if (!isOpen) return null

  function handleZoomIn() {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2.5))
  }

  function handleZoomOut() {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.75))
  }

  function handleResetZoom() {
    setZoomLevel(1)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6" dir="rtl">
      <div className="bg-[#031527] border border-cyan-700/60 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <header className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#041d36]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                متحف المخطوطات القرآنية المبكرة <em>(Corpus Coranicum)</em>
              </h2>
              <p className="text-xs text-slate-400">
                فحص الرقائق والوثائق الأركيولوجية من القرن الأول الهجري (القرن 7 الميلادي)
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

        {/* Manuscript Selector Tabs */}
        <div className="flex gap-2 p-2 bg-[#020e1d] border-b border-slate-800 overflow-x-auto text-xs">
          {EARLY_MANUSCRIPTS.map((ms) => (
            <button
              key={ms.id}
              onClick={() => {
                setSelectedManuscript(ms)
                setZoomLevel(1)
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedManuscript.id === ms.id
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              {ms.arabicTitle}
            </button>
          ))}
        </div>

        {/* Main Content Split */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
          {/* Left/Center Viewport: Zoomable Manuscript Image */}
          <div className="lg:col-span-2 relative bg-[#020b18] overflow-hidden flex items-center justify-center p-4">
            {/* Zoom Controls Overlay */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-[#03172b]/90 border border-slate-700 rounded-lg p-1.5 shadow-lg backdrop-blur-sm">
              <button
                onClick={handleZoomIn}
                className="p-1.5 hover:bg-slate-700 text-slate-200 rounded"
                title="تكبير"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-1.5 hover:bg-slate-700 text-slate-200 rounded"
                title="تصغير"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono"
                title="إعادة تعيين"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
            </div>

            {/* Manuscript Folio Image */}
            <div
              className="transition-transform duration-200 ease-out cursor-grab active:cursor-grabbing max-h-full max-w-full flex items-center justify-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={selectedManuscript.imageUrl}
                alt={selectedManuscript.arabicTitle}
                className="rounded-lg shadow-2xl border border-amber-900/40 object-contain max-h-[65vh]"
              />
            </div>

            <div className="absolute bottom-3 right-4 text-[11px] text-slate-400 bg-black/60 px-3 py-1 rounded backdrop-blur-sm">
              رق أصلي عالي الدقة · تصوير طيفي رقمي
            </div>
          </div>

          {/* Right Column: Metadata & Paleographical Analysis */}
          <div className="p-4 bg-[#03172b] border-t lg:border-t-0 lg:border-r border-slate-800 space-y-4 overflow-y-auto text-xs">
            <div>
              <span className="text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40 font-mono">
                {selectedManuscript.id}
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                {selectedManuscript.arabicTitle}
              </h3>
              <p className="text-[11px] text-slate-400 italic" dir="ltr">
                {selectedManuscript.title}
              </p>
            </div>

            <div className="space-y-2 p-3 bg-[#020e1d] rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span><strong>الموقع الحالي:</strong> {selectedManuscript.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>التأريخ الكربوني (C-14):</strong> {selectedManuscript.carbonDating}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>نوع الخط:</strong> {selectedManuscript.scriptType}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                <span><strong>السور والآيات المتضمنة:</strong> {selectedManuscript.surahsCovered}</span>
              </div>
            </div>

            <div>
              <strong className="text-slate-200 block mb-1">الوصف الأركيولوجي:</strong>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {selectedManuscript.description}
              </p>
            </div>

            <div className="p-3 bg-emerald-950/30 border border-emerald-600/40 rounded-xl space-y-1 text-emerald-300">
              <strong className="block text-xs font-bold text-emerald-200">
                الأهمية العلمية والتوثيقية:
              </strong>
              <p className="text-[11px] leading-relaxed">
                {selectedManuscript.scholarlySignificance}
              </p>
            </div>

            {currentSurahName && (
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-300">
                <strong>الموضع المعروض حالياً في المصحف:</strong>
                <div className="text-cyan-300 font-semibold mt-0.5">
                  سورة {currentSurahName} (الآية {currentAyah || 1})
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
