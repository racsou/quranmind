import { NextRequest, NextResponse } from 'next/server'
import { getTafsirForVerse } from '@/lib/quran/tafsir-hadith'
import { redisCache } from '@/lib/redis/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const surah = Number(searchParams.get('surah') || '1')
    const ayah = Number(searchParams.get('ayah') || '1')

    const cacheKey = `quran:tafsir:${surah}:${ayah}`

    const tafsir = await redisCache.getOrSet(
      cacheKey,
      async () => {
        return getTafsirForVerse(surah, ayah)
      },
      86400 // Cache for 24 hours
    )

    return NextResponse.json({
      success: true,
      surah,
      ayah,
      data: tafsir,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
