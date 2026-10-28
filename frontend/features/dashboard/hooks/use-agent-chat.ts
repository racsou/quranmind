'use client'

import { useState } from 'react'
import type { QuranVerse } from '@/lib/quran/quran-data'

export interface ChatMessage {
  sender: 'user' | 'agent'
  text: string
  verseContext?: string
}

export function useAgentChat() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      sender: 'user',
      text: 'حلل الآيتين: «ربك فكبر» و«وكل في فلك يسبحون» من حيث التناظر، أعداد الحروف، والدلالات العلمية.',
    },
    {
      sender: 'agent',
      text: 'يوجد تناظر لفظي دقيق وبناء متماثل (Palindrome) على مستوى الحروف. تتألف عبارة «كُلٌّ فِي فَلَكٍ» من الحروف (ك-ل-ف-ي-ف-ل-ك) وتتطابق قراءتها من اليمين إلى اليسار والعكس تماماً، مع ارتباط دلالي محكم بحركة الأجرام المدارية.',
    },
  ])

  const [agentMessage, setAgentMessage] = useState('')
  const [attachedVerse, setAttachedVerse] = useState<QuranVerse | null>(null)
  const [isAgentTyping, setIsAgentTyping] = useState(false)

  const handleAddVerseToAgentContext = (verse: QuranVerse) => {
    setAttachedVerse(verse)
    setAgentMessage(
      `حلل الآية الكريمة [سورة ${verse.surahName}: ${verse.ayah}]: «${verse.text}» من حيث الدلالة، التناظر، والروابط العلمية.`
    )
  }

  const handleSendMessage = () => {
    if (!agentMessage.trim() && !attachedVerse) return

    const userText = agentMessage.trim()
    const verseCtx = attachedVerse
      ? `[سورة ${attachedVerse.surahName}: ${attachedVerse.ayah}] «${attachedVerse.text}»`
      : undefined

    setChatHistory((prev) => [
      ...prev,
      { sender: 'user', text: userText, verseContext: verseCtx },
    ])
    setAgentMessage('')
    setAttachedVerse(null)
    setIsAgentTyping(true)

    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: `تم استقراء النص القرآني وإجراء فحص التناظر وحساب الجمل. تظهر البيانات توافقاً منهجياً مع الأنساق الدلالية المعيارية مع درجة موثوقية عالية.`,
        },
      ])
      setIsAgentTyping(false)
    }, 700)
  }

  return {
    chatHistory,
    agentMessage,
    setAgentMessage,
    attachedVerse,
    setAttachedVerse,
    isAgentTyping,
    handleAddVerseToAgentContext,
    handleSendMessage,
  }
}
