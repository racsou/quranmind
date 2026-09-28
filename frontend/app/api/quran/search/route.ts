import { NextRequest, NextResponse } from 'next/server'
import { searchQuran } from '@/lib/quran/quran-data'
import { redisCache } from '@/lib/redis/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || ''

    const cacheKey = `quran:search:${encodeURIComponent(query.trim())}`

    const results = await redisCache.getOrSet(
      cacheKey,
      async () => {
        return searchQuran(query)
      },
      1800 // Cache for 30 minutes
    )

    return NextResponse.json({
      success: true,
      query,
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
