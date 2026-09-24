import { NextRequest, NextResponse } from 'next/server'
import { getRecurrentPhrases } from '@/lib/quran/quran-data'
import { redisCache } from '@/lib/redis/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const surah = Number(searchParams.get('surah') || '1')
    const ayah = Number(searchParams.get('ayah') || '1')

    const cacheKey = `quran:phrases:${surah}:${ayah}`

    const results = await redisCache.getOrSet(
      cacheKey,
      async () => {
        return getRecurrentPhrases(surah, ayah)
      },
      3600
    )

    return NextResponse.json({
      success: true,
      surah,
      ayah,
      count: results.length,
      data: results,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
