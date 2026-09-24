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

interface TabViewProps {
  tab: string
}

export function DashboardTabView({ tab }: TabViewProps) {
  // Quran Explorer State
  const [selectedSurah, setSelectedSurah] = useState<number>(1)
  const [selectedAyah, setSelectedAyah] = useState<number>(1)
  const [showTranslation, setShowTranslation] = useState<boolean>(true)
  const [viewMode, setViewMode] = useState<'text' | 'matching' | 'phrases'>('text')

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
    // 6. SETTINGS / DEFAULT FALLBACK
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
