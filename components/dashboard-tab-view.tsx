'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  FlaskConical,
  BrainCircuit,
  FolderKanban,
  LibraryBig,
  LineChart,
  Settings,
  Search,
  CheckCircle2,
  Check,
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  Sparkles,
  Layers,
  Calculator,
  RefreshCw,
  Plus,
  ExternalLink,
  ShieldCheck,
  FileCheck,
  Compass,
  Download,
  FileText,
  Calendar,
  MapPin,
  Copy,
  Network,
  Play,
  Tag,
  Trash2,
  Edit3,
  Eye,
  FileCode,
} from 'lucide-react'
import {
  SURAHS_META,
  lookupVerse,
  getSurahVerses,
  getMatchingAyahs,
  getRecurrentPhrases,
  type QuranVerse,
} from '@/lib/quran/quran-data'
import { analyzeVerseDetailed, type NormalizationMode } from '@/lib/quran/analysis'
import { EARLY_MANUSCRIPTS, type QuranManuscript } from '@/lib/quran/manuscripts'
import { SCHOLARLY_ARCHIVE, type TafsirEntry } from '@/lib/quran/tafsir-hadith'
import { ManuscriptViewer } from '@/components/manuscript-viewer'
import { WordConcordanceModal } from '@/components/word-concordance-modal'
import { DossierExportModal } from '@/components/dossier-export-modal'
import { AudioReciter } from '@/components/audio-reciter'
import { AdminDashboardView } from '@/components/admin-dashboard-view'
import {
  HADITH_CORPUS,
  classifyHadithBreadth,
  detectCorroboration,
  diffHadithMatn,
  type HadithEntry,
  type MatnDiffResult,
} from '@/lib/hadith/mustalah-engine'
import {
  getStudyNotes,
  saveStudyNotes,
  parseNoteMentions,
  searchStudyNotes,
  type StudyNote,
  type NoteHighlightColor,
} from '@/lib/notes/study-notes'

interface TabViewProps {
  tab: string
}

export function DashboardTabView({ tab }: TabViewProps) {
  // Quran Explorer State
  const [selectedSurah, setSelectedSurah] = useState<number>(1)
  const [selectedAyah, setSelectedAyah] = useState<number>(1)
  const [showTranslation, setShowTranslation] = useState<boolean>(true)
  const [viewMode, setViewMode] = useState<'text' | 'matching' | 'phrases'>('text')
  const [attachedToAgentVerse, setAttachedToAgentVerse] = useState<QuranVerse | null>(null)
  const [copyToast, setCopyToast] = useState<string | null>(null)

  // Analysis Workbench State
  const [analysisText, setAnalysisText] = useState<string>('كُلٌّ فِي فَلَكٍ يَسْبَحُونَ')
  const [normMode, setNormMode] = useState<NormalizationMode>('structural')

  // Projects State
  const [projects, setProjects] = useState<
    Array<{ id: string; title: string; hypothesis?: string; status: string; createdAt?: string }>
  >([])
  const [evidenceList, setEvidenceList] = useState<
    Array<{
      id: string
      surah: number
      ayah: number
      surahName?: string
      verseText: string
      classification: string
      notes?: string
    }>
  >([])
  const [newProjectModal, setNewProjectModal] = useState<boolean>(false)
  const [newTitle, setNewTitle] = useState('')
  const [newHypothesis, setNewHypothesis] = useState('')

  // Statistics State
  const [globalStats, setGlobalStats] = useState<any>(null)

  // Interactive Pillars State
  const [manuscriptModalOpen, setManuscriptModalOpen] = useState(false)
  const [selectedWordForConcordance, setSelectedWordForConcordance] = useState<string | null>(null)
  const [dossierExportModalOpen, setDossierExportModalOpen] = useState(false)
  const [exportingProject, setExportingProject] = useState<{ title: string; hypothesis?: string } | null>(null)

  // Hadith Studio State
  const [selectedHadithId, setSelectedHadithId] = useState<string>('bukhari-1')
  const [hadithDiffA, setHadithDiffA] = useState<string>(
    'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا، فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ.'
  )
  const [hadithDiffB, setHadithDiffB] = useState<string>(
    'الأَعْمَالُ بِالنِّيَّةِ، وَلِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوْ امْرَأَةٍ يَتَزَوَّجُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ.'
  )
  const [diffResult, setDiffResult] = useState<MatnDiffResult | null>(null)

  // Personal Study Notes State
  const [notes, setNotes] = useState<StudyNote[]>([])
  const [noteSearch, setNoteSearch] = useState('')
  const [activeNoteTag, setActiveNoteTag] = useState('all')
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [newNoteContent, setNewNoteContent] = useState('')
  const [newNoteColor, setNewNoteColor] = useState<NoteHighlightColor>('cyan')
  const [newNoteTags, setNewNoteTags] = useState('فلك, تدقيق')
  const [showNewNoteForm, setShowNewNoteForm] = useState(false)

  // API Docs State
  const [activeApiRoute, setActiveApiRoute] = useState<string>('/v1/quran/ayah?surah=21&ayah=33')
  const [apiConsoleResponse, setApiConsoleResponse] = useState<any>(null)
  const [apiConsoleLoading, setApiConsoleLoading] = useState(false)

  // Current active verse for Quran tab
  const currentVerse = useMemo(() => {
    return lookupVerse(selectedSurah, selectedAyah) || lookupVerse(1, 1)!
  }, [selectedSurah, selectedAyah])

  // Current surah verses
  const surahVerses = useMemo(() => {
    return getSurahVerses(selectedSurah)
  }, [selectedSurah])

  // Matching verses for current active verse
  const matchingVerses = useMemo(() => {
    return getMatchingAyahs(selectedSurah, selectedAyah)
  }, [selectedSurah, selectedAyah])

  // Recurrent phrases for current active verse
  const recurrentPhrases = useMemo(() => {
    return getRecurrentPhrases(selectedSurah, selectedAyah)
  }, [selectedSurah, selectedAyah])

  // Detailed Analysis for analysis tab
  const analysisResult = useMemo(() => {
    return analyzeVerseDetailed(analysisText, normMode)
  }, [analysisText, normMode])

  // Load Projects from Neon
  useEffect(() => {
    if (tab === 'projects' || tab === 'settings') {
      fetch('/api/projects')
        .then((r) => r.json())
        .then((res) => {
          if (res.success && res.data) setProjects(res.data)
        })
        .catch(() => {})

      fetch('/api/evidence')
        .then((r) => r.json())
        .then((res) => {
          if (res.success && res.data) setEvidenceList(res.data)
        })
        .catch(() => {})
    }

    if (tab === 'statistics') {
      fetch('/api/quran/stats')
        .then((r) => r.json())
        .then((res) => {
          if (res.success && res.data) setGlobalStats(res.data)
        })
        .catch(() => {})
    }
  }, [tab])

  async function handleCreateProject() {
    if (!newTitle.trim()) return
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          hypothesis: newHypothesis.trim(),
        }),
      })
      const data = await res.json()
      if (data.success && data.data) {
        setProjects((prev) => [data.data, ...prev])
      }
    } catch {
      setProjects((prev) => [
        {
          id: `p-${Date.now()}`,
          title: newTitle.trim(),
          hypothesis: newHypothesis.trim(),
          status: 'active',
        },
        ...prev,
      ])
    } finally {
      setNewTitle('')
      setNewHypothesis('')
      setNewProjectModal(false)
    }
  }

  // Render according to tab
  function renderTabContent() {
    switch (tab) {
      // ----------------------------------------------------
      // 1. QURAN EXPLORER TAB
      // ----------------------------------------------------
      case 'quran':
        return (
        <div className="space-y-4" dir="rtl">
          {/* Controls Bar */}
          <div className="p-4 bg-[#03172b] border border-cyan-900/40 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-bold text-white">
                تصفح القرآن الكريم (مصحف المدينة الملكي)
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Surah Dropdown */}
              <select
                value={selectedSurah}
                onChange={(e) => {
                  setSelectedSurah(Number(e.target.value))
                  setSelectedAyah(1)
                }}
                className="bg-[#062444] border border-cyan-800/60 text-cyan-200 text-xs rounded-lg px-3 py-1.5 outline-none"
              >
                {SURAHS_META.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. سورة {s.name} ({s.numberOfAyahs} آية -{' '}
                    {s.revelationType === 'Meccan' ? 'مكية' : 'مدنية'})
                  </option>
                ))}
              </select>

              {/* Translation Toggle */}
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                  showTranslation
                    ? 'bg-cyan-600/30 border-cyan-500 text-cyan-200'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {showTranslation ? 'إخفاء الترجمة' : 'عرض الترجمة'}
              </button>

              <button
                onClick={() => setManuscriptModalOpen(true)}
                className="text-xs px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 rounded-lg font-semibold flex items-center gap-1.5 transition"
              >
                <FileCheck className="w-3.5 h-3.5" />
                المخطوطات المبكرة
              </button>

              <Link
                href="/workspace"
                className="text-xs px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold flex items-center gap-1"
              >
                مساحة التحليل <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Synchronized Audio Recitation Bar */}
          <AudioReciter
            surah={selectedSurah}
            ayah={selectedAyah}
            surahName={SURAHS_META[selectedSurah - 1]?.name}
            totalAyahs={SURAHS_META[selectedSurah - 1]?.numberOfAyahs}
            onAyahChange={(newAyah) => setSelectedAyah(newAyah)}
          />

          {/* Surah Verses List & Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Verses Column (2 cols) */}
            <div className="lg:col-span-2 space-y-3 max-h-[700px] overflow-y-auto p-1">
              {surahVerses.map((verse) => (
                <article
                  key={verse.id}
                  onClick={() => setSelectedAyah(verse.ayah)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    verse.ayah === selectedAyah
                      ? 'bg-[#04203a] border-cyan-500/70 shadow-lg shadow-cyan-950/50'
                      : 'bg-[#031527] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold text-cyan-400">
                      الآية {verse.ayah}
                    </span>
                    <span className="text-[11px] bg-slate-800/80 px-2 py-0.5 rounded">
                      {verse.id}
                    </span>
                  </div>

                  {/* Interactive Word Tokens */}
                  <div
                    className="text-xl sm:text-2xl leading-loose text-white text-right font-serif flex flex-wrap gap-x-1.5 items-center"
                    style={{ fontFamily: "'UthmanicHafs', var(--font-cairo), serif" }}
                  >
                    {verse.text.split(/\s+/).filter(Boolean).map((w, wIdx) => (
                      <span
                        key={wIdx}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedAyah(verse.ayah)
                          setSelectedWordForConcordance(w)
                        }}
                        className="hover:text-cyan-300 hover:bg-cyan-950/70 px-1 py-0.5 rounded transition cursor-pointer"
                        title={`فحص جذر «${w}»`}
                      >
                        {w}
                      </span>
                    ))}
                  </div>

                  {showTranslation && (
                    <p
                      className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80 italic text-left"
                      dir="ltr"
                    >
                      {verse.translation}
                    </p>
                  )}

                  {/* Verse Quick Action Bar */}
                  <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2">
                      {/* Add to AI Agent Context */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setAttachedToAgentVerse(verse)
                          if (typeof window !== 'undefined') {
                            sessionStorage.setItem('qm_agent_context_verse', JSON.stringify({
                              surah: verse.surah,
                              surahName: verse.surahName,
                              ayah: verse.ayah,
                              text: verse.text,
                            }))
                          }
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition ${
                          attachedToAgentVerse?.id === verse.id
                            ? 'bg-cyan-700 text-white'
                            : 'bg-[#062c4e] hover:bg-[#0a3c69] text-cyan-300 border border-cyan-700/60'
                        }`}
                        title="إضافة هذه الآية إلى سياق الوكيل الذكي للتحليل"
                      >
                        <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                        <span>
                          {attachedToAgentVerse?.id === verse.id ? 'تمت الإضافة للسياق ✓' : 'إضافة إلى سياق الوكيل'}
                        </span>
                      </button>

                      {/* Play / Select Ayah */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedAyah(verse.ayah)
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] flex items-center gap-1.5 transition ${
                          selectedAyah === verse.ayah
                            ? 'bg-emerald-800/60 border border-emerald-600 text-emerald-300'
                            : 'bg-[#062444] hover:bg-[#08315c] text-slate-300 border border-slate-700'
                        }`}
                        title="تشغيل التلاوة الصوتية لهذه الآية"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>{selectedAyah === verse.ayah ? 'الآية المحددة' : 'استماع'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigator.clipboard.writeText(`﴿${verse.text}﴾ [سورة ${verse.surahName}: ${verse.ayah}]`)
                          setCopyToast(verse.id)
                          setTimeout(() => setCopyToast(null), 2000)
                        }}
                        className="p-1 text-slate-400 hover:text-white rounded transition"
                        title="نسخ نص الآية"
                      >
                        {copyToast === verse.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Ayah Relationship & Evidence Inspector (1 col) */}
            <div className="space-y-4">
              <div className="p-4 bg-[#03172b] border border-cyan-900/50 rounded-xl space-y-3 sticky top-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> فاحص العلاقات والتراكيب
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    الآية {selectedSurah}:{selectedAyah}
                  </span>
                </div>

                {/* Sub-tabs */}
                <div className="flex gap-1 bg-[#020e1d] p-1 rounded-lg text-xs">
                  <button
                    onClick={() => setViewMode('text')}
                    className={`flex-1 py-1 rounded transition ${
                      viewMode === 'text' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    النص والتحليل
                  </button>
                  <button
                    onClick={() => setViewMode('matching')}
                    className={`flex-1 py-1 rounded transition ${
                      viewMode === 'matching' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    الآيات المتشابهة ({matchingVerses.length})
                  </button>
                  <button
                    onClick={() => setViewMode('phrases')}
                    className={`flex-1 py-1 rounded transition ${
                      viewMode === 'phrases' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    التراكيب ({recurrentPhrases.length})
                  </button>
                </div>

                {/* View: Text Stats */}
                {viewMode === 'text' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-[#061d36] rounded-lg border border-slate-800">
                      <div className="text-[11px] text-slate-400 mb-1">الرسم القرآني المعتمد:</div>
                      <div className="text-sm font-serif text-slate-100">{currentVerse.text}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2 bg-[#020e1d] rounded border border-slate-800">
                        <div className="text-[10px] text-slate-400">عدد الكلمات</div>
                        <div className="text-base font-bold text-cyan-300">
                          {currentVerse.text.split(/\s+/).filter(Boolean).length}
                        </div>
                      </div>
                      <div className="p-2 bg-[#020e1d] rounded border border-slate-800">
                        <div className="text-[10px] text-slate-400">عدد الحروف</div>
                        <div className="text-base font-bold text-cyan-300">
                          {currentVerse.text.replace(/\s+/g, '').length}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setExportingProject({
                            title: `توثيق سورة ${SURAHS_META[selectedSurah - 1]?.name} الآية ${selectedAyah}`,
                            hypothesis: 'تحليل البنية اللغوية والتناظرية للنص المصدر',
                          })
                          setDossierExportModalOpen(true)
                        }}
                        className="py-2 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition"
                      >
                        <Download className="w-3.5 h-3.5" /> تصدير ملف
                      </button>

                      <Link
                        href="/workspace"
                        className="py-2 bg-cyan-700/60 hover:bg-cyan-600 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 text-center"
                      >
                        مختبر التناظر <ArrowLeft className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* View: Matching Ayahs */}
                {viewMode === 'matching' && (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {matchingVerses.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">
                        لا توجد آيات متشابهة لفظياً مباشرة مسجلة لهذه الآية في قاعدة التطابق.
                      </p>
                    ) : (
                      matchingVerses.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-[#020e1d] rounded-lg border border-slate-800 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-cyan-400 text-[11px] font-semibold">
                            <span>
                              {m.verse ? `سورة ${m.verse.surahName} (${m.matchedAyahKey})` : m.matchedAyahKey}
                            </span>
                            <span className="bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800/40">
                              تطابق {m.coverage}% (درجة {m.score})
                            </span>
                          </div>
                          {m.verse && (
                            <p className="text-slate-300 font-serif leading-relaxed text-[11px]">
                              {m.verse.text}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* View: Recurrent Phrases */}
                {viewMode === 'phrases' && (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {recurrentPhrases.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">
                        لا توجد تراكيب متكررة مسجلة في هذا الموضع.
                      </p>
                    ) : (
                      recurrentPhrases.map((phrase) => (
                        <div
                          key={phrase.id}
                          className="p-2.5 bg-[#020e1d] rounded-lg border border-slate-800 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-amber-400 text-[11px]">
                            <span>تركيب متكرر (#{phrase.id})</span>
                            <span className="bg-amber-950/80 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800/40">
                              تكرر {phrase.count} مرة عبر {phrase.surahsCount} سورة
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex flex-wrap gap-1 mt-1">
                            {phrase.occurrences.slice(0, 6).map((occ) => (
                              <span key={occ} className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                                {occ}
                              </span>
                            ))}
                            {phrase.occurrences.length > 6 && (
                              <span className="text-slate-500">
                                +{phrase.occurrences.length - 6} مواضع أخرى
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )

    // ----------------------------------------------------
    // 2. ANALYSIS WORKBENCH TAB
    // ----------------------------------------------------
    case 'analysis':
      return (
        <div className="space-y-4" dir="rtl">
          {/* Header & Input */}
          <div className="p-4 bg-[#03172b] border border-cyan-900/40 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-cyan-400" /> مختبر التحليل اللغوي والتناظري والعددي
              </h2>
              <span className="text-xs text-cyan-400">محرك حسابي قطعي 100%</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="text-xs text-slate-400 block mb-1">
                  أدخل النص القرآني المراد تحليله:
                </label>
                <input
                  type="text"
                  value={analysisText}
                  onChange={(e) => setAnalysisText(e.target.value)}
                  className="w-full bg-[#020e1d] border border-slate-700 rounded-lg p-2.5 text-white font-serif text-lg outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">نمط التطبيع (Normalization):</label>
                <select
                  value={normMode}
                  onChange={(e) => setNormMode(e.target.value as NormalizationMode)}
                  className="bg-[#020e1d] border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 outline-none"
                >
                  <option value="exact">Mode A: الرسم العثماني التام</option>
                  <option value="no_diacritics">Mode B: دون تشكيل</option>
                  <option value="structural">Mode C: تطبيع بنيوي (Structural)</option>
                  <option value="letters_only">Mode D: حروف مجردة فقط</option>
                </select>
              </div>
            </div>
          </div>

          {/* Analysis Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Letter & Word Counts */}
            <div className="p-4 bg-[#03172b] border border-slate-800 rounded-xl space-y-3">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-cyan-400" /> الإحصاءات العددية
              </h3>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 bg-[#020e1d] rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">الحروف</div>
                  <div className="text-2xl font-bold text-cyan-300">{analysisResult.letterCount}</div>
                </div>
                <div className="p-3 bg-[#020e1d] rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">الكلمات</div>
                  <div className="text-2xl font-bold text-cyan-300">{analysisResult.wordCount}</div>
                </div>
                <div className="p-3 bg-[#020e1d] rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">الحروف الفريدة</div>
                  <div className="text-2xl font-bold text-cyan-300">{analysisResult.uniqueLettersCount}</div>
                </div>
                <div className="p-3 bg-[#020e1d] rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">حساب الجمل الكبير</div>
                  <div className="text-2xl font-bold text-cyan-300">{analysisResult.abjadValue}</div>
                </div>
              </div>

              <div className="p-2.5 bg-[#020e1d] rounded border border-slate-800 text-[11px] font-mono text-cyan-200 break-all text-center">
                {analysisResult.normalizedText}
              </div>
            </div>

            {/* Card 2: Symmetry Engine */}
            <div className="p-4 bg-[#03172b] border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> محرك التناظر (Symmetry)
                </h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    analysisResult.symmetry.isPalindrome
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/40'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {Math.round(analysisResult.symmetry.symmetryRatio * 100)}% تطابق
                </span>
              </div>

              <div className="p-3 bg-[#020e1d] rounded-lg border border-slate-800 text-xs space-y-2">
                <div>
                  <span className="text-cyan-400 text-[10px] block">الأمام (Forward):</span>
                  <div className="font-mono text-slate-200 mt-0.5">{analysisResult.symmetry.forwardText}</div>
                </div>
                <div>
                  <span className="text-cyan-400 text-[10px] block">العكس (Reversed):</span>
                  <div className="font-mono text-slate-200 mt-0.5">{analysisResult.symmetry.reversedText}</div>
                </div>
              </div>

              {analysisResult.symmetry.isPalindrome ? (
                <div className="p-2.5 bg-emerald-950/40 border border-emerald-600/40 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>تناظر حرفي تام 100% يقرأ من اليمين كما يقرأ من اليسار.</span>
                </div>
              ) : (
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400">
                  تناظر نسبي جزئي بمقدار {Math.round(analysisResult.symmetry.symmetryRatio * 100)}%.
                </div>
              )}
            </div>

            {/* Card 3: Letter Distribution Cloud */}
            <div className="p-4 bg-[#03172b] border border-slate-800 rounded-xl space-y-3">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <LineChart className="w-4 h-4 text-cyan-400" /> تكرار الحروف ونسبها
              </h3>

              <div className="space-y-1.5 max-h-56 overflow-y-auto">
                {analysisResult.letterFrequencies.slice(0, 7).map(({ letter, count, percentage }) => (
                  <div
                    key={letter}
                    className="flex items-center justify-between text-xs p-1.5 bg-[#020e1d] rounded border border-slate-800"
                  >
                    <span className="font-bold text-cyan-300 w-6 text-center">{letter}</span>
                    <div className="flex-1 mx-3 bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {count} ({percentage}%)
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-2 bg-amber-950/30 border border-amber-800/30 rounded text-[11px] text-amber-200/90">
                <AlertTriangle className="w-3.5 h-3.5 inline ml-1 text-amber-400" />
                <span>{analysisResult.evidenceStatement}</span>
              </div>
            </div>
          </div>
        </div>
      )

    // ----------------------------------------------------
    // 3. RESEARCH PROJECTS TAB
    // ----------------------------------------------------
    case 'projects':
      return (
        <div className="space-y-4" dir="rtl">
          <div className="p-4 bg-[#03172b] border border-cyan-900/40 rounded-xl flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-cyan-400" /> المشاريع البحثية المنظمة (Neon PostgreSQL)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                إدارة الفرضيات، سلاسل الأدلة، والملاحظات الموثقة عبر السحاب مع التصدير لـ Supabase.
              </p>
            </div>

            <button
              onClick={() => setNewProjectModal(true)}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" /> مشروع جديد
            </button>
          </div>

          {/* Projects List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div key={proj.id} className="p-4 bg-[#03172b] border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-cyan-300">{proj.title}</h3>
                  <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800/40">
                    {proj.status === 'active' ? 'نشط' : 'مسودة'}
                  </span>
                </div>

                {proj.hypothesis && (
                  <p className="text-xs text-slate-300 bg-[#020e1d] p-3 rounded-lg border border-slate-800 leading-relaxed">
                    <strong className="text-cyan-400 block text-[11px] mb-1">الفرضية البحثية:</strong>
                    {proj.hypothesis}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span>
                    الأدلة الموثقة:{' '}
                    {evidenceList.filter((e: any) => e.projectId === proj.id).length} أدلة
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setExportingProject(proj)
                        setDossierExportModalOpen(true)
                      }}
                      className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Download className="w-3 h-3" /> تصدير الملف
                    </button>
                    <Link
                      href="/workspace"
                      className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      مساحة العمل <ArrowLeft className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* New Project Modal */}
          {newProjectModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#03172c] border border-cyan-800/60 rounded-xl p-5 w-full max-w-md space-y-4 text-right shadow-2xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                  <FolderKanban className="w-5 h-5 text-cyan-400" /> إنشاء مشروع بحثي جديد
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">عنوان المشروع</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="مثال: التماثل والتناظر في الآيات الكونية"
                      className="w-full bg-[#062444] border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">الفرضية الأساسية</label>
                    <textarea
                      value={newHypothesis}
                      onChange={(e) => setNewHypothesis(e.target.value)}
                      placeholder="وصف الفرضية الرياضية أو العلمية المراد التحقق منها..."
                      className="w-full bg-[#062444] border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-cyan-400 h-24 resize-none"
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
                    إنشاء وحفظ في Neon
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )

    // ----------------------------------------------------
    // 4. SCIENTIFIC LIBRARY TAB (Corpus Coranicum, Hadith, Manuscripts)
    // ----------------------------------------------------
    case 'library':
      return (
        <div className="space-y-6" dir="rtl">
          {/* Header */}
          <div className="p-4 bg-[#03172b] border border-cyan-900/40 rounded-xl flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <LibraryBig className="w-5 h-5 text-cyan-400" /> المكتبة العلمية والأركيولوجية
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                متحف المخطوطات المبكرة (القرن 7م)، الأرشيف التفسيري الموثق، وشواهد الحديث النبوي المسندة.
              </p>
            </div>
            <button
              onClick={() => setManuscriptModalOpen(true)}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <FileCheck className="w-4 h-4" /> فحص المخطوطات بالمجهر
            </button>
          </div>

          {/* Section 1: Early Manuscripts Showcase */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" /> مخطوطات ورقع القرن الأول الهجري (Corpus Coranicum)
              </h3>
              <span className="text-[11px] text-slate-400">توثيق مادي أركيولوجي قطعي</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {EARLY_MANUSCRIPTS.map((ms) => (
                <div
                  key={ms.id}
                  onClick={() => setManuscriptModalOpen(true)}
                  className="p-3 bg-[#03172b] hover:bg-[#04203a] border border-slate-800 hover:border-cyan-600/60 rounded-xl cursor-pointer transition flex flex-col justify-between space-y-2 group"
                >
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-black/60 relative">
                    <img
                      src={ms.imageUrl}
                      alt={ms.arabicTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute bottom-1 right-1 text-[9px] bg-black/70 text-cyan-300 px-1.5 py-0.5 rounded">
                      {ms.carbonDating}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                      {ms.arabicTitle}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{ms.location}</p>
                  </div>

                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 pt-1 border-t border-slate-800/80">
                    <Sparkles className="w-3 h-3" />
                    <span>{ms.scriptType}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Scholarly Tafsir & Hadith Archive */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> شواهد التفسير الأثري والحديث النبوي المسند
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(SCHOLARLY_ARCHIVE).map(([ayahKey, item]) => (
                <div
                  key={ayahKey}
                  className="p-4 bg-[#03172b] border border-slate-800 rounded-xl space-y-2.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300">
                      الآية ({ayahKey})
                    </span>
                    <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800/40">
                      ابن كثير & الحديث
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed text-[11px] bg-[#020e1d] p-2.5 rounded-lg border border-slate-800">
                    <strong className="text-cyan-400 block mb-0.5">تفسير ابن كثير:</strong>
                    {item.ibnKathir}
                  </p>

                  {item.hadithCitations.map((h, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-[#020b18] border border-emerald-900/50 rounded-lg text-[11px] space-y-1"
                    >
                      <div className="flex items-center justify-between text-emerald-300 font-semibold">
                        <span>{h.source} (#{h.number})</span>
                        <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded">
                          إسناد {h.isnadGrade}
                        </span>
                      </div>
                      <p className="text-slate-100 font-serif leading-relaxed">«{h.text}»</p>
                      <div className="text-[10px] text-slate-400"><strong>السند:</strong> {h.narratorChain}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    // ----------------------------------------------------
    // 5. STATISTICS TAB
    // ----------------------------------------------------
    case 'statistics':
      return (
        <div className="space-y-4" dir="rtl">
          <div className="p-4 bg-[#03172b] border border-cyan-900/40 rounded-xl flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <LineChart className="w-5 h-5 text-cyan-400" /> إحصاءات القرآن الكريم الشاملة (6,236 آية)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                محسوبة مباشرة من بيانات مصحف المدينة الملكي (QPC Hafs) المخزنة في الذاكرة السريعة (Redis).
              </p>
            </div>
            <span className="text-xs bg-emerald-950 text-emerald-400 px-3 py-1 rounded-full border border-emerald-600/40">
              بيانات كاملة 114 سورة
            </span>
          </div>

          {/* Big Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 bg-[#03172b] border border-slate-800 rounded-xl text-center">
              <span className="text-xs text-slate-400">عدد السور</span>
              <strong className="block text-2xl text-cyan-300 mt-1">114</strong>
              <small className="text-[10px] text-slate-500">86 مكية · 28 مدنية</small>
            </div>
            <div className="p-4 bg-[#03172b] border border-slate-800 rounded-xl text-center">
              <span className="text-xs text-slate-400">إجمالي الآيات</span>
              <strong className="block text-2xl text-cyan-300 mt-1">6,236</strong>
              <small className="text-[10px] text-slate-500">وفق العد الكوفي المعتمد</small>
            </div>
            <div className="p-4 bg-[#03172b] border border-slate-800 rounded-xl text-center">
              <span className="text-xs text-slate-400">إجمالي الكلمات</span>
              <strong className="block text-2xl text-cyan-300 mt-1">77,430+</strong>
              <small className="text-[10px] text-slate-500">بالرسم العثماني</small>
            </div>
            <div className="p-4 bg-[#03172b] border border-slate-800 rounded-xl text-center">
              <span className="text-xs text-slate-400">إجمالي الحروف</span>
              <strong className="block text-2xl text-cyan-300 mt-1">320,000+</strong>
              <small className="text-[10px] text-slate-500">بدون فواصل وتشكيل</small>
            </div>
          </div>

          {/* Palindromic & Symmetry Leaderboard */}
          <div className="p-4 bg-[#03172b] border border-slate-800 rounded-xl space-y-3">
            <h3 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> أبرز الأنماط التناظرية المكتشفة في القرآن
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#020e1d] rounded-lg border border-slate-800 space-y-1">
                <span className="text-cyan-400 font-bold text-sm block">«وَرَبَّكَ فَكَبِّرْ»</span>
                <span className="text-[11px] text-slate-400 block">سورة المدثر · الآية 3</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded inline-block">
                  تناظر تام 100% (Palindrome)
                </span>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">ر-ب-ك-ف-ك-ب-ر</p>
              </div>

              <div className="p-3 bg-[#020e1d] rounded-lg border border-slate-800 space-y-1">
                <span className="text-cyan-400 font-bold text-sm block">«كُلٌّ فِي فَلَكٍ»</span>
                <span className="text-[11px] text-slate-400 block">سورة يس 40 · الأنبياء 33</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded inline-block">
                  تناظر تام 100% (Palindrome)
                </span>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">ك-ل-ف-ي-ف-ل-ك</p>
              </div>

              <div className="p-3 bg-[#020e1d] rounded-lg border border-slate-800 space-y-1">
                <span className="text-cyan-400 font-bold text-sm block">«سَنُرِيهِمْ آيَاتِنَا»</span>
                <span className="text-[11px] text-slate-400 block">سورة فصلت · الآية 53</span>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded inline-block">
                  دلالة علمية استقرائية
                </span>
                <p className="text-[10px] text-slate-400 mt-1">الآفاق والأنفس</p>
              </div>
            </div>
          </div>
        </div>
      )

      // ----------------------------------------------------
      // 6. HADITH & MUSTALAH STUDIO (Ilm Port)
      // ----------------------------------------------------
      case 'hadith': {
        const currentHadith = HADITH_CORPUS.find((h) => h.id === selectedHadithId) || HADITH_CORPUS[0]
        const breadthData = classifyHadithBreadth(selectedHadithId)
        const corroborationData = detectCorroboration(selectedHadithId)

        return (
          <div className="space-y-6" dir="rtl">
            <div className="p-4 bg-[#03172b] border border-cyan-900/40 rounded-xl flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-cyan-400 font-mono">MUSTALAH & TEXTUAL CRITICISM ENGINE</span>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  استوديو دراسة الحديث النبوي ومصطلح الحديث
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">اختر الحديث للدراسة:</span>
                <select
                  value={selectedHadithId}
                  onChange={(e) => {
                    setSelectedHadithId(e.target.value)
                    const h = HADITH_CORPUS.find((item) => item.id === e.target.value)
                    if (h && h.variants && h.variants.length > 0) {
                      setHadithDiffA(h.arabicMatn)
                      setHadithDiffB(h.variants[0].variantText)
                      setDiffResult(null)
                    }
                  }}
                  className="bg-[#062444] border border-cyan-800/60 text-cyan-200 text-xs rounded-lg px-3 py-1.5 outline-none font-semibold"
                >
                  {HADITH_CORPUS.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.collection} - حديث {h.number} ({h.breadth})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hadith Main Card */}
            <div className="p-5 rounded-2xl bg-[#031527] border border-slate-800 space-y-3 shadow-lg">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-cyan-300">
                  {currentHadith.collection} · حديث رقم {currentHadith.number}
                </span>
                <span className="text-slate-400">راوي الحديث: <strong className="text-white">{currentHadith.primaryNarrator}</strong></span>
              </div>

              <div className="p-4 rounded-xl bg-[#020b18] border border-slate-800 text-lg leading-loose font-serif text-white text-center">
                «{currentHadith.arabicMatn}»
              </div>

              <div className="text-xs text-slate-400 italic">
                {currentHadith.englishMatn}
              </div>
            </div>

            {/* Breadth & Corroboration Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Breadth Classification Card */}
              <div className="p-5 rounded-2xl bg-[#031527] border border-cyan-800/60 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Network className="w-4 h-4 text-cyan-400" />
                    تصنيف اتساع الحديث (Breadth Classification)
                  </h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                    breadthData.breadth === 'mutawatir'
                      ? 'bg-purple-950 text-purple-300 border border-purple-800'
                      : breadthData.breadth === 'mashhur'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      : breadthData.breadth === 'aziz'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {breadthData.arabicTerm}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {breadthData.description}
                </p>

                <div className="p-3 bg-[#020b18] rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="text-slate-400">أقل عدد رواة في طبقة واحدة من السند:</div>
                  <div className="text-xl font-bold font-mono text-cyan-300">{breadthData.minTierCount} رواة</div>
                </div>

                {currentHadith.chains.length > 0 && (
                  <div className="space-y-2 text-xs">
                    <span className="font-bold text-slate-400 block">مسار السند التوثيقي:</span>
                    {currentHadith.chains.map((chain, cIdx) => (
                      <div key={cIdx} className="p-2.5 bg-[#020b18] rounded-lg border border-slate-800 text-[11px] space-y-1">
                        <div className="flex justify-between text-cyan-400 font-semibold">
                          <span>{chain.collection} (سند {cIdx + 1})</span>
                          <span className="text-emerald-400">{chain.isnadGrade}</span>
                        </div>
                        <div className="text-slate-300">
                          {chain.narratorPath.map((n) => n.arabicName).join(' ← ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Corroboration Detection Card */}
              <div className="p-5 rounded-2xl bg-[#031527] border border-emerald-800/60 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    المتابعات والشواهد (Corroboration)
                  </h3>
                  <span className="text-xs bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-800">
                    {corroborationData.corroborationStrength}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block mb-1">المتابعات (نفس الصحابي بسند موازٍ):</span>
                    {corroborationData.mutabaat.map((m, mIdx) => (
                      <div key={mIdx} className="p-2.5 bg-[#020b18] rounded-lg border border-slate-800 text-[11px] space-y-1 mb-1.5">
                        <span className="text-cyan-300 font-bold">متابعة {m.type}:</span>
                        <p className="text-slate-300">{m.description}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block mb-1">الشواهد (صحابة آخرون بنفس المعنى):</span>
                    {corroborationData.shawahid.map((s, sIdx) => (
                      <div key={sIdx} className="p-2.5 bg-[#020b18] rounded-lg border border-slate-800 text-[11px] space-y-1 mb-1.5">
                        <div className="flex justify-between text-amber-300 font-semibold">
                          <span>عن {s.companion}</span>
                          <span className="text-emerald-400">{s.isnadGrade}</span>
                        </div>
                        <p className="text-slate-300">{s.hadithSummary}</p>
                        <small className="text-slate-500">{s.source}</small>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/50 text-xs text-emerald-200">
                  <strong>الخلاصة الإسنادية:</strong> {corroborationData.scholarlyVerdict}
                </div>
              </div>

            </div>

            {/* Word-level Matn Diffing Studio */}
            <div className="p-5 rounded-2xl bg-[#031527] border border-cyan-800/60 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    محرك تفاضل المتون اللفظي (Word-Level Matn Diffing)
                  </h3>
                  <span className="text-xs text-slate-400">مقارنة الفروق والزيادات بين روايات الحديث الواحد كلمة بكلمة</span>
                </div>

                <button
                  onClick={() => {
                    const res = diffHadithMatn(hadithDiffA, hadithDiffB, 'الرواية الأولى', 'الرواية الثانية')
                    setDiffResult(res)
                  }}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  فحص التفاضل اللفظي الآن
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-cyan-300 font-semibold block mb-1">الرواية الأولى (A):</label>
                  <textarea
                    value={hadithDiffA}
                    onChange={(e) => setHadithDiffA(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-emerald-300 font-semibold block mb-1">الرواية الثانية (B):</label>
                  <textarea
                    value={hadithDiffB}
                    onChange={(e) => setHadithDiffB(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white resize-none"
                  />
                </div>
              </div>

              {diffResult && (
                <div className="p-4 bg-[#020b18] rounded-xl border border-cyan-700/50 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                    <span className="text-emerald-400 font-bold">{diffResult.summary}</span>
                    <span className="text-cyan-300 font-mono">تطابق {diffResult.similarityPercentage}%</span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-400">الرواية A بالتظليل اللفظي:</div>
                    <div className="p-3 bg-slate-900 rounded-lg text-sm font-serif leading-loose flex flex-wrap gap-1">
                      {diffResult.tokensA.map((t, idx) => (
                        <span
                          key={idx}
                          className={`px-1 rounded ${
                            t.status === 'identical'
                              ? 'text-slate-200'
                              : t.status === 'substituted'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                          title={t.status === 'substituted' ? `يقابلها في B: ${t.alternative}` : undefined}
                        >
                          {t.word}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-400">الرواية B بالتظليل اللفظي:</div>
                    <div className="p-3 bg-slate-900 rounded-lg text-sm font-serif leading-loose flex flex-wrap gap-1">
                      {diffResult.tokensB.map((t, idx) => (
                        <span
                          key={idx}
                          className={`px-1 rounded ${
                            t.status === 'identical'
                              ? 'text-slate-200'
                              : t.status === 'added'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                          title={t.status === 'added' ? 'زيادة واردة في هذه الرواية' : undefined}
                        >
                          {t.word}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        )
      }

      // ----------------------------------------------------
      // 7. PERSONAL STUDY NOTES (Ilm Port)
      // ----------------------------------------------------
      case 'notes': {
        const displayedNotes = searchStudyNotes(notes, noteSearch, activeNoteTag)
        const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)))

        function handleCreateNote() {
          if (!newNoteTitle.trim()) return
          const parsed = parseNoteMentions(newNoteContent)
          const newNote: StudyNote = {
            id: `note-${Date.now()}`,
            title: newNoteTitle.trim(),
            content: newNoteContent.trim(),
            tags: newNoteTags.split(',').map((t) => t.trim()).filter(Boolean),
            color: newNoteColor,
            embeddedAyahs: parsed.embeddedAyahs,
            embeddedHadiths: parsed.embeddedHadiths,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
          }
          const updated = [newNote, ...notes]
          setNotes(updated)
          saveStudyNotes(updated)
          setNewNoteTitle('')
          setNewNoteContent('')
          setShowNewNoteForm(false)
        }

        function handleDeleteNote(id: string) {
          const updated = notes.filter((n) => n.id !== id)
          setNotes(updated)
          saveStudyNotes(updated)
        }

        return (
          <div className="space-y-6" dir="rtl">
            <div className="p-4 bg-[#03172b] border border-cyan-900/40 rounded-xl flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-cyan-400 font-mono">PERSONAL RESEARCH NOTEBOOK</span>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  الملاحظات الدراسية المتطورة (Personal Study Notes)
                </h2>
                <p className="text-xs text-slate-400">
                  تدوين الملاحظات مع ميزة الإسناد التلقائي للآيات عبر @21:33 والأحاديث عبر @bukhari:1
                </p>
              </div>

              <button
                onClick={() => setShowNewNoteForm(!showNewNoteForm)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>تدوين ملاحظة جديدة</span>
              </button>
            </div>

            {/* Note Creator Form */}
            {showNewNoteForm && (
              <div className="p-5 rounded-2xl bg-[#031527] border border-cyan-700/60 space-y-4 shadow-xl">
                <h3 className="text-sm font-bold text-white">إضافة ملاحظة دراسية جديدة</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">عنوان الملاحظة:</label>
                    <input
                      type="text"
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      placeholder="مثال: فحص التناظر في آيات الفلك..."
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">الوسوم (مفصولة بفواصل):</label>
                    <input
                      type="text"
                      value={newNoteTags}
                      onChange={(e) => setNewNoteTags(e.target.value)}
                      placeholder="فلك, تناظر, إعجاز"
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 text-xs font-semibold block mb-1">
                    نص الملاحظة مع إمكانية تضمين الآيات والأحاديث:
                  </label>
                  <textarea
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="اكتب تأملاتك هنا... اكتب @21:33 لتضمين آية سورة الأنبياء، أو @bukhari:1 لتضمين حديث النيات..."
                    rows={4}
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white resize-none"
                  />
                  <small className="text-[10px] text-cyan-400 mt-1 block">
                    ✦ ميزة التضمين الآلي: اكتب @ متبوعاً برقم السورة والآية (مثل @21:33) أو @bukhari:3199 وسيقوم النظام باستحضار النص وسنده فوراً!
                  </small>
                </div>

                {/* Color Selector */}
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400">لون الملاحظة:</span>
                  <div className="flex gap-2">
                    {(['cyan', 'emerald', 'amber', 'purple', 'rose'] as NoteHighlightColor[]).map((c) => (
                      <button
                        key={c}
                        onClick={() => setNewNoteColor(c)}
                        className={`w-6 h-6 rounded-full border-2 transition ${
                          newNoteColor === c ? 'border-white scale-110' : 'border-transparent'
                        } ${
                          c === 'cyan'
                            ? 'bg-cyan-500'
                            : c === 'emerald'
                            ? 'bg-emerald-500'
                            : c === 'amber'
                            ? 'bg-amber-500'
                            : c === 'purple'
                            ? 'bg-purple-500'
                            : 'bg-rose-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setShowNewNoteForm(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleCreateNote}
                    className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs shadow"
                  >
                    حفظ الملاحظة
                  </button>
                </div>
              </div>
            )}

            {/* Search and Tags Filter */}
            <div className="p-3 bg-[#031527] border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={noteSearch}
                  onChange={(e) => setNoteSearch(e.target.value)}
                  placeholder="ابحث في نصوص الملاحظات والآيات والأحاديث..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-slate-400">الوسوم:</span>
                <button
                  onClick={() => setActiveNoteTag('all')}
                  className={`px-2.5 py-1 rounded-lg ${
                    activeNoteTag === 'all' ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  الكل
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveNoteTag(tag)}
                    className={`px-2.5 py-1 rounded-lg ${
                      activeNoteTag === tag ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-900 text-slate-300'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-5 rounded-2xl bg-[#031527] border space-y-3 shadow-lg relative ${
                    note.color === 'cyan'
                      ? 'border-cyan-700/60'
                      : note.color === 'emerald'
                      ? 'border-emerald-700/60'
                      : note.color === 'amber'
                      ? 'border-amber-700/60'
                      : note.color === 'purple'
                      ? 'border-purple-700/60'
                      : 'border-rose-700/60'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-white">{note.title}</h4>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition"
                      title="حذف الملاحظة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                    {note.content}
                  </p>

                  {/* Embedded Ayahs */}
                  {note.embeddedAyahs.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <span className="text-[10px] text-cyan-400 font-bold block">الآيات المضمنة آلياً:</span>
                      {note.embeddedAyahs.map((ea, idx) => (
                        <div key={idx} className="p-2.5 bg-[#020b18] rounded-xl border border-cyan-800/40 text-xs">
                          <div className="text-cyan-300 font-semibold text-[11px] mb-1">
                            سورة {ea.surahName} ({ea.ayah})
                          </div>
                          <p className="font-serif text-white leading-relaxed">«{ea.text}»</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Embedded Hadiths */}
                  {note.embeddedHadiths.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <span className="text-[10px] text-amber-400 font-bold block">الأحاديث المضمنة آلياً:</span>
                      {note.embeddedHadiths.map((eh, idx) => (
                        <div key={idx} className="p-2.5 bg-[#020b18] rounded-xl border border-amber-800/40 text-xs">
                          <div className="flex justify-between text-amber-300 font-semibold text-[11px] mb-1">
                            <span>{eh.collection} (حديث {eh.number})</span>
                            <span className="text-emerald-400">{eh.grade}</span>
                          </div>
                          <p className="font-serif text-white leading-relaxed">«{eh.matn}»</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags & Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                    <div className="flex gap-1">
                      {note.tags.map((t) => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <span>{note.updatedAt}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )
      }

      // ----------------------------------------------------
      // 8. PUBLIC REST API & OPENAPI DOCS (Ilm Port)
      // ----------------------------------------------------
      case 'api-docs': {
        const routes = [
          { method: 'GET', path: '/v1/quran/ayah?surah=21&ayah=33', desc: 'تفاصيل الآية مع التحليل الصرفي والعددي' },
          { method: 'GET', path: '/v1/quran/search?q=فلك&limit=5', desc: 'البحث الشامل في الـ 6,236 آية' },
          { method: 'GET', path: '/v1/hadith?id=bukhari-1', desc: 'استعلام الأحاديث والمسالك الإسنادية' },
          { method: 'GET', path: '/v1/mustalah/breadth?hadithId=bukhari-1', desc: 'تصنيف اتساع الحديث (متواتر/مشهور/عزيز/غريب)' },
          { method: 'GET', path: '/v1/mustalah/corroboration?hadithId=bukhari-1', desc: 'رصد المتابعات والشواهد الإسنادية' },
        ]

        async function handleRunApiTest(endpoint: string) {
          setActiveApiRoute(endpoint)
          setApiConsoleLoading(true)
          setApiConsoleResponse(null)
          try {
            const res = await fetch(endpoint)
            const data = await res.json()
            setApiConsoleResponse(data)
          } catch (err: any) {
            setApiConsoleResponse({ error: err.message })
          } finally {
            setApiConsoleLoading(false)
          }
        }

        return (
          <div className="space-y-6" dir="rtl">
            <div className="p-4 bg-[#03172b] border border-cyan-900/40 rounded-xl flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-cyan-400 font-mono">OPENAPI 3.1 & REST API SUITE</span>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Network className="w-5 h-5 text-cyan-400" />
                  توثيق الواجهة البرمجية المفتوحة (Public REST API /v1/*)
                </h2>
                <p className="text-xs text-slate-400">
                  واجهة برمجية معيارية للباحثين والمطورين لاستقراء نصوص القرآن، الجذور، والمصطلح الحديثي
                </p>
              </div>

              <a
                href="/v1/openapi.json"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#042444] hover:bg-cyan-900 border border-cyan-700/60 text-cyan-200 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>تحميل مواصفة OpenAPI 3.1 (JSON)</span>
              </a>
            </div>

            {/* API Console Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Endpoints List (Col 5) */}
              <div className="lg:col-span-5 space-y-3">
                <span className="text-xs font-bold text-slate-400 block">نقاط النهاية المتاحة (Endpoints):</span>
                {routes.map((r) => (
                  <div
                    key={r.path}
                    onClick={() => handleRunApiTest(r.path)}
                    className={`p-3 rounded-xl border transition cursor-pointer space-y-1 ${
                      activeApiRoute === r.path
                        ? 'bg-cyan-950/80 border-cyan-500 shadow-md'
                        : 'bg-[#031527] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px] border border-emerald-800/40">
                        {r.method}
                      </span>
                      <span className="text-white truncate">{r.path}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{r.desc}</p>
                  </div>
                ))}
              </div>

              {/* Live Interactive Test Console (Col 7) */}
              <div className="lg:col-span-7 p-5 rounded-2xl bg-[#031527] border border-cyan-800/60 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Play className="w-4 h-4 text-cyan-400" />
                    وحدة التجربة الحية (Live API Console)
                  </h3>
                  <button
                    onClick={() => handleRunApiTest(activeApiRoute)}
                    disabled={apiConsoleLoading}
                    className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg shadow transition flex items-center gap-1.5"
                  >
                    {apiConsoleLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                    <span>إرسال الطلب</span>
                  </button>
                </div>

                <div className="p-3 bg-[#020b18] rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 break-all" dir="ltr">
                  GET {activeApiRoute}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>استجابة الخادم (Response):</span>
                    <span className="text-emerald-400 font-mono">Status: 200 OK</span>
                  </div>
                  <pre
                    className="p-4 bg-[#020b18] rounded-xl border border-slate-800 text-[11px] text-emerald-300 font-mono overflow-x-auto max-h-80"
                    dir="ltr"
                  >
                    {apiConsoleResponse
                      ? JSON.stringify(apiConsoleResponse, null, 2)
                      : '// انقر على "إرسال الطلب" لعرض بيانات الـ JSON الحية من الخادم...'}
                  </pre>
                </div>
              </div>

            </div>

          </div>
        )
      }

      // ----------------------------------------------------
      // 9. ADMIN DASHBOARD TAB
      // ----------------------------------------------------
      case 'admin':
        return <AdminDashboardView />

      // ----------------------------------------------------
      // 10. SETTINGS / DEFAULT FALLBACK
      // ----------------------------------------------------
    default:
      return (
        <div className="space-y-4" dir="rtl">
          <div className="p-5 bg-[#03172b] border border-cyan-900/40 rounded-xl space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" /> البنية التحتية وحالة النظام
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#020e1d] rounded-lg border border-slate-800 space-y-1">
                <strong className="text-cyan-300 block">المصادقة والمستخدمين:</strong>
                <span className="text-slate-300">Clerk Authentication (@clerk/nextjs)</span>
              </div>
              <div className="p-3 bg-[#020e1d] rounded-lg border border-slate-800 space-y-1">
                <strong className="text-cyan-300 block">قاعدة البيانات السحابية:</strong>
                <span className="text-slate-300">Neon Serverless PostgreSQL (Drizzle ORM)</span>
              </div>
              <div className="p-3 bg-[#020e1d] rounded-lg border border-slate-800 space-y-1">
                <strong className="text-cyan-300 block">الذاكرة المؤقتة (Cache):</strong>
                <span className="text-slate-300">Docker Redis (redis:7-alpine على المنفذ 6379)</span>
              </div>
              <div className="p-3 bg-[#020e1d] rounded-lg border border-slate-800 space-y-1">
                <strong className="text-cyan-300 block">الملفات والأدلة:</strong>
                <span className="text-slate-300">Supabase Cloud Storage (research-exports)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <Link
                href="/workspace"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2"
              >
                الدخول إلى مساحة العمل المتصلة <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <>
      {renderTabContent()}
      <ManuscriptViewer
        isOpen={manuscriptModalOpen}
        onClose={() => setManuscriptModalOpen(false)}
        currentSurahName={SURAHS_META[selectedSurah - 1]?.name}
        currentAyah={selectedAyah}
      />

      <WordConcordanceModal
        word={selectedWordForConcordance}
        onClose={() => setSelectedWordForConcordance(null)}
        onSelectVerse={(s, a) => {
          setSelectedSurah(s)
          setSelectedAyah(a)
        }}
      />

      <DossierExportModal
        isOpen={dossierExportModalOpen}
        onClose={() => setDossierExportModalOpen(false)}
        verse={currentVerse}
        normMode={normMode}
        projectTitle={exportingProject?.title || 'تقرير بحثي قرآني'}
        hypothesis={exportingProject?.hypothesis || 'توثيق علمي للأدلة والشواهد القرآنية'}
      />
    </>
  )
}
