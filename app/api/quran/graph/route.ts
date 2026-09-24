import { NextRequest, NextResponse } from 'next/server'
import { buildVerseResearchGraph, type ResearchGraphData } from '@/lib/quran/research-graph'
import { redisCache } from '@/lib/redis/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const surah = Number(searchParams.get('surah') || '21')
    const ayah = Number(searchParams.get('ayah') || '33')
    const maxNeighbors = Number(searchParams.get('limit') || '12')

    const cacheKey = `graph:${surah}:${ayah}:${maxNeighbors}`

    const graphData = await redisCache.getOrSet<ResearchGraphData>(
      cacheKey,
      async () => {
        return buildVerseResearchGraph(surah, ayah, maxNeighbors)
      },
      3600
    )

    return NextResponse.json({ success: true, data: graphData })
  } catch (error: any) {
    console.error('Error generating research graph:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'حدث خطأ أثناء بناء شبكة العلاقات' },
      { status: 500 }
    )
  }
}
