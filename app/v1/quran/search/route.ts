import { NextRequest, NextResponse } from 'next/server'
import { searchQuran, type QuranVerse } from '@/lib/quran/quran-data'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const limit = parseInt(searchParams.get('limit') || '20', 10)

  if (!q.trim()) {
    return NextResponse.json({
      success: false,
      error: 'Query parameter "q" is required',
    }, { status: 400 })
  }

  const results: QuranVerse[] = searchQuran(q, limit)

  return NextResponse.json({
    success: true,
    version: '1.0',
    query: q,
    count: results.length,
    data: results.map((v: QuranVerse) => ({
      surah: v.surah,
      ayah: v.ayah,
      surahName: v.surahName,
      text: v.text,
      translation: v.translation,
    })),
  })
}
