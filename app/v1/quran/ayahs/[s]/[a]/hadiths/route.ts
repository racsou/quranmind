import { NextRequest, NextResponse } from 'next/server'
import { SCHOLARLY_ARCHIVE } from '@/lib/quran/tafsir-hadith'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ s: string; a: string }> }
) {
  const { s, a } = await params
  const surahNum = parseInt(s, 10)
  const ayahNum = parseInt(a, 10)
  const key = `${surahNum}:${ayahNum}`

  const archive = SCHOLARLY_ARCHIVE[key]
  const citations = archive?.hadithCitations || []

  return NextResponse.json({
    surah: surahNum,
    ayah: ayahNum,
    count: citations.length,
    hadiths: citations.map((h) => ({
      source: h.source,
      number: h.number,
      text_ar: h.text,
      grade: h.isnadGrade,
      isnad_chain: h.narratorChain,
      relevance: h.relevanceNote,
    })),
  })
}
