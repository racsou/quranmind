import { NextRequest, NextResponse } from 'next/server'
import { lookupVerse } from '@/lib/quran/quran-data'
import { analyzeVerseDetailed } from '@/lib/quran/analysis'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const surah = parseInt(searchParams.get('surah') || '1', 10)
  const ayah = parseInt(searchParams.get('ayah') || '1', 10)

  const verse = lookupVerse(surah, ayah)
  if (!verse) {
    return NextResponse.json(
      { success: false, error: 'الآية المطلوبة غير موجودة' },
      { status: 404 }
    )
  }

  const analysis = analyzeVerseDetailed(verse, 'structural')

  return NextResponse.json({
    success: true,
    version: '1.0',
    data: {
      surah: verse.surah,
      ayah: verse.ayah,
      surahName: verse.surahName,
      surahEnglishName: verse.surahEnglishName,
      revelationType: verse.revelationType,
      text: verse.text,
      translation: verse.translation,
      transliteration: verse.transliteration,
      juz: verse.juz,
      page: verse.page,
      analysis: {
        letterCount: analysis.letterCount,
        wordCount: analysis.wordCount,
        abjadValue: analysis.abjadValue,
        isPalindrome: analysis.symmetry.isPalindrome,
        classification: analysis.classification,
      },
    },
  })
}
