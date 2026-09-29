'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  BrainCircuit,
  Sparkles,
  Send,
  RotateCcw,
  Bot,
  User,
  ExternalLink,
  Copy,
  Check,
  BookOpen,
  Layers,
  ChevronDown,
  Info,
  Cpu,
  Key,
  Sliders,
  CheckCircle2,
  Trash2,
  Download,
  AlertCircle,
  HelpCircle,
  Volume2,
  Lock,
  ArrowLeft,
} from 'lucide-react'
import { lookupVerse, type QuranVerse } from '@/lib/quran/quran-data'

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

const DEFAULT_PROMPTS = [
  {
    title: 'التناظر الحرفي التام (Palindromes)',
    query: 'ما هو التناظر الحرفي الدائري في آيتي «كل في فلك» و«ربك فكبر»؟ وما قيمته الرياضية؟',
  },
  {
    title: 'الروابط الكونية والحركة الفلكية',
    query: 'استخرج الآيات المتعلقة بحركة الأجرام والسماء في القرآن مع بيان الدلالة النصية.',
  },
  {
    title: 'حساب الجُمّل والأوزان العددية',
    query: 'احسب القيمة العددية بالحروف المجردة لآية الكرسي واشرح قواعد التطبيع المعتمدة.',
  },
  {
    title: 'المنهجية والتمييز الإبستيمي',
    query: 'كيف تميز منصة QuranMind بين النص القرآني الصريح وبين التأويل العلمي المتغير؟',
  },
]

export function AgentChatView() {
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash')
  const [apiKey, setApiKey] = useState<string>('')
  const [temperature, setTemperature] = useState<number>(0.3)
  const [showConfig, setShowConfig] = useState<boolean>(false)
  const [inputQuery, setInputQuery] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedVerseText, setCopiedVerseText] = useState<string | null>(null)
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

  const [userProfile, setUserProfile] = useState<{ plan: string; role: string; name: string } | null>(null)
  const [isPaywalled, setIsPaywalled] = useState<boolean>(false)

  // Fetch real user profile from Supabase on mount
  useEffect(() => {
    fetch('/api/user/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUserProfile(data.user)
          // If the user's plan is free or role is student without paid subscription, enforce paywall for Agent
          if (data.user.plan === 'free') {
            setIsPaywalled(true)
          } else {
            setIsPaywalled(false)
          }
        }
      })
      .catch(() => {})
  }, [])

  // Load user settings on mount
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
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Save history on changes
  const saveChatHistory = (newMessages: AgentChatMessage[]) => {
    setMessages(newMessages)
    try {
      localStorage.setItem('qm_agent_chat_history', JSON.stringify(newMessages))
    } catch {
      // ignore
    }
  }

  // Handle Model Change
  const handleModelChange = (newModel: string) => {
    setSelectedModel(newModel)
    try {
      localStorage.setItem('qm_preferred_model', newModel)
    } catch {
      // ignore
    }
  }

  // Reset chat to default
  const handleResetChat = () => {
    if (window.confirm('هل تريد إعادة تعيين المحادثة ومسح السجل الحالي؟')) {
      const initial: AgentChatMessage[] = [
        {
          id: 'welcome-reset',
          role: 'assistant',
          content:
            'تمت إعادة تعيين جلسة الوكيل البحثي. أنا جاهز للبدء في استفسار جديد مدعوماً بنموذج ' +
            (selectedModel.includes('pro') ? 'Google Gemini 2.5 Pro' : 'Google Gemini 2.5 Flash') +
            '.',
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          modelUsed: selectedModel,
          provider: selectedModel.startsWith('gemini') ? 'Google Gemini' : 'AI Engine',
        },
      ]
      saveChatHistory(initial)
    }
  }

  // Reset all defaults (Model + Key + Temp + Chat)
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
      } catch {
        // ignore
      }
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

  // Send message
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
        body: JSON.stringify({
          query: q,
          model: selectedModel,
          apiKey: apiKey.trim() || undefined,
          temperature: temperature,
        }),
      })

      const json = await res.json()

      if (json.success && json.data) {
        const d = json.data
        let botContent = ''

        if (d.aiGeneratedExplanation) {
          botContent = d.aiGeneratedExplanation
        } else {
          botContent = `**نتائج الفحص والتحليل الأكاديمي لطلب البحث:** "${d.query}"\n\n`
          if (d.symmetryInsight) {
            botContent += `🔍 **تحليل التناظر الحرفي (Palindrome):**\n${d.symmetryInsight}\n\n`
          }
          if (d.summaryPoints && d.summaryPoints.length > 0) {
            botContent += `📌 **الخلاصة الإحصائية والمنهجية:**\n` + d.summaryPoints.map((p: string) => `- ${p}`).join('\n')
          }
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
        const errorMsg: AgentChatMessage = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `تعذر إكمال المعالجة: ${json.error || 'حدث خطأ غير متوقع أثناء استدعاء المحرك.'}`,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          modelUsed: selectedModel,
        }
        saveChatHistory([...updated, errorMsg])
      }
    } catch (err: any) {
      const errorMsg: AgentChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `خطأ في الاتصال بالخادم: ${err?.message || 'يرجى التحقق من الشبكة وإعادة المحاولة.'}`,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      }
      saveChatHistory([...updated, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  // Copy text helper
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Export chat transcript
  const handleExportChat = () => {
    const transcript = messages
      .map(
        (m) =>
          `### [${m.timestamp}] ${m.role === 'user' ? 'الباحث' : `QuranMind Agent (${m.modelUsed || selectedModel})`}\n\n${m.content}\n`
      )
      .join('\n---\n\n')

    const blob = new Blob([transcript], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quranmind-agent-session-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[640px] bg-[#020b14] border border-cyan-950/60 rounded-2xl overflow-hidden shadow-2xl" dir="rtl">
      {/* Top Bar: Model Selector, Status & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-[#031527] border-b border-cyan-900/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">الوكيل البحثي الذكي (QuranMind Agent Studio)</h2>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                متصل وجاهز
              </span>
            </div>
            <p className="text-xs text-slate-400">استدلال متقدم على نصوص القرآن الكريم ومحرك التحليل القطعي</p>
          </div>
        </div>

        {/* Model Chooser & Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Active Model Picker */}
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => handleModelChange(e.target.value)}
              className="bg-[#020e1d] border border-cyan-800/60 text-cyan-200 text-xs font-medium rounded-lg px-3 py-1.5 pr-2 pl-7 outline-none hover:border-cyan-500 transition-colors cursor-pointer"
            >
              <optgroup label="Google Gemini (الموصى به)">
                <option value="gemini-2.5-flash">⚡ Google Gemini 2.5 Flash (فائق السرعة)</option>
                <option value="gemini-2.5-pro">🧠 Google Gemini 2.5 Pro (استدلال وبحث معمق)</option>
              </optgroup>
              <optgroup label="نماذج ذكاء اصطناعي إضافية">
                <option value="gpt-4o">OpenAI GPT-4o</option>
                <option value="claude-3-5">Anthropic Claude 3.5 Sonnet</option>
                <option value="deepseek-r1">DeepSeek R1 (تفكير رياضي)</option>
              </optgroup>
            </select>
          </div>

          {/* Settings Drawer Toggle */}
          <button
            onClick={() => setShowConfig(!showConfig)}
            title="إعدادات المفاتيح ودرجة الحرارة"
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              showConfig
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                : 'bg-[#020e1d] border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden sm:inline">الإعدادات</span>
          </button>

          {/* Export Chat */}
          <button
            onClick={handleExportChat}
            title="تصدير الجلسة كملف Markdown"
            className="p-1.5 rounded-lg bg-[#020e1d] border border-slate-700 hover:border-cyan-800 text-slate-300 hover:text-cyan-400 text-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">تصدير</span>
          </button>

          {/* Reset Chat */}
          <button
            onClick={handleResetChat}
            title="مسح المحادثة والبدء من جديد"
            className="p-1.5 rounded-lg bg-[#020e1d] border border-slate-700 hover:border-amber-600/70 text-slate-300 hover:text-amber-400 text-xs flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">مسح</span>
          </button>

          {/* Reset All Defaults */}
          <button
            onClick={handleResetAllDefaults}
            title="استعادة كافة الإعدادات والافتراضيات"
            className="px-2.5 py-1.5 rounded-lg bg-red-950/30 border border-red-900/40 text-red-300 hover:bg-red-900/40 text-xs flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden md:inline">استعادة الافتراضيات</span>
          </button>
        </div>
      </div>

      {/* Config Drawer (Expandable) */}
      {showConfig && (
        <div className="bg-[#031b32] border-b border-cyan-900/60 p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs animate-in fade-in duration-200">
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              مفتاح Google Gemini API المخصص (اختياري):
            </label>
            <input
              type="password"
              placeholder="AIzaSy... (اتركه فارغاً للاعتماد على المفتاح العام)"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value)
                try {
                  localStorage.setItem('qm_gemini_api_key', e.target.value)
                } catch {}
              }}
              className="w-full bg-[#020e1d] border border-cyan-900/80 rounded-lg px-3 py-1.5 text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-400 font-mono text-xs"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              إذا لم تضف مفتاحاً خاصاً، ستعمل التحليلات عبر المفتاح الداخلي والمحرك الحسابي.
            </p>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5 flex items-center justify-between">
              <span>درجة الدقة والحرارة (Temperature):</span>
              <span className="text-cyan-400 font-mono">{temperature}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={temperature}
              onChange={(e) => {
                const val = parseFloat(e.target.value)
                setTemperature(val)
                try {
                  localStorage.setItem('qm_temperature', val.toString())
                } catch {}
              }}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0.0 (دقة رياضية حازمة)</span>
              <span>0.3 (موصى به للقرآن)</span>
              <span>1.0 (إبداعي)</span>
            </div>
          </div>

          <div className="bg-[#020e1d] p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-cyan-300 font-bold block mb-1">المحرك المعتمد:</span>
              <p className="text-slate-300 text-[11px]">
                {selectedModel.startsWith('gemini')
                  ? '⚡ Google Gemini + المحرك القطعي (Deterministic Normalized Engine)'
                  : 'ذكاء اصطناعي عام + قاعدة بيانات المصحف الشريف'}
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowConfig(false)}
                className="px-3 py-1 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-[11px] font-semibold"
              >
                إغلاق الإعدادات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-4xl ${
              msg.role === 'user' ? 'mr-auto flex-row-reverse' : 'ml-auto flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center shadow-md ${
                msg.role === 'user'
                  ? 'bg-slate-800 border border-slate-700 text-slate-200'
                  : 'bg-gradient-to-tr from-cyan-600 to-blue-700 text-white shadow-cyan-900/30'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble Content */}
            <div className="flex-1 space-y-2 max-w-2xl">
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border transition-all ${
                  msg.role === 'user'
                    ? 'bg-slate-800/90 border-slate-700/80 text-white rounded-tr-none'
                    : 'bg-[#03182e] border-cyan-900/50 text-slate-200 rounded-tl-none shadow-lg'
                }`}
              >
                {/* Header for assistant message */}
                {msg.role === 'assistant' && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-900/30 text-xs">
                    <span className="font-semibold text-cyan-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                      {msg.provider || 'QuranMind Intelligence'}{' '}
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                        {msg.modelUsed || selectedModel}
                      </span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                  </div>
                )}

                {/* Main Text Content */}
                <div className="whitespace-pre-wrap font-sans text-slate-100">
                  {msg.content}
                </div>

                {/* Rich Data Cards (Matched Verses, Symmetry, Disclaimer) */}
                {msg.data && (
                  <div className="mt-4 pt-3 border-t border-cyan-900/40 space-y-3">
                    {/* Symmetry Box if available */}
                    {msg.data.symmetryInsight && (
                      <div className="p-3 bg-gradient-to-r from-emerald-950/40 via-[#021f2d] to-cyan-950/40 border border-emerald-500/30 rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" /> تناظر حرفي تام (100% Palindrome)
                          </span>
                          <span className="text-[10px] bg-emerald-900/50 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/50">
                            ملاحظة قطعية
                          </span>
                        </div>
                        <p className="text-xs text-emerald-100 leading-relaxed font-serif">
                          {msg.data.symmetryInsight}
                        </p>
                      </div>
                    )}

                    {/* Matched Verses Cards */}
                    {msg.data.matchedVerses && msg.data.matchedVerses.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" /> الآيات القرآنية ذات الصلة الموثقة:
                        </span>
                        <div className="grid grid-cols-1 gap-2">
                          {msg.data.matchedVerses.map((v) => (
                            <div
                              key={v.id}
                              className="p-3 bg-[#020f1f] border border-cyan-900/40 rounded-xl space-y-1.5 hover:border-cyan-700/60 transition-colors"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-cyan-400 font-bold">
                                  سورة {v.surahName} - الآية [{v.ayah}]
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleCopy(v.id, v.text)}
                                    title="نسخ الآية"
                                    className="p-1 text-slate-400 hover:text-white transition-colors"
                                  >
                                    {copiedId === v.id ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              </div>
                              <p className="text-base text-white font-serif leading-loose" dir="rtl">
                                «{v.text}»
                              </p>
                              {v.translation && (
                                <p className="text-[11px] text-slate-400 italic" dir="ltr">
                                  "{v.translation}"
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Summary Points */}
                    {msg.data.summaryPoints && msg.data.summaryPoints.length > 0 && (
                      <div className="p-3 bg-[#020e1d] border border-slate-800 rounded-xl space-y-1">
                        <span className="text-xs font-semibold text-slate-300 block mb-1">
                          النتائج المستخلصة:
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                          {msg.data.summaryPoints.map((pt, idx) => (
                            <li key={idx}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Scholarly Disclaimer */}
                    {msg.data.disclaimer && (
                      <div className="p-2.5 bg-amber-950/20 border border-amber-800/30 rounded-lg flex items-start gap-2 text-[11px] text-amber-300/90 leading-relaxed">
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{msg.data.disclaimer}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions below bubble */}
              <div className="flex items-center gap-2 px-1 text-[11px] text-slate-500">
                <button
                  onClick={() => handleCopy(msg.id, msg.content)}
                  className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
                >
                  {copiedId === msg.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" /> تم النسخ
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> نسخ الإجابة
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Loading / Thinking Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-2xl ml-auto">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center shadow-md animate-pulse">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="p-4 rounded-2xl bg-[#03182e] border border-cyan-800/60 text-slate-200 rounded-tl-none shadow-lg space-y-2">
              <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>
                  جارٍ التفكير والتحليل عبر {selectedModel.includes('pro') ? 'Google Gemini 2.5 Pro' : 'Google Gemini 2.5 Flash'}...
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                فحص معجم المصحف، تدقيق التناظر الحرفي، وتطبيق أوزان التطبيع البنيوي...
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Carousel / Pills */}
      {messages.length <= 2 && (
        <div className="px-5 py-2.5 bg-[#020e1d]/80 border-t border-cyan-950/80">
          <div className="text-[11px] text-slate-400 mb-2 flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3 h-3 text-cyan-400" /> أسئلة بحثية مقترحة للبدء السريع:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {DEFAULT_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                className="text-right p-2.5 bg-[#031527] hover:bg-[#062444] border border-cyan-900/40 hover:border-cyan-500/60 rounded-xl transition-all group"
              >
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 block mb-0.5">
                  {p.title}
                </span>
                <span className="text-[11px] text-slate-400 line-clamp-1 group-hover:text-slate-200">
                  {p.query}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Paywall Banner for Free/Student Users */}
      {isPaywalled && (
        <div className="mx-4 mb-2 p-3.5 bg-gradient-to-r from-amber-950/80 via-[#1b1202] to-[#041a2e] border border-amber-600/60 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-900/60 border border-amber-500/50 flex items-center justify-center text-amber-300 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <span>الوكيل البحثي القرآني يتطلب الترقية إلى باقة المحقق الأكاديمي (Pro)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-900/80 text-amber-300 font-semibold">
                  ميزة احترافية
                </span>
              </h4>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                تصفح المصحف الشريف والاستماع إلى تلاوات كبار القراء متاح مجاناً. للوصول إلى الوكيل الذكي (Google Gemini)، يرجى تفعيل اشتراكك.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/settings?subtab=billing"
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>اختيار الخطة والترقية الآن</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Bottom Input Area */}
      <div className="p-4 bg-[#031527] border-t border-cyan-900/50">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onClick={() => {
                if (isPaywalled) window.location.href = '/dashboard/settings?subtab=billing'
              }}
              placeholder={
                isPaywalled
                  ? '🔒 الوكيل مقفل لحسابك المجاني. اضغط هنا للانتقال لصفحة الفواتير واختيار باقة المحقق...'
                  : 'اكتب استفسارك القرآني أو العلمي هنا... (مثال: ما هو التناظر في «كل في فلك»؟)'
              }
              disabled={isLoading}
              className={`w-full border rounded-xl px-4 py-3 text-sm placeholder-slate-500 outline-none transition-all font-sans ${
                isPaywalled
                  ? 'bg-amber-950/20 border-amber-700/50 text-amber-200 cursor-pointer'
                  : 'bg-[#020e1d] border-cyan-900/80 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={(!inputQuery.trim() && !isPaywalled) || isLoading}
            className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all shrink-0 ${
              isPaywalled
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-cyan-600/20'
            }`}
          >
            {isPaywalled ? (
              <>
                <span>ترقية الحساب</span>
                <Lock className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>إرسال</span>
                <Send className="w-4 h-4 rotate-180" />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
          <div className="flex items-center gap-2">
            <span>النموذج النشط:</span>
            <strong className="text-cyan-300">
              {selectedModel === 'gemini-2.5-flash'
                ? 'Google Gemini 2.5 Flash'
                : selectedModel === 'gemini-2.5-pro'
                ? 'Google Gemini 2.5 Pro'
                : selectedModel}
            </strong>
          </div>
          <span>منهجية قطعية: التمييز الصارم بين النص القرآني والتأويلات البشرية</span>
        </div>
      </div>
    </div>
  )
}
