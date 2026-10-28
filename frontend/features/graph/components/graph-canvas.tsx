import React from 'react'
import { Loader2 } from 'lucide-react'
import { GraphNode, GraphEdge, ResearchGraphData } from '@/lib/quran/research-graph'
import { Point } from '../types/graph-view'

interface GraphCanvasProps {
  graphData: ResearchGraphData | null
  loading: boolean
  zoom: number
  pan: Point
  nodePositions: Map<string, Point>
  visibleNodes: GraphNode[]
  visibleEdges: GraphEdge[]
  hoveredNode: GraphNode | null
  setHoveredNode: (n: GraphNode | null) => void
  onSelectVerse?: (surah: number, ayah: number) => void
  onSelectRoot?: (root: string) => void
  containerRef: React.RefObject<HTMLDivElement | null>
  onMouseDown: (e: React.MouseEvent) => void
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
}

export function GraphCanvas({
  graphData,
  loading,
  zoom,
  pan,
  nodePositions,
  visibleNodes,
  visibleEdges,
  hoveredNode,
  setHoveredNode,
  onSelectVerse,
  onSelectRoot,
  containerRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}: GraphCanvasProps) {
  return (
    <div
      ref={containerRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      className="flex-1 w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden bg-slate-50/60"
    >
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 backdrop-blur-xs">
          <Loader2 className="w-6 h-6 animate-spin text-teal-700" />
        </div>
      )}

      <svg className="w-full h-full" viewBox="-350 -350 700 700" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="lightGraphGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
          </pattern>
        </defs>

        <rect x="-350" y="-350" width="700" height="700" fill="url(#lightGraphGrid)" />
        <circle cx="0" cy="0" r="130" fill="none" stroke="#cbd5e1" strokeDasharray="3 3" />
        <circle cx="0" cy="0" r="210" fill="none" stroke="#cbd5e1" strokeDasharray="3 3" />
        <circle cx="0" cy="0" r="270" fill="none" stroke="#cbd5e1" strokeDasharray="3 3" />

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {visibleEdges.map((edge) => {
            const p1 = nodePositions.get(edge.source)
            const p2 = nodePositions.get(edge.target)
            if (!p1 || !p2) return null
            const isHovered = hoveredNode && (hoveredNode.id === edge.source || hoveredNode.id === edge.target)
            return (
              <line
                key={edge.id}
                x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke={isHovered ? '#0284c7' : '#94a3b8'}
                strokeWidth={isHovered ? 2.5 : edge.weight > 0.8 ? 1.5 : 1}
                strokeDasharray={edge.type === 'similarity' ? '4 3' : undefined}
                opacity={isHovered ? 1 : 0.65}
                className="transition-all duration-200"
              />
            )
          })}

          {visibleNodes.map((node) => {
            const pos = nodePositions.get(node.id)
            if (!pos) return null
            const isCenter = node.id === graphData?.centerVerseId
            const isHovered = hoveredNode?.id === node.id
            const radius = isCenter ? 26 : node.type === 'verse' ? 17 : node.type === 'root' ? 19 : 15

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={(e) => {
                  e.stopPropagation()
                  if (node.type === 'verse' && node.surah && node.ayah) onSelectVerse?.(node.surah, node.ayah)
                  else if (node.type === 'root' && node.root) onSelectRoot?.(node.root)
                }}
                className="cursor-pointer transition-transform duration-200"
              >
                {isCenter && <circle r={radius + 8} fill="none" stroke="#0d9488" strokeWidth="2" opacity="0.4" className="animate-ping" />}
                <circle
                  r={radius}
                  fill={node.color}
                  fillOpacity={isCenter ? '0.95' : isHovered ? '0.9' : '0.8'}
                  stroke={isHovered ? '#0f172a' : '#ffffff'}
                  strokeWidth={isHovered ? '2.5' : '1.5'}
                />
                {node.type === 'root' && (
                  <text textAnchor="middle" dy="4" fontSize="9" fontWeight="bold" fill="#ffffff" fontFamily="var(--font-cairo), sans-serif">
                    {node.root}
                  </text>
                )}
                {node.type === 'verse' && (
                  <text textAnchor="middle" dy="4" fontSize={isCenter ? '10' : '8'} fontWeight="bold" fill="#ffffff" fontFamily="var(--font-cairo), sans-serif">
                    {node.ayah}
                  </text>
                )}
                {node.type === 'theme' && (
                  <text textAnchor="middle" dy="3.5" fontSize="7" fontWeight="bold" fill="#ffffff">★</text>
                )}
                <text
                  y={radius + 12}
                  textAnchor="middle"
                  fontSize={isCenter ? '11' : '9'}
                  fontWeight={isCenter ? 'bold' : 'normal'}
                  fill={isHovered ? '#0284c7' : '#475569'}
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

      {hoveredNode && (
        <div className="absolute bottom-3 right-3 max-w-xs p-3 bg-white/95 border border-slate-200 rounded-xl shadow-lg backdrop-blur-md text-xs space-y-1 pointer-events-none z-30">
          <div className="flex items-center justify-between text-teal-800 font-bold">
            <span>{hoveredNode.label}</span>
            <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-700">
              {hoveredNode.type === 'verse' ? 'آية قرآنية' : hoveredNode.type === 'root' ? 'جذر لغوي' : 'موضوع معرفي'}
            </span>
          </div>
          {hoveredNode.text && <p className="text-slate-800 font-serif leading-relaxed text-[11px] line-clamp-2">«{hoveredNode.text}»</p>}
        </div>
      )}

      <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-white/90 border border-slate-200 rounded-lg px-2.5 py-1.5 backdrop-blur-md text-[10px] text-slate-600 shadow-sm">
        <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> الآيات</div>
        <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> الجذور</div>
        <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> الموضوعات</div>
      </div>
    </div>
  )
}
