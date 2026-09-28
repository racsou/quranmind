'use client'

import React, { useState } from 'react'
import {
  X,
  Download,
  Printer,
  Copy,
  Check,
  Sparkles,
  CloudUpload,
  FileText,
  Loader2,
  ExternalLink,
} from 'lucide-react'
import { type QuranVerse } from '@/lib/quran/quran-data'
import { type NormalizationMode } from '@/lib/quran/analysis'

interface DossierExportModalProps {
  isOpen: boolean
  onClose: () => void
  verse: QuranVerse
  normMode: NormalizationMode
  projectTitle?: string
  hypothesis?: string
}

export function DossierExportModal({
  isOpen,
  onClose,
  verse,
  normMode,
  projectTitle: initialProjectTitle = 'ملف بحثي تحليلي',
  hypothesis: initialHypothesis = '',
}: DossierExportModalProps) {
  const [title, setTitle] = useState(initialProjectTitle)
  const [hypo, setHypo] = useState(initialHypothesis)
  const [author, setAuthor] = useState('باحث مستقل')
  const [isExporting, setIsExporting] = useState(false)
  const [exportResult, setExportResult] = useState<{
    downloadUrl: string
    markdown: string
    html: string
  } | null>(null)
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  async function handleExport() {
    setIsExporting(true)
    try {
      const res = await fetch('/api/projects/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle: title,
          hypothesis: hypo,
          surah: verse.surah,
          ayah: verse.ayah,
          normMode,
          authorName: author,
        }),
      })

      const json = await res.json()
      if (json.success && json.data) {
        setExportResult(json.data)
      } else {
        throw new Error(json.error || 'فشل التصدير')
      }
    } catch (err: any) {
      alert(`خطأ أثناء التصدير: ${err.message}`)
    } finally {
      setIsExporting(false)
    }
  }

  function handleCopyMarkdown() {
    if (!exportResult) return
    navigator.clipboard.writeText(exportResult.markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownloadMarkdown() {
    if (!exportResult) return
    const blob = new Blob([exportResult.markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `QuranMind_Dossier_${verse.surah}_${verse.ayah}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function handlePrintPreview() {
    if (!exportResult) return
    const win = window.open('', '_blank')
    if (win) {
      win.document.write(exportResult.html)
      win.document.close()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      dir="rtl"
    >
      <div className="bg-[#031527] border border-cyan-700/60 rounded-2xl w-full max-w-xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <header className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#041d36]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                تصدير الملف البحثي الأكاديمي <em>(Research Dossier)</em>
              </h2>
              <p className="text-xs text-slate-400">
                توليد ملف توثيقي شامل وتخزينه في Supabase Storage أو الطباعة كـ PDF
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {!exportResult ? (
            <>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">عنوان التقرير / الملف:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#020b18] border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">اسم الباحث:</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-[#020b18] border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">الفرضية البحثية:</label>
                <textarea
                  value={hypo}
                  onChange={(e) => setHypo(e.target.value)}
                  placeholder="صياغة الفرضية الرياضية أو العلمية المراد توثيقها في التقرير..."
                  className="w-full bg-[#020b18] border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-cyan-400 h-20 resize-none"
                />
              </div>

              <div className="p-3 bg-[#020e1d] rounded-xl border border-slate-800 space-y-1 text-slate-300">
                <span className="font-semibold text-cyan-300 block">المحتويات المتضمنة في الملف:</span>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400">
                  <div>✓ النص الموثق بالرسم العثماني</div>
                  <div>✓ جدول تكرار الحروف وحساب الجمل</div>
                  <div>✓ اختبار التناظر الحرفي (Palindrome)</div>
                  <div>✓ التفسير الأثري والشواهد الحديثية</div>
                  <div>✓ التصنيف الإبستيمي والملاحظات</div>
                  <div>✓ تخزين سحابي في Supabase</div>
                </div>
              </div>

              <button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري التوليد والتخزين في Supabase...
                  </>
                ) : (
                  <>
                    <CloudUpload className="w-4 h-4" />
                    توليد الملف البحثي وتخزينه في Supabase
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-950/40 border border-emerald-600/50 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  تم إنشاء الملف البحثي بنجاح وتوثيقه في Supabase Storage
                </div>
                <p className="text-[11px] text-slate-300">
                  مسار التخزين: <span className="font-mono text-cyan-300">research-exports</span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={handlePrintPreview}
                  className="py-2.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition"
                >
                  <Printer className="w-4 h-4" />
                  معاينة وطباعة PDF
                </button>

                <button
                  onClick={handleDownloadMarkdown}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-4 h-4" />
                  تحميل Markdown
                </button>

                <button
                  onClick={handleCopyMarkdown}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg flex items-center justify-center gap-1.5 transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      تم النسخ
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      نسخ النص
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between">
                <button
                  onClick={() => setExportResult(null)}
                  className="text-cyan-400 hover:underline text-[11px]"
                >
                  ← إعادة التصدير بخيارات أخرى
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs"
                >
                  إغلاق
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
