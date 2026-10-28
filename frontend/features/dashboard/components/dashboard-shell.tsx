'use client'

import React, { useState } from 'react'
import { Menu } from 'lucide-react'
import { DashboardTabView } from '@/components/dashboard-tab-view'
import { useDashboardTabs } from '../hooks/use-dashboard-tabs'
import { useSurahLoader } from '../hooks/use-surah-loader'
import { useAudioReciter } from '../hooks/use-audio-reciter'
import { useAgentChat } from '../hooks/use-agent-chat'
import { DashboardSidebar } from './sidebar/dashboard-sidebar'
import { DashboardTopbar } from './topbar/dashboard-topbar'
import { DashboardTabStrip } from './tabs/dashboard-tab-strip'
import { ThreePaneWorkspace } from './panes/three-pane-workspace'
import '../styles/dashboard.css'

interface DashboardShellProps {
  initialTab?: string
  children?: React.ReactNode
}

export function DashboardShell({ initialTab }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = useDashboardTabs(initialTab)
  const surahLoader = useSurahLoader()
  const agentChat = useAgentChat()

  const audio = useAudioReciter(
    surahLoader.currentAyahIndex,
    surahLoader.mushafPageSize,
    surahLoader.setCurrentAyahIndex,
    surahLoader.currentSurahVerses,
    surahLoader.loadSurah
  )

  const totalVerses =
    surahLoader.currentSurahVerses.length ||
    surahLoader.currentSurahMeta.numberOfAyahs

  return (
    <div className="exact-dashboard" dir="rtl">
      <DashboardSidebar
        activeTabId={tabs.activeTabId}
        sidebarOpen={sidebarOpen}
        onSelectTab={(item) => {
          tabs.handleSelectTab(item)
          setSidebarOpen(false)
        }}
      />

      <div className="exact-right-pane">
        <DashboardTopbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectTab={tabs.handleSelectTab}
        />

        <DashboardTabStrip
          openTabs={tabs.openTabs}
          activeTabId={tabs.activeTabId}
          addMenuOpen={tabs.addMenuOpen}
          unopenedItems={tabs.unopenedItems}
          onSelectTab={(tabId, href) => {
            tabs.setActiveTabId(tabId)
            window.history.pushState(null, '', href)
          }}
          onCloseTab={tabs.handleCloseTab}
          onToggleAddMenu={() => tabs.setAddMenuOpen((prev) => !prev)}
          onOpenNewTab={tabs.handleOpenNewTab}
        />

        <div className="exact-content-viewport">
          {tabs.activeTabId === 'overview' ? (
            <ThreePaneWorkspace
              mushafSurah={surahLoader.mushafSurah}
              currentSurahMeta={surahLoader.currentSurahMeta}
              displayedVerses={surahLoader.displayedVerses}
              selectedVerse={surahLoader.selectedVerse}
              playingAyahKey={audio.playingAyahKey}
              currentAyahIndex={surahLoader.currentAyahIndex}
              mushafPageSize={surahLoader.mushafPageSize}
              totalVerses={totalVerses}
              chatHistory={agentChat.chatHistory}
              agentMessage={agentChat.agentMessage}
              attachedVerse={agentChat.attachedVerse}
              isAgentTyping={agentChat.isAgentTyping}
              onSurahChange={(s) => surahLoader.loadSurah(s, 0)}
              onSelectVerse={(v) => surahLoader.setSelectedVerse(v)}
              onPlayVerse={(v) => audio.handleTogglePlayAudio(v)}
              onAttachAgent={agentChat.handleAddVerseToAgentContext}
              onPrevPage={surahLoader.handlePrevAyahOrPage}
              onNextPage={surahLoader.handleNextAyahOrPage}
              onAgentMessageChange={agentChat.setAgentMessage}
              onClearAttachedVerse={() => agentChat.setAttachedVerse(null)}
              onSendAgentMessage={agentChat.handleSendMessage}
              onSelectSuggestion={(s) => agentChat.setAgentMessage(s)}
            />
          ) : (
            <div className="exact-tab-view-wrapper">
              <DashboardTabView tab={tabs.activeTabId} />
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setSidebarOpen((prev) => !prev)}
        className="exact-mobile-toggle"
        title="القائمة"
      >
        <Menu className="w-5 h-5" />
      </button>
    </div>
  )
}
