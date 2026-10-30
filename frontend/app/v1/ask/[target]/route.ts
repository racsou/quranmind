import { NextRequest } from 'next/server'
import { searchQuran } from '@/lib/quran/quran-data'
import { HADITH_CORPUS } from '@/lib/hadith/mustalah-engine'
import { executeAgentStream } from '@/lib/agent/llm-provider'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ target: string }> }
) {
  const { target } = await params
  let question = ''
  try {
    const body = await req.json()
    question = body.question || ''
  } catch {
    question = ''
  }

  // Retrieve relevant sources based on target
  const quranSources = searchQuran(question || 'حمد', 3).map((v) => ({
    id: `${v.surah}:${v.ayah}`,
    text_ar: v.text,
    text_en: v.translation,
  }))

  const hadithSources = HADITH_CORPUS.slice(0, 2).map((h) => ({
    id: h.id.replace('-', ':'),
    collection: h.collection,
    text_ar: h.arabicMatn,
  }))

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      // 1. Initial SSE event carrying sources matching ilm API.md
      const initialPayload =
        target === 'hadith'
          ? { hadith_sources: hadithSources }
          : target === 'all'
          ? { quran_sources: quranSources, hadith_sources: hadithSources }
          : { quran_sources: quranSources }

      controller.enqueue(encoder.encode(`data: ${JSON.stringify(initialPayload)}\n\n`))

      try {
        await executeAgentStream(
          {
            query: question || 'التدبر والبحث في آيات القرآن الكريم',
            model: 'command-r7b-arabic',
            provider: 'auto',
          },
          {
            onToken: (tok) => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: tok })}\n\n`))
            },
            onDone: () => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`))
              controller.close()
            },
            onError: () => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`))
              controller.close()
            },
          }
        )
      } catch {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
