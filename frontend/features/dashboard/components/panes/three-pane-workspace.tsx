'use client'

import React from 'react'
import type { QuranVerse, SurahMeta } from '@/lib/quran/quran-data'
import { ChatMessage } from '../../hooks/use-agent-chat'
import { QuranPaneHeader } from './quran-pane/quran-pane-header'
import { QuranPaneVerseList } from './quran-pane/quran-pane-verse-list'
import { QuranPanePagination } from './quran-pane/quran-pane-pagination'
import { AgentPaneHeader } from './agent-pane/agent-pane-header'
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
  onSurahChange: (surah: number) => void
  onSelectVerse: (verse: QuranVerse) => void
  onPlayVerse: (verse: QuranVerse) => void
  onAttachAgent: (verse: QuranVerse) => void
  onPrevPage: () => void
  onNextPage: () => void
  onAgentMessageChange: (val: string) => void
  onClearAttachedVerse: () => void
  onSendAgentMessage: () => void
  onSelectSuggestion: (text: string) => void
}

export function ThreePaneWorkspace(props: ThreePaneWorkspaceProps) {
  const pageInfo = `${props.currentAyahIndex + 1} إلى ${Math.min(
    props.currentAyahIndex + props.mushafPageSize,
    props.totalVerses
  )} من ${props.totalVerses}`

  return (
    <main className="exact-main">
      {/* 1. Quran Mushaf Viewer Pane */}
      <section className="exact-quran">
        <QuranPaneHeader
          currentSurah={props.mushafSurah}
          onSurahChange={props.onSurahChange}
        />
        <QuranPaneVerseList
          displayedVerses={props.displayedVerses}
          selectedVerse={props.selectedVerse}
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

      {/* 2. AI Research Agent Pane */}
      <section className="exact-agent">
        <AgentPaneHeader />
        <AgentPaneMessageList
          chatHistory={props.chatHistory}
          isAgentTyping={props.isAgentTyping}
        />
        <AgentPaneSuggestions onSelect={props.onSelectSuggestion} />
        <AgentPaneInput
          message={props.agentMessage}
          attachedVerse={props.attachedVerse}
          onChange={props.onAgentMessageChange}
          onClearVerse={props.onClearAttachedVerse}
          onSend={props.onSendAgentMessage}
        />
      </section>

      {/* 3. Mathematical & Epistemic Evidence Pane */}
      <section className="exact-evidence">
        <EvidencePaneHeader />
        <EvidenceList />
      </section>
    </main>
  )
}
