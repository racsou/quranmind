'use client'

import React from 'react'
import { ResearchGraphProps } from '../types/graph-view'
export type { ResearchGraphProps }
import { useGraphLayout } from '../hooks/use-graph-layout'
import { GraphToolbar } from './graph-toolbar'
import { GraphCanvas } from './graph-canvas'

export function ResearchGraphView({
  surah,
  ayah,
  onSelectVerse,
  onSelectRoot,
  className = '',
}: ResearchGraphProps) {
  const layout = useGraphLayout(surah, ayah)

  return (
    <div
      className={`relative w-full h-full min-h-[460px] bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col select-none shadow-sm ${className}`}
      dir="rtl"
    >
      <GraphToolbar
        graphData={layout.graphData}
        showVerses={layout.showVerses}
        setShowVerses={layout.setShowVerses}
        showRoots={layout.showRoots}
        setShowRoots={layout.setShowRoots}
        showThemes={layout.showThemes}
        setShowThemes={layout.setShowThemes}
        onZoomIn={() => layout.setZoom(Math.min(layout.zoom + 0.2, 2.2))}
        onZoomOut={() => layout.setZoom(Math.max(layout.zoom - 0.2, 0.5))}
        onReset={layout.resetView}
      />

      <GraphCanvas
        graphData={layout.graphData}
        loading={layout.loading}
        zoom={layout.zoom}
        pan={layout.pan}
        nodePositions={layout.nodePositions}
        visibleNodes={layout.visibleNodes}
        visibleEdges={layout.visibleEdges}
        hoveredNode={layout.hoveredNode}
        setHoveredNode={layout.setHoveredNode}
        onSelectVerse={onSelectVerse}
        onSelectRoot={onSelectRoot}
        containerRef={layout.containerRef}
        onMouseDown={layout.handleMouseDown}
        onMouseMove={layout.handleMouseMove}
        onMouseUp={layout.handleMouseUp}
      />
    </div>
  )
}
