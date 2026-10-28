'use client'

import { useState, useEffect, useRef } from 'react'
import { AgentChatMessage } from '../types/agent-message'

export function useAgentSession() {
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash')
  const [apiKey, setApiKey] = useState<string>('')
  const [temperature, setTemperature] = useState<number>(0.3)
  const [showConfig, setShowConfig] = useState<boolean>(false)
  const [inputQuery, setInputQuery] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isPaywalled, setIsPaywalled] = useState<boolean>(false)
  const [messages, setMessages] = useState<AgentChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        'مرحباً بك في الوكيل البحثي القرآني الذكي مدعوماً بنموذج **Google Gemini 2.5 Flash** والمحرك الحسابي القطعي لـ QuranMind.\n\nيمكنك توجيه أي سؤال بحثي حول آيات القرآن الكريم، التناظر الحرفي المعكوس، حساب الجُمّل، أو تحليل المصطلحات بدقة رياضية منهجية.',
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-2.5-flash',
      provider: 'Google Gemini',
      data: {
        summaryPoints: [
          'استخدام نماذج Google Gemini 2.5 Flash و Pro الرائدة في الاستدلال اللغوي المتقدم.',
          'تكامل مباشر مع محرك التحليل البنيوي والتناظري للقرآن الكريم (Deterministic Engine).',
          'التزام صارم بقواعد التدقيق الأكاديمي والتمييز بين النص الصريح والاجتهاد البشري.',
        ],
        disclaimer:
          'QuranMind منصة بحثية أكاديمية؛ المحرك يفحص البنية اللفظية والإحصائية للنص القرآني، ولا يحل محل التفسير المعتمد لأهل العلم.',
      },
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/user/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setIsPaywalled(data.user.plan === 'free')
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    try {
      const savedModel = localStorage.getItem('qm_preferred_model')
      if (savedModel) setSelectedModel(savedModel)
      const savedKey = localStorage.getItem('qm_gemini_api_key') || localStorage.getItem('qm_custom_api_key')
      if (savedKey) setApiKey(savedKey)
      const savedTemp = localStorage.getItem('qm_temperature')
      if (savedTemp) setTemperature(parseFloat(savedTemp))
      const savedHistory = localStorage.getItem('qm_agent_chat_history')
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory)
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed)
      }
    } catch {}
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const saveChatHistory = (newMessages: AgentChatMessage[]) => {
    setMessages(newMessages)
    try {
      localStorage.setItem('qm_agent_chat_history', JSON.stringify(newMessages))
    } catch {}
  }

  const handleModelChange = (newModel: string) => {
    setSelectedModel(newModel)
    try {
      localStorage.setItem('qm_preferred_model', newModel)
    } catch {}
  }

  const handleResetChat = () => {
    if (window.confirm('هل تريد إعادة تعيين المحادثة ومسح السجل الحالي؟')) {
      const initial: AgentChatMessage[] = [
        {
          id: 'welcome-reset',
          role: 'assistant',
          content: `تمت إعادة تعيين جلسة الوكيل البحثي. أنا جاهز للبدء في استفسار جديد مدعوماً بنموذج ${
            selectedModel.includes('pro') ? 'Google Gemini 2.5 Pro' : 'Google Gemini 2.5 Flash'
          }.`,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          modelUsed: selectedModel,
          provider: selectedModel.startsWith('gemini') ? 'Google Gemini' : 'AI Engine',
        },
      ]
      saveChatHistory(initial)
    }
  }

  const handleResetAllDefaults = () => {
    if (window.confirm('هل أنت متأكد من استعادة كافة الإعدادات الافتراضية للوكيل الذكي والنموذج؟')) {
      setSelectedModel('gemini-2.5-flash')
      setApiKey('')
      setTemperature(0.3)
      try {
        localStorage.removeItem('qm_preferred_model')
        localStorage.removeItem('qm_gemini_api_key')
        localStorage.removeItem('qm_custom_api_key')
        localStorage.removeItem('qm_temperature')
        localStorage.removeItem('qm_agent_chat_history')
      } catch {}
      const initial: AgentChatMessage[] = [
        {
          id: 'welcome-defaults',
          role: 'assistant',
          content: 'تمت استعادة كافة الإعدادات والافتراضيات بنجاح. النموذج النشط الآن هو **Google Gemini 2.5 Flash**.',
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          modelUsed: 'gemini-2.5-flash',
          provider: 'Google Gemini',
        },
      ]
      setMessages(initial)
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
    a.download = `quranmind-agent-session-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSendMessage = async (textToSend?: string) => {
    if (isPaywalled) {
      window.location.href = '/dashboard/settings?subtab=billing'
      return
    }
    const q = (textToSend || inputQuery).trim()
    if (!q || isLoading) return

    const userMessage: AgentChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    }
    const updated = [...messages, userMessage]
    saveChatHistory(updated)
    setInputQuery('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, model: selectedModel, apiKey: apiKey.trim() || undefined, temperature }),
      })
      const json = await res.json()
      if (json.success && json.data) {
        const d = json.data
        let botContent = d.aiGeneratedExplanation || `**نتائج الفحص والتحليل الأكاديمي لطلب البحث:** "${d.query}"\n\n`
        if (!d.aiGeneratedExplanation) {
          if (d.symmetryInsight) botContent += `🔍 **تحليل التناظر الحرفي (Palindrome):**\n${d.symmetryInsight}\n\n`
          if (d.summaryPoints?.length) botContent += `📌 **الخلاصة الإحصائية والمنهجية:**\n` + d.summaryPoints.map((p: string) => `- ${p}`).join('\n')
        }
        const botMessage: AgentChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: botContent,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          modelUsed: d.modelUsed || selectedModel,
          provider: d.provider || (selectedModel.startsWith('gemini') ? 'Google Gemini' : 'QuranMind AI'),
          data: d,
        }
        saveChatHistory([...updated, botMessage])
      } else {
        saveChatHistory([...updated, {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `تعذر إكمال المعالجة: ${json.error || 'حدث خطأ غير متوقع أثناء استدعاء المحرك.'}`,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          modelUsed: selectedModel,
        }])
      }
    } catch (err: any) {
      saveChatHistory([...updated, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `خطأ في الاتصال بالخادم: ${err?.message || 'يرجى التحقق من الشبكة وإعادة المحاولة.'}`,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      }])
    } finally {
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
    inputQuery,
    setInputQuery,
    isLoading,
    copiedId,
    isPaywalled,
    messages,
    messagesEndRef,
    handleModelChange,
    handleResetChat,
    handleResetAllDefaults,
    handleCopy,
    handleExportChat,
    handleSendMessage,
  }
}
