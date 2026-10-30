'use client'

import React from 'react'
import type { QuranVerse, SurahMeta } from '@/lib/quran/quran-data'
import { ChatMessage, DashboardAgentSession } from '../../hooks/use-agent-chat'
import { QuranPaneHeader } from './quran-pane/quran-pane-header'
import { QuranPaneVerseList } from './quran-pane/quran-pane-verse-list'
import { QuranPanePagination } from './quran-pane/quran-pane-pagination'
import { QuranPaneNumericAnalysis } from './quran-pane/quran-pane-numeric-analysis'
import { AgentPaneHeader } from './agent-pane/agent-pane-header'
import { AgentPaneSessionsDrawer } from './agent-pane/agent-pane-sessions-drawer'
import { AgentPaneMessageList } from './agent-pane/agent-pane-message-list'
import { AgentPaneSuggestions } from './agent-pane/agent-pane-suggestions'
import { AgentPaneInput } from './agent-pane/agent-pane-input'
import { EvidencePaneHeader } from './evidence-pane/evidence-pane-header'
import { EvidenceList } from './evidence-pane/evidence-list'

interface ThreePaneWorkspaceProps {
  mushafSurah: number
  currentSurahMeta: SurahMeta
  displayedVerses: QuranVerse[]
  selectedVerse: QuranVerse | null
  playingAyahKey: string | null
  currentAyahIndex: number
  mushafPageSize: number
  totalVerses: number
  chatHistory: ChatMessage[]
  agentMessage: string
  attachedVerse: QuranVerse | null
  isAgentTyping: boolean
  sessions?: DashboardAgentSession[]
  activeSessionId?: string
  showSessionsDrawer?: boolean
  activeModel?: string
  onToggleSessions?: () => void
  onSelectSession?: (id: string) => void
  onNewSession?: () => void
  onDeleteSession?: (id: string) => void
  onSurahChange: (surah: number) => void
  onSelectVerse: (verse: QuranVerse | null) => void
  onPlayVerse: (verse: QuranVerse) => void
  onAttachAgent: (verse: QuranVerse) => void
  onPrevPage: () => void
  onNextPage: () => void
  onAgentMessageChange: (val: string) => void
  onClearAttachedVerse: () => void
  onSendAgentMessage: () => void
  onStopAgentMessage?: () => void
  onSelectSuggestion: (text: string) => void
}

export function ThreePaneWorkspace(props: ThreePaneWorkspaceProps) {
  const pageInfo = `${props.currentAyahIndex + 1} إلى ${Math.min(
    props.currentAyahIndex + props.mushafPageSize,
    props.totalVerses
  )} من ${props.totalVerses}`

  return (
    <main className="exact-main">
      {/* 1. AI Research Agent Pane (Right Side in RTL) */}
      <section className="exact-agent relative">
        <AgentPaneHeader
          onToggleSessions={props.onToggleSessions}
          onNewSession={props.onNewSession}
          activeModel={props.activeModel}
          sessionsCount={props.sessions?.length}
        />

        {/* Sessions Drawer (Toggled by Three Dashes Button) */}
        <AgentPaneSessionsDrawer
          isOpen={Boolean(props.showSessionsDrawer)}
          onClose={props.onToggleSessions || (() => {})}
          sessions={props.sessions || []}
          activeSessionId={props.activeSessionId || ''}
          onSelectSession={props.onSelectSession || (() => {})}
          onNewSession={props.onNewSession || (() => {})}
          onDeleteSession={props.onDeleteSession || (() => {})}
        />

        <AgentPaneMessageList
          chatHistory={props.chatHistory}
          isAgentTyping={props.isAgentTyping}
        />
        <AgentPaneSuggestions onSelect={props.onSelectSuggestion} />
        <AgentPaneInput
          message={props.agentMessage}
          attachedVerse={props.attachedVerse}
          isTyping={props.isAgentTyping}
          onChange={props.onAgentMessageChange}
          onClearVerse={props.onClearAttachedVerse}
          onSend={props.onSendAgentMessage}
          onStop={props.onStopAgentMessage}
        />
      </section>

      {/* 2. Authentic Flowing Mushaf & Analysis Pane (Center) */}
      <section className="exact-quran">
        <QuranPaneHeader
          currentSurah={props.mushafSurah}
          mushafPageSize={props.mushafPageSize}
          playingAyahKey={props.playingAyahKey}
          selectedVerse={props.selectedVerse}
          displayedVerses={props.displayedVerses}
          onSurahChange={props.onSurahChange}
          onPageSizeChange={(sz) => {}}
          onTogglePlayAudio={() => {
            const first = props.displayedVerses[0]
            if (first) props.onPlayVerse(props.selectedVerse || first)
          }}
          onOpenFullView={() => {
            window.location.href = '/dashboard/quran'
          }}
        />
        <QuranPaneVerseList
          mushafSurah={props.mushafSurah}
          currentSurahMeta={props.currentSurahMeta}
          displayedVerses={props.displayedVerses}
          selectedVerse={props.selectedVerse}
          attachedVerse={props.attachedVerse}
          playingAyahKey={props.playingAyahKey}
          onSelectVerse={props.onSelectVerse}
          onPlayVerse={props.onPlayVerse}
          onAttachAgent={props.onAttachAgent}
        />
        <QuranPanePagination
          currentSurahName={props.currentSurahMeta.name}
          pageInfo={pageInfo}
          canPrev={props.currentAyahIndex > 0 || props.mushafSurah > 1}
          canNext={props.currentAyahIndex + props.mushafPageSize < props.totalVerses || props.mushafSurah < 114}
          onPrev={props.onPrevPage}
          onNext={props.onNextPage}
        />
      </section>

      {/* 3. Mathematical Symmetry & Scientific Evidence Pane (Left Side) */}
      <section className="exact-evidence">
        <EvidencePaneHeader />
        <EvidenceList />
      </section>
    </main>
  )
}
