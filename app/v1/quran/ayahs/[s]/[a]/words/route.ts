import { NextRequest, NextResponse } from 'next/server'
import { lookupVerse } from '@/lib/quran/quran-data'
import { analyzeQuranWord } from '@/lib/quran/morphology'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ s: string; a: string }> }
) {
  const { s, a } = await params
  const surahNum = parseInt(s, 10)
  const ayahNum = parseInt(a, 10)

  const verse = lookupVerse(surahNum, ayahNum)
  if (!verse) {
    return NextResponse.json(
      { code: 'NOT_FOUND', message: `Ayah ${surahNum}:${ayahNum} not found.` },
      { status: 404 }
    )
  }

  const rawWords = verse.text.split(/\s+/).filter(Boolean)
  const words = rawWords.map((w, index) => {
    const analysis = analyzeQuranWord(w)
    return {
      position: index + 1,
      word_ar: w,
      clean_ar: analysis.cleanWord,
      root: analysis.root || null,
      abjad: analysis.abjadValue,
      occurrences_in_quran: analysis.occurrencesCount,
    }
  })

  return NextResponse.json(words)
}
