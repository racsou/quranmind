import { type GraphNode, type GraphEdge, type ResearchGraphData } from '@/lib/quran/research-graph'

export interface Point {
  x: number
  y: number
}

export interface ResearchGraphProps {
  surah: number
  ayah: number
  onSelectVerse?: (surah: number, ayah: number) => void
  onSelectRoot?: (root: string) => void
  className?: string
}
