'use client'

import { useState, useEffect, useRef } from 'react'
import { AgentChatMessage, ToolStep } from '../types/agent-message'
import { AgentSession } from '../types/agent-session'

const DEFAULT_WELCOME_MESSAGE: AgentChatMessage = {
  id: 'welcome-init',
  role: 'assistant',
  content:
    'مرحباً بك في الوكيل البحثي القرآني والحديثي الذكي المطور (QuranMind Agent Studio).\n\nأنا متصل بالنماذج المحلية (Ollama) والنماذج السحابية، ومزود بأدوات قطعية لفحص 6,236 آية، المتشابهات، التناظر البنيوي، ومصطلح الحديث النبوي.\n\nكيف يمكنني مساعدتك في بحثك اليوم؟',
  timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
  modelUsed: 'Qwen3-Hermes:latest',
  provider: 'QuranMind Real Agent',
}

function createNewSessionObj(model: string): AgentSession {
  const id = `session-${Date.now()}`
  return {
    id,
    title: 'محادثة بحثية جديدة',
    createdAt: new Date().toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    updatedAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    modelUsed: model,
    messages: [{ ...DEFAULT_WELCOME_MESSAGE, id: `welcome-${id}` }],
  }
}

export function useAgentSession() {
  const [selectedModel, setSelectedModel] = useState<string>('Qwen3-Hermes:latest')
  const [apiKey, setApiKey] = useState<string>('')
  const [temperature, setTemperature] = useState<number>(0.2)
  const [showConfig, setShowConfig] = useState<boolean>(false)
  const [showSessionsDrawer, setShowSessionsDrawer] = useState<boolean>(false)
  const [inputQuery, setInputQuery] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isPaywalled, setIsPaywalled] = useState<boolean>(false)

  // Local engine state
  const [localOnline, setLocalOnline] = useState<boolean>(false)
  const [localModels, setLocalModels] = useState<string[]>([])
  const [provider, setProvider] = useState<'ollama' | 'openai-compatible' | 'gemini' | 'auto'>('auto')
  const [endpoint, setEndpoint] = useState<string>('http://localhost:11434')

  // Multi-session state
  const [sessions, setSessions] = useState<AgentSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string>('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // 1. Initial Load of sessions and preferences
  useEffect(() => {
    try {
      const savedModel = localStorage.getItem('qm_preferred_model')
      if (savedModel) setSelectedModel(savedModel)

      const savedKey = localStorage.getItem('qm_gemini_api_key') || localStorage.getItem('qm_custom_api_key')
      if (savedKey) setApiKey(savedKey)

      const savedTemp = localStorage.getItem('qm_temperature')
      if (savedTemp) setTemperature(parseFloat(savedTemp))

      const savedProv = localStorage.getItem('qm_agent_provider')
      if (savedProv) setProvider(savedProv as any)

      const savedEp = localStorage.getItem('qm_local_endpoint')
      if (savedEp) setEndpoint(savedEp)

      // Load sessions
      const rawSessions = localStorage.getItem('qm_agent_sessions_v2')
      if (rawSessions) {
        const parsed: AgentSession[] = JSON.parse(rawSessions)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed)
          const savedActiveId = localStorage.getItem('qm_active_session_id')
          const found = parsed.find((s) => s.id === savedActiveId)
          setActiveSessionId(found ? found.id : parsed[0].id)
          return
        }
      }

      // If no sessions exist, create initial session
      const initial = createNewSessionObj(savedModel || 'Qwen3-Hermes:latest')
      setSessions([initial])
      setActiveSessionId(initial.id)
      localStorage.setItem('qm_agent_sessions_v2', JSON.stringify([initial]))
      localStorage.setItem('qm_active_session_id', initial.id)
    } catch {
      const fallback = createNewSessionObj('Qwen3-Hermes:latest')
      setSessions([fallback])
      setActiveSessionId(fallback.id)
    }
  }, [])

  // Auto-discover local models
  const fetchLocalModels = async (epToTest?: string) => {
    const targetEndpoint = epToTest || endpoint
    try {
      const res = await fetch(`/api/agent/models?endpoint=${encodeURIComponent(targetEndpoint)}`)
      if (res.ok) {
        const data = await res.json()
        setLocalOnline(Boolean(data.online))
        if (Array.isArray(data.models) && data.models.length > 0) {
          setLocalModels(data.models)
          // If current model is not set or not in local models, adopt first real local model
          if (data.online && !localStorage.getItem('qm_preferred_model')) {
            setSelectedModel(data.models[0])
          }
        }
        return Boolean(data.online)
      }
    } catch {
      setLocalOnline(false)
    }
    return false
  }

  useEffect(() => {
    fetchLocalModels()
  }, [endpoint])

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0]
  const messages = activeSession ? activeSession.messages : []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Persist session changes
  const saveSessions = (updated: AgentSession[]) => {
    setSessions(updated)
    try {
      localStorage.setItem('qm_agent_sessions_v2', JSON.stringify(updated))
    } catch {}
  }

  const handleCreateNewSession = () => {
    const newSession = createNewSessionObj(selectedModel)
    const updated = [newSession, ...sessions]
    saveSessions(updated)
    setActiveSessionId(newSession.id)
    try {
      localStorage.setItem('qm_active_session_id', newSession.id)
    } catch {}
  }

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id)
    try {
      localStorage.setItem('qm_active_session_id', id)
    } catch {}
  }

  const handleDeleteSession = (id: string) => {
    const remaining = sessions.filter((s) => s.id !== id)
    if (remaining.length === 0) {
      const fresh = createNewSessionObj(selectedModel)
      saveSessions([fresh])
      setActiveSessionId(fresh.id)
      try {
        localStorage.setItem('qm_active_session_id', fresh.id)
      } catch {}
    } else {
      saveSessions(remaining)
      if (activeSessionId === id) {
        setActiveSessionId(remaining[0].id)
        try {
          localStorage.setItem('qm_active_session_id', remaining[0].id)
        } catch {}
      }
    }
  }

  const handleModelChange = (newModel: string) => {
    setSelectedModel(newModel)
    try {
      localStorage.setItem('qm_preferred_model', newModel)
    } catch {}
  }

  const handleResetChat = () => {
    if (window.confirm('هل تريد إعادة تعيين المحادثة الحالية؟')) {
      const freshMessage: AgentChatMessage = {
        id: `welcome-reset-${Date.now()}`,
        role: 'assistant',
        content: `تم مسح الرسائل في هذه الجلسة. أنا جاهز للبدء من جديد عبر نموذج ${selectedModel}.`,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
        provider: selectedModel.startsWith('gemini') ? 'Google Gemini' : 'Local AI Model',
      }
      const updated = sessions.map((s) =>
        s.id === activeSessionId ? { ...s, messages: [freshMessage], updatedAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) } : s
      )
      saveSessions(updated)
    }
  }

  const handleResetAllDefaults = () => {
    if (window.confirm('هل أنت متأكد من استعادة كافة الإعدادات الافتراضية للوكيل والنموذج؟')) {
      setSelectedModel('Qwen3-Hermes:latest')
      setApiKey('')
      setTemperature(0.2)
      setProvider('auto')
      setEndpoint('http://localhost:11434')
      try {
        localStorage.removeItem('qm_preferred_model')
        localStorage.removeItem('qm_gemini_api_key')
        localStorage.removeItem('qm_custom_api_key')
        localStorage.removeItem('qm_temperature')
        localStorage.removeItem('qm_agent_provider')
        localStorage.removeItem('qm_local_endpoint')
      } catch {}
    }
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleExportChat = () => {
    const transcript = messages
      .map((m) => `### [${m.timestamp}] ${m.role === 'user' ? 'الباحث' : `QuranMind Agent (${m.modelUsed || selectedModel})`}\n\n${m.content}\n`)
      .join('\n---\n\n')
    const blob = new Blob([transcript], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quranmind-session-${activeSession?.title || 'chat'}-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Stop Generation Handler (Square Button)
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsLoading(false)
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

  const handleSendMessage = async (textToSend?: string) => {
    const q = (textToSend || inputQuery).trim()
    if (!q || isLoading || !activeSession) return

    const userMessage: AgentChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    }

    const botMessageId = `bot-${Date.now()}`
    const botPlaceholder: AgentChatMessage = {
      id: botMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      modelUsed: selectedModel,
      provider: selectedModel.startsWith('gemini') ? 'Google Gemini' : 'Local AI Model',
      toolSteps: [],
      isStreaming: true,
    }

    // Auto-update session title if it's still default
    let newTitle = activeSession.title
    if (activeSession.title === 'محادثة بحثية جديدة' || activeSession.messages.length <= 1) {
      newTitle = q.length > 36 ? `${q.slice(0, 36)}...` : q
    }

    const currentMessages = activeSession.messages
    const updatedMessagesWithPlaceholder = [...currentMessages, userMessage, botPlaceholder]

    const updatedSessionsWorking = sessions.map((s) =>
      s.id === activeSessionId
        ? {
            ...s,
            title: newTitle,
            updatedAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
            messages: updatedMessagesWithPlaceholder,
          }
        : s
    )
    setSessions(updatedSessionsWorking)
    setInputQuery('')
    setIsLoading(true)

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const res = await fetch('/api/agent/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          history: currentMessages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
          model: selectedModel,
          provider,
          endpoint,
          apiKey: apiKey.trim() || undefined,
          temperature,
        }),
        signal: controller.signal,
      })

      if (!res.ok || !res.body) {
        throw new Error(`تعذر بدء الاتصال بالوكيل: ${res.statusText}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedText = ''
      let toolSteps: ToolStep[] = []

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

            if (data.type === 'tool_call') {
              const call = data.call
              const newStep: ToolStep = {
                id: call.id || `step-${Date.now()}`,
                name: call.name,
                args: call.args || {},
                status: 'calling',
              }
              toolSteps = [...toolSteps, newStep]
              setSessions((prev) =>
                prev.map((s) =>
                  s.id === activeSessionId
                    ? {
                        ...s,
                        messages: s.messages.map((m) =>
                          m.id === botMessageId ? { ...m, toolSteps } : m
                        ),
                      }
                    : s
                )
              )
            } else if (data.type === 'tool_result') {
              const r = data.result
              toolSteps = toolSteps.map((s) =>
                s.name === r.name || s.id === r.id
                  ? { ...s, summary: r.summary, data: r.data, status: 'done' }
                  : s
              )
              if (!toolSteps.some((s) => s.id === r.id)) {
                toolSteps.push({
                  id: r.id || `step-${Date.now()}`,
                  name: r.name,
                  args: {},
                  summary: r.summary,
                  data: r.data,
                  status: 'done',
                })
              }
              setSessions((prev) =>
                prev.map((s) =>
                  s.id === activeSessionId
                    ? {
                        ...s,
                        messages: s.messages.map((m) =>
                          m.id === botMessageId ? { ...m, toolSteps } : m
                        ),
                      }
                    : s
                )
              )
            } else if (data.type === 'token') {
              accumulatedText += data.token
              setSessions((prev) =>
                prev.map((s) =>
                  s.id === activeSessionId
                    ? {
                        ...s,
                        messages: s.messages.map((m) =>
                          m.id === botMessageId ? { ...m, content: accumulatedText } : m
                        ),
                      }
                    : s
                )
              )
            } else if (data.type === 'done') {
              accumulatedText = data.fullText || accumulatedText
              const finalMessage: AgentChatMessage = {
                id: botMessageId,
                role: 'assistant',
                content: accumulatedText,
                timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
                modelUsed: selectedModel,
                provider: selectedModel.startsWith('gemini') ? 'Google Gemini' : 'Local AI Model',
                toolSteps,
                isStreaming: false,
              }
              const finalSessions = sessions.map((s) =>
                s.id === activeSessionId
                  ? {
                      ...s,
                      title: newTitle,
                      messages: [...currentMessages, userMessage, finalMessage],
                    }
                  : s
              )
              saveSessions(finalSessions)
            } else if (data.type === 'error') {
              throw new Error(data.error)
            }
          } catch (jsonErr) {
            // chunk parse
          }
        }
      }
    } catch (err: any) {
      if (err?.name === 'AbortError' || controller.signal.aborted) {
        setSessions((prev) => {
          const stopped = prev.map((s) => {
            if (s.id !== activeSessionId) return s
            const msgs = s.messages.map((m) =>
              m.id === botMessageId ? { ...m, isStreaming: false } : m
            )
            return { ...s, messages: msgs }
          })
          saveSessions(stopped)
          return stopped
        })
        return
      }

      const errorMessage: AgentChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ خطأ في الاتصال بالنموذج:\n${err?.message || 'تعذر إكمال المعالجة.'}\n\nيرجى التحقق من تشغيل \`ollama serve\` أو اختيار نموذج متوفر.`,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
        isStreaming: false,
      }
      const finalErrSessions = sessions.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              title: newTitle,
              messages: [...currentMessages, userMessage, errorMessage],
            }
          : s
      )
      saveSessions(finalErrSessions)
    } finally {
      abortControllerRef.current = null
      setIsLoading(false)
    }
  }

  return {
    selectedModel,
    apiKey,
    setApiKey,
    temperature,
    setTemperature,
    showConfig,
    setShowConfig,
    showSessionsDrawer,
    setShowSessionsDrawer,
    inputQuery,
    setInputQuery,
    isLoading,
    copiedId,
    isPaywalled,
    sessions,
    activeSessionId,
    activeSession,
    messages,
    messagesEndRef,
    localOnline,
    localModels,
    provider,
    setProvider,
    endpoint,
    setEndpoint,
    fetchLocalModels,
    handleCreateNewSession,
    handleSelectSession,
    handleDeleteSession,
    handleModelChange,
    handleResetChat,
    handleResetAllDefaults,
    handleCopy,
    handleExportChat,
    handleSendMessage,
    handleStopGeneration,
  }
}
