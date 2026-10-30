'use client'

import React from 'react'
import { Send, Square, X } from 'lucide-react'
import type { QuranVerse } from '@/lib/quran/quran-data'

interface AgentPaneInputProps {
  message: string
  attachedVerse: QuranVerse | null
  isTyping?: boolean
  onChange: (val: string) => void
  onClearVerse: () => void
  onSend: () => void
  onStop?: () => void
}

export function AgentPaneInput({
  message,
  attachedVerse,
  isTyping = false,
  onChange,
  onClearVerse,
  onSend,
  onStop,
}: AgentPaneInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (isTyping) {
        onStop?.()
      } else {
        onSend()
      }
    }
  }

  return (
    <div className="agent-input-container">
      {attachedVerse && (
        <div className="mb-2 p-1.5 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-between text-xs text-sky-900">
          <span className="truncate">
            مرتبط بـ: [سورة {attachedVerse.surahName}: {attachedVerse.ayah}]
          </span>
          <button
            type="button"
            onClick={onClearVerse}
            className="p-1 hover:text-rose-600 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="agent-input-box">
        <textarea
          value={message}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isTyping ? "جارٍ التوليد والاستدلال..." : "اطرح استفسارك البحثي القرآني..."}
          rows={1}
        />
        {isTyping ? (
          <button
            type="button"
            onClick={onStop}
            className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all cursor-pointer flex items-center justify-center"
            title="إيقاف التوليد (Stop)"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSend}
            disabled={!message.trim() && !attachedVerse}
            className="agent-send-btn disabled:opacity-40 disabled:cursor-not-allowed"
            title="إرسال"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
