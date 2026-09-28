import { NextRequest, NextResponse } from 'next/server'
import { analyzeVerseDetailed, type NormalizationMode } from '@/lib/quran/analysis'
import { lookupVerse } from '@/lib/quran/quran-data'
import { redisCache } from '@/lib/redis/client'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { text, surah, ayah, mode = 'structural' } = body

    let targetText = text

    if (!targetText && surah && ayah) {
      const verse = lookupVerse(Number(surah), Number(ayah))
      if (!verse) {
        return NextResponse.json(
          { success: false, error: 'الآية المطلوبة غير موجودة في قاعدة البيانات' },
          { status: 404 }
        )
      }
      targetText = verse.text
    }

    if (!targetText || typeof targetText !== 'string') {
      return NextResponse.json(
        { success: false, error: 'النص المطلوب تحليله مفقود' },
        { status: 400 }
      )
    }

    const cacheKey = `quran:analyze:${mode}:${Buffer.from(targetText.trim()).toString('base64')}`

    const analysis = await redisCache.getOrSet(
      cacheKey,
      async () => {
        return analyzeVerseDetailed(targetText, mode as NormalizationMode)
      },
      3600 // Cache 1 hour
    )

    return NextResponse.json({
      success: true,
      data: analysis,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
