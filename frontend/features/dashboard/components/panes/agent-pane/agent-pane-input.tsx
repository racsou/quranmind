'use client'

import React from 'react'
import { Send, X } from 'lucide-react'
import type { QuranVerse } from '@/lib/quran/quran-data'

interface AgentPaneInputProps {
  message: string
  attachedVerse: QuranVerse | null
  onChange: (val: string) => void
  onClearVerse: () => void
  onSend: () => void
}

export function AgentPaneInput({
  message,
  attachedVerse,
  onChange,
  onClearVerse,
  onSend,
}: AgentPaneInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
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
          placeholder="اطرح استفسارك البحثي القرآني..."
          rows={1}
        />
        <button
          type="button"
          onClick={onSend}
          className="agent-send-btn"
          title="إرسال"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
