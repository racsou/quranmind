'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { buildVerseResearchGraph, type ResearchGraphData, type GraphNode } from '@/lib/quran/research-graph'
import { Point } from '../types/graph-view'

export function useGraphLayout(surah: number, ayah: number) {
  const [graphData, setGraphData] = useState<ResearchGraphData | null>(null)
  const [loading, setLoading] = useState(false)
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 })

  const [showVerses, setShowVerses] = useState(true)
  const [showRoots, setShowRoots] = useState(true)
  const [showThemes, setShowThemes] = useState(true)

  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/quran/graph?surah=${surah}&ayah=${ayah}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) setGraphData(res.data)
        else setGraphData(buildVerseResearchGraph(surah, ayah))
      })
      .catch(() => setGraphData(buildVerseResearchGraph(surah, ayah)))
      .finally(() => setLoading(false))
  }, [surah, ayah])

  const nodePositions = useMemo(() => {
    if (!graphData) return new Map<string, Point>()
    const map = new Map<string, Point>()
    const centerNode = graphData.nodes.find((n) => n.id === graphData.centerVerseId)
    if (centerNode) map.set(centerNode.id, { x: 0, y: 0 })

    const otherNodes = graphData.nodes.filter((n) => n.id !== graphData.centerVerseId)
    const roots = otherNodes.filter((n) => n.type === 'root')
    const verses = otherNodes.filter((n) => n.type === 'verse')
    const themes = otherNodes.filter((n) => n.type === 'theme')

    roots.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / Math.max(roots.length, 1) - Math.PI / 2
      map.set(node.id, { x: Math.cos(angle) * 130, y: Math.sin(angle) * 130 })
    })

    verses.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / Math.max(verses.length, 1)
      map.set(node.id, { x: Math.cos(angle) * 210, y: Math.sin(angle) * 210 })
    })

    themes.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / Math.max(themes.length, 1) + Math.PI / 4
      map.set(node.id, { x: Math.cos(angle) * 270, y: Math.sin(angle) * 270 })
    })

    return map
  }, [graphData])

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

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map((n) => n.id)), [visibleNodes])

  const visibleEdges = useMemo(() => {
    if (!graphData) return []
    return graphData.edges.filter((e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target))
  }, [graphData, visibleNodeIds])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }

  const handleMouseUp = () => setIsDragging(false)
  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  return {
    graphData,
    loading,
    hoveredNode,
    setHoveredNode,
    zoom,
    setZoom,
    pan,
    nodePositions,
    visibleNodes,
    visibleEdges,
    showVerses,
    setShowVerses,
    showRoots,
    setShowRoots,
    showThemes,
    setShowThemes,
    containerRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetView,
  }
}
