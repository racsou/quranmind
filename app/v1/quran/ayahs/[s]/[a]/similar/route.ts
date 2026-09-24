import { NextRequest, NextResponse } from 'next/server'
import { getMatchingAyahs } from '@/lib/quran/quran-data'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ s: string; a: string }> }
) {
  const { s, a } = await params
  const surahNum = parseInt(s, 10)
  const ayahNum = parseInt(a, 10)

  const matching = getMatchingAyahs(surahNum, ayahNum)

  return NextResponse.json({
    surah: surahNum,
    ayah: ayahNum,
    count: matching.length,
    data: matching.map((m) => ({
      matched_key: m.matchedAyahKey,
      matched_words_count: m.matchedWordsCount,
      coverage: m.coverage,
      score: m.score,
      text_ar: m.verse?.text,
      text_en: m.verse?.translation,
    })),
  })
}
