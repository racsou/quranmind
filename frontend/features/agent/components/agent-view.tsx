'use client'

import React from 'react'
import { Sparkles } from 'lucide-react'
import { useAgentSession } from '../hooks/use-agent-session'
import { DEFAULT_PROMPTS } from '../config/default-prompts'
import { AgentHeaderBar } from './agent-header-bar'
import { AgentConfigDrawer } from './agent-config-drawer'
import { AgentSessionsDrawer } from './agent-sessions-drawer'
import { AgentMessageItem } from './agent-message-item'
import { AgentPaywallBanner } from './agent-paywall-banner'
import { AgentChatInputBar } from './agent-chat-input-bar'

export function AgentView() {
  const session = useAgentSession()

  return (
    <div className="relative flex flex-col h-[calc(100vh-140px)] min-h-[640px] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm" dir="rtl">
      <AgentHeaderBar
        selectedModel={session.selectedModel}
        showConfig={session.showConfig}
        showSessions={session.showSessionsDrawer}
        localOnline={session.localOnline}
        localModels={session.localModels}
        onToggleConfig={() => session.setShowConfig(!session.showConfig)}
        onToggleSessions={() => session.setShowSessionsDrawer(!session.showSessionsDrawer)}
        onModelChange={session.handleModelChange}
        onExportChat={session.handleExportChat}
        onResetChat={session.handleResetChat}
        onResetAllDefaults={session.handleResetAllDefaults}
        onRefreshModels={() => session.fetchLocalModels()}
      />

      {/* Collapsible Sessions Drawer (Toggled by Three Dashes Menu) */}
      <AgentSessionsDrawer
        isOpen={session.showSessionsDrawer}
        onClose={() => session.setShowSessionsDrawer(false)}
        sessions={session.sessions}
        activeSessionId={session.activeSessionId}
        onSelectSession={session.handleSelectSession}
        onNewSession={session.handleCreateNewSession}
        onDeleteSession={session.handleDeleteSession}
      />

      {session.showConfig && (
        <AgentConfigDrawer
          apiKey={session.apiKey}
          setApiKey={session.setApiKey}
          temperature={session.temperature}
          setTemperature={session.setTemperature}
          selectedModel={session.selectedModel}
          provider={session.provider}
          setProvider={session.setProvider}
          endpoint={session.endpoint}
          setEndpoint={session.setEndpoint}
          localOnline={session.localOnline}
          onClose={() => session.setShowConfig(false)}
          onTestConnection={() => session.fetchLocalModels(session.endpoint)}
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

        {session.isLoading && (!session.messages.length || !session.messages[session.messages.length - 1].isStreaming) && (
          <div className="flex gap-2 max-w-xs ml-auto items-center p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse delay-100" />
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse delay-200" />
          </div>
        )}

        <div ref={session.messagesEndRef} />
      </div>

      {session.messages.length <= 1 && (
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
        onStop={session.handleStopGeneration}
      />
    </div>
  )
}
