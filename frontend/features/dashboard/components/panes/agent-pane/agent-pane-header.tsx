'use client'

import React from 'react'
import { BrainCircuit, Sparkles, Menu, Plus } from 'lucide-react'

interface AgentPaneHeaderProps {
  onToggleSessions?: () => void
  onNewSession?: () => void
  activeModel?: string
  sessionsCount?: number
}

export function AgentPaneHeader({
  onToggleSessions,
  onNewSession,
  activeModel = 'Qwen3-Hermes',
  sessionsCount = 1,
}: AgentPaneHeaderProps) {
  return (
    <header className="flex items-center justify-between p-2.5 bg-slate-50 border-b border-slate-200">
      <div className="flex items-center gap-2">
        {/* Three Dashes Button to toggle sessions drawer */}
        {onToggleSessions && (
          <button
            type="button"
            onClick={onToggleSessions}
            className="p-1.5 rounded-lg border border-slate-300 hover:border-teal-600 bg-white text-slate-700 hover:text-teal-800 transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
            title="سجل الجلسات والمحادثات (ثلاث شرطات)"
          >
            <Menu className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold hidden sm:inline">الجلسات</span>
          </button>
        )}

        <div className="agent-heading">
          <div className="w-7 h-7 rounded-lg bg-teal-700 flex items-center justify-center text-white shrink-0 shadow-xs">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>الوكيل البحثي الذكي</span>
              <Sparkles className="w-3 h-3 text-teal-600" />
            </div>
            <div className="text-[10px] text-slate-500 font-mono truncate max-w-[120px]" title={activeModel}>
              {activeModel}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {onNewSession && (
          <button
            type="button"
            onClick={onNewSession}
            className="p-1 rounded-lg border border-slate-200 hover:border-teal-600 bg-white text-slate-600 hover:text-teal-800 text-[10px] flex items-center gap-1 cursor-pointer transition shadow-2xs"
            title="محادثة جديدة"
          >
            <Plus className="w-3 h-3" />
            <span className="hidden sm:inline">جديدة</span>
          </button>
        )}

        <span className="agent-status-badge text-[10px] font-semibold">استدلال حقيقي</span>
      </div>
    </header>
  )
}
