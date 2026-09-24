import { NextRequest, NextResponse } from 'next/server'
import { SURAHS_META } from '@/lib/quran/quran-data'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '114', 10)

  const surahs = SURAHS_META.map((s) => ({
    number: s.number,
    name_ar: s.name,
    name_en: s.englishName,
    name_translation: s.englishTranslation,
    ayahs_count: s.numberOfAyahs,
    revelation_type: s.revelationType.toLowerCase(),
  }))

  const startIndex = (page - 1) * limit
  const pagedData = surahs.slice(startIndex, startIndex + limit)

  return NextResponse.json({
    data: pagedData,
    page,
    limit,
    total: surahs.length,
    has_more: startIndex + limit < surahs.length,
  })
}
