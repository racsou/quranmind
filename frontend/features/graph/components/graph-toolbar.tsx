import React from 'react'
import { Share2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { ResearchGraphData } from '@/lib/quran/research-graph'

interface GraphToolbarProps {
  graphData: ResearchGraphData | null
  showVerses: boolean
  setShowVerses: (v: boolean) => void
  showRoots: boolean
  setShowRoots: (r: boolean) => void
  showThemes: boolean
  setShowThemes: (t: boolean) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
}

export function GraphToolbar({
  graphData,
  showVerses,
  setShowVerses,
  showRoots,
  setShowRoots,
  showThemes,
  setShowThemes,
  onZoomIn,
  onZoomOut,
  onReset,
}: GraphToolbarProps) {
  return (
    <div className="absolute top-3 right-3 left-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
      <div className="flex items-center gap-2 bg-white/95 border border-slate-200 rounded-lg px-2.5 py-1.5 backdrop-blur-md pointer-events-auto shadow-sm">
        <Share2 className="w-4 h-4 text-teal-700" />
        <span className="text-xs font-bold text-slate-800">
          شبكة العلاقات المعرفية <em>(Research Graph)</em>
        </span>
        {graphData && (
          <span className="text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-mono">
            {graphData.stats.totalNodes} عقد · {graphData.stats.totalEdges} روابط
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 bg-white/95 border border-slate-200 rounded-lg p-1 backdrop-blur-md pointer-events-auto text-[11px] shadow-sm">
        <button
          onClick={() => setShowVerses(!showVerses)}
          className={`px-2 py-0.5 rounded transition cursor-pointer ${
            showVerses ? 'bg-sky-50 text-sky-800 font-bold border border-sky-300' : 'text-slate-400'
          }`}
        >
          الآيات ({graphData?.stats.similarityCount || 0})
        </button>
        <button
          onClick={() => setShowRoots(!showRoots)}
          className={`px-2 py-0.5 rounded transition cursor-pointer ${
            showRoots ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300' : 'text-slate-400'
          }`}
        >
          الجذور ({graphData?.stats.rootsCount || 0})
        </button>
        <button
          onClick={() => setShowThemes(!showThemes)}
          className={`px-2 py-0.5 rounded transition cursor-pointer ${
            showThemes ? 'bg-amber-50 text-amber-800 font-bold border border-amber-300' : 'text-slate-400'
          }`}
        >
          الموضوعات ({graphData?.stats.themesCount || 0})
        </button>
      </div>

      <div className="flex items-center gap-1 bg-white/95 border border-slate-200 rounded-lg p-1 backdrop-blur-md pointer-events-auto shadow-sm">
        <button onClick={onZoomIn} className="p-1 hover:bg-slate-100 text-slate-600 rounded cursor-pointer" title="تكبير">
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button onClick={onZoomOut} className="p-1 hover:bg-slate-100 text-slate-600 rounded cursor-pointer" title="تصغير">
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button onClick={onReset} className="p-1 hover:bg-slate-100 text-slate-600 rounded cursor-pointer" title="إعادة ضبط الرؤية">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
