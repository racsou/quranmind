'use client'

import React from 'react'
import { Sparkles } from 'lucide-react'
import { useAgentSession } from '../hooks/use-agent-session'
import { DEFAULT_PROMPTS } from '../config/default-prompts'
import { AgentHeaderBar } from './agent-header-bar'
import { AgentConfigDrawer } from './agent-config-drawer'
import { AgentMessageItem } from './agent-message-item'
import { AgentPaywallBanner } from './agent-paywall-banner'
import { AgentChatInputBar } from './agent-chat-input-bar'

export function AgentView() {
  const session = useAgentSession()

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[640px] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm" dir="rtl">
      <AgentHeaderBar
        selectedModel={session.selectedModel}
        showConfig={session.showConfig}
        onToggleConfig={() => session.setShowConfig(!session.showConfig)}
        onModelChange={session.handleModelChange}
        onExportChat={session.handleExportChat}
        onResetChat={session.handleResetChat}
        onResetAllDefaults={session.handleResetAllDefaults}
      />

      {session.showConfig && (
        <AgentConfigDrawer
          apiKey={session.apiKey}
          setApiKey={session.setApiKey}
          temperature={session.temperature}
          setTemperature={session.setTemperature}
          selectedModel={session.selectedModel}
          onClose={() => session.setShowConfig(false)}
        />
      )}

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/50">
        {session.messages.map((msg) => (
          <AgentMessageItem
            key={msg.id}
            message={msg}
            selectedModel={session.selectedModel}
            copiedId={session.copiedId}
            onCopy={session.handleCopy}
          />
        ))}

        {session.isLoading && (
          <div className="flex gap-3 max-w-2xl ml-auto">
            <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center shadow-sm animate-pulse text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs text-teal-700 font-semibold">
                <div className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
                <span>
                  جارٍ التفكير والتحليل عبر {session.selectedModel.includes('pro') ? 'Google Gemini 2.5 Pro' : 'Google Gemini 2.5 Flash'}...
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                فحص معجم المصحف، تدقيق التناظر الحرفي، وتطبيق أوزان التطبيع البنيوي...
              </p>
            </div>
          </div>
        )}

        <div ref={session.messagesEndRef} />
      </div>

      {session.messages.length <= 2 && (
        <div className="px-5 py-2.5 bg-slate-100/70 border-t border-slate-200">
          <div className="text-[11px] text-slate-500 mb-2 flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3 h-3 text-teal-600" /> أسئلة بحثية مقترحة للبدء السريع:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {DEFAULT_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => session.handleSendMessage(p.query)}
                className="text-right p-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-teal-500/60 rounded-xl transition-all group cursor-pointer shadow-xs"
              >
                <span className="text-xs font-bold text-slate-900 group-hover:text-teal-800 block mb-0.5">
                  {p.title}
                </span>
                <span className="text-[11px] text-slate-500 line-clamp-1 group-hover:text-slate-700">
                  {p.query}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {session.isPaywalled && <AgentPaywallBanner />}

      <AgentChatInputBar
        inputQuery={session.inputQuery}
        setInputQuery={session.setInputQuery}
        isLoading={session.isLoading}
        isPaywalled={session.isPaywalled}
        selectedModel={session.selectedModel}
        onSubmit={session.handleSendMessage}
      />
    </div>
  )
}
