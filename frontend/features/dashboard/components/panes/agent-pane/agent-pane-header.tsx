'use client'

import React from 'react'
import { BrainCircuit, Sparkles } from 'lucide-react'

export function AgentPaneHeader() {
  return (
    <header className="flex items-center justify-between">
      <div className="agent-heading">
        <div className="agent-icon">
          <BrainCircuit />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span>الوكيل البحثي الذكي</span>
            <Sparkles className="w-3 h-3 text-cyan-600" />
          </div>
          <div className="text-[10px] text-slate-500">تحليل قطعي وتدقيق إبستيمي</div>
        </div>
      </div>

      <span className="agent-status-badge">نشط ومستعد</span>
    </header>
  )
}
