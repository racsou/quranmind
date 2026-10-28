'use client'

import React from 'react'
import { CheckCircle2 } from 'lucide-react'

export interface EvidenceCardProps {
  title: string
  tag: string
  classification: 'verified' | 'hypothesis'
  explanation: string
  letterCount?: number
  wordCount?: number
  letters?: string[]
}

export function EvidenceCard({
  title,
  tag,
  classification,
  explanation,
  letterCount = 7,
  wordCount = 3,
  letters = ['ك', 'ل', 'ف', 'ي', 'س', 'ب', 'ح', 'و', 'ن'],
}: EvidenceCardProps) {
  return (
    <article className="evidence-card">
      <span className={`evidence-tag ${classification}`}>{tag}</span>
      <strong>{title}</strong>

      <div className="evidence-method space-y-1.5">
        <div className="flex items-center gap-1.5 text-slate-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{explanation}</span>
        </div>

        <div className="flex gap-4 pt-1 font-mono text-[11px] text-slate-600">
          <span>الحروف: <b className="text-cyan-700 font-bold">{letterCount}</b></span>
          <span>الكلمات: <b className="text-cyan-700 font-bold">{wordCount}</b></span>
        </div>
      </div>

      <div className="flex justify-center gap-1 pt-2 direction-rtl">
        {letters.map((x, i) => (
          <span
            key={i}
            className="w-5 h-5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[10px] grid place-items-center font-bold"
          >
            {x}
          </span>
        ))}
      </div>
    </article>
  )
}
