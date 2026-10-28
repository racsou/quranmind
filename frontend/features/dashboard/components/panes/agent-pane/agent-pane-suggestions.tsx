'use client'

import React from 'react'

const SUGGESTIONS = [
  'فحص التناظر في «ربك فكبر»',
  'العلاقة بين الآفاق والأنفس في فصلت',
  'تكرار مشتقات الفلك وحساب الجمل',
]

export function AgentPaneSuggestions({ onSelect }: { onSelect: (text: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border-t border-slate-100">
      {SUGGESTIONS.map((suggestion, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(suggestion)}
          className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-cyan-700 hover:border-cyan-300 transition"
        >
          {suggestion}
        </button>
      ))}
    </div>
  )
}
