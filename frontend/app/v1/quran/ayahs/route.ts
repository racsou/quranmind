import { NextRequest, NextResponse } from 'next/server'
import { getAllVerses, getSurahVerses } from '@/lib/quran/quran-data'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '20', 10)
  const surahParam = searchParams.get('surah')

  let verses = getAllVerses()
  if (surahParam) {
    const sNum = parseInt(surahParam, 10)
    if (!isNaN(sNum)) {
      verses = getSurahVerses(sNum)
    }
  }

  const startIndex = (page - 1) * limit
  const pagedData = verses.slice(startIndex, startIndex + limit).map((v) => ({
    id: `${v.surah}:${v.ayah}`,
    surah: v.surah,
    ayah: v.ayah,
    surah_name: v.surahName,
    surah_name_en: v.surahEnglishName,
    text_ar: v.text,
    text_en: v.translation,
    juz: v.juz || 1,
    page: v.page || 1,
  }))

  return NextResponse.json({
    data: pagedData,
    page,
    limit,
    total: verses.length,
    has_more: startIndex + limit < verses.length,
  })
}
