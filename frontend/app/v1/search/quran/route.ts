import { NextRequest, NextResponse } from 'next/server'
import { searchQuran } from '@/lib/quran/quran-data'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const limit = parseInt(searchParams.get('limit') || '20', 10)

  if (!q.trim()) {
    return NextResponse.json(
      { code: 'BAD_REQUEST', message: 'Query parameter "q" is required' },
      { status: 400 }
    )
  }

  const matches = searchQuran(q, limit)

  return NextResponse.json({
    query: q,
    count: matches.length,
    data: matches.map((v) => ({
      id: `${v.surah}:${v.ayah}`,
      surah: v.surah,
      ayah: v.ayah,
      surah_name_ar: v.surahName,
      surah_name_en: v.surahEnglishName,
      text_ar: v.text,
      text_en: v.translation,
    })),
  })
}
