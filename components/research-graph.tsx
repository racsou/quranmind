'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  Share2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  BookOpen,
  Filter,
  Layers,
  Compass,
  Tag,
  Loader2,
  Info,
} from 'lucide-react'
import {
  buildVerseResearchGraph,
  type ResearchGraphData,
  type GraphNode,
  type GraphEdge,
} from '@/lib/quran/research-graph'

export interface ResearchGraphProps {
  surah: number
  ayah: number
  onSelectVerse?: (surah: number, ayah: number) => void
  onSelectRoot?: (root: string) => void
  className?: string
}

interface Point {
  x: number
  y: number
}

export function ResearchGraph({
  surah,
  ayah,
  onSelectVerse,
  onSelectRoot,
  className = '',
}: ResearchGraphProps) {
  const [graphData, setGraphData] = useState<ResearchGraphData | null>(null)
  const [loading, setLoading] = useState(false)
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 })

  // Filter toggles
  const [showVerses, setShowVerses] = useState(true)
  const [showRoots, setShowRoots] = useState(true)
  const [showThemes, setShowThemes] = useState(true)

  const containerRef = useRef<HTMLDivElement | null>(null)

  // Fetch or calculate graph data
  useEffect(() => {
    setLoading(true)
    fetch(`/api/quran/graph?surah=${surah}&ayah=${ayah}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setGraphData(res.data)
        } else {
          setGraphData(buildVerseResearchGraph(surah, ayah))
        }
      })
      .catch(() => {
        setGraphData(buildVerseResearchGraph(surah, ayah))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [surah, ayah])

  // Compute 2D coordinates for nodes (Radial Layout)
  const nodePositions = useMemo(() => {
    if (!graphData) return new Map<string, Point>()
    const map = new Map<string, Point>()
    const centerNode = graphData.nodes.find((n) => n.id === graphData.centerVerseId)

    // Center is (0, 0)
    if (centerNode) {
      map.set(centerNode.id, { x: 0, y: 0 })
    }

    const otherNodes = graphData.nodes.filter((n) => n.id !== graphData.centerVerseId)
    const roots = otherNodes.filter((n) => n.type === 'root')
    const verses = otherNodes.filter((n) => n.type === 'verse')
    const themes = otherNodes.filter((n) => n.type === 'theme')

    // Orbit 1: Trilateral Roots (Radius: 130px)
    roots.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / Math.max(roots.length, 1) - Math.PI / 2
      map.set(node.id, {
        x: Math.cos(angle) * 130,
        y: Math.sin(angle) * 130,
      })
    })

    // Orbit 2: Similar Verses (Radius: 210px)
    verses.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / Math.max(verses.length, 1)
      map.set(node.id, {
        x: Math.cos(angle) * 210,
        y: Math.sin(angle) * 210,
      })
    })

    // Orbit 3: Thematic Clusters (Radius: 280px)
    themes.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / Math.max(themes.length, 1) + Math.PI / 4
      map.set(node.id, {
        x: Math.cos(angle) * 270,
        y: Math.sin(angle) * 270,
      })
    })

    return map
  }, [graphData])

  // Filtered nodes
  const visibleNodes = useMemo(() => {
    if (!graphData) return []
    return graphData.nodes.filter((n) => {
      if (n.id === graphData.centerVerseId) return true
      if (n.type === 'verse' && !showVerses) return false
      if (n.type === 'root' && !showRoots) return false
      if (n.type === 'theme' && !showThemes) return false
      return true
    })
  }, [graphData, showVerses, showRoots, showThemes])

  const visibleNodeIds = useMemo(() => {
    return new Set(visibleNodes.map((n) => n.id))
  }, [visibleNodes])

  // Filtered edges
  const visibleEdges = useMemo(() => {
    if (!graphData) return []
    return graphData.edges.filter(
      (e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
    )
  }, [graphData, visibleNodeIds])

  // Pan handlers
  function handleMouseDown(e: React.MouseEvent) {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging) return
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }

  function handleMouseUp() {
    setIsDragging(false)
  }

  function resetView() {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  return (
    <div
      className={`relative w-full h-full min-h-[460px] bg-[#020b18] border border-cyan-900/60 rounded-xl overflow-hidden flex flex-col select-none ${className}`}
      dir="rtl"
    >
      {/* Top Controls Bar */}
      <div className="absolute top-3 right-3 left-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Title & Stats Badge */}
        <div className="flex items-center gap-2 bg-[#031527]/90 border border-slate-800 rounded-lg px-2.5 py-1.5 backdrop-blur-md pointer-events-auto shadow-lg">
          <Share2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white">
            شبكة العلاقات المعرفية <em>(Research Graph)</em>
          </span>
          {graphData && (
            <span className="text-[10px] text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40">
              {graphData.stats.totalNodes} عقد · {graphData.stats.totalEdges} روابط
            </span>
          )}
        </div>

        {/* Visibility Filter Toggles */}
        <div className="flex items-center gap-1 bg-[#031527]/90 border border-slate-800 rounded-lg p-1 backdrop-blur-md pointer-events-auto text-[11px] shadow-lg">
          <button
            onClick={() => setShowVerses(!showVerses)}
            className={`px-2 py-0.5 rounded transition ${
              showVerses ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700/50' : 'text-slate-500'
            }`}
          >
            الآيات ({graphData?.stats.similarityCount || 0})
          </button>
          <button
            onClick={() => setShowRoots(!showRoots)}
            className={`px-2 py-0.5 rounded transition ${
              showRoots ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-700/50' : 'text-slate-500'
            }`}
          >
            الجذور ({graphData?.stats.rootsCount || 0})
          </button>
          <button
            onClick={() => setShowThemes(!showThemes)}
            className={`px-2 py-0.5 rounded transition ${
              showThemes ? 'bg-amber-950 text-amber-300 font-bold border border-amber-700/50' : 'text-slate-500'
            }`}
          >
            الموضوعات ({graphData?.stats.themesCount || 0})
          </button>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-1 bg-[#031527]/90 border border-slate-800 rounded-lg p-1 backdrop-blur-md pointer-events-auto shadow-lg">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.2, 2.2))}
            className="p-1 hover:bg-slate-800 text-slate-300 rounded"
            title="تكبير"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
            className="p-1 hover:bg-slate-800 text-slate-300 rounded"
            title="تصغير"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetView}
            className="p-1 hover:bg-slate-800 text-slate-300 rounded"
            title="إعادة ضبط الرؤية"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex-1 w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden"
      >
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-xs">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
          </div>
        )}

        <svg
          className="w-full h-full"
          viewBox="-350 -350 700 700"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Subtle Grid Background */}
          <defs>
            <radialGradient id="graphGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#020b18" stopOpacity="0" />
            </radialGradient>
            <pattern id="graphGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10253f" strokeWidth="0.5" />
            </pattern>
          </defs>

          <rect x="-350" y="-350" width="700" height="700" fill="url(#graphGrid)" />
          <circle cx="0" cy="0" r="280" fill="url(#graphGlow)" />

          {/* Concentric Guide Orbits */}
          <circle cx="0" cy="0" r="130" fill="none" stroke="#1e293b" strokeDasharray="3 3" />
          <circle cx="0" cy="0" r="210" fill="none" stroke="#1e293b" strokeDasharray="3 3" />
          <circle cx="0" cy="0" r="270" fill="none" stroke="#1e293b" strokeDasharray="3 3" />

          {/* Group with Zoom & Pan Transforms */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* 1. EDGES */}
            {visibleEdges.map((edge) => {
              const p1 = nodePositions.get(edge.source)
              const p2 = nodePositions.get(edge.target)
              if (!p1 || !p2) return null

              const isHovered =
                hoveredNode &&
                (hoveredNode.id === edge.source || hoveredNode.id === edge.target)

              return (
                <g key={edge.id}>
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={isHovered ? '#38bdf8' : edge.color}
                    strokeWidth={isHovered ? 2.5 : edge.weight > 0.8 ? 1.5 : 1}
                    strokeDasharray={edge.type === 'similarity' ? '4 3' : undefined}
                    opacity={isHovered ? 1 : 0.65}
                    className="transition-all duration-200"
                  />
                </g>
              )
            })}

            {/* 2. NODES */}
            {visibleNodes.map((node) => {
              const pos = nodePositions.get(node.id)
              if (!pos) return null

              const isCenter = node.id === graphData?.centerVerseId
              const isHovered = hoveredNode?.id === node.id

              const radius = isCenter
                ? 26
                : node.type === 'verse'
                ? 17
                : node.type === 'root'
                ? 19
                : 15

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (node.type === 'verse' && node.surah && node.ayah) {
                      onSelectVerse?.(node.surah, node.ayah)
                    } else if (node.type === 'root' && node.root) {
                      onSelectRoot?.(node.root)
                    }
                  }}
                  className="cursor-pointer transition-transform duration-200"
                >
                  {/* Glowing halo for center node */}
                  {isCenter && (
                    <circle
                      r={radius + 8}
                      fill="none"
                      stroke="#00d4ff"
                      strokeWidth="2"
                      opacity="0.4"
                      className="animate-ping"
                    />
                  )}

                  {/* Main Node Body */}
                  <circle
                    r={radius}
                    fill={node.color}
                    fillOpacity={isCenter ? '0.95' : isHovered ? '0.9' : '0.75'}
                    stroke={isHovered ? '#ffffff' : '#03172b'}
                    strokeWidth={isHovered ? '2.5' : '1.5'}
                    filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))"
                  />

                  {/* Icon or Type Indicator */}
                  {node.type === 'root' && (
                    <text
                      textAnchor="middle"
                      dy="4"
                      fontSize="9"
                      fontWeight="bold"
                      fill="#ffffff"
                      fontFamily="var(--font-cairo), sans-serif"
                    >
                      {node.root}
                    </text>
                  )}

                  {node.type === 'verse' && (
                    <text
                      textAnchor="middle"
                      dy="4"
                      fontSize={isCenter ? '10' : '8'}
                      fontWeight="bold"
                      fill={isCenter ? '#020b18' : '#ffffff'}
                      fontFamily="var(--font-cairo), sans-serif"
                    >
                      {isCenter ? `${node.ayah}` : `${node.ayah}`}
                    </text>
                  )}

                  {node.type === 'theme' && (
                    <text
                      textAnchor="middle"
                      dy="3.5"
                      fontSize="7"
                      fontWeight="bold"
                      fill="#ffffff"
                    >
                      ★
                    </text>
                  )}

                  {/* Node Label Below */}
                  <text
                    y={radius + 12}
                    textAnchor="middle"
                    fontSize={isCenter ? '11' : '9'}
                    fontWeight={isCenter ? 'bold' : 'normal'}
                    fill={isHovered ? '#38bdf8' : '#cbd5e1'}
                    fontFamily="var(--font-cairo), sans-serif"
                    className="pointer-events-none"
                  >
                    {node.label}
                  </text>
                </g>
              )
            })}
          </g>
        </svg>

        {/* Hovered Node Tooltip Card */}
        {hoveredNode && (
          <div className="absolute bottom-3 right-3 max-w-xs p-3 bg-[#03172c]/95 border border-cyan-600/60 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-1 pointer-events-none z-30">
            <div className="flex items-center justify-between text-cyan-300 font-bold">
              <span>{hoveredNode.label}</span>
              <span className="text-[10px] bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800/40">
                {hoveredNode.type === 'verse'
                  ? 'آية قرآنية'
                  : hoveredNode.type === 'root'
                  ? 'جذر لغوي'
                  : 'موضوع معرفي'}
              </span>
            </div>

            {hoveredNode.text && (
              <p className="text-slate-200 font-serif leading-relaxed text-[11px] line-clamp-2">
                «{hoveredNode.text}»
              </p>
            )}

            <div className="text-[10px] text-slate-400">
              {hoveredNode.type === 'verse'
                ? 'انقر لتثبيت هذه الآية في مساحة العمل'
                : hoveredNode.type === 'root'
                ? 'انقر لاستعراض شجرة اشتقاقات الجذر'
                : 'محور موضوعي مشترك'}
            </div>
          </div>
        )}

        {/* Legend in Bottom Left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-[#020e1d]/90 border border-slate-800 rounded-lg px-2.5 py-1.5 backdrop-blur-md text-[10px] text-slate-400">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> الآيات
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> الجذور
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> الموضوعات
          </div>
        </div>
      </div>
    </div>
  )
}
