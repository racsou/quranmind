import { NextRequest, NextResponse } from 'next/server'
import { SURAHS_META, getSurahVerses } from '@/lib/quran/quran-data'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ n: string }> }
) {
  const { n } = await params
  const surahNum = parseInt(n, 10)

  if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
    return NextResponse.json(
      { code: 'INVALID_SURAH', message: `Surah number must be between 1 and 114. Received: ${n}` },
      { status: 400 }
    )
  }

  const meta = SURAHS_META.find((s) => s.number === surahNum)
  if (!meta) {
    return NextResponse.json(
      { code: 'NOT_FOUND', message: `Surah ${surahNum} not found.` },
      { status: 404 }
    )
  }

  const verses = getSurahVerses(surahNum)

  return NextResponse.json({
    surah: {
      number: meta.number,
      name_ar: meta.name,
      name_en: meta.englishName,
      name_translation: meta.englishTranslation,
      ayahs_count: meta.numberOfAyahs,
      revelation_type: meta.revelationType.toLowerCase(),
    },
    ayahs: verses.map((v) => ({
      ayah: v.ayah,
      id: `${meta.number}:${v.ayah}`,
      text_ar: v.text,
      text_en: v.translation,
      juz: v.juz || 1,
      page: v.page || 1,
    })),
  })
}
