'use client'

import { useState, useEffect, useRef } from 'react'
import type { QuranVerse } from '@/lib/quran/quran-data'

export interface ChatMessage {
  id?: string
  sender: 'user' | 'agent'
  text: string
  verseContext?: string
  isStreaming?: boolean
}

export interface DashboardAgentSession {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: ChatMessage[]
}

const DEFAULT_WELCOME_MSG: ChatMessage = {
  id: 'init-msg',
  sender: 'agent',
  text: 'أنا الوكيل البحثي القرآني والحديثي الذكي المطور (Real AI Agent). متصل بالنماذج المحلية (Ollama) والنماذج السحابية لفحص نصوص المصحف، المتشابهات، التناظر، ومصطلح الحديث بدقة.\n\nيمكنك توجيه أي سؤال، أو إرفاق أي آية من لوح المصحف لتحليلها فوراً.',
}

function createDashboardSession(): DashboardAgentSession {
  const id = `session-${Date.now()}`
  return {
    id,
    title: 'محادثة بحثية جديدة',
    createdAt: new Date().toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    updatedAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    messages: [{ ...DEFAULT_WELCOME_MSG, id: `msg-${id}` }],
  }
}

export function useAgentChat() {
  const [sessions, setSessions] = useState<DashboardAgentSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string>('')
  const [showSessionsDrawer, setShowSessionsDrawer] = useState<boolean>(false)

  const [agentMessage, setAgentMessage] = useState('')
  const [attachedVerse, setAttachedVerse] = useState<QuranVerse | null>(null)
  const [isAgentTyping, setIsAgentTyping] = useState(false)
  const [activeModel, setActiveModel] = useState('Qwen3-Hermes:latest')
  const abortControllerRef = useRef<AbortController | null>(null)

  // Load persisted sessions and active model
  useEffect(() => {
    try {
      const savedModel = localStorage.getItem('qm_preferred_model') || 'Qwen3-Hermes:latest'
      setActiveModel(savedModel)

      const raw = localStorage.getItem('qm_dashboard_agent_sessions')
      if (raw) {
        const parsed: DashboardAgentSession[] = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed)
          const savedActive = localStorage.getItem('qm_dashboard_active_session_id')
          const found = parsed.find((s) => s.id === savedActive)
          setActiveSessionId(found ? found.id : parsed[0].id)
          return
        }
      }

      const initial = createDashboardSession()
      setSessions([initial])
      setActiveSessionId(initial.id)
      localStorage.setItem('qm_dashboard_agent_sessions', JSON.stringify([initial]))
      localStorage.setItem('qm_dashboard_active_session_id', initial.id)
    } catch {
      const fallback = createDashboardSession()
      setSessions([fallback])
      setActiveSessionId(fallback.id)
    }
  }, [])

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0]
  const chatHistory = activeSession ? activeSession.messages : []

  const saveSessions = (updated: DashboardAgentSession[]) => {
    setSessions(updated)
    try {
      localStorage.setItem('qm_dashboard_agent_sessions', JSON.stringify(updated))
    } catch {}
  }

  const handleCreateNewSession = () => {
    const newSession = createDashboardSession()
    const updated = [newSession, ...sessions]
    saveSessions(updated)
    setActiveSessionId(newSession.id)
    try {
      localStorage.setItem('qm_dashboard_active_session_id', newSession.id)
    } catch {}
  }

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id)
    try {
      localStorage.setItem('qm_dashboard_active_session_id', id)
    } catch {}
  }

  const handleDeleteSession = (id: string) => {
    const remaining = sessions.filter((s) => s.id !== id)
    if (remaining.length === 0) {
      const fresh = createDashboardSession()
      saveSessions([fresh])
      setActiveSessionId(fresh.id)
      try {
        localStorage.setItem('qm_dashboard_active_session_id', fresh.id)
      } catch {}
    } else {
      saveSessions(remaining)
      if (activeSessionId === id) {
        setActiveSessionId(remaining[0].id)
        try {
          localStorage.setItem('qm_dashboard_active_session_id', remaining[0].id)
        } catch {}
      }
    }
  }

  const handleAddVerseToAgentContext = (verse: QuranVerse) => {
    setAttachedVerse(verse)
    setAgentMessage(
      `حلل الآية الكريمة [سورة ${verse.surahName}: ${verse.ayah}]: «${verse.text}» من حيث الدلالة، التناظر، والروابط العلمية.`
    )
  }

  // Stop Generation Handler (Square Button)
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsAgentTyping(false)
    setSessions((prev) => {
      const updated = prev.map((s) => {
        if (s.id !== activeSessionId) return s
        const msgs = s.messages.map((m) =>
          m.isStreaming ? { ...m, isStreaming: false } : m
        )
        return { ...s, messages: msgs }
      })
      saveSessions(updated)
      return updated
    })
  }

  // Real LLM Streaming with ZERO simulation
  const handleSendMessage = async () => {
    if ((!agentMessage.trim() && !attachedVerse) || isAgentTyping || !activeSession) return

    const userText = agentMessage.trim()
    const verseCtx = attachedVerse
      ? `[سورة ${attachedVerse.surahName}: ${attachedVerse.ayah}] «${attachedVerse.text}»`
      : undefined

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      verseContext: verseCtx,
    }

    const botMsgId = `agent-${Date.now()}`
    const botPlaceholder: ChatMessage = {
      id: botMsgId,
      sender: 'agent',
      text: '',
      isStreaming: true,
    }

    let newTitle = activeSession.title
    if (activeSession.title === 'محادثة بحثية جديدة' || activeSession.messages.length <= 1) {
      newTitle = userText.length > 36 ? `${userText.slice(0, 36)}...` : userText
    }

    const currentMsgs = activeSession.messages
    const updatedMessagesWithBot = [...currentMsgs, userMsg, botPlaceholder]

    const updatedSessionsWorking = sessions.map((s) =>
      s.id === activeSessionId
        ? {
            ...s,
            title: newTitle,
            updatedAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
            messages: updatedMessagesWithBot,
          }
        : s
    )

    setSessions(updatedSessionsWorking)
    setAgentMessage('')
    setAttachedVerse(null)
    setIsAgentTyping(true)

    const controller = new AbortController()
    abortControllerRef.current = controller

    // Full query combined with verse context
    const fullQuery = verseCtx ? `${userText}\n\nسياق الآية المرفقة:\n${verseCtx}` : userText

    try {
      const modelToUse = localStorage.getItem('qm_preferred_model') || activeModel || 'Qwen3-Hermes:latest'
      const provider = localStorage.getItem('qm_agent_provider') || 'auto'
      const endpoint = localStorage.getItem('qm_local_endpoint') || 'http://localhost:11434'
      const apiKey = localStorage.getItem('qm_gemini_api_key') || undefined

      const res = await fetch('/api/agent/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: fullQuery,
          history: currentMsgs.slice(-4).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
          model: modelToUse,
          provider,
          endpoint,
          apiKey,
        }),
        signal: controller.signal,
      })

      if (!res.ok || !res.body) {
        throw new Error(`خطأ في استجابة الخادم: ${res.statusText}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        if (controller.signal.aborted) {
          try { reader.cancel() } catch {}
          break
        }
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const events = chunk.split('\n\n').filter((e) => e.startsWith('data: '))

        for (const ev of events) {
          const jsonStr = ev.replace('data: ', '').trim()
          if (!jsonStr) continue

          try {
            const data = JSON.parse(jsonStr)

            if (data.type === 'token') {
              accumulated += data.token
              setSessions((prev) =>
                prev.map((s) =>
                  s.id === activeSessionId
                    ? {
                        ...s,
                        messages: s.messages.map((m) =>
                          m.id === botMsgId ? { ...m, text: accumulated } : m
                        ),
                      }
                    : s
                )
              )
            } else if (data.type === 'done') {
              accumulated = data.fullText || accumulated
              const finalBotMsg: ChatMessage = {
                id: botMsgId,
                sender: 'agent',
                text: accumulated,
                isStreaming: false,
              }
              const finalSessions = sessions.map((s) =>
                s.id === activeSessionId
                  ? {
                      ...s,
                      title: newTitle,
                      messages: [...currentMsgs, userMsg, finalBotMsg],
                    }
                  : s
              )
              saveSessions(finalSessions)
            } else if (data.type === 'error') {
              throw new Error(data.error)
            }
          } catch {}
        }
      }
    } catch (err: any) {
      if (err?.name === 'AbortError' || controller.signal.aborted) {
        // Stopped by user cleanly, finalize whatever partial content arrived
        setSessions((prev) => {
          const stoppedSessions = prev.map((s) => {
            if (s.id !== activeSessionId) return s
            const msgs = s.messages.map((m) =>
              m.id === botMsgId ? { ...m, isStreaming: false } : m
            )
            return { ...s, messages: msgs }
          })
          saveSessions(stoppedSessions)
          return stoppedSessions
        })
        return
      }

      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'agent',
        text: `⚠️ خطأ أثناء الاتصال بالنموذج:\n${err?.message || 'تعذر استدعاء النموذج الحقيقي.'}\n\nيرجى التأكد من تشغيل Ollama (\`ollama serve\`) أو مراجعة الإعدادات.`,
        isStreaming: false,
      }
      const errSessions = sessions.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              title: newTitle,
              messages: [...currentMsgs, userMsg, errorMsg],
            }
          : s
      )
      saveSessions(errSessions)
    } finally {
      abortControllerRef.current = null
      setIsAgentTyping(false)
    }
  }

  return {
    sessions,
    activeSessionId,
    activeSession,
    showSessionsDrawer,
    setShowSessionsDrawer,
    handleCreateNewSession,
    handleSelectSession,
    handleDeleteSession,
    chatHistory,
    agentMessage,
    setAgentMessage,
    attachedVerse,
    setAttachedVerse,
    isAgentTyping,
    activeModel,
    handleAddVerseToAgentContext,
    handleSendMessage,
    handleStopGeneration,
  }
}
