'use client'

import React, { useEffect, useRef } from 'react'
import { ChatMessage } from '../../../hooks/use-agent-chat'

interface AgentPaneMessageListProps {
  chatHistory: ChatMessage[]
  isAgentTyping: boolean
}

export function AgentPaneMessageList({
  chatHistory,
  isAgentTyping,
}: AgentPaneMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory, isAgentTyping])

  return (
    <div className="agent-chat-view">
      {chatHistory.map((msg, idx) => (
        <div
          key={msg.id || idx}
          className={msg.sender === 'user' ? 'agent-msg-user' : 'agent-msg-agent'}
        >
          {msg.verseContext && (
            <div className="mb-2 p-1.5 rounded-lg bg-sky-50 text-[11px] text-sky-900 border border-sky-200 font-serif leading-relaxed">
              {msg.verseContext}
            </div>
          )}
          <div className="whitespace-pre-line leading-relaxed text-xs">
            {msg.text}
            {msg.isStreaming && (
              <span className="inline-block w-1.5 h-3.5 bg-teal-600 mr-1 animate-pulse align-middle" />
            )}
          </div>
        </div>
      ))}

      {isAgentTyping && (!chatHistory.length || !chatHistory[chatHistory.length - 1].isStreaming) && (
        <div className="agent-msg-agent opacity-80 text-[11px] flex items-center gap-1.5 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-ping" />
          <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse delay-100" />
          <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse delay-200" />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
