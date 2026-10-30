'use client'

import React from 'react'
import { Plus, MessageSquare, Trash2, X, Clock, Check } from 'lucide-react'
import { AgentSession } from '../types/agent-session'

interface AgentSessionsDrawerProps {
  isOpen: boolean
  onClose: () => void
  sessions: AgentSession[]
  activeSessionId: string
  onSelectSession: (id: string) => void
  onNewSession: () => void
  onDeleteSession: (id: string) => void
}

export function AgentSessionsDrawer({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
}: AgentSessionsDrawerProps) {
  if (!isOpen) return null

  return (
    <div className="absolute inset-y-0 right-0 w-72 sm:w-80 bg-white border-l border-slate-200 z-30 flex flex-col shadow-xl animate-in slide-in-from-right duration-200" dir="rtl">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-teal-700" />
          <span className="font-bold text-slate-800 text-xs">سجل المحادثات والجلسات</span>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-mono">
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
      <div className="p-3 border-b border-slate-100">
        <button
          onClick={() => {
            onNewSession()
            onClose()
          }}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
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
                className={`group relative flex items-start justify-between p-2.5 rounded-xl border text-right cursor-pointer transition-all ${
                  isActive
                    ? 'bg-teal-50/70 border-teal-300 text-teal-900 shadow-2xs'
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
