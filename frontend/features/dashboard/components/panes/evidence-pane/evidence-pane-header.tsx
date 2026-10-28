'use client'

import React from 'react'
import { FlaskConical } from 'lucide-react'

export function EvidencePaneHeader() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <FlaskConical className="w-4 h-4 text-cyan-600" />
        <span className="font-bold text-xs text-slate-800">الأدلة والتحليل الرياضي</span>
      </div>
      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
        4 أنماط تطبيع
      </span>
    </header>
  )
}
