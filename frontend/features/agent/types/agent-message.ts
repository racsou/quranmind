import { type QuranVerse } from '@/lib/quran/quran-data'

export interface ToolStep {
  id: string
  name: string
  args: Record<string, any>
  summary?: string
  data?: any
  status: 'calling' | 'done' | 'error'
}

export interface AgentChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  modelUsed?: string
  provider?: string
  toolSteps?: ToolStep[]
  isStreaming?: boolean
  data?: {
    summaryPoints?: string[]
    symmetryInsight?: string | null
    aiGeneratedExplanation?: string | null
    matchedVerses?: QuranVerse[]
    analyses?: Array<{
      verse: QuranVerse
      analysis: any
    }>
    disclaimer?: string
  }
}
