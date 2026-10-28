import { type QuranVerse } from '@/lib/quran/quran-data'

export interface AgentChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  modelUsed?: string
  provider?: string
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
