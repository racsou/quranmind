'use client'

import React from 'react'
import { Plus, MessageSquare, Trash2, X, Clock, Check } from 'lucide-react'
import { DashboardAgentSession } from '../../../hooks/use-agent-chat'

interface AgentPaneSessionsDrawerProps {
  isOpen: boolean
  onClose: () => void
  sessions: DashboardAgentSession[]
  activeSessionId: string
  onSelectSession: (id: string) => void
  onNewSession: () => void
  onDeleteSession: (id: string) => void
}

export function AgentPaneSessionsDrawer({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
}: AgentPaneSessionsDrawerProps) {
  if (!isOpen) return null

  return (
    <div className="absolute inset-0 z-20 bg-white flex flex-col shadow-lg animate-in fade-in duration-150" dir="rtl">
      {/* Header */}
      <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-teal-700" />
          <span className="font-bold text-slate-800 text-xs">سجل الجلسات والمحادثات</span>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full font-mono">
            {sessions.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          title="إغلاق القائمة"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* New Session Button */}
      <div className="p-2.5 border-b border-slate-100">
        <button
          onClick={() => {
            onNewSession()
            onClose()
          }}
          className="w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>محادثة بحثية جديدة</span>
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sessions.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            لا توجد جلسات سابقة. ابدأ جلسة جديدة الآن.
          </div>
        ) : (
          sessions.map((sess) => {
            const isActive = sess.id === activeSessionId
            return (
              <div
                key={sess.id}
                onClick={() => {
                  onSelectSession(sess.id)
                  onClose()
                }}
                className={`group relative flex items-start justify-between p-2 rounded-lg border text-right cursor-pointer transition-all ${
                  isActive
                    ? 'bg-teal-50 border-teal-300 text-teal-900 shadow-2xs'
                    : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    {isActive ? (
                      <Check className="w-3 h-3 text-teal-700 shrink-0" />
                    ) : (
                      <MessageSquare className="w-3 h-3 text-slate-400 shrink-0" />
                    )}
                    <span className="font-semibold text-xs truncate block" title={sess.title}>
                      {sess.title || 'محادثة بلا عنوان'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {sess.createdAt}
                    </span>
                    <span>•</span>
                    <span>{sess.messages.length} رسائل</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (window.confirm('هل تريد حذف هذه الجلسة نهائياً؟')) {
                      onDeleteSession(sess.id)
                    }
                  }}
                  title="حذف الجلسة"
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-opacity rounded cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
