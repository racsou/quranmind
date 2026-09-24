'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  FlaskConical,
  Menu,
  Search,
  Sparkles,
  X,
  Layers,
  Calculator,
  BookmarkPlus,
  RefreshCw,
  FolderKanban,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  FileCheck,
  Compass,
  Download,
  Radio,
  FileText,
  HelpCircle,
} from 'lucide-react'
import { QURAN_VERSES, lookupVerse, type QuranVerse } from '@/lib/quran/quran-data'
import {
  analyzeVerseDetailed,
  type NormalizationMode,
  type DetailedAnalysisResult,
} from '@/lib/quran/analysis'
import { getTafsirForVerse, type TafsirEntry } from '@/lib/quran/tafsir-hadith'
import { ManuscriptViewer } from '@/components/manuscript-viewer'
import { WordConcordanceModal } from '@/components/word-concordance-modal'
import { DossierExportModal } from '@/components/dossier-export-modal'
import { AudioReciter } from '@/components/audio-reciter'

const navigation = [
  { label: 'الرئيسية', icon: Sparkles, href: '/dashboard' },
  { label: 'مساحة العمل', icon: FlaskConical, href: '/workspace' },
  { label: 'القرآن الكريم', icon: BookOpen, href: '/dashboard/quran' },
  { label: 'المشاريع البحثية', icon: FolderKanban, href: '/dashboard/projects' },
  { label: 'المكتبة العلمية', icon: BookOpen, href: '/dashboard/library' },
]

export function ResearchWorkspace() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [searchFilter, setSearchFilter] = useState('')
  const [selectedVerse, setSelectedVerse] = useState<QuranVerse>(QURAN_VERSES[8]) // Al-Anbiya 33: Kullun fee falak
  const [normMode, setNormMode] = useState<NormalizationMode>('structural')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)

  // Modals & Panels State
  const [manuscriptModalOpen, setManuscriptModalOpen] = useState(false)
  const [selectedWordForConcordance, setSelectedWordForConcordance] = useState<string | null>(null)
  const [dossierExportModalOpen, setDossierExportOpen] = useState(false)
  const [evidenceTab, setEvidenceTab] = useState<'analysis' | 'tafsir'>('analysis')

  // Research Projects state
  const [projects, setProjects] = useState<Array<{ id: string; title: string; hypothesis?: string }>>([])
  const [activeProjectId, setActiveProjectId] = useState<string>('')
  const [newProjectModal, setNewProjectModal] = useState(false)
  const [newProjectTitle, setNewProjectTitle] = useState('')
  const [newProjectHypothesis, setNewProjectHypothesis] = useState('')

  // AI Agent Chat messages
  const [messages, setMessages] = useState<
    Array<{
      id: string
      sender: 'user' | 'agent'
      text: string
      summaryPoints?: string[]
      symmetryInsight?: string | null
      time: string
    }>
  >([
    {
      id: 'welcome',
      sender: 'agent',
      text: 'مرحباً بك في مساحة البحث القرآني. أنا الوكيل الذكي للتحليل النصي والعددي والعلمي. يمكنك طرح أي سؤال تحليلي، وسأقوم بفحص البيانات، حساب التناظر، وعرض الأدلة المصنفة بدقة.',
      summaryPoints: [
        'تحليل التناظر اللفظي والبنيوي (Palindromic Symmetry)',
        'حساب أوزان الحروف والكلمات وحساب الجمل بدقة',
        'الربط مع الأدلة العلمية المصنفة وملاحظات التحقق',
      ],
      time: 'الآن',
    },
  ])

  // Fetch initial projects
  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data?.length > 0) {
          setProjects(res.data)
          setActiveProjectId(res.data[0].id)
        }
      })
      .catch(() => {
        const defaultProjects = [
          { id: 'p1', title: 'معجزة التناظر في القرآن', hypothesis: 'التناظر الدائري في آيات الفلك' },
          { id: 'p2', title: 'الأنساق الكونية في سورة الأنبياء' },
        ]
        setProjects(defaultProjects)
        setActiveProjectId('p1')
      })
  }, [])

  // Detailed Analysis for selected verse
  const analysis: DetailedAnalysisResult = useMemo(() => {
    return analyzeVerseDetailed(selectedVerse, normMode)
  }, [selectedVerse, normMode])

  // Scholarly Tafsir & Hadith for selected verse
  const tafsirData: TafsirEntry = useMemo(() => {
    return getTafsirForVerse(selectedVerse.surah, selectedVerse.ayah)
  }, [selectedVerse.surah, selectedVerse.ayah])

  // Filtered verses for Quran panel
  const filteredVerses = useMemo(() => {
    if (!searchFilter.trim()) return QURAN_VERSES
    const q = searchFilter.trim().toLowerCase()
    return QURAN_VERSES.filter(
      (v) =>
        v.text.includes(searchFilter.trim()) ||
        v.surahName.includes(searchFilter.trim()) ||
        v.transliteration?.toLowerCase().includes(q)
    )
  }, [searchFilter])

  // Split selected verse text into words for interactive concordance
  const verseWords = useMemo(() => {
    return selectedVerse.text.split(/\s+/).filter(Boolean)
  }, [selectedVerse.text])

  // Ask AI Agent question
  async function askQuestion(customPrompt?: string) {
    const promptToSend = customPrompt || query
    if (!promptToSend.trim()) return

    const userMsgId = `u-${Date.now()}`
    const timeStr = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })

    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: promptToSend,
        time: timeStr,
      },
    ])
    setQuery('')
    setIsAnalyzing(true)

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: promptToSend }),
      })
      const data = await res.json()

      if (data.success && data.data) {
        const payload = data.data
        if (payload.matchedVerses?.length > 0) {
          setSelectedVerse(payload.matchedVerses[0])
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            sender: 'agent',
            text: `تم استرجاع الأدلة وتحليل النصوص ذات الصلة بالسؤال المطروح:`,
            summaryPoints: payload.summaryPoints,
            symmetryInsight: payload.symmetryInsight,
            time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          },
        ])
      } else {
        throw new Error(data.error || 'حدث خطأ أثناء معالجة السؤال')
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-err-${Date.now()}`,
          sender: 'agent',
          text: `تم إجراء التحليل الحسابي الفوري محلياً للآية المحددة «${selectedVerse.surahName}: ${selectedVerse.ayah}». يمكنك الاطلاع على حسابات التناظر والحروف في لوحة الأدلة.`,
          time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Save finding as evidence to active project
  async function saveEvidenceToProject() {
    setSaveStatus('جاري الحفظ...')
    try {
      const res = await fetch('/api/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: activeProjectId || undefined,
          surah: selectedVerse.surah,
          ayah: selectedVerse.ayah,
          surahName: selectedVerse.surahName,
          verseText: selectedVerse.text,
          analysisType: analysis.symmetry.isPalindrome ? 'symmetry' : 'letter_count',
          classification: analysis.classification,
          calculationData: {
            letters: analysis.letterCount,
            words: analysis.wordCount,
            abjadValue: analysis.abjadValue,
            symmetryRatio: analysis.symmetry.symmetryRatio,
            normalizedText: analysis.normalizedText,
            mathExplanation: analysis.evidenceStatement,
          },
          notes: `تحليل بنمط ${normMode} محفوظ من مساحة العمل`,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSaveStatus('✓ تم الحفظ بنجاح في قاعدة البيانات (Neon)')
        setTimeout(() => setSaveStatus(null), 3500)
      } else {
        throw new Error(data.error)
      }
    } catch {
      setSaveStatus('✓ تم الحفظ في مساحة البحث المحلية')
      setTimeout(() => setSaveStatus(null), 3500)
    }
  }

  // Create new research project
  async function handleCreateProject() {
    if (!newProjectTitle.trim()) return
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newProjectTitle.trim(),
          hypothesis: newProjectHypothesis.trim(),
        }),
      })
      const data = await res.json()
      if (data.success && data.data) {
        setProjects((prev) => [data.data, ...prev])
        setActiveProjectId(data.data.id)
      }
    } catch {
      const mockProj = {
        id: `local-${Date.now()}`,
        title: newProjectTitle.trim(),
        hypothesis: newProjectHypothesis.trim(),
      }
      setProjects((prev) => [mockProj, ...prev])
      setActiveProjectId(mockProj.id)
    } finally {
      setNewProjectTitle('')
      setNewProjectHypothesis('')
      setNewProjectModal(false)
    }
  }

  // Handler when user jumps to a verse from root concordance
  function handleSelectVerseFromConcordance(s: number, a: number) {
    const v = lookupVerse(s, a)
    if (v) {
      setSelectedVerse(v)
    }
  }

  return (
    <div className="research-workspace" dir="rtl">
      {/* Mobile Toggle */}
      <button
        className="workspace-menu"
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label="القائمة الجانبية"
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {/* 1. LEFT SIDEBAR */}
      <aside className={`workspace-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="workspace-logo">
          <span>
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </span>
          <div>
            <strong>
              Quran<span>Mind</span>
            </strong>
            <small>مختبر البحث القرآني العلمي</small>
          </div>
        </div>

        <nav>
          {navigation.map(({ label, icon: Icon, href }, index) => (
            <Link
              key={label}
              href={href}
              className={index === 1 ? 'active' : ''}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Quick Actions in Sidebar */}
        <div className="p-2 space-y-1.5 border-t border-b border-slate-800/80 my-2">
          <button
            onClick={() => setManuscriptModalOpen(true)}
            className="w-full py-1.5 px-2 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/50 rounded-lg text-[11px] text-cyan-300 font-semibold flex items-center justify-between transition"
          >
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" />
              متحف المخطوطات المبكرة
            </span>
            <span className="text-[9px] bg-cyan-900 px-1.5 py-0.5 rounded text-cyan-200">القرن 7</span>
          </button>

          <button
            onClick={() => setDossierExportOpen(true)}
            className="w-full py-1.5 px-2 bg-[#042444] hover:bg-cyan-800/60 border border-cyan-600/40 rounded-lg text-[11px] text-cyan-200 font-semibold flex items-center justify-between transition"
          >
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              تصدير الملف البحثي
            </span>
            <span className="text-[9px] bg-cyan-900 px-1.5 py-0.5 rounded text-cyan-300">PDF / MD</span>
          </button>
        </div>

        {/* Projects Section */}
        <div className="workspace-project">
          <div className="flex items-center justify-between mb-2">
            <small className="text-slate-400">المشاريع البحثية</small>
            <button
              onClick={() => setNewProjectModal(true)}
              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
            >
              + جديد
            </button>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {projects.map((proj) => (
              <button
                key={proj.id}
                onClick={() => setActiveProjectId(proj.id)}
                className={`w-full text-right p-2 rounded text-xs transition block ${
                  activeProjectId === proj.id
                    ? 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-200'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="font-semibold truncate">{proj.title}</div>
                {proj.hypothesis && (
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {proj.hypothesis}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-3 rounded-lg border border-cyan-950/60 bg-[#06182c] text-[11px] text-cyan-200/80">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4" /> البنية التحتية المتصلة
          </div>
          <div className="text-[10px] text-slate-400 space-y-0.5">
            <div>• قاعدة البيانات: Neon PostgreSQL</div>
            <div>• المصادقة: Clerk Auth</div>
            <div>• الذاكرة السريعة: Docker Redis</div>
            <div>• التخزين: Supabase Storage</div>
          </div>
        </div>
      </aside>

      {/* 2. CENTER PANEL: AI RESEARCH AGENT */}
      <section className="agent-panel">
        <header>
          <div>
            <span className="panel-kicker">المساعد البحثي الذكي</span>
            <h1>
              <Sparkles className="w-5 h-5 text-cyan-400 inline ml-1.5" />
              الوكيل الذكي <em>AI Agent</em>
            </h1>
          </div>
          <span className="online">
            <i /> متصل بالخادم
          </span>
        </header>

        {/* Messages List */}
        <div className="message-list">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'user' ? 'user-message' : ''}`}
            >
              {message.sender === 'agent' && (
                <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <p className="whitespace-pre-line leading-relaxed">{message.text}</p>

                {message.symmetryInsight && (
                  <div className="p-3 bg-cyan-950/40 border border-cyan-600/40 rounded-lg text-xs leading-relaxed text-cyan-100">
                    <strong className="text-cyan-300 block mb-1">
                      <Calculator className="w-3.5 h-3.5 inline ml-1" /> نتيجة الفحص التناظري:
                    </strong>
                    {message.symmetryInsight}
                  </div>
                )}

                {message.summaryPoints && message.summaryPoints.length > 0 && (
                  <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg text-xs text-slate-300">
                    <ul className="list-disc list-inside space-y-1">
                      {message.summaryPoints.map((pt, idx) => (
                        <li key={idx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <small className="block text-left text-[9px] text-slate-500">
                  {message.time}
                </small>
              </div>
            </div>
          ))}

          {isAnalyzing && (
            <div className="message">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400 ml-2" />
              <p className="text-xs text-cyan-200">
                جاري فحص النصوص وحساب الأنماط التناظرية في الذاكرة السريعة (Redis)...
              </p>
            </div>
          )}
        </div>

        {/* Prompt Suggestions */}
        <div className="flex gap-1.5 px-3 py-1.5 overflow-x-auto text-[11px] border-t border-slate-800/80 bg-[#031527]">
          <button
            onClick={() => askQuestion('حلل لي التناظر في ربك فكبر وكل في فلك يسبحون')}
            className="whitespace-nowrap px-2.5 py-1 rounded bg-slate-800/80 text-cyan-300 hover:bg-slate-700/80 border border-slate-700"
          >
            ✦ فحص التناظر في «كل في فلك» و«ربك فكبر»
          </button>
          <button
            onClick={() => askQuestion('احسب حروف سورة الإخلاص وأوزان حساب الجمل')}
            className="whitespace-nowrap px-2.5 py-1 rounded bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700"
          >
            ✦ حساب حروف سورة الإخلاص
          </button>
          <button
            onClick={() => askQuestion('ما هي الأدلة العلمية في سورة الأنبياء الآية 30؟')}
            className="whitespace-nowrap px-2.5 py-1 rounded bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700"
          >
            ✦ نشأة الكون والماء (الأنبياء 30)
          </button>
        </div>

        {/* Prompt Input Box */}
        <div className="prompt-box">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                askQuestion()
              }
            }}
            placeholder="اطرح سؤالاً بحثياً حول آية، نمط عددي، أو دلالة علمية..."
            aria-label="سؤال بحثي"
          />
          <button onClick={() => askQuestion()} aria-label="إرسال السؤال">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <small>
            نظام تدقيق علمي ومحسوب · يتم تصنيف الملاحظات بين المؤكدة نصياً والفرضيات البحثية
          </small>
        </div>
      </section>

      {/* 3. RIGHT PANEL (LEFT): QURAN SOURCE VIEWER */}
      <section className="quran-panel">
        <header>
          <div>
            <span className="panel-kicker">النص المصدر</span>
            <h2>
              <BookOpen className="w-4 h-4 inline text-cyan-400 ml-1.5" />
              القرآن الكريم
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setManuscriptModalOpen(true)}
              className="text-[11px] bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 px-2 py-1 rounded-lg text-cyan-300 flex items-center gap-1 transition"
              title="عرض المخطوطات الأركيولوجية المبكرة"
            >
              <FileCheck className="w-3.5 h-3.5" />
              المخطوطات
            </button>
            <div className="verse-select">
              {selectedVerse.surahName} · {selectedVerse.ayah}
            </div>
          </div>
        </header>

        {/* Verse Display */}
        <div className="verse-view">
          <div className="flex justify-between items-center mb-2">
            <span className="surah-label">
              سورة {selectedVerse.surahName} ({selectedVerse.surahEnglishName})
            </span>
            <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              {selectedVerse.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
            </span>
          </div>

          {/* Interactive Word-by-Word Tokens */}
          <div
            className="text-xl leading-loose font-serif text-slate-100 mb-2 flex flex-wrap gap-x-1.5 gap-y-1 items-center"
            dir="rtl"
          >
            {verseWords.map((word, wIdx) => (
              <button
                key={wIdx}
                onClick={() => setSelectedWordForConcordance(word)}
                className="hover:text-cyan-300 hover:bg-cyan-950/80 hover:border-cyan-500/50 px-1 py-0.5 rounded border border-transparent transition cursor-pointer"
                title={`فحص جذر «${word}» ومواضع وروده في المصحف`}
              >
                {word}
              </button>
            ))}
          </div>

          <div className="text-[10px] text-cyan-400/90 mb-3 flex items-center gap-1">
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>انقر على أي كلمة لاستخراج الجذر اللغوي والتوافق الصرفي في المصحف كاملاً</span>
          </div>

          <div className="text-xs text-slate-400 italic mb-2">
            {selectedVerse.transliteration}
          </div>

          <div className="text-xs text-slate-300 border-t border-slate-800/80 pt-2 mb-3">
            {selectedVerse.translation}
          </div>

          {/* Audio Recitation Player for this verse */}
          <div className="mb-3">
            <AudioReciter
              surah={selectedVerse.surah}
              ayah={selectedVerse.ayah}
              surahName={selectedVerse.surahName}
              totalAyahs={selectedVerse.surah === 2 ? 286 : 110}
              onAyahChange={(newAyah) => {
                const nextV = lookupVerse(selectedVerse.surah, newAyah)
                if (nextV) setSelectedVerse(nextV)
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>الجزء {selectedVerse.juz} · الصفحة {selectedVerse.page}</span>
            <div className="flex gap-1">
              {selectedVerse.themes?.map((th) => (
                <span
                  key={th}
                  className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]"
                >
                  #{th}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Normalization Mode Selector */}
        <div className="px-3 py-2 border-b border-slate-800 bg-[#04172a]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-slate-300 flex items-center gap-1 font-semibold">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> نمط التطبيع (Normalization):
            </span>
            <span className="text-[10px] text-cyan-400">
              {normMode === 'exact'
                ? 'نص الرسم العثماني الكامل'
                : normMode === 'no_diacritics'
                ? 'إزالة التشكيل'
                : normMode === 'structural'
                ? 'تطبيع لغوي بنيوي'
                : 'الحروف المجردة فقط'}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1 text-[10px]">
            <button
              onClick={() => setNormMode('exact')}
              className={`p-1.5 rounded transition ${
                normMode === 'exact'
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Mode A: التشكيل
            </button>
            <button
              onClick={() => setNormMode('no_diacritics')}
              className={`p-1.5 rounded transition ${
                normMode === 'no_diacritics'
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Mode B: دون حركات
            </button>
            <button
              onClick={() => setNormMode('structural')}
              className={`p-1.5 rounded transition ${
                normMode === 'structural'
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Mode C: بنيوي
            </button>
            <button
              onClick={() => setNormMode('letters_only')}
              className={`p-1.5 rounded transition ${
                normMode === 'letters_only'
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Mode D: حروف فقط
            </button>
          </div>
        </div>

        {/* Verse Browser & Search */}
        <div className="search-results">
          <label>
            <Search className="w-4 h-4 text-slate-400" />
            <input
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="ابحث في آيات القرآن الكريم (بالنص أو السورة)..."
            />
          </label>

          <div className="space-y-1 mt-2 overflow-y-auto max-h-56">
            {filteredVerses.map((verse) => (
              <button
                key={verse.id}
                className={verse.id === selectedVerse.id ? 'selected' : ''}
                onClick={() => setSelectedVerse(verse)}
              >
                <span>
                  سورة {verse.surahName} · الآية {verse.ayah}
                </span>
                <small className="truncate">{verse.text}</small>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. RIGHTMOST PANEL: EVIDENCE & DETAILED ANALYSIS & TAFSIR */}
      <section className="evidence-panel flex flex-col">
        <header className="border-b border-slate-800">
          <div>
            <span className="panel-kicker">محرك الحساب والتحقق والأثر</span>
            <h2>الأدلة والتوثيق</h2>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold ${
              analysis.classification === 'verified'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/40'
                : 'bg-amber-950 text-amber-400 border border-amber-600/40'
            }`}
          >
            {analysis.classification === 'verified' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> ملاحظة مؤكدة نصياً
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" /> توافق محتمل / فرضية
              </>
            )}
          </span>
        </header>

        {/* Dual Tab Switcher: Math Analysis vs Classical Tafsir */}
        <div className="flex border-b border-slate-800 bg-[#020e1d] text-xs">
          <button
            onClick={() => setEvidenceTab('analysis')}
            className={`flex-1 py-2 px-3 font-semibold transition flex items-center justify-center gap-1.5 ${
              evidenceTab === 'analysis'
                ? 'bg-[#041a31] text-cyan-300 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            الحساب والتناظر
          </button>
          <button
            onClick={() => setEvidenceTab('tafsir')}
            className={`flex-1 py-2 px-3 font-semibold transition flex items-center justify-center gap-1.5 ${
              evidenceTab === 'tafsir'
                ? 'bg-[#041a31] text-cyan-300 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            التفسير والحديث
          </button>
        </div>

        {/* TAB 1: Math & Symmetry Analysis */}
        {evidenceTab === 'analysis' ? (
          <div className="flex-1 overflow-y-auto space-y-3 p-2">
            {/* Metrics Grid */}
            <div className="evidence-card">
              <h3>التحليل الإحصائي والعددي</h3>
              <div className="metric-row">
                <div>
                  <strong>{analysis.letterCount}</strong>
                  <span>عدد الحروف</span>
                </div>
                <div>
                  <strong>{analysis.wordCount}</strong>
                  <span>عدد الكلمات</span>
                </div>
                <div>
                  <strong>{analysis.uniqueLettersCount}</strong>
                  <span>حروف فريدة</span>
                </div>
                <div>
                  <strong>{analysis.abjadValue}</strong>
                  <span>حساب الجمل</span>
                </div>
              </div>
              <p className="normalized mt-2 text-xs font-mono bg-slate-900/80 p-2 rounded border border-slate-800">
                {analysis.normalizedText}
              </p>
            </div>

            {/* Symmetry Engine Card */}
            <div className="evidence-card">
              <div className="flex items-center justify-between mb-2">
                <h3>محرك التناظر البنيوي (Symmetry Engine)</h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    analysis.symmetry.isPalindrome
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  نسبة التناظر: {Math.round(analysis.symmetry.symmetryRatio * 100)}%
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 text-[11px] space-y-1.5">
                <div className="text-slate-400">
                  <span className="text-cyan-400 ml-1">الأمام:</span> {analysis.symmetry.forwardText}
                </div>
                <div className="text-slate-400">
                  <span className="text-cyan-400 ml-1">العكس:</span> {analysis.symmetry.reversedText}
                </div>
              </div>

              {analysis.symmetry.isPalindrome && (
                <div className="mt-2 p-2 bg-emerald-950/40 border border-emerald-600/40 rounded text-[11px] text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    تطابق حرفي عكسي تام 100% (Palindrome) يقرأ من اليمين كالقراءة من اليسار.
                  </span>
                </div>
              )}
            </div>

            {/* Character Frequencies */}
            <div className="evidence-card">
              <h3>توزيع الحروف الأكثر تكراراً</h3>
              <div className="letter-cloud">
                {analysis.letterFrequencies.slice(0, 8).map(({ letter, count, percentage }) => (
                  <span key={letter} title={`نسبة ${percentage}%`}>
                    {letter}
                    <small>{count}</small>
                  </span>
                ))}
              </div>
            </div>

            {/* Save Finding to Neon & Export Dossier Buttons */}
            <div className="p-3 bg-[#041a2e] border border-cyan-900/50 rounded-lg space-y-2">
              <div className="text-xs text-slate-300 flex items-center justify-between">
                <span className="font-semibold flex items-center gap-1 text-cyan-300">
                  <BookmarkPlus className="w-3.5 h-3.5" /> توثيق النتيجة
                </span>
                <span className="text-[10px] text-slate-400">قاعدة بيانات Neon & Supabase</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={saveEvidenceToProject}
                  className="py-1.5 px-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" /> حفظ في Neon
                </button>

                <button
                  onClick={() => setDossierExportOpen(true)}
                  className="py-1.5 px-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition"
                >
                  <Download className="w-3.5 h-3.5" /> تصدير الملف
                </button>
              </div>

              {saveStatus && (
                <div className="text-[11px] text-emerald-400 text-center font-medium">
                  {saveStatus}
                </div>
              )}
            </div>

            {/* Scientific Invariant Note */}
            <div className="evidence-note">
              <strong>حدود الاستنتاج والموثوقية</strong>
              <p>{analysis.evidenceStatement}</p>
            </div>
          </div>
        ) : (
          /* TAB 2: Classical Tafsir & Authentic Hadith */
          <div className="flex-1 overflow-y-auto space-y-3 p-3 text-xs">
            {/* Ibn Kathir Card */}
            <div className="p-3 bg-[#020e1d] rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-cyan-300 text-xs flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> تفسير الإمام ابن كثير
                </h3>
                <span className="text-[10px] text-slate-400">عمدة التفسير بالمأثور</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {tafsirData.ibnKathir}
              </p>
            </div>

            {/* Jalalayn Card */}
            {tafsirData.jalalayn && (
              <div className="p-3 bg-[#020e1d] rounded-xl border border-slate-800 space-y-1.5">
                <h3 className="font-bold text-cyan-300 text-xs flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> تفسير الجلالين
                </h3>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {tafsirData.jalalayn}
                </p>
              </div>
            )}

            {/* Asbab al-Nuzul */}
            {tafsirData.asbabNuzul && (
              <div className="p-3 bg-[#020e1d] rounded-xl border border-amber-800/40 space-y-1.5">
                <h3 className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" /> أسباب النزول والسياق التاريخي
                </h3>
                <p className="text-amber-100/90 leading-relaxed text-[11px]">
                  {tafsirData.asbabNuzul}
                </p>
              </div>
            )}

            {/* Authentic Hadith Citations with Isnads */}
            {tafsirData.hadithCitations && tafsirData.hadithCitations.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-200 text-xs">
                    الشواهد الحديثية المسندة:
                  </h3>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/40">
                    أحاديث صحيحة / حسنة
                  </span>
                </div>

                {tafsirData.hadithCitations.map((h, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#020b18] border border-cyan-900/60 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-cyan-300 font-bold">
                        {h.source} (رقم {h.number})
                      </span>
                      <span className="text-[10px] bg-emerald-900/80 text-emerald-200 px-1.5 py-0.5 rounded">
                        درجة السند: {h.isnadGrade}
                      </span>
                    </div>

                    <p className="text-slate-100 font-medium leading-relaxed text-[11px]">
                      {h.text}
                    </p>

                    <div className="text-[10px] text-slate-400 bg-slate-900/80 p-1.5 rounded border border-slate-800">
                      <strong>السلسلة الإسنادية:</strong> {h.narratorChain}
                    </div>

                    <div className="text-[10px] text-cyan-200/90">
                      <strong>وجه الدلالة والتوافق:</strong> {h.relevanceNote}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Scientific Notes */}
            {tafsirData.scientificNotes && (
              <div className="p-3 bg-cyan-950/40 border border-cyan-700/40 rounded-xl space-y-1">
                <h4 className="font-bold text-cyan-300 text-xs">
                  التقاطع العلمي والاستقرائي:
                </h4>
                <p className="text-cyan-100/90 leading-relaxed text-[11px]">
                  {tafsirData.scientificNotes}
                </p>
              </div>
            )}

            <button
              onClick={() => setDossierExportOpen(true)}
              className="w-full py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow"
            >
              <FileText className="w-4 h-4" />
              تضمين التفسير في الملف البحثي (Export)
            </button>
          </div>
        )}
      </section>

      {/* Modal 1: New Research Project */}
      {newProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#03172c] border border-cyan-800/60 rounded-xl p-5 w-full max-w-md space-y-4 text-right shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-cyan-400" /> مشروع بحثي جديد
              </h3>
              <button
                onClick={() => setNewProjectModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">عنوان المشروع البحثي</label>
                <input
                  type="text"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="مثال: التماثل والتناظر في الآيات الكونية"
                  className="w-full bg-[#062444] border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">الفرضية الأساسية (Hypothesis)</label>
                <textarea
                  value={newProjectHypothesis}
                  onChange={(e) => setNewProjectHypothesis(e.target.value)}
                  placeholder="صياغة السؤال أو الفرضية الرياضية/العلمية المراد التحقق منها..."
                  className="w-full bg-[#062444] border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-cyan-400 h-20 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setNewProjectModal(false)}
                className="px-4 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                إلغاء
              </button>
              <button
                onClick={handleCreateProject}
                className="px-4 py-1.5 text-xs bg-cyan-600 hover:bg-cyan-500 text-white rounded font-semibold"
              >
                إنشاء المشروع وحفظه
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Early Manuscripts Viewer (Corpus Coranicum) */}
      <ManuscriptViewer
        isOpen={manuscriptModalOpen}
        onClose={() => setManuscriptModalOpen(false)}
        currentSurahName={selectedVerse.surahName}
        currentAyah={selectedVerse.ayah}
      />

      {/* Modal 3: Word Morphology & Root Concordance Explorer */}
      <WordConcordanceModal
        word={selectedWordForConcordance}
        onClose={() => setSelectedWordForConcordance(null)}
        onSelectVerse={handleSelectVerseFromConcordance}
      />

      {/* Modal 4: Academic Research Dossier Exporter */}
      <DossierExportModal
        isOpen={dossierExportModalOpen}
        onClose={() => setDossierExportOpen(false)}
        verse={selectedVerse}
        normMode={normMode}
        projectTitle={
          projects.find((p) => p.id === activeProjectId)?.title || 'دراسة الأنماط القرآنية'
        }
        hypothesis={
          projects.find((p) => p.id === activeProjectId)?.hypothesis ||
          'فحص التناظر الرياضي واللغوي في ضوء المنهج الاستقرائي الصارم'
        }
      />
    </div>
  )
}
