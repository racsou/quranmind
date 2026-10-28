'use client'

import React from 'react'
import { ChatMessage } from '../../../hooks/use-agent-chat'

interface AgentPaneMessageListProps {
  chatHistory: ChatMessage[]
  isAgentTyping: boolean
}

export function AgentPaneMessageList({
  chatHistory,
  isAgentTyping,
}: AgentPaneMessageListProps) {
  return (
    <div className="agent-chat-view">
      {chatHistory.map((msg, idx) => (
        <div
          key={idx}
          className={msg.sender === 'user' ? 'agent-msg-user' : 'agent-msg-agent'}
        >
          {msg.verseContext && (
            <div className="mb-2 p-1.5 rounded bg-sky-50 text-[11px] text-sky-900 border border-sky-200 font-serif">
              {msg.verseContext}
            </div>
          )}
          <div className="whitespace-pre-line">{msg.text}</div>
        </div>
      ))}

      {isAgentTyping && (
        <div className="agent-msg-agent opacity-75 animate-pulse text-[11px]">
          جاري المعالجة والاستقراء الرياضي...
        </div>
      )}
    </div>
  )
}
