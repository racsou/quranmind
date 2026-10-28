'use client'

import React from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'

interface QuranPanePaginationProps {
  currentSurahName: string
  pageInfo: string
  canPrev: boolean
  canNext: boolean
  onPrev: () => void
  onNext: () => void
}

export function QuranPanePagination({
  currentSurahName,
  pageInfo,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: QuranPanePaginationProps) {
  return (
    <footer className="h-10 border-t border-slate-100 px-3 flex items-center justify-between text-xs text-slate-500 bg-slate-50">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className="flex items-center gap-1 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
      >
        <ChevronRight className="w-3.5 h-3.5" />
        <span>السابق</span>
      </button>

      <span className="font-mono text-[11px] text-slate-600">
        سورة {currentSurahName} · {pageInfo}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="flex items-center gap-1 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
      >
        <span>التالي</span>
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
    </footer>
  )
}
