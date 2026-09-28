import { lookupVerse, getAllVerses, getMatchingAyahs, type QuranVerse } from './quran-data'
import { extractArabicRoot } from './morphology'

export interface GraphNode {
  id: string
  label: string
  type: 'verse' | 'root' | 'theme' | 'similarity'
  surah?: number
  ayah?: number
  text?: string
  root?: string
  theme?: string
  degree: number
  color: string
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  type: 'root_link' | 'similarity' | 'theme_link'
  label?: string
  weight: number
  color: string
}

export interface ResearchGraphData {
  centerVerseId: string
  nodes: GraphNode[]
  edges: GraphEdge[]
  stats: {
    totalNodes: number
    totalEdges: number
    rootsCount: number
    similarityCount: number
    themesCount: number
  }
}

// Well-known theme mappings for key Quranic research verses
const VERSE_THEMES: Record<string, string[]> = {
  '21:33': ['علم الفلك والمدارات', 'حركة الأجرام', 'التناظر الكوني'],
  '36:40': ['علم الفلك والمدارات', 'انتظام الليل والنهار', 'التناظر الكوني'],
  '74:3': ['التناظر الحرفي التام', 'البلاغة والبيان', 'بدء الرسالة'],
  '21:30': ['نشأة الكون (الرتق والفتق)', 'أصل الحياة من الماء', 'الإعجاز العلمي'],
  '41:53': ['المنهج الاستقرائي', 'آيات الآفاق والأنفس', 'اليقين المعرفي'],
  '112:1': ['التوحيد المطلق', 'أحدية الذات', 'الأسماء والصفات'],
  '112:2': ['الصمدية', 'الغنى المطلق'],
  '55:19': ['البرزخ المائي', 'التقاء البحار', 'علوم المحيطات'],
  '55:20': ['البرزخ المائي', 'عدم البغي والمزج'],
  '67:3': ['تناسق السماوات', 'نفي التفاوت والخلل', 'الهندسة الكونية'],
}

/**
 * Builds an interactive visual research subgraph centered around a specific verse.
 */
export function buildVerseResearchGraph(
  surah: number,
  ayah: number,
  maxNeighbors = 12
): ResearchGraphData {
  const centerKey = `${surah}:${ayah}`
  const centerVerse = lookupVerse(surah, ayah) || lookupVerse(21, 33)!

  const nodesMap = new Map<string, GraphNode>()
  const edgesMap = new Map<string, GraphEdge>()

  // 1. Center Verse Node
  const centerNodeId = `v:${centerVerse.surah}:${centerVerse.ayah}`
  nodesMap.set(centerNodeId, {
    id: centerNodeId,
    label: `سورة ${centerVerse.surahName} (${centerVerse.ayah})`,
    type: 'verse',
    surah: centerVerse.surah,
    ayah: centerVerse.ayah,
    text: centerVerse.text,
    degree: 0,
    color: '#00d4ff', // Electric blue
  })

  // 2. Extract and Connect Trilateral Roots
  const words = centerVerse.text.split(/\s+/).filter(Boolean)
  const uniqueRoots = new Set<string>()

  for (const w of words) {
    const r = extractArabicRoot(w)
    if (r && r.length >= 2 && !uniqueRoots.has(r)) {
      uniqueRoots.add(r)
      const rootNodeId = `r:${r}`
      nodesMap.set(rootNodeId, {
        id: rootNodeId,
        label: `جذر (${r})`,
        type: 'root',
        root: r,
        degree: 0,
        color: '#10b981', // Emerald green
      })

      // Edge from verse to root
      const edgeId = `e:${centerNodeId}->${rootNodeId}`
      edgesMap.set(edgeId, {
        id: edgeId,
        source: centerNodeId,
        target: rootNodeId,
        type: 'root_link',
        label: `اشتقاق ${w}`,
        weight: 1,
        color: '#10b98188',
      })
    }
  }

  // 3. Connect Thematic Clusters
  const themes = VERSE_THEMES[centerKey] || ['مباحث الهداية والسنن']
  for (const th of themes) {
    const themeNodeId = `t:${th}`
    if (!nodesMap.has(themeNodeId)) {
      nodesMap.set(themeNodeId, {
        id: themeNodeId,
        label: th,
        type: 'theme',
        theme: th,
        degree: 0,
        color: '#f59e0b', // Amber gold
      })
    }

    const edgeId = `e:${centerNodeId}->${themeNodeId}`
    edgesMap.set(edgeId, {
      id: edgeId,
      source: centerNodeId,
      target: themeNodeId,
      type: 'theme_link',
      label: 'موضوع مشترك',
      weight: 0.8,
      color: '#f59e0b88',
    })
  }

  // 4. Connect Cross-Verse Similarities (from matching-ayah.json)
  const similarities = getMatchingAyahs(centerVerse.surah, centerVerse.ayah)
  for (const sim of similarities.slice(0, maxNeighbors)) {
    const simVerse = sim.verse
    if (!simVerse) continue

    const simNodeId = `v:${simVerse.surah}:${simVerse.ayah}`
    if (!nodesMap.has(simNodeId)) {
      nodesMap.set(simNodeId, {
        id: simNodeId,
        label: `${simVerse.surahName} (${simVerse.ayah})`,
        type: 'verse',
        surah: simVerse.surah,
        ayah: simVerse.ayah,
        text: simVerse.text,
        degree: 0,
        color: '#38bdf8', // Cyan
      })
    }

    const edgeId = `e:${centerNodeId}<->${simNodeId}`
    edgesMap.set(edgeId, {
      id: edgeId,
      source: centerNodeId,
      target: simNodeId,
      type: 'similarity',
      label: `تشابه ${sim.coverage}%`,
      weight: sim.coverage / 100,
      color: '#06b6d4',
    })

    // Also connect similar verse to the common roots if present
    for (const r of uniqueRoots) {
      if (simVerse.text.includes(r)) {
        const rootNodeId = `r:${r}`
        const simRootEdgeId = `e:${simNodeId}->${rootNodeId}`
        if (!edgesMap.has(simRootEdgeId)) {
          edgesMap.set(simRootEdgeId, {
            id: simRootEdgeId,
            source: simNodeId,
            target: rootNodeId,
            type: 'root_link',
            label: `جذر مشترك ${r}`,
            weight: 0.7,
            color: '#10b98155',
          })
        }
      }
    }
  }

  // Calculate degrees for node sizing
  for (const edge of edgesMap.values()) {
    const sNode = nodesMap.get(edge.source)
    const tNode = nodesMap.get(edge.target)
    if (sNode) sNode.degree += 1
    if (tNode) tNode.degree += 1
  }

  const nodes = Array.from(nodesMap.values())
  const edges = Array.from(edgesMap.values())

  return {
    centerVerseId: centerNodeId,
    nodes,
    edges,
    stats: {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      rootsCount: nodes.filter((n) => n.type === 'root').length,
      similarityCount: nodes.filter((n) => n.type === 'verse' && n.id !== centerNodeId).length,
      themesCount: nodes.filter((n) => n.type === 'theme').length,
    },
  }
}
