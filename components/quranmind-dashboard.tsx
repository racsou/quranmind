'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { UserProfileButton } from './user-profile-button'
import { DashboardTabView } from './dashboard-tab-view'
import {
  SURAHS_META,
  getSurahVerses,
  type QuranVerse,
} from '@/lib/quran/quran-data'
import {
  ArrowLeft,
  Bell,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  FileCode,
  FileText,
  FlaskConical,
  FolderKanban,
  Home,
  LibraryBig,
  LineChart,
  LogOut,
  Menu,
  Moon,
  Network,
  Plus,
  Search,
  Sparkles,
  Star,
  X,
  Maximize2,
  LayoutGrid,
  Columns,
  Play,
  Pause,
  Volume2,
  Copy,
  Check,
  Send,
  Quote,
} from 'lucide-react'

export interface NavItem {
  id: string
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

// User Dashboard Sidebar Navigation - Admin & Settings are separated into their own protected route /admin
export const allNavItems: NavItem[] = [
  { id: 'overview', href: '/dashboard', label: 'الرئيسية', icon: Home },
  { id: 'quran', href: '/dashboard/quran', label: 'القرآن الكريم', icon: BookOpen },
  { id: 'analysis', href: '/dashboard/analysis', label: 'تحليل علمي وتناظر', icon: FlaskConical },
  { id: 'assistant', href: '/dashboard/assistant', label: 'الوكيل الذكي', icon: BrainCircuit },
  { id: 'hadith', href: '/dashboard/hadith', label: 'استوديو الحديث', icon: Network, badge: 'حديث' },
  { id: 'notes', href: '/dashboard/notes', label: 'الملاحظات الدراسية', icon: FileText, badge: '@' },
  { id: 'projects', href: '/dashboard/projects', label: 'المشاريع البحثية', icon: FolderKanban },
  { id: 'library', href: '/dashboard/library', label: 'المكتبة والمخطوطات', icon: LibraryBig },
  { id: 'statistics', href: '/dashboard/statistics', label: 'الإحصائيات', icon: LineChart },
  { id: 'api-docs', href: '/dashboard/api-docs', label: 'توثيق الـ API', icon: FileCode, badge: 'v1' },
]

export function QuranMindDashboard({
  children,
  title = 'مساحة العمل',
  initialTab,
}: {
  children?: React.ReactNode
  title?: string
  initialTab?: string
}) {
  const pathname = usePathname()
  const router = useRouter()

  // Determine initial active tab id from prop or pathname
  const getTabIdFromPath = (path: string): string => {
    if (initialTab) return initialTab
    if (!path || path === '/dashboard') return 'overview'
    const match = path.match(/^\/dashboard\/([^/]+)/)
    return match ? match[1] : 'overview'
  }

  const initialTabId = getTabIdFromPath(pathname)

  // Open tabs list in the dynamic multi-tab strip under navbar
  const [openTabs, setOpenTabs] = useState<NavItem[]>(() => {
    const mainTab = allNavItems.find((n) => n.id === 'overview') || allNavItems[0]
    if (initialTabId && initialTabId !== 'overview') {
      const activeItem = allNavItems.find((n) => n.id === initialTabId)
      if (activeItem) {
        return [mainTab, activeItem]
      }
    }
    return [mainTab]
  })

  const [activeTabId, setActiveTabId] = useState<string>(initialTabId)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [addMenuOpen, setAddMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [agentMessage, setAgentMessage] = useState('')
  const [quranTab, setQuranTab] = useState('الدلالات')
  const [evidenceTab, setEvidenceTab] = useState('الدلالات')
  const [overviewMode, setOverviewMode] = useState<'panes' | 'overview'>('panes')

  // Live Quran Navigator in the Middle Pane
  const [mushafSurah, setMushafSurah] = useState<number>(36) // Default to Surah Ya-Sin
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number>(37) // Ayah 38
  const [mushafPageSize, setMushafPageSize] = useState<number>(3) // Show 3 ayahs per page view
  const [copiedAyahKey, setCopiedAyahKey] = useState<string | null>(null)

  // Audio Playback
  const [playingAyahKey, setPlayingAyahKey] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Attached context verse for the AI Agent
  const [attachedVerse, setAttachedVerse] = useState<QuranVerse | null>(null)

  // History of Agent Conversation
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'agent'; text: string; verseContext?: string }>>([
    {
      sender: 'user',
      text: 'حلل الآيتين: «ربك فكبر» و«وكل في فلك يسبحون» من حيث التناظر، أعداد الحروف، الدلالات العلمية، وأي حقائق تم تأكيدها علمياً.',
    },
    {
      sender: 'agent',
      text: 'بالتأكيد! سأقوم بتحليل الآيتين بشكل شامل من خلال الأدلة المتاحة. يوجد تناظر دقيق في بناء الآيتين على مستوى الحروف والكلمات (7 حروف لكل آية)، وهناك ارتباط دلالي محكم مع حركة الأجرام والطبقات الكونية.',
    },
  ])

  // Get verses for currently selected Surah
  const surahVerses = React.useMemo(() => {
    return getSurahVerses(mushafSurah)
  }, [mushafSurah])

  // Paginated slice of verses for the middle pane
  const displayedVerses = React.useMemo(() => {
    const start = Math.max(0, currentAyahIndex)
    return surahVerses.slice(start, start + mushafPageSize)
  }, [surahVerses, currentAyahIndex, mushafPageSize])

  // Current active Surah metadata
  const currentSurahMeta = React.useMemo(() => {
    return SURAHS_META.find((s) => s.number === mushafSurah) || SURAHS_META[0]
  }, [mushafSurah])

  // Synchronize active tab if prop or URL changes externally
  useEffect(() => {
    const currentId = getTabIdFromPath(pathname)
    if (currentId && currentId !== activeTabId) {
      setActiveTabId(currentId)
      const navItem = allNavItems.find((n) => n.id === currentId)
      if (navItem && !openTabs.some((t) => t.id === currentId)) {
        setOpenTabs((prev) => [...prev, navItem])
      }
    }
  }, [pathname, initialTab])

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Select a tab from the sidebar or tab strip
  const handleSelectTab = (item: NavItem) => {
    if (!openTabs.some((t) => t.id === item.id)) {
      setOpenTabs((prev) => [...prev, item])
    }
    setActiveTabId(item.id)
    window.history.pushState(null, '', item.href)
    setSidebarOpen(false)
  }

  // Close an open tab
  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation()
    if (openTabs.length <= 1) return // Keep at least one tab

    const indexToClose = openTabs.findIndex((t) => t.id === tabId)
    const newTabs = openTabs.filter((t) => t.id !== tabId)
    setOpenTabs(newTabs)

    if (activeTabId === tabId) {
      const nextTab = newTabs[Math.max(0, indexToClose - 1)] || newTabs[0]
      setActiveTabId(nextTab.id)
      window.history.pushState(null, '', nextTab.href)
    }
  }

  // Add specific verse as context into AI Agent chat
  const handleAddVerseToAgentContext = (verse: QuranVerse) => {
    setAttachedVerse(verse)
    setAgentMessage(`حلل الآية الكريمة [سورة ${verse.surahName}: ${verse.ayah}]: «${verse.text}» من حيث الدلالة، التناظر، والروابط العلمية.`)
  }

  // Play / pause recitation of a specific verse
  const handleTogglePlayAyah = (verse: QuranVerse) => {
    const ayahKey = `${verse.surah}:${verse.ayah}`

    if (playingAyahKey === ayahKey) {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      setPlayingAyahKey(null)
      return
    }

    if (audioRef.current) {
      audioRef.current.pause()
    }

    const padSurah = String(verse.surah).padStart(3, '0')
    const padAyah = String(verse.ayah).padStart(3, '0')
    const audioUrl = `https://everyayah.com/data/Alafasy_128kbps/${padSurah}${padAyah}.mp3`

    const newAudio = new Audio(audioUrl)
    audioRef.current = newAudio
    setPlayingAyahKey(ayahKey)

    newAudio.play().catch(() => {
      setPlayingAyahKey(null)
    })

    newAudio.onended = () => {
      setPlayingAyahKey(null)
    }
  }

  // Copy verse text to clipboard
  const handleCopyAyah = (verse: QuranVerse) => {
    const key = `${verse.surah}:${verse.ayah}`
    navigator.clipboard.writeText(`﴿${verse.text}﴾ [سورة ${verse.surahName}: ${verse.ayah}]`)
    setCopiedAyahKey(key)
    setTimeout(() => setCopiedAyahKey(null), 2000)
  }

  // Send message to AI Agent
  const handleSendMessage = () => {
    if (!agentMessage.trim() && !attachedVerse) return

    const query = agentMessage.trim()
    const currentContext = attachedVerse
      ? `[سورة ${attachedVerse.surahName}: ${attachedVerse.ayah}] ﴿${attachedVerse.text}﴾`
      : undefined

    setChatHistory((prev) => [
      ...prev,
      { sender: 'user', text: query || `تحليل الآية المرفقة`, verseContext: currentContext },
      {
        sender: 'agent',
        text: `تم استلام الآية للتحليل العلمي. جاري استخراج الإعجاز البنائي، أوزان الكلمات، والتوافقات الكونية والفيزيائية الموثقة في التفاسير والمراجع الحديثة.`,
      },
    ])

    setAgentMessage('')
  }

  // Unopened tabs for the Quick-Add (+) dropdown
  const unopenedItems = allNavItems.filter((item) => !openTabs.some((t) => t.id === item.id))

  return (
    <div className="exact-dashboard" dir="rtl">
      {/* Mobile Toggle Button */}
      <button
        className="exact-mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="فتح القائمة"
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar - User Tools Only (Admin & Settings are moved to /admin) */}
      <aside className={`exact-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="exact-brand">
          <div className="exact-logo">
            <BrainCircuit />
          </div>
          <div>
            <strong>
              Quran<span>Mind</span>
            </strong>
            <small>القرآن · علم · حقيقة</small>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="exact-nav-list">
          {allNavItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTabId === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item)}
                className={`exact-nav-btn ${isActive ? 'active' : ''}`}
              >
                <Icon />
                <span className="flex-1 text-right">{item.label}</span>
                {item.badge && (
                  <span
                    className={`exact-nav-badge ${
                      item.badge === 'حديث' ? 'badge-hadith' : ''
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Research Projects */}
        <div className="exact-projects">
          <div className="exact-project-title">
            المشاريع الحالية <ChevronDown />
          </div>
          {[
            'معجزة التناظر في القرآن',
            'الحقائق العلمية في القرآن',
            'العدد والأرقام في القرآن',
            'دلالات الحروف والكلمات',
            'الكون والذرة',
          ].map((item, i) => (
            <button
              key={item}
              type="button"
              className="exact-project-item"
              onClick={() => {
                const projectItem = allNavItems.find((n) => n.id === 'projects')
                if (projectItem) handleSelectTab(projectItem)
              }}
            >
              <i className={`project-dot dot-${i}`} />
              <span>{item}</span>
              <b>•</b>
            </button>
          ))}
          <button
            type="button"
            className="exact-new-project"
            onClick={() => {
              const projectItem = allNavItems.find((n) => n.id === 'projects')
              if (projectItem) handleSelectTab(projectItem)
            }}
          >
            مشروع جديد
          </button>
        </div>

        {/* Ayah Quote */}
        <div className="exact-quote">
          {`{ سَنُرِيهِمْ آيَاتِنَا فِي الْآفَاقِ وَفِي أَنفُسِهِمْ حَتَّى يَتَبَيَّنَ لَهُمْ أَنَّهُ الْحَقُّ }`}
          <small>فصلت: 53</small>
        </div>

        {/* Footer Info */}
        <div className="exact-sidebar-footer">
          <span>
            <i /> النظام متصل
          </span>
          <small>v2.4 — 2026</small>
        </div>
      </aside>

      {/* Main Column (Topbar + Tab Navigator Strip + Content Area) */}
      <div className="exact-right-pane">
        {/* Topbar */}
        <header className="exact-topbar">
          <div className="exact-search">
            <Search />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="إبحث في الآيات، الكلمات، التحليلات، أو الأحاديث والمصطلح..."
            />
            <ChevronDown />
          </div>

          <div className="exact-top-actions">
            <button
              type="button"
              title="تنبيهات النظام"
              className="text-slate-300 hover:text-cyan-300 p-1"
            >
              <Bell />
            </button>
            <span className="top-divider" />
            <UserProfileButton />
          </div>
        </header>

        {/* Dynamic Multi-Tab Navigator Strip Under Navbar */}
        <div className="exact-tab-strip">
          <div className="exact-tab-scroll">
            {openTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTabId === tab.id
              return (
                <div
                  key={tab.id}
                  onClick={() => {
                    setActiveTabId(tab.id)
                    window.history.pushState(null, '', tab.href)
                  }}
                  className={`exact-tab-item ${isActive ? 'is-active' : ''}`}
                >
                  <Icon className="tab-icon" />
                  <span className="tab-label">{tab.label}</span>
                  {tab.badge && <span className="tab-badge">{tab.badge}</span>}

                  {openTabs.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => handleCloseTab(e, tab.id)}
                      className="tab-close-btn"
                      title="إغلاق التبويب"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )
            })}

            {/* Quick Add Tab Button */}
            {unopenedItems.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAddMenuOpen(!addMenuOpen)}
                  className="exact-tab-add-btn"
                  title="فتح تبويب جديد"
                >
                  <Plus className="w-4 h-4" />
                </button>

                {addMenuOpen && (
                  <div className="exact-add-dropdown">
                    <div className="add-dropdown-title">فتح أداة في تبويب جديد:</div>
                    {unopenedItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            handleSelectTab(item)
                            setAddMenuOpen(false)
                          }}
                          className="add-dropdown-item"
                        >
                          <Icon className="w-4 h-4 text-cyan-400" />
                          <span>{item.label}</span>
                          {item.badge && <span className="tab-badge mr-auto">{item.badge}</span>}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right End Tool Controls */}
          {activeTabId === 'overview' && (
            <div className="tab-strip-actions">
              <button
                type="button"
                onClick={() => setOverviewMode(overviewMode === 'panes' ? 'overview' : 'panes')}
                className={`tab-strip-toggle-btn ${overviewMode === 'panes' ? 'is-active' : ''}`}
                title={
                  overviewMode === 'panes'
                    ? 'التبديل إلى بطاقات الإحصائيات'
                    : 'التبديل إلى الأعمدة الثلاثة'
                }
              >
                {overviewMode === 'panes' ? (
                  <>
                    <Columns className="w-3.5 h-3.5" />
                    <span>التحليل الثلاثي</span>
                  </>
                ) : (
                  <>
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>ملخص الأنشطة</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Content Viewport */}
        <div className="exact-content-viewport">
          {activeTabId === 'overview' ? (
            overviewMode === 'panes' ? (
              /* Three-Pane Scientific Analysis Workspace */
              <main className="exact-main">
                {/* 1. AI Agent Pane with Attached Verse Context */}
                <section className="exact-agent">
                  <header>
                    <div className="agent-heading">
                      <div className="agent-icon">
                        <BrainCircuit />
                      </div>
                      <h1>
                        الوكيل الذكي <em>AI Agent</em>
                      </h1>
                    </div>
                    <span className="agent-online">
                      <i /> متصل
                    </span>
                  </header>

                  <div className="agent-messages">
                    {/* Active Context Verse Notification Banner */}
                    {attachedVerse && (
                      <div className="agent-active-verse-context">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="context-label">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                            <span>سياق الآية النشط للبحث:</span>
                          </span>
                          <button
                            onClick={() => setAttachedVerse(null)}
                            className="context-close"
                            title="إزالة السياق"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="context-verse-quote">
                          <strong>سورة {attachedVerse.surahName} (الآية {attachedVerse.ayah}):</strong>
                          <p className="font-serif">﴿{attachedVerse.text}﴾</p>
                        </div>
                      </div>
                    )}

                    {chatHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className={item.sender === 'user' ? 'agent-user-bubble' : 'agent-answer'}
                      >
                        {item.sender === 'user' ? (
                          <>
                            {item.verseContext && (
                              <div className="text-[9px] text-cyan-300 font-semibold mb-1 opacity-90 border-b border-cyan-800/60 pb-1">
                                📎 {item.verseContext}
                              </div>
                            )}
                            {item.text}
                            <small>15:42</small>
                          </>
                        ) : (
                          <>
                            <BrainCircuit />
                            <div>
                              <p>{item.text}</p>
                              {idx === 1 && (
                                <div className="agent-summary">
                                  <strong>
                                    <CheckCircle2 /> ملخص التحليل
                                  </strong>
                                  <ul>
                                    <li>يوجد تناظر دقيق في بناء الآيتين على مستوى الحروف والكلمات.</li>
                                    <li>عدد الحروف في كل آية = 7 حروف.</li>
                                    <li>هناك ارتباط بين هذا الرقم والبنية الكونية (7 طبقات الذرة).</li>
                                    <li>توجد دلائل علمية مؤكدة في بعض الجوانب.</li>
                                  </ul>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="exact-composer">
                    {attachedVerse && (
                      <div className="composer-attached-pill">
                        <Quote className="w-3 h-3 text-cyan-400" />
                        <span>مرفق: سورة {attachedVerse.surahName} ({attachedVerse.ayah})</span>
                        <button type="button" onClick={() => setAttachedVerse(null)}>
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}

                    <textarea
                      value={agentMessage}
                      onChange={(e) => setAgentMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      placeholder="اكتب سؤالك هنا للوكيل الذكي، أو أضف آية من المصحف..."
                    />
                    <button type="button" onClick={handleSendMessage} title="إرسال">
                      ➤
                    </button>
                    <small>GPT-4o / Claude 3.5　⌄</small>
                    <div className="composer-suggestions">
                      <button onClick={() => setAgentMessage('ما هو الإعجاز العددي في الآية المرفقة؟')}>
                        ما هو الإعجاز العددي؟
                      </button>
                      <button onClick={() => setAgentMessage('ابحث عن الدلائل العلمية للآية المرفقة')}>
                        إبحث عن علمية
                      </button>
                      <button onClick={() => setAgentMessage('حلل التناظر الحرفي للآية المرفقة')}>
                        إبحث عن تناظر
                      </button>
                    </div>
                  </div>
                </section>

                {/* 2. Interactive Quran Reader with Verse Navigation and Hover Actions */}
                <section className="exact-quran">
                  <header>
                    <div className="flex items-center gap-2">
                      <BookOpen className="text-cyan-400 w-5 h-5" />
                      <span className="font-bold text-sm text-white">القرآن الكريم (تصفح وتلاوة)</span>
                    </div>

                    {/* Surah Selector Dropdown */}
                    <div className="quran-toolbar">
                      <select
                        value={mushafSurah}
                        onChange={(e) => {
                          setMushafSurah(Number(e.target.value))
                          setCurrentAyahIndex(0)
                        }}
                        className="surah-select-box"
                      >
                        {SURAHS_META.map((s) => (
                          <option key={s.number} value={s.number}>
                            {s.number}. {s.name} ({s.revelationType === 'Meccan' ? 'مكية' : 'مدنية'})
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          const quranItem = allNavItems.find((n) => n.id === 'quran')
                          if (quranItem) handleSelectTab(quranItem)
                        }}
                        className="quran-full-view-btn"
                        title="فتح المصحف كاملاً في تبويب مستقل"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>عرض كامل</span>
                      </button>
                    </div>
                  </header>

                  {/* Real Interactive Quran Verses Container (Replaces Static Image) */}
                  <div className="mushaf-live-container">
                    {/* Surah Header Banner */}
                    <div className="surah-header-banner">
                      <div className="surah-title">
                        <span>سورة {currentSurahMeta.name}</span>
                        <small>
                          {currentSurahMeta.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} · {currentSurahMeta.numberOfAyahs} آية
                        </small>
                      </div>

                      {mushafSurah !== 9 && mushafSurah !== 1 && (
                        <div className="bismillah-line font-serif">
                          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                        </div>
                      )}
                    </div>

                    {/* Verses List with Hover Action Toolbar */}
                    <div className="mushaf-verses-scroll">
                      {displayedVerses.map((verse) => {
                        const isPlaying = playingAyahKey === `${verse.surah}:${verse.ayah}`
                        const isContextAttached = attachedVerse?.id === verse.id
                        const isCopied = copiedAyahKey === `${verse.surah}:${verse.ayah}`

                        return (
                          <div
                            key={verse.id}
                            className={`mushaf-verse-card group ${
                              isContextAttached ? 'is-attached-context' : ''
                            } ${isPlaying ? 'is-playing' : ''}`}
                          >
                            {/* Verse Text with Ayah Marker */}
                            <div className="verse-text-line font-serif">
                              <span>{verse.text}</span>
                              <span className="ayah-number-badge">﴿{verse.ayah}﴾</span>
                            </div>

                            {/* Verse Bottom Action Bar (Appears cleanly on hover or focus) */}
                            <div className="verse-action-bar">
                              {/* 1. Add Verse to Chat Agent as Context */}
                              <button
                                type="button"
                                onClick={() => handleAddVerseToAgentContext(verse)}
                                className={`verse-btn-add-agent ${
                                  isContextAttached ? 'btn-active' : ''
                                }`}
                                title="إضافة هذه الآية إلى سياق الوكيل الذكي للتحليل"
                              >
                                <Sparkles className="w-3 h-3 text-cyan-300" />
                                <span>
                                  {isContextAttached ? 'الآية في السياق ✓' : 'إضافة للوكيل الذكي'}
                                </span>
                              </button>

                              {/* 2. Play Audio Recitation */}
                              <button
                                type="button"
                                onClick={() => handleTogglePlayAyah(verse)}
                                className={`verse-btn-audio ${isPlaying ? 'btn-playing' : ''}`}
                                title={isPlaying ? 'إيقاف التلاوة' : 'استماع للتلاوة (مشاري العفاسي)'}
                              >
                                {isPlaying ? (
                                  <>
                                    <Pause className="w-3 h-3" />
                                    <span>إيقاف</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-3 h-3" />
                                    <span>استماع</span>
                                  </>
                                )}
                              </button>

                              {/* 3. Copy Verse */}
                              <button
                                type="button"
                                onClick={() => handleCopyAyah(verse)}
                                className="verse-btn-copy"
                                title="نسخ الآية الكريمة"
                              >
                                {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Pagination Controls */}
                    <div className="mushaf-nav-footer">
                      <button
                        type="button"
                        disabled={currentAyahIndex <= 0}
                        onClick={() => setCurrentAyahIndex((prev) => Math.max(0, prev - mushafPageSize))}
                        className="mushaf-nav-btn"
                      >
                        ‹ الآيات السابقة
                      </button>

                      <span className="mushaf-nav-page-info">
                        الآيات {currentAyahIndex + 1} - {Math.min(currentAyahIndex + mushafPageSize, currentSurahMeta.numberOfAyahs)} من {currentSurahMeta.numberOfAyahs}
                      </span>

                      <button
                        type="button"
                        disabled={currentAyahIndex + mushafPageSize >= currentSurahMeta.numberOfAyahs}
                        onClick={() => setCurrentAyahIndex((prev) => prev + mushafPageSize)}
                        className="mushaf-nav-btn"
                      >
                        الآيات التالية ›
                      </button>
                    </div>
                  </div>

                  <div className="quran-tabs">
                    {['المخططات والبيانات', 'الأدلة والمراجع', 'المصادر العلمية'].map((item) => (
                      <button
                        key={item}
                        className={quranTab === item ? 'selected' : ''}
                        onClick={() => setQuranTab(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <div className="numeric-title">إحصائيات رقمية وتناظرية</div>
                  <div className="numeric-grid">
                    <div>
                      <span>عدد الحروف (الآيتان)</span>
                      <strong>14</strong>
                      <small>7 + 7</small>
                    </div>
                    <div>
                      <span>عدد الكلمات (الآيتان)</span>
                      <strong>5</strong>
                      <small>3 + 2</small>
                    </div>
                    <div>
                      <span>نسبة التناظر</span>
                      <strong>100%</strong>
                      <small>دقيق</small>
                    </div>
                  </div>

                  <div className="letter-panel">
                    <h3>توزيع الحروف في الآيتين</h3>
                    <div>
                      <div className="letter-line">
                        <b>ربك فكبر</b>
                        {['ر', 'ب', 'ك', 'ف', 'ك', 'ب', 'ر'].map((x, i) => (
                          <i key={i}>{x}</i>
                        ))}
                      </div>
                      <div className="letter-line">
                        <b>كل في فلك</b>
                        {['ك', 'ل', 'ف', 'ي', 'ف', 'ل', 'ك'].map((x, i) => (
                          <i key={i}>{x}</i>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="notice">
                    <Sparkles />
                    <span>
                      <strong>ملاحظة منهجية</strong>
                      <br />
                      هذه النتائج تعتمد على الأدلة العلمية واللغوية المتاحة حالياً، وتخضع للمراجعة
                      الأكاديمية المستمرة.
                    </span>
                  </div>
                </section>

                {/* 3. Evidence & Scientific Links Pane */}
                <section className="exact-evidence">
                  <header>
                    <h2>الأدلة والتحليلات المقارنة</h2>
                    <FileText />
                  </header>

                  <div className="evidence-tabs">
                    {['الدلالات', 'الحقائق العلمية', 'الأعداد والحروف', 'التناظر'].map((item) => (
                      <button
                        key={item}
                        className={evidenceTab === item ? 'selected' : ''}
                        onClick={() => setEvidenceTab(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <EvidenceCard
                    title="الآية الأولى: وكل في فلك يسبحون"
                    tag="سورة يس - الآية 40"
                    tone="green"
                  />
                  <EvidenceCard
                    title="الآية الثانية: وربك فكبر"
                    tag="سورة المدثر - الآية 3"
                    tone="cyan"
                  />

                  <h3 className="science-title">
                    <Sparkles /> الدلائل العلمية والكونية
                  </h3>

                  {[
                    'دوران الكواكب والنجوم',
                    'التماثل في الكون',
                    'الرقم 7 وبنية الذرة',
                    'دوران الأرض والتعاقب',
                  ].map((item, i) => (
                    <div className="science-item" key={item}>
                      <span className={`science-icon s-${i}`}>
                        <Network />
                      </span>
                      <div>
                        <strong>{item}</strong>
                        <small>
                          {i === 0
                            ? 'يتوافق مع الاكتشافات الفلكية الحديثة حول مسارات الأجرام.'
                            : 'نموذج بحثي موثق بانتظار استكمال دراسات المخطوطات.'}
                        </small>
                      </div>
                      <em>{i === 1 ? 'مقترح بحثياً' : 'مدعوم علمياً'}</em>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      const libraryItem = allNavItems.find((n) => n.id === 'library')
                      if (libraryItem) handleSelectTab(libraryItem)
                    }}
                    className="all-evidence"
                  >
                    <span>عرض جميع الأدلة والمصادر في المكتبة</span>
                    <ArrowLeft />
                  </button>
                </section>
              </main>
            ) : (
              /* Activity & Projects Grid View */
              <div className="exact-overview-cards-view">
                {children ? (
                  children
                ) : (
                  <div className="p-6 text-center text-slate-400">
                    لا توجد بيانات إضافية لعرضها.
                  </div>
                )}
              </div>
            )
          ) : (
            /* Subpage / Specific Tool Tab View (e.g. Full Quran, Analysis, Hadith, Notes, etc.) */
            <div className="exact-tab-view-wrapper">
              <DashboardTabView tab={activeTabId} />
            </div>
          )}
        </div>
      </div>

      <style jsx global>{styles}</style>
    </div>
  )
}

function EvidenceCard({ title, tag, tone }: { title: string; tag: string; tone: string }) {
  return (
    <article className="evidence-card">
      <div className="evidence-card-title">
        <span className={`evidence-tag ${tone}`}>{tag}</span>
        <strong>{title}</strong>
      </div>
      <div className="evidence-method">
        <span>
          <CheckCircle2 /> التحليل اللغوي والعددي
        </span>
        <div>
          <b>7</b>
          <small>عدد الحروف</small>
          <b>3</b>
          <small>عدد الكلمات</small>
        </div>
        <p>تناظر بنيوي تام</p>
      </div>
      <div className="evidence-letters">
        {['ك', 'ل', 'ف', 'ي', 'س', 'ب', 'ح', 'و', 'ن'].map((x, i) => (
          <i key={i}>{x}</i>
        ))}
      </div>
    </article>
  )
}

export const dashboardTabs = allNavItems
export const dashboardMock = { stats: [], recent: [] }

const styles = `
.exact-dashboard {
  height: 100vh;
  overflow: hidden;
  background: #020e1d;
  color: #e5f3fc;
  font-family: var(--font-cairo), Tahoma, Arial, sans-serif;
  display: grid;
  grid-template-columns: 260px 1fr;
}

.exact-sidebar {
  background: #031426;
  border-left: 1px solid #143958;
  display: flex;
  flex-direction: column;
  padding: 14px 10px 9px;
  gap: 12px;
  z-index: 20;
  height: 100vh;
  overflow-y: auto;
}

.exact-brand {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 0 7px 12px;
  border-bottom: 1px solid #12304e;
  flex-shrink: 0;
}

.exact-logo {
  width: 43px;
  height: 43px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #0ed0f5;
  border: 1px solid #087a9e;
  background: #062947;
}

.exact-logo svg {
  width: 28px;
  height: 28px;
}

.exact-brand strong {
  font-size: 20px;
}

.exact-brand strong span {
  color: #0bc2f0;
}

.exact-brand small {
  display: block;
  color: #789ab5;
  font-size: 10px;
}

.exact-nav-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-shrink: 0;
}

.exact-nav-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  color: #abc1d4;
  text-decoration: none;
  font-size: 12px;
  padding: 8px 10px;
  border-radius: 8px;
  background: transparent;
  border: 0;
  cursor: pointer;
  text-align: right;
  transition: all 0.15s ease;
}

.exact-nav-btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.exact-nav-btn:hover {
  color: #11d0fa;
  background: rgba(6, 45, 78, 0.6);
}

.exact-nav-btn.active {
  color: #11d0fa;
  background: linear-gradient(90deg, #062d4e, #07365e);
  border-right: 3px solid #0bd3fb;
}

.exact-nav-badge {
  font-size: 9px;
  padding: 1px 6px;
  border-radius: 10px;
  background: #084063;
  color: #62d6f5;
  font-weight: 600;
}

.exact-nav-badge.badge-hadith {
  background: #064e3b;
  color: #34d399;
}

.exact-projects {
  border-top: 1px solid #12304e;
  padding-top: 8px;
  flex-shrink: 0;
}

.exact-project-title {
  font-size: 11px;
  padding: 4px 8px;
  color: #9abfd7;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.exact-project-title svg {
  width: 13px;
  height: 13px;
}

.exact-project-item {
  display: flex;
  gap: 7px;
  align-items: center;
  width: 100%;
  color: #b8cede;
  background: transparent;
  border: 0;
  font-size: 10.5px;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  text-align: right;
  transition: background 0.15s ease;
}

.exact-project-item:hover {
  background: rgba(6, 45, 78, 0.4);
}

.exact-project-item b {
  margin-right: auto;
  color: #14a6d7;
}

.project-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #13c99f;
  flex-shrink: 0;
}

.dot-1 { background: #5945dc; }
.dot-2 { background: #9d5bd9; }
.dot-3 { background: #0dc68e; }
.dot-4 { background: #3d87da; }

.exact-new-project {
  display: block;
  width: 100%;
  text-align: center;
  padding: 6px;
  font-size: 11px;
  color: #5ed6f5;
  background: transparent;
  border: 1px solid #12608e;
  border-radius: 16px;
  margin-top: 7px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.exact-new-project:hover {
  background: #09375b;
}

.exact-quote {
  margin-top: auto;
  border: 1px solid #185077;
  border-radius: 8px;
  padding: 10px;
  color: #c7e9fb;
  font-size: 10px;
  line-height: 1.8;
  background: #06223b;
  flex-shrink: 0;
}

.exact-quote small {
  display: block;
  color: #6e9bb8;
  margin-top: 4px;
}

.exact-sidebar-footer {
  border-top: 1px solid #12304e;
  padding-top: 8px;
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  color: #6f96ad;
  flex-shrink: 0;
}

.exact-sidebar-footer span {
  color: #7edab5;
}

.exact-sidebar-footer i {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2be1a0;
  margin-left: 4px;
}

/* Right Pane Layout */
.exact-right-pane {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  min-width: 0;
}

.exact-topbar {
  height: 60px;
  border-bottom: 1px solid #12304e;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #031426;
  flex-shrink: 0;
}

.exact-search {
  width: min(640px, 60%);
  height: 36px;
  background: #0b2948;
  border: 1px solid #17466c;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 10px;
  color: #8eb0c8;
}

.exact-search svg {
  width: 15px;
  height: 15px;
}

.exact-search input {
  background: transparent;
  border: 0;
  outline: 0;
  color: #dbeef8;
  font-family: inherit;
  font-size: 11px;
  flex: 1;
}

.exact-search input::placeholder {
  color: #8ba8c0;
}

.exact-top-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #d6e9f4;
}

.exact-top-actions svg {
  width: 17px;
  height: 17px;
}

.top-divider {
  height: 20px;
  width: 1px;
  background: #21425b;
}

/* Dynamic Multi-Tab Navigator Strip Under Navbar */
.exact-tab-strip {
  height: 42px;
  background: #021020;
  border-bottom: 1px solid #103454;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  flex-shrink: 0;
  gap: 10px;
}

.exact-tab-scroll {
  display: flex;
  align-items: center;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
  flex: 1;
}

.exact-tab-scroll::-webkit-scrollbar {
  display: none;
}

.exact-tab-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #051a2e;
  border: 1px solid #133959;
  border-radius: 6px 6px 0 0;
  color: #8ab1cc;
  font-size: 11px;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition: all 0.15s ease;
}

.exact-tab-item:hover {
  color: #d0e7f7;
  background: #08243e;
}

.exact-tab-item.is-active {
  background: #072f52;
  border-color: #00d4ff;
  border-bottom-color: transparent;
  color: #00e1ff;
  font-weight: 600;
  box-shadow: inset 0 2px 0 0 #00d4ff;
}

.tab-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.tab-label {
  font-size: 11px;
}

.tab-badge {
  font-size: 9px;
  padding: 1px 5px;
  border-radius: 8px;
  background: #0b456d;
  color: #7ce8ff;
}

.tab-close-btn {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: transparent;
  border: 0;
  color: #799eb8;
  cursor: pointer;
  margin-right: 4px;
  transition: all 0.15s ease;
}

.tab-close-btn:hover {
  background: rgba(239, 68, 68, 0.25);
  color: #f87171;
}

.exact-tab-add-btn {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  display: grid;
  place-items: center;
  background: #06223b;
  border: 1px solid #144066;
  color: #84abc6;
  cursor: pointer;
  transition: all 0.15s ease;
}

.exact-tab-add-btn:hover {
  background: #0a365c;
  color: #00e1ff;
}

.exact-add-dropdown {
  position: absolute;
  top: 32px;
  right: 0;
  width: 220px;
  background: #03172b;
  border: 1px solid #13456e;
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.7);
  padding: 6px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.add-dropdown-title {
  font-size: 10px;
  color: #769cb6;
  padding: 4px 8px;
  border-bottom: 1px solid #0d3251;
  margin-bottom: 4px;
}

.add-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 6px;
  background: transparent;
  border: 0;
  color: #bed6e6;
  font-size: 11px;
  cursor: pointer;
  text-align: right;
  transition: background 0.15s ease;
}

.add-dropdown-item:hover {
  background: #082d4f;
  color: #00e1ff;
}

.tab-strip-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-strip-toggle-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  background: #052037;
  border: 1px solid #114266;
  color: #8db5ce;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tab-strip-toggle-btn:hover,
.tab-strip-toggle-btn.is-active {
  background: #083459;
  border-color: #00d4ff;
  color: #00e1ff;
}

/* Content Viewport */
.exact-content-viewport {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.exact-tab-view-wrapper {
  height: 100%;
  overflow-y: auto;
  padding: 16px;
}

.exact-overview-cards-view {
  height: 100%;
  overflow-y: auto;
  padding: 20px;
}

/* 3-Pane Analysis Workspace */
.exact-main {
  height: 100%;
  display: flex;
  flex-direction: row;
  min-width: 0;
  direction: rtl;
  gap: 10px;
  padding: 10px;
  overflow: hidden;
}

.exact-agent,
.exact-quran,
.exact-evidence {
  border: 1px solid #133e60;
  border-radius: 10px;
  background: #03172a;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.exact-agent {
  flex: 1.05;
  min-width: 0;
}

.exact-quran {
  flex: 1.45;
  background: #04192c;
  min-width: 0;
  overflow-y: auto;
}

.exact-evidence {
  flex: 0.95;
  background: #031629;
  padding-bottom: 9px;
  min-width: 0;
  overflow-y: auto;
}

.exact-agent > header,
.exact-quran > header,
.exact-evidence > header {
  height: 52px;
  flex: none;
  border-bottom: 1px solid #143c5c;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.agent-heading {
  display: flex;
  align-items: center;
  gap: 9px;
}

.agent-icon {
  width: 34px;
  height: 34px;
  background: #073860;
  border-radius: 8px;
  display: grid;
  place-items: center;
  color: #0bd0f5;
}

.agent-icon svg {
  width: 20px;
  height: 20px;
}

.agent-heading h1 {
  font-size: 15px;
  margin: 0;
}

.agent-heading em {
  font-style: normal;
  font-size: 9px;
  background: #075477;
  color: #16c9ed;
  border-radius: 4px;
  padding: 3px 6px;
  margin-right: 6px;
}

.agent-online {
  font-size: 10px;
  color: #46d598;
}

.agent-online i {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #48dc96;
  margin-left: 4px;
}

.agent-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px 10px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.agent-active-verse-context {
  background: #042542;
  border: 1px solid #00d4ff;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 10px;
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.15);
}

.context-label {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #67e8f9;
  font-weight: 600;
}

.context-close {
  background: transparent;
  border: 0;
  color: #94a3b8;
  cursor: pointer;
  padding: 2px;
}

.context-close:hover {
  color: #f87171;
}

.context-verse-quote strong {
  display: block;
  color: #38bdf8;
  font-size: 9.5px;
  margin-bottom: 2px;
}

.context-verse-quote p {
  color: #e0f2fe;
  font-size: 12px;
  line-height: 1.8;
  margin: 0;
}

.composer-attached-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #083457;
  border: 1px solid #135588;
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 9px;
  color: #7dd3fc;
  margin-bottom: 6px;
  width: fit-content;
}

.composer-attached-pill button {
  background: transparent;
  border: 0;
  color: #94a3b8;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.composer-attached-pill button:hover {
  color: #f87171;
}

.agent-user-bubble {
  width: 85%;
  align-self: flex-start;
  background: #083d70;
  border: 1px solid #116ba8;
  border-radius: 12px 12px 2px 12px;
  padding: 10px;
  color: #d5ebf6;
  font-size: 11px;
  line-height: 1.8;
  position: relative;
}

.agent-user-bubble small {
  display: block;
  text-align: left;
  color: #72a4c5;
  font-size: 8px;
  margin-top: 4px;
}

.agent-answer {
  display: flex;
  gap: 9px;
  font-size: 11px;
  line-height: 1.7;
  color: #d6e8f2;
}

.agent-answer > svg {
  color: #06c6f1;
  width: 24px;
  min-width: 24px;
  margin-top: 2px;
}

.agent-answer p {
  margin: 0 0 6px;
}

.agent-summary {
  border: 1px solid #145681;
  background: #052440;
  border-radius: 8px;
  padding: 8px 10px;
  margin-top: 6px;
}

.agent-summary strong {
  color: #5fd38f;
  display: flex;
  gap: 5px;
  align-items: center;
  font-size: 11px;
}

.agent-summary strong svg {
  width: 15px;
  height: 15px;
}

.agent-summary ul {
  padding: 0 15px 0 0;
  margin: 5px 0;
  color: #bbd4e3;
  font-size: 10px;
}

.agent-summary li {
  margin: 3px 0;
}

.exact-composer {
  margin: 8px;
  border: 1px solid #174b70;
  border-radius: 8px;
  padding: 8px;
  background: #03172b;
  flex: none;
}

.exact-composer textarea {
  height: 42px;
  width: calc(100% - 35px);
  background: transparent;
  border: 0;
  outline: 0;
  color: white;
  font-family: inherit;
  resize: none;
  font-size: 10.5px;
}

.exact-composer > button {
  float: left;
  border: 0;
  border-radius: 50%;
  background: #057ec6;
  color: #fff;
  width: 26px;
  height: 26px;
  cursor: pointer;
}

.exact-composer small {
  display: block;
  color: #608da8;
  font-size: 8px;
}

.composer-suggestions {
  display: flex;
  gap: 4px;
  margin-top: 6px;
  flex-direction: row-reverse;
}

.composer-suggestions button {
  border: 1px solid #154a70;
  background: #05213a;
  color: #86b0c9;
  border-radius: 5px;
  padding: 4px 6px;
  font-family: inherit;
  font-size: 8px;
  white-space: nowrap;
  cursor: pointer;
}

/* Quran Middle Pane Styles */
.surah-select-box {
  background: #06233f;
  border: 1px solid #124c75;
  color: #cbe6f7;
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 6px;
  outline: none;
  font-family: inherit;
}

.quran-full-view-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #062644;
  border: 1px solid #144f7a;
  color: #64d9ef;
  font-size: 9.5px;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.quran-full-view-btn:hover {
  background: #0a3a66;
  border-color: #00d4ff;
}

/* Mushaf Live Interactive Viewer */
.mushaf-live-container {
  margin: 8px 10px;
  border: 1px solid #144268;
  border-radius: 9px;
  background: #031a2f;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.surah-header-banner {
  background: #052440;
  border-bottom: 1px solid #134368;
  padding: 8px 12px;
  text-align: center;
}

.surah-title span {
  font-size: 13px;
  font-weight: bold;
  color: #62dcf5;
}

.surah-title small {
  display: block;
  font-size: 9px;
  color: #89b3ce;
  margin-top: 1px;
}

.bismillah-line {
  color: #d1ecfa;
  font-size: 14px;
  margin-top: 4px;
  letter-spacing: 0.5px;
}

.mushaf-verses-scroll {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 240px;
  overflow-y: auto;
}

.mushaf-verse-card {
  background: #041f38;
  border: 1px solid #114168;
  border-radius: 8px;
  padding: 10px 12px;
  transition: all 0.2s ease;
  position: relative;
}

.mushaf-verse-card:hover {
  border-color: #00d4ff;
  background: #062847;
  box-shadow: 0 4px 12px rgba(0, 212, 255, 0.1);
}

.mushaf-verse-card.is-attached-context {
  border-color: #00e1ff;
  background: #073155;
  box-shadow: inset 0 0 0 1px #00e1ff;
}

.mushaf-verse-card.is-playing {
  border-color: #22c55e;
  background: #052e3b;
}

.verse-text-line {
  font-size: 15px;
  line-height: 2;
  color: #f1f8fc;
  text-align: right;
  margin-bottom: 8px;
}

.ayah-number-badge {
  color: #00d4ff;
  font-size: 13px;
  margin-right: 6px;
  font-family: inherit;
}

.verse-action-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: 6px;
  border-top: 1px solid #10395c;
}

.verse-btn-add-agent {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #063152;
  border: 1px solid #11578a;
  border-radius: 6px;
  padding: 4px 8px;
  color: #72dbf7;
  font-size: 9.5px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.verse-btn-add-agent:hover {
  background: #084370;
  border-color: #00d4ff;
  color: #ffffff;
}

.verse-btn-add-agent.btn-active {
  background: #084877;
  border-color: #00e1ff;
  color: #00e1ff;
  font-weight: bold;
}

.verse-btn-audio {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #052640;
  border: 1px solid #114269;
  border-radius: 6px;
  padding: 4px 8px;
  color: #9ec1d8;
  font-size: 9.5px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.verse-btn-audio:hover {
  color: #ffffff;
  background: #09375b;
}

.verse-btn-audio.btn-playing {
  background: #064e3b;
  border-color: #10b981;
  color: #34d399;
}

.verse-btn-copy {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #052640;
  border: 1px solid #114269;
  border-radius: 6px;
  color: #9ec1d8;
  cursor: pointer;
  margin-right: auto;
  transition: all 0.15s ease;
}

.verse-btn-copy:hover {
  color: #ffffff;
  background: #09375b;
}

.mushaf-nav-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: #04192b;
  border-top: 1px solid #103656;
}

.mushaf-nav-btn {
  background: #072e4f;
  border: 1px solid #124b78;
  border-radius: 6px;
  padding: 3px 8px;
  color: #84d8f0;
  font-size: 9px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.mushaf-nav-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.mushaf-nav-page-info {
  font-size: 9px;
  color: #79a6c4;
}

.quran-tabs {
  display: flex;
  border-bottom: 1px solid #123c5d;
  padding: 0 8px;
  flex-shrink: 0;
}

.quran-tabs button {
  flex: 1;
  background: transparent;
  border: 0;
  color: #638fab;
  font-family: inherit;
  font-size: 10px;
  padding: 8px 3px;
  cursor: pointer;
}

.quran-tabs button.selected {
  color: #12cdf2;
  border-bottom: 2px solid #0ac2ed;
}

.numeric-title {
  color: #84d4ec;
  font-size: 11px;
  text-align: right;
  padding: 8px 12px 4px;
  flex-shrink: 0;
}

.numeric-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  padding: 0 12px;
  flex-shrink: 0;
}

.numeric-grid > div {
  text-align: center;
  border: 1px solid #103f60;
  border-radius: 6px;
  padding: 6px;
  background: #041c31;
}

.numeric-grid span,
.numeric-grid small {
  display: block;
  font-size: 8.5px;
  color: #9ab7ca;
}

.numeric-grid strong {
  display: block;
  font-size: 18px;
  margin: 2px;
  color: #f2f8ff;
}

.letter-panel {
  margin: 8px 12px;
  border: 1px solid #123f60;
  border-radius: 7px;
  padding: 8px;
  flex-shrink: 0;
}

.letter-panel h3 {
  font-size: 10px;
  text-align: center;
  margin: 0 0 6px;
}

.letter-line {
  display: flex;
  gap: 4px;
  align-items: center;
  margin: 4px 0;
  direction: rtl;
}

.letter-line b {
  font-size: 8.5px;
  color: #64d9ef;
  width: 70px;
}

.letter-line i,
.evidence-letters i {
  font-style: normal;
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #095b75;
  color: #d5f5fc;
  font-size: 9.5px;
}

.letter-line i:nth-child(3n) {
  background: #774c5a;
}

.notice {
  margin: 8px 12px 10px;
  border: 1px solid #08709c;
  border-radius: 7px;
  padding: 8px;
  display: flex;
  gap: 7px;
  color: #a7d6e6;
  font-size: 8.5px;
  line-height: 1.5;
  flex-shrink: 0;
}

.notice svg {
  color: #ffd544;
  min-width: 18px;
  width: 18px;
  height: 18px;
}

.notice strong {
  color: #ffd544;
}

.exact-evidence > header h2 {
  font-size: 14px;
  margin: 0;
}

.exact-evidence > header svg {
  color: #a4c8dd;
  width: 16px;
  height: 16px;
}

.evidence-tabs {
  display: flex;
  gap: 3px;
  padding: 8px 8px 4px;
  flex-shrink: 0;
}

.evidence-tabs button {
  flex: 1;
  padding: 6px 3px;
  color: #779aaf;
  background: #05203a;
  border: 1px solid #0f3d5d;
  border-radius: 5px;
  font-family: inherit;
  font-size: 8.5px;
  cursor: pointer;
}

.evidence-tabs button.selected {
  color: #10c9ef;
  border-color: #087da5;
  background: #083655;
}

.evidence-card {
  border: 1px solid #115278;
  border-radius: 7px;
  margin: 4px 8px;
  padding: 8px;
  background: #041d34;
  flex-shrink: 0;
}

.evidence-card-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.evidence-card-title strong {
  font-size: 10.5px;
}

.evidence-tag {
  width: max-content;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 8px;
}

.evidence-tag.green {
  color: #54deb0;
  background: #064b42;
}

.evidence-tag.cyan {
  color: #45d7ee;
  background: #06455d;
}

.evidence-method {
  border-top: 1px solid #123e5d;
  margin-top: 6px;
  padding-top: 6px;
  font-size: 8.5px;
  color: #7dc0d6;
}

.evidence-method > span {
  display: block;
  color: #48d9ac;
  margin-bottom: 4px;
}

.evidence-method svg {
  width: 11px;
  height: 11px;
  vertical-align: middle;
}

.evidence-method > div {
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.evidence-method b {
  display: block;
  color: #e6f4fb;
  font-size: 15px;
}

.evidence-method small {
  color: #7ea8bd;
  font-size: 7.5px;
}

.evidence-method p {
  margin: 4px 0 0;
  border: 1px solid #176a67;
  color: #6ee0bc;
  border-radius: 6px;
  text-align: center;
  padding: 2px;
  font-size: 8px;
}

.evidence-letters {
  display: flex;
  gap: 3px;
  margin-top: 6px;
}

.evidence-letters i {
  width: 20px;
  height: 20px;
  border: 1px solid #1680ad;
  background: #052d4e;
}

.science-title {
  font-size: 11px;
  color: #a9d8e7;
  padding: 6px 10px 2px;
  margin: 0;
  flex-shrink: 0;
}

.science-title svg {
  width: 14px;
  height: 14px;
  color: #c0e6ff;
  vertical-align: middle;
}

.science-item {
  margin: 4px 8px;
  padding: 7px;
  border: 1px solid #124866;
  border-radius: 7px;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.science-icon {
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #163f5e;
  color: #91d7ec;
  flex-shrink: 0;
}

.science-icon svg {
  width: 15px;
  height: 15px;
}

.science-item div {
  flex: 1;
}

.science-item strong,
.science-item small {
  display: block;
}

.science-item strong {
  font-size: 8.5px;
}

.science-item small {
  color: #7da3b7;
  font-size: 7px;
  margin-top: 2px;
  line-height: 1.3;
}

.science-item em {
  font-style: normal;
  font-size: 7px;
  color: #3be0aa;
  background: #064438;
  border-radius: 6px;
  padding: 3px 5px;
  flex-shrink: 0;
}

.all-evidence {
  color: #0bbfe9;
  text-decoration: none;
  font-size: 9.5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  background: transparent;
  border: 0;
  width: 100%;
  cursor: pointer;
  margin-top: 6px;
}

.all-evidence svg {
  width: 13px;
  height: 13px;
}

.exact-mobile-toggle {
  display: none;
}

@media (max-width: 960px) {
  .exact-dashboard {
    display: block;
    height: auto;
    min-height: 100vh;
    overflow: auto;
  }
  .exact-sidebar {
    transform: translateX(105%);
    transition: 0.2s;
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 270px;
  }
  .exact-sidebar.is-open {
    transform: translateX(0);
  }
  .exact-right-pane {
    height: auto;
    min-height: 100vh;
  }
  .exact-topbar {
    height: 60px;
    padding: 0 12px;
  }
  .exact-search {
    width: 50%;
  }
  .exact-main {
    display: flex;
    flex-direction: column;
    height: auto;
    padding: 8px;
  }
  .exact-agent,
  .exact-quran,
  .exact-evidence {
    min-height: 520px;
  }
  .exact-agent { order: 3; }
  .exact-quran { order: 2; }
  .exact-evidence { order: 1; }
  .exact-mobile-toggle {
    display: grid;
    place-items: center;
    position: fixed;
    top: 13px;
    right: 12px;
    z-index: 30;
    background: #0a3556;
    color: #fff;
    border: 1px solid #1a648d;
    border-radius: 6px;
    width: 34px;
    height: 34px;
    cursor: pointer;
  }
  .exact-top-actions {
    padding-right: 44px;
  }
}
`
