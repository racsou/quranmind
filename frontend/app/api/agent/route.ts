import { NextRequest, NextResponse } from 'next/server'
import { searchQuran, QURAN_VERSES } from '@/lib/quran/quran-data'
import { analyzeVerseDetailed, checkSymmetry } from '@/lib/quran/analysis'
import { executeAgentStream } from '@/lib/agent/llm-provider'
import { redisCache } from '@/lib/redis/client'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      query,
      model = 'gemini-2.5-flash',
      provider = 'auto',
      endpoint = 'http://localhost:11434',
      apiKey,
      temperature = 0.2,
    } = body

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { success: false, error: 'سؤال البحث مطلوب' },
        { status: 400 }
      )
    }

    const cleanQuery = query.trim()
    const cacheKey = `agent:v3:${model}:${provider}:${Buffer.from(cleanQuery).toString('base64')}`

    const responseData = await redisCache.getOrSet(
      cacheKey,
      async () => {
        let accumulatedText = ''
        const toolsUsed: any[] = []

        await executeAgentStream(
          {
            query: cleanQuery,
            model,
            provider,
            endpoint,
            apiKey,
            temperature,
          },
          {
            onToolResult: (res) => {
              toolsUsed.push(res)
            },
            onToken: (tok) => {
              accumulatedText += tok
            },
            onDone: (full) => {
              accumulatedText = full || accumulatedText
            },
          }
        )

        // Matched verses extraction
        const matchedVerses = searchQuran(cleanQuery, 4)

        return {
          query: cleanQuery,
          modelUsed: model,
          provider: model.startsWith('gemini') ? 'Google Gemini' : 'Local AI Model',
          aiGeneratedExplanation: accumulatedText,
          toolsUsed,
          matchedVerses,
          disclaimer:
            'هذه النتائج مستندة إلى التحليل الرياضي والنصي الصارم للبيانات القرآنية المعتمدة، ولا تعد فتوى أو استنتاجاً علمياً جازماً دون مراجعة أهل الاختصاص.',
        }
      },
      3600 // Cache for 1 hour
    )

    return NextResponse.json({
      success: true,
      data: responseData,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'خطأ في معالجة الوكيل' },
      { status: 500 }
    )
  }
}
