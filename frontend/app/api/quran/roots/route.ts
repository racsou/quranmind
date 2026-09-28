import { NextRequest, NextResponse } from 'next/server'
import { analyzeWordToken, findRootOccurrences } from '@/lib/quran/morphology'
import { redisCache } from '@/lib/redis/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const word = searchParams.get('word')
    const root = searchParams.get('root')

    if (!word && !root) {
      return NextResponse.json(
        { success: false, error: 'يجب تحديد الكلمة (word) أو الجذر (root)' },
        { status: 400 }
      )
    }

    if (word) {
      const cacheKey = `quran:word:${encodeURIComponent(word.trim())}`
      const result = await redisCache.getOrSet(
        cacheKey,
        async () => {
          return analyzeWordToken(word)
        },
        7200
      )
      return NextResponse.json({ success: true, data: result })
    }

    if (root) {
      const cacheKey = `quran:root:${encodeURIComponent(root.trim())}`
      const occurrences = await redisCache.getOrSet(
        cacheKey,
        async () => {
          return findRootOccurrences(root, 40)
        },
        7200
      )
      return NextResponse.json({
        success: true,
        root,
        count: occurrences.length,
        data: occurrences,
      })
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
