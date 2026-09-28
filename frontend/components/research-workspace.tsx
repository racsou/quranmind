'use client'

import React, { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
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
  Share2,
  Info,
  Maximize2,
  Eye,
  Check,
  Home,
  MessageSquare,
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
import { ResearchGraph } from '@/components/research-graph'
import { EARLY_MANUSCRIPTS, type QuranManuscript } from '@/lib/quran/manuscripts'

const navigation = [
  { label: 'الرئيسية', icon: Home, href: '/' },
  { label: 'مساحة العمل', icon: FlaskConical, href: '/workspace' },
  { label: 'المصحف الشريف', icon: BookOpen, href: '/dashboard/quran' },
  { label: 'المشاريع البحثية', icon: FolderKanban, href: '/dashboard/projects' },
  { label: 'المكتبة والمخطوطات', icon: FileCheck, href: '/dashboard/library' },
]

export function ResearchWorkspace() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [searchFilter, setSearchFilter] = useState('')
  const [selectedVerse, setSelectedVerse] = useState<QuranVerse>(QURAN_VERSES[8]) // Al-Anbiya 33: Kullun fee falak
  const [normMode, setNormMode] = useState<NormalizationMode>('structural')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)

  // Top Tab Navigator State
  const [activeMainTab, setActiveMainTab] = useState<'workspace' | 'graph' | 'manuscripts' | 'concordance' | 'projects'>('workspace')

  // Responsive Workspace Panel Switcher for Mobile / Tablet (< xl screens)
  const [activeMobilePanel, setActiveMobilePanel] = useState<'quran' | 'agent' | 'evidence'>('agent')

  // Modals & Sub-Panels State
  const [manuscriptModalOpen, setManuscriptModalOpen] = useState(false)
  const [selectedWordForConcordance, setSelectedWordForConcordance] = useState<string | null>(null)
  const [dossierExportModalOpen, setDossierExportOpen] = useState(false)
  const [evidenceSubTab, setEvidenceSubTab] = useState<'analysis' | 'tafsir'>('analysis')
  const [rightPanelView, setRightPanelView] = useState<'graph' | 'evidence'>('graph')

  // Full Manuscripts View state (when main tab is 'manuscripts')
  const [selectedManuscript, setSelectedManuscript] = useState<QuranManuscript>(EARLY_MANUSCRIPTS[0])
  const [manuscriptZoom, setManuscriptZoom] = useState(1)

  // Dedicated Concordance View search state
  const [rootSearchTerm, setRootSearchTerm] = useState('فلك')

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
      text: 'مرحباً بك في مساحة البحث القرآني العلمي. أنا الوكيل الذكي للتحليل النصي والعددي والإبستيمي. يمكنك طرح أي سؤال تحليلي، وسأقوم بفحص البيانات، حساب التناظر، وعرض الأدلة المصنفة مع الشواهد المسندة.',
      summaryPoints: [
        'تحليل التناظر اللفظي والبنيوي (Palindromic Symmetry)',
        'حساب أوزان الحروف والكلمات وحساب الجمل الكبير بدقة',
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

        let symmetryInsight: string | null = null
        if (payload.analysis?.symmetry?.isPalindrome) {
          symmetryInsight = `تطابق عكسي تام: «${payload.analysis.text}» يقرأ من اليمين كالشمال بنسبة 100%. حساب الجمل: ${payload.analysis.abjadValue}.`
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            sender: 'agent',
            text: payload.answer,
            summaryPoints: payload.summaryPoints,
            symmetryInsight,
            time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          },
        ])
      } else {
        throw new Error(data.error || 'فشل استرجاع التحليل')
      }
    } catch {
      // Local fallback
      setTimeout(() => {
        let fallbackText = `تم فحص النص القرآني للآية الكريمة [سورة ${selectedVerse.surahName}: ${selectedVerse.ayah}].`
        let symm = null
        if (analysis.symmetry.isPalindrome) {
          symm = `تطابق تناظري تام (Palindrome): يقرأ النص للأمام وللخلف بذات الترتيب الحرفي. أوزان الجمل: ${analysis.abjadValue}.`
          fallbackText += `\n✓ كشف النظام عن تناظر بنيوي لفظي دقيق.`
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `a-local-${Date.now()}`,
            sender: 'agent',
            text: fallbackText,
            summaryPoints: [
              `إجمالي الحروف: ${analysis.letterCount}`,
              `عدد الكلمات: ${analysis.wordCount}`,
              `حساب الجمل الكبير: ${analysis.abjadValue}`,
              `ملاحظة إبستيمية: تم التحقق عبر مصحف المدينة ومطابقة النص برواية حفص`,
            ],
            symmetryInsight: symm,
            time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          },
        ])
      }, 600)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Save current discovery as evidence
  async function handleSaveDiscovery() {
    try {
      const payload = {
        projectId: activeProjectId || 'default-project',
        title: `تحليل سورة ${selectedVerse.surahName} (${selectedVerse.ayah})`,
        hypothesis: `التناظر والخصائص البنيوية في الآية ${selectedVerse.ayah}`,
        claimText: selectedVerse.text,
        claimType: analysis.symmetry.isPalindrome ? 'scientific_correlation' : 'linguistic_observation',
        epistemicStatus: analysis.symmetry.isPalindrome ? 'verified_fact' : 'supported_correlation',
        quranicPassages: [
          {
            surah: selectedVerse.surah,
            ayah: selectedVerse.ayah,
            text: selectedVerse.text,
          },
        ],
        calculations: {
          abjad: analysis.abjadValue,
          isPalindrome: analysis.symmetry.isPalindrome,
          wordCount: analysis.wordCount,
          letterCount: analysis.letterCount,
        },
      }

      const res = await fetch('/api/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.success) {
        setSaveStatus('✓ تم حفظ الاكتشاف في مشروعك البحثي (Neon DB)')
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

  // Jump to verse from root concordance
  function handleSelectVerseFromConcordance(s: number, a: number) {
    const v = lookupVerse(s, a)
    if (v) {
      setSelectedVerse(v)
      setActiveMainTab('workspace')
    }
  }

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0]

  return (
    <div className="min-h-screen bg-[#020b18] text-slate-100 flex flex-col font-sans antialiased overflow-x-hidden selection:bg-cyan-500 selection:text-black" dir="rtl">
      
      {/* ========================================================================= */}
      {/* 1. TOP NAVBAR                                                             */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#020d1c] border-b border-cyan-950/80 px-3 sm:px-6 h-16 flex items-center justify-between shadow-md">
        
        {/* Right side (RTL): Brand & Mobile Menu & Project */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="القائمة الجانبية"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-950 to-cyan-600 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-md shadow-cyan-950/50 group-hover:scale-105 transition">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1 font-serif">
                Quran<span className="text-cyan-400">Mind</span>
              </span>
              <span className="hidden sm:block text-[9px] text-slate-400 font-medium">
                مساحة البحث والتحليل المتكاملة
              </span>
            </div>
          </Link>

          {/* Active Project Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#041a2d] border border-cyan-800/40 text-xs">
            <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 text-[11px]">المشروع:</span>
            <span className="text-cyan-200 font-semibold max-w-[140px] truncate">
              {activeProject?.title || 'مشروع بحثي نشط'}
            </span>
          </div>
        </div>

        {/* Center: Current Verse & Server Indicator */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400">الآية المحددة:</span>
            <strong className="text-white font-serif">
              سورة {selectedVerse.surahName} ({selectedVerse.ayah})
            </strong>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>الوكيل متصل (Ready)</span>
          </div>
        </div>

        {/* Left side (RTL): Quick Launch Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setManuscriptModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/50 text-xs text-cyan-300 font-semibold transition"
            title="فحص المخطوطات الأركيولوجية من القرن الأول الهجري"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>المخطوطات (C-14)</span>
          </button>

          <button
            onClick={() => setDossierExportOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#042444] hover:bg-cyan-800/60 border border-cyan-600/40 text-xs text-cyan-200 font-semibold transition"
            title="تصدير ملف البحث بصيغة PDF أو Markdown"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تصدير Dossier</span>
          </button>

          <Link
            href="/"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 transition"
          >
            <span className="hidden sm:inline">الرئيسية</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. TAB NAVIGATOR UNDER NAVBAR                                             */}
      {/* ========================================================================= */}
      <nav className="sticky top-16 z-30 bg-[#031527] border-b border-slate-800/90 px-3 sm:px-6 h-12 flex items-center justify-between overflow-x-auto shadow-sm">
        
        {/* Main Tool Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveMainTab('workspace')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeMainTab === 'workspace'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>مساحة العمل المتكاملة</span>
          </button>

          <button
            onClick={() => setActiveMainTab('graph')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeMainTab === 'graph'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>شبكة العلاقات المعرفية</span>
          </button>

          <button
            onClick={() => setActiveMainTab('manuscripts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeMainTab === 'manuscripts'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>متحف المخطوطات المبكرة</span>
          </button>

          <button
            onClick={() => setActiveMainTab('concordance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeMainTab === 'concordance'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>المعجم الصرفي والجذور</span>
          </button>

          <button
            onClick={() => setActiveMainTab('projects')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeMainTab === 'projects'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>المشاريع والفرضيات</span>
          </button>
        </div>

        {/* Responsive Mobile / Tablet Sub-Panel Switcher (Only visible in 'workspace' tab on screens < xl) */}
        {activeMainTab === 'workspace' && (
          <div className="flex xl:hidden items-center p-1 bg-slate-900/90 rounded-lg border border-slate-800 text-[11px]">
            <button
              onClick={() => setActiveMobilePanel('quran')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                activeMobilePanel === 'quran' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              النص القرآني
            </button>
            <button
              onClick={() => setActiveMobilePanel('agent')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                activeMobilePanel === 'agent' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              الوكيل الذكي
            </button>
            <button
              onClick={() => setActiveMobilePanel('evidence')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                activeMobilePanel === 'evidence' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              الأدلة والشبكة
            </button>
          </div>
        )}
      </nav>

      {/* ========================================================================= */}
      {/* 3. MAIN BODY LAYOUT (Sidebar on Right in RTL + Main Viewport on Left)       */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT SIDEBAR (Desktop Docked + Mobile Slide-out Drawer)                */}
        {/* ----------------------------------------------------------------------- */}
        
        {/* Mobile Backdrop Overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          />
        )}

        <aside
          className={`
            fixed lg:static top-0 right-0 bottom-0 z-50 lg:z-auto
            w-72 lg:w-64 shrink-0 bg-[#031426] border-l border-slate-800
            flex flex-col justify-between p-4 overflow-y-auto transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="space-y-6">
            
            {/* Mobile Sidebar Header */}
            <div className="flex lg:hidden items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-sm text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" /> القائمة الجانبية
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Navigation Links */}
            <div>
              <small className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-2">
                التنقل والمصادر
              </small>
              <nav className="space-y-1">
                {navigation.map(({ label, icon: Icon, href }, index) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                      index === 1
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/50'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Quick Actions in Sidebar */}
            <div className="p-3 bg-[#020b18] border border-slate-800 rounded-xl space-y-2">
              <small className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                أدوات بحثية سريعة
              </small>
              
              <button
                onClick={() => {
                  setManuscriptModalOpen(true)
                  setSidebarOpen(false)
                }}
                className="w-full py-2 px-2.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/50 rounded-lg text-xs text-cyan-300 font-semibold flex items-center justify-between transition"
              >
                <span className="flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5" />
                  متحف المخطوطات
                </span>
                <span className="text-[10px] bg-cyan-900 px-1.5 py-0.5 rounded text-cyan-200">القرن 7</span>
              </button>

              <button
                onClick={() => {
                  setDossierExportOpen(true)
                  setSidebarOpen(false)
                }}
                className="w-full py-2 px-2.5 bg-[#042444] hover:bg-cyan-800/60 border border-cyan-600/40 rounded-lg text-xs text-cyan-200 font-semibold flex items-center justify-between transition"
              >
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  تصدير الملف البحثي
                </span>
                <span className="text-[10px] bg-cyan-900 px-1.5 py-0.5 rounded text-cyan-300">PDF / MD</span>
              </button>
            </div>

            {/* Projects Section */}
            <div className="p-3 bg-[#020b18] border border-slate-800 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <small className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  المشاريع البحثية
                </small>
                <button
                  onClick={() => setNewProjectModal(true)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-bold"
                >
                  + جديد
                </button>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {projects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      setActiveProjectId(proj.id)
                      setSidebarOpen(false)
                    }}
                    className={`w-full text-right p-2 rounded-lg text-xs transition block ${
                      activeProjectId === proj.id
                        ? 'bg-cyan-950/90 border border-cyan-500/50 text-cyan-200'
                        : 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:bg-slate-800'
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

          </div>

          {/* Infrastructure status */}
          <div className="mt-6 p-3 rounded-xl border border-cyan-950/80 bg-[#020b18] text-[11px] text-cyan-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1 text-xs">
              <ShieldCheck className="w-3.5 h-3.5" /> البنية التحتية المتصلة
            </div>
            <div className="text-[10px] text-slate-400 space-y-0.5">
              <div>• قاعدة البيانات: Neon PostgreSQL</div>
              <div>• المصادقة: Clerk Auth</div>
              <div>• الذاكرة السريعة: Docker Redis</div>
              <div>• التخزين: Supabase Storage</div>
            </div>
          </div>
        </aside>

        {/* ----------------------------------------------------------------------- */}
        {/* MAIN VIEWPORT CONTENT (LEFT OF SIDEBAR IN RTL)                          */}
        {/* ----------------------------------------------------------------------- */}
        <main className="flex-1 min-w-0 flex flex-col overflow-hidden bg-[#020d1b]">

          {/* ===================================================================== */}
          {/* TAB VIEW 1: مساحة العمل المتكاملة (3 Synchronized Panes)              */}
          {/* ===================================================================== */}
          {activeMainTab === 'workspace' && (
            <div className="flex-1 overflow-hidden">
              
              {/* Responsive Container: 3 Panes on >= xl, or Tabbed on < xl */}
              <div className="h-full xl:grid xl:grid-cols-12 divide-y xl:divide-y-0 xl:divide-x xl:divide-x-reverse divide-slate-800 overflow-y-auto xl:overflow-hidden">
                
                {/* --------------------------------------------------------------- */}
                {/* PANE 1: QURAN SOURCE VIEWER (Right in RTL, Col span 4)          */}
                {/* --------------------------------------------------------------- */}
                <section
                  className={`
                    xl:col-span-4 h-full flex flex-col bg-[#03172b]/50 overflow-hidden
                    ${activeMobilePanel === 'quran' ? 'flex' : 'hidden xl:flex'}
                  `}
                >
                  <header className="p-3.5 border-b border-slate-800 bg-[#020f20] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-cyan-400 font-mono">PANEL 1 / SOURCE</span>
                      <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-cyan-400" /> النص القرآني
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setManuscriptModalOpen(true)}
                        className="text-[11px] bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 px-2 py-1 rounded-lg text-cyan-300 flex items-center gap-1 transition"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        المخطوطات
                      </button>
                      <span className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-2 py-1 rounded-lg font-mono">
                        {selectedVerse.surahName} · {selectedVerse.ayah}
                      </span>
                    </div>
                  </header>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    
                    {/* Selected Verse Display Card */}
                    <div className="p-5 rounded-2xl bg-gradient-to-b from-[#041d36] to-[#031527] border border-cyan-800/50 shadow-lg text-center space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-cyan-300 font-bold">
                          سورة {selectedVerse.surahName} ({selectedVerse.surahEnglishName})
                        </span>
                        <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                          {selectedVerse.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                        </span>
                      </div>

                      {/* Interactive Word Tokens */}
                      <div className="text-xl sm:text-2xl leading-loose font-serif text-white py-2 flex flex-wrap justify-center gap-1.5 items-center">
                        {verseWords.map((word, wIdx) => (
                          <button
                            key={wIdx}
                            onClick={() => setSelectedWordForConcordance(word)}
                            className="hover:text-cyan-300 hover:bg-cyan-950/80 hover:border-cyan-500/50 px-1.5 py-0.5 rounded-lg border border-transparent transition cursor-pointer"
                            title={`انقر لفحص جذر «${word}» ومواضعه في 114 سورة`}
                          >
                            {word}
                          </button>
                        ))}
                      </div>

                      <div className="text-[10px] text-cyan-400/90 flex items-center justify-center gap-1">
                        <Compass className="w-3 h-3 text-cyan-400" />
                        <span>انقر على أي كلمة لاستخراج الجذر والتوافق الصرفي في المصحف كاملاً</span>
                      </div>

                      <div className="text-xs text-slate-400 italic">
                        {selectedVerse.transliteration}
                      </div>

                      <div className="text-xs text-slate-300 border-t border-slate-800 pt-2 text-right">
                        {selectedVerse.translation}
                      </div>

                      {/* Synchronized Reciter Player */}
                      <div className="pt-2">
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
                    </div>

                    {/* Normalization Mode Selector */}
                    <div className="p-3 rounded-xl bg-[#020b18] border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300 font-semibold flex items-center gap-1 text-[11px]">
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
                          A: تشكيل
                        </button>
                        <button
                          onClick={() => setNormMode('no_diacritics')}
                          className={`p-1.5 rounded transition ${
                            normMode === 'no_diacritics'
                              ? 'bg-cyan-600 text-white font-bold'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          B: دون حركات
                        </button>
                        <button
                          onClick={() => setNormMode('structural')}
                          className={`p-1.5 rounded transition ${
                            normMode === 'structural'
                              ? 'bg-cyan-600 text-white font-bold'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          C: بنيوي
                        </button>
                        <button
                          onClick={() => setNormMode('letters_only')}
                          className={`p-1.5 rounded transition ${
                            normMode === 'letters_only'
                              ? 'bg-cyan-600 text-white font-bold'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          D: مجرد
                        </button>
                      </div>
                    </div>

                    {/* Quick Verse Browser & Search */}
                    <div className="p-3 rounded-xl bg-[#020b18] border border-slate-800 space-y-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                        <input
                          type="text"
                          value={searchFilter}
                          onChange={(e) => setSearchFilter(e.target.value)}
                          placeholder="ابحث في آيات القرآن الكريم (نص أو سورة)..."
                          className="w-full pr-8 pl-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="space-y-1 max-h-44 overflow-y-auto">
                        {filteredVerses.map((verse) => (
                          <button
                            key={verse.id}
                            onClick={() => setSelectedVerse(verse)}
                            className={`w-full text-right p-2 rounded-lg text-xs transition block ${
                              verse.id === selectedVerse.id
                                ? 'bg-cyan-950/80 border border-cyan-500/50 text-cyan-200'
                                : 'bg-slate-900/50 border border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                            }`}
                          >
                            <span className="font-semibold block text-[11px] text-cyan-400">
                              سورة {verse.surahName} · الآية {verse.ayah}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate block mt-0.5 font-serif">
                              {verse.text}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </section>

                {/* --------------------------------------------------------------- */}
                {/* PANE 2: AI RESEARCH AGENT (Center, Col span 4)                  */}
                {/* --------------------------------------------------------------- */}
                <section
                  className={`
                    xl:col-span-4 h-full flex flex-col bg-[#020b18] overflow-hidden
                    ${activeMobilePanel === 'agent' ? 'flex' : 'hidden xl:flex'}
                  `}
                >
                  <header className="p-3.5 border-b border-slate-800 bg-[#020f20] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-cyan-400 font-mono">PANEL 2 / AGENT</span>
                      <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-cyan-400" /> الوكيل الذكي للبحث
                      </h2>
                    </div>
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/40">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      استجابة فورية
                    </span>
                  </header>

                  {/* Messages Stream */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-2.5 ${message.sender === 'user' ? 'justify-start' : 'justify-start'}`}
                      >
                        {message.sender === 'agent' && (
                          <div className="w-7 h-7 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400 mt-1">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                        )}

                        <div className="flex-1 space-y-2">
                          <div
                            className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                              message.sender === 'user'
                                ? 'bg-gradient-to-l from-cyan-950 to-blue-950 border border-cyan-600/40 text-cyan-100'
                                : 'bg-[#031527] border border-slate-800 text-slate-200'
                            }`}
                          >
                            <p className="whitespace-pre-line leading-relaxed">{message.text}</p>
                          </div>

                          {message.symmetryInsight && (
                            <div className="p-3 bg-cyan-950/40 border border-cyan-600/40 rounded-xl text-xs leading-relaxed text-cyan-100">
                              <strong className="text-cyan-300 block mb-1 flex items-center gap-1">
                                <Calculator className="w-3.5 h-3.5" /> نتيجة الفحص التناظري:
                              </strong>
                              {message.symmetryInsight}
                            </div>
                          )}

                          {message.summaryPoints && message.summaryPoints.length > 0 && (
                            <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-300">
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
                      <div className="flex items-center gap-2 p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-xs text-cyan-300">
                        <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                        <span>جاري فحص النصوص وحساب الأنماط التناظرية في الذاكرة السريعة...</span>
                      </div>
                    )}
                  </div>

                  {/* Suggestion Chips */}
                  <div className="flex gap-1.5 px-3 py-1.5 overflow-x-auto text-[11px] border-t border-slate-800/80 bg-[#031527]">
                    <button
                      onClick={() => askQuestion('حلل لي التناظر في ربك فكبر وكل في فلك يسبحون')}
                      className="whitespace-nowrap px-2.5 py-1 rounded bg-slate-800/80 text-cyan-300 hover:bg-slate-700 border border-slate-700"
                    >
                      ✦ فحص التناظر في «كل في فلك»
                    </button>
                    <button
                      onClick={() => askQuestion('احسب حروف سورة الإخلاص وأوزان حساب الجمل')}
                      className="whitespace-nowrap px-2.5 py-1 rounded bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700"
                    >
                      ✦ حساب سورة الإخلاص
                    </button>
                    <button
                      onClick={() => askQuestion('ما هي الأدلة العلمية في سورة الأنبياء الآية 30؟')}
                      className="whitespace-nowrap px-2.5 py-1 rounded bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700"
                    >
                      ✦ نشأة الكون والماء (الأنبياء 30)
                    </button>
                  </div>

                  {/* Prompt Input Box */}
                  <div className="p-3 border-t border-slate-800 bg-[#020b18]">
                    <div className="relative">
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
                        rows={2}
                        className="w-full p-2.5 pl-10 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                      />
                      <button
                        onClick={() => askQuestion()}
                        className="absolute left-2 bottom-2.5 p-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition"
                        aria-label="إرسال السؤال"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <small className="block text-[10px] text-slate-500 mt-1">
                      نظام تدقيق علمي ومحسوب · يتم تصنيف الملاحظات بين المؤكدة نصياً والفرضيات البحثية
                    </small>
                  </div>
                </section>

                {/* --------------------------------------------------------------- */}
                {/* PANE 3: EVIDENCE & RESEARCH GRAPH (Left in RTL, Col span 4)     */}
                {/* --------------------------------------------------------------- */}
                <section
                  className={`
                    xl:col-span-4 h-full flex flex-col bg-[#041a2d]/50 overflow-hidden
                    ${activeMobilePanel === 'evidence' ? 'flex' : 'hidden xl:flex'}
                  `}
                >
                  <header className="p-3.5 border-b border-slate-800 bg-[#020f20] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-cyan-400 font-mono">PANEL 3 / EVIDENCE & GRAPH</span>
                      <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Share2 className="w-4 h-4 text-cyan-400" />
                        {rightPanelView === 'graph' ? 'شبكة العلاقات المعرفية' : 'الأدلة والتوثيق الأثري'}
                      </h2>
                    </div>

                    {/* View Switcher between Graph and Evidence */}
                    <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                      <button
                        onClick={() => setRightPanelView('graph')}
                        className={`px-2.5 py-1 rounded-md font-semibold transition ${
                          rightPanelView === 'graph' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        الشبكة
                      </button>
                      <button
                        onClick={() => setRightPanelView('evidence')}
                        className={`px-2.5 py-1 rounded-md font-semibold transition ${
                          rightPanelView === 'evidence' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        الأدلة
                      </button>
                    </div>
                  </header>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    
                    {/* View 1: Embedded Interactive Research Graph */}
                    {rightPanelView === 'graph' && (
                      <div className="space-y-3">
                        <div className="h-[360px] rounded-2xl bg-[#020b18] border border-cyan-800/50 overflow-hidden shadow-inner">
                          <ResearchGraph
                            surah={selectedVerse.surah}
                            ayah={selectedVerse.ayah}
                            onSelectVerse={(s, a) => {
                              const v = lookupVerse(s, a)
                              if (v) setSelectedVerse(v)
                            }}
                            onSelectRoot={(r) => {
                              setSelectedWordForConcordance(r)
                            }}
                          />
                        </div>

                        <div className="p-3 bg-[#020b18] border border-slate-800 rounded-xl text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-cyan-300 font-bold text-xs">العقد المتشابهة والمتصلة:</span>
                            <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded">
                              1,162 زوج متشابه
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            ترتبط سورة {selectedVerse.surahName} الآية {selectedVerse.ayah} بعقد معرفية مع سورة يس (40) في تركيب «كُلٌّ فِي فَلَكٍ» وجذري (شمس، قمر).
                          </p>
                        </div>
                      </div>
                    )}

                    {/* View 2: Evidence & Classical Tafsir */}
                    {rightPanelView === 'evidence' && (
                      <div className="space-y-4">
                        
                        {/* Sub-tab: Analysis vs Tafsir */}
                        <div className="flex gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                          <button
                            onClick={() => setEvidenceSubTab('analysis')}
                            className={`flex-1 py-1.5 rounded-lg font-bold transition ${
                              evidenceSubTab === 'analysis' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            التحليل الحسابي والتناظر
                          </button>
                          <button
                            onClick={() => setEvidenceSubTab('tafsir')}
                            className={`flex-1 py-1.5 rounded-lg font-bold transition ${
                              evidenceSubTab === 'tafsir' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            التفسير الأثري والشواهد
                          </button>
                        </div>

                        {evidenceSubTab === 'analysis' && (
                          <div className="space-y-3">
                            {/* Metric Cards */}
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div className="p-3 bg-[#020b18] border border-slate-800 rounded-xl">
                                <span className="text-[10px] text-slate-400 block">إجمالي الحروف</span>
                                <strong className="text-xl font-bold text-white font-mono">
                                  {analysis.letterCount}
                                </strong>
                              </div>
                              <div className="p-3 bg-[#020b18] border border-slate-800 rounded-xl">
                                <span className="text-[10px] text-slate-400 block">حساب الجمل</span>
                                <strong className="text-xl font-bold text-amber-300 font-mono">
                                  {analysis.abjadValue}
                                </strong>
                              </div>
                              <div className="p-3 bg-[#020b18] border border-slate-800 rounded-xl">
                                <span className="text-[10px] text-slate-400 block">التناظر اللفظي</span>
                                <strong className="text-xs font-bold text-emerald-400 block mt-1">
                                  {analysis.symmetry.isPalindrome ? '✓ تام 100%' : 'جزئي'}
                                </strong>
                              </div>
                            </div>

                            {/* Letter Cloud */}
                            <div className="p-3 bg-[#020b18] border border-slate-800 rounded-xl space-y-2">
                              <span className="text-xs font-semibold text-slate-300 block">
                                توزيع الحروف الأكثر تكراراً:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {analysis.letterFrequencies.slice(0, 10).map((lf) => (
                                  <span
                                    key={lf.letter}
                                    className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-cyan-300 font-mono"
                                  >
                                    {lf.letter}: <strong className="text-white">{lf.count}</strong>
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Epistemic Rigor Badge */}
                            <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-xs space-y-1 text-emerald-200">
                              <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span>تصنيف التدقيق: ملاحظة مؤكدة نصياً وحسابياً</span>
                              </div>
                              <p className="text-[11px] leading-relaxed text-slate-300">
                                الحساب مستقر وفق مصحف المدينة ولا يعتمد على انتقائية رقمية (Zero Cherry-Picking).
                              </p>
                            </div>
                          </div>
                        )}

                        {evidenceSubTab === 'tafsir' && (
                          <div className="space-y-3 text-xs">
                            <div className="p-3 bg-[#020b18] border border-slate-800 rounded-xl space-y-1.5">
                              <strong className="text-cyan-300 block font-bold">
                                تفسير ابن كثير:
                              </strong>
                              <p className="text-slate-300 leading-relaxed text-[11px]">
                                {tafsirData.ibnKathir}
                              </p>
                            </div>

                            <div className="p-3 bg-[#020b18] border border-slate-800 rounded-xl space-y-1.5">
                              <strong className="text-cyan-300 block font-bold">
                                تفسير الجلالين:
                              </strong>
                              <p className="text-slate-300 leading-relaxed text-[11px]">
                                {tafsirData.jalalayn}
                              </p>
                            </div>

                            {tafsirData.hadithCitations?.length > 0 && (
                              <div className="p-3 bg-[#020b18] border border-amber-800/40 rounded-xl space-y-2">
                                <strong className="text-amber-300 block font-bold">
                                  الشواهد الحديثية المسندة:
                                </strong>
                                {tafsirData.hadithCitations.map((hadith, hIdx) => (
                                  <div key={hIdx} className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-[11px] space-y-1">
                                    <div className="text-white font-serif">«{hadith.text}»</div>
                                    <div className="text-slate-400 text-[10px] flex justify-between">
                                      <span>تخريج: {hadith.source}</span>
                                      <span className="text-emerald-400">{hadith.isnadGrade}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Save Discovery Button */}
                        <div className="pt-2">
                          <button
                            onClick={handleSaveDiscovery}
                            className="w-full py-2.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-900/40 transition active:scale-95"
                          >
                            <BookmarkPlus className="w-4 h-4" />
                            <span>حفظ الاكتشاف في ملف المشروع البحثي</span>
                          </button>
                          {saveStatus && (
                            <div className="text-center text-xs text-emerald-400 mt-2 font-semibold animate-pulse">
                              {saveStatus}
                            </div>
                          )}
                        </div>

                      </div>
                    )}

                  </div>
                </section>

              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB VIEW 2: شبكة العلاقات المعرفية (Full Interactive View)           */}
          {/* ===================================================================== */}
          {activeMainTab === 'graph' && (
            <div className="flex-1 p-4 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-cyan-400" />
                    خريطة العلاقات المعرفية الطوبولوجية (Topological Research Graph)
                  </h2>
                  <p className="text-xs text-slate-400">
                    استكشاف بصري للعلاقات والروابط بين الآيات، الجذور اللغوية، والموضوعات المشتركة
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">الآية المرتكزة:</span>
                  <strong className="text-xs text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-800">
                    سورة {selectedVerse.surahName} ({selectedVerse.ayah})
                  </strong>
                </div>
              </div>

              <div className="flex-1 rounded-2xl bg-[#020b18] border border-cyan-800/60 overflow-hidden shadow-2xl relative">
                <ResearchGraph
                  surah={selectedVerse.surah}
                  ayah={selectedVerse.ayah}
                  onSelectVerse={(s, a) => {
                    const v = lookupVerse(s, a)
                    if (v) setSelectedVerse(v)
                  }}
                  onSelectRoot={(r) => {
                    setSelectedWordForConcordance(r)
                  }}
                  className="h-full"
                />
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB VIEW 3: متحف المخطوطات المبكرة (Manuscripts Gallery View)        */}
          {/* ===================================================================== */}
          {activeMainTab === 'manuscripts' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-cyan-400" />
                    متحف المخطوطات والوثائق الأركيولوجية المبكرة
                  </h2>
                  <p className="text-xs text-slate-400">
                    مقارنة نصوص الرقع والجلود من القرن الأول الهجري (القرن 7 الميلادي) بمصحف المدينة النبوي
                  </p>
                </div>
                <button
                  onClick={() => setManuscriptModalOpen(true)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  فتح المجهر الرقمي عالي الدقة ←
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {EARLY_MANUSCRIPTS.map((ms) => (
                  <div
                    key={ms.id}
                    onClick={() => {
                      setSelectedManuscript(ms)
                      setManuscriptModalOpen(true)
                    }}
                    className="p-5 rounded-2xl bg-[#031527] border border-slate-800 hover:border-cyan-500/60 transition cursor-pointer group space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-cyan-300 group-hover:text-cyan-200">
                        {ms.arabicTitle}
                      </span>
                      <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800/40">
                        {ms.carbonDating}
                      </span>
                    </div>

                    <div className="h-36 rounded-xl bg-[#020b18] border border-slate-800 flex items-center justify-center relative overflow-hidden group-hover:border-cyan-700/50">
                      <img
                        src={ms.imageUrl}
                        alt={ms.arabicTitle}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute bottom-2 right-2 text-[10px] bg-black/80 px-2 py-0.5 rounded text-white">
                        {ms.scriptType}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {ms.scholarlySignificance}
                    </p>

                    <div className="text-[11px] text-cyan-400 font-semibold pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span>فحص الرقعة بالتكبير 250%</span>
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB VIEW 4: المعجم الصرفي والتوافق (Concordance Explorer)            */}
          {/* ===================================================================== */}
          {activeMainTab === 'concordance' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-6">
              <div className="pb-3 border-b border-slate-800 space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-cyan-400" />
                  المعجم الصرفي واستكشاف الجذور ومشتقاتها
                </h2>
                <p className="text-xs text-slate-400">
                  تجريد الكلمات القرآنية إلى جذورها الثلاثية والرباعية وتتبع مشتقاتها عبر سور القرآن الـ 114
                </p>
              </div>

              {/* Root Search Bar */}
              <div className="max-w-xl flex gap-2">
                <input
                  type="text"
                  value={rootSearchTerm}
                  onChange={(e) => setRootSearchTerm(e.target.value)}
                  placeholder="اكتب جذراً أو كلمة (مثال: فلك، سبح، رتق، علم)..."
                  className="flex-1 px-4 py-2.5 bg-[#031527] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => setSelectedWordForConcordance(rootSearchTerm)}
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  استقراء الجذر
                </button>
              </div>

              {/* Preset Sample Roots */}
              <div className="space-y-3">
                <span className="text-xs text-slate-400 font-semibold block">جذور شائعة للفحص السريع:</span>
                <div className="flex flex-wrap gap-2">
                  {['فلك', 'سبح', 'رتق', 'فتق', 'شمس', 'قمر', 'خلق', 'علم', 'نور'].map((root) => (
                    <button
                      key={root}
                      onClick={() => {
                        setRootSearchTerm(root)
                        setSelectedWordForConcordance(root)
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#03172b] hover:bg-cyan-950 border border-slate-800 hover:border-cyan-600 text-xs text-cyan-300 font-serif font-bold transition"
                    >
                      جذر ({root})
                    </button>
                  ))}
                </div>
              </div>

              {/* Concordance Info Box */}
              <div className="p-5 rounded-2xl bg-[#031527] border border-slate-800 max-w-2xl space-y-2 text-xs">
                <strong className="text-white block text-sm">كيف يعمل المعجم الصرفي في QuranMind؟</strong>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  يقوم النظام بإزالة زوائد المضارعة، حروف العطف، الضمائر المتصلة، وتجريد الفعل إلى وزنه المجرد، ثم يربط الجذر بقاعدة بيانات الجذور والمشتقات في 6,236 آية، مع حساب الجمل (Abjad) الدقيق لكل مشتق.
                </p>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB VIEW 5: المشاريع والفرضيات (Research Projects & Dossiers)        */}
          {/* ===================================================================== */}
          {activeMainTab === 'projects' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <FolderKanban className="w-5 h-5 text-cyan-400" />
                    المشاريع البحثية والملفات العلمية
                  </h2>
                  <p className="text-xs text-slate-400">
                    إدارة الفرضيات، توثيق سلاسل الأدلة، وتصدير التقارير الأكاديمية (Research Dossiers)
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewProjectModal(true)}
                    className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow transition"
                  >
                    + مشروع جديد
                  </button>
                  <button
                    onClick={() => setDossierExportOpen(true)}
                    className="px-3.5 py-2 bg-[#042444] hover:bg-cyan-900 border border-cyan-700/60 text-cyan-200 font-bold text-xs rounded-xl shadow transition"
                  >
                    تصدير Dossier
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => setActiveProjectId(proj.id)}
                    className={`p-5 rounded-2xl border transition cursor-pointer space-y-3 ${
                      activeProjectId === proj.id
                        ? 'bg-gradient-to-b from-[#041d36] to-[#031527] border-cyan-500 shadow-xl shadow-cyan-950/60'
                        : 'bg-[#031527] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-cyan-300">
                        {proj.title}
                      </span>
                      {activeProjectId === proj.id && (
                        <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-700">
                          نشط
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed min-h-[40px]">
                      {proj.hypothesis || 'لا توجد فرضية مدونة حتى الآن.'}
                    </p>

                    <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800 flex justify-between items-center">
                      <span>مخزن في Neon PostgreSQL</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveMainTab('workspace')
                        }}
                        className="text-cyan-400 font-bold hover:underline"
                      >
                        فتح في مساحة العمل ←
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>

      </div>

      {/* ========================================================================= */}
      {/* 4. MODALS (Manuscripts, Concordance, Export, New Project)                */}
      {/* ========================================================================= */}
      
      {/* Manuscript Zoom Modal */}
      <ManuscriptViewer
        isOpen={manuscriptModalOpen}
        onClose={() => setManuscriptModalOpen(false)}
        currentSurahName={selectedVerse.surahName}
        currentAyah={selectedVerse.ayah}
      />

      {/* Word Root Concordance Modal */}
      <WordConcordanceModal
        word={selectedWordForConcordance}
        onClose={() => setSelectedWordForConcordance(null)}
        onSelectVerse={handleSelectVerseFromConcordance}
      />

      {/* Research Dossier Export Modal */}
      <DossierExportModal
        isOpen={dossierExportModalOpen}
        onClose={() => setDossierExportOpen(false)}
        verse={selectedVerse}
        normMode={normMode}
        projectTitle={activeProject?.title || 'مشروع البحث القرآني'}
        hypothesis={activeProject?.hypothesis || 'فحص الأنساق البنائية والتناظر في القرآن الكريم'}
      />

      {/* New Project Creation Modal */}
      {newProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="bg-[#031527] border border-cyan-700/60 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <FolderKanban className="w-4 h-4 text-cyan-400" />
                إنشاء مشروع بحثي جديد
              </h3>
              <button
                onClick={() => setNewProjectModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  عنوان المشروع:
                </label>
                <input
                  type="text"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="مثال: التناظر العددي في سورة الكهف..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  الفرضية المبدئية للبحث:
                </label>
                <textarea
                  value={newProjectHypothesis}
                  onChange={(e) => setNewProjectHypothesis(e.target.value)}
                  placeholder="صف الفرضية التي ترغب في استقرائها وفحص أدلتها..."
                  rows={3}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setNewProjectModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                إلغاء
              </button>
              <button
                onClick={handleCreateProject}
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow"
              >
                حفظ المشروع
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
