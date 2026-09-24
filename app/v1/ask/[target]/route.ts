import { NextRequest } from 'next/server'
import { searchQuran } from '@/lib/quran/quran-data'
import { HADITH_CORPUS } from '@/lib/hadith/mustalah-engine'

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
      // 1. Initial SSE event carrying sources matching API.md
      const initialPayload =
        target === 'hadith'
          ? { hadith_sources: hadithSources }
          : target === 'all'
          ? { quran_sources: quranSources, hadith_sources: hadithSources }
          : { quran_sources: quranSources }

      controller.enqueue(encoder.encode(`data: ${JSON.stringify(initialPayload)}\n\n`))

      // 2. Stream answer tokens
      const answer = `بناءً على نصوص الوحي والتحليل الاستقرائي لسؤالك حول «${question || 'التدبر والبحث'}»: يركز القرآن الكريم على اقتران الشكر بزيادة الفضل والنعم، كما في قوله تعالى: «لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ» (إبراهيم: 7)، ويؤكد النظم القرآني على أن الشكر عمل بالقلب واللسان والجوارح.`

      const words = answer.split(' ')
      for (const word of words) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: word + ' ' })}\n\n`))
        await new Promise((r) => setTimeout(r, 40))
      }

      // 3. Final event closing the stream matching API.md
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`))
      controller.close()
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
