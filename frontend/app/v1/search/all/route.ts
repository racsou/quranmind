import { NextRequest, NextResponse } from 'next/server'
import { searchQuran, type QuranVerse } from '@/lib/quran/quran-data'
import { HADITH_CORPUS } from '@/lib/hadith/mustalah-engine'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const type = searchParams.get('type') || 'hybrid'

  if (!q.trim()) {
    return NextResponse.json(
      { code: 'BAD_REQUEST', message: 'Query parameter "q" is required' },
      { status: 400 }
    )
  }

  const qLower = q.toLowerCase()

  // Quran matches
  const quranMatches = searchQuran(q, limit).map((v) => ({
    id: `${v.surah}:${v.ayah}`,
    surah: v.surah,
    ayah: v.ayah,
    surah_name: v.surahName,
    text_ar: v.text,
    text_en: v.translation,
  }))

  // Hadith matches
  const hadithMatches = HADITH_CORPUS.filter(
    (h) =>
      h.arabicMatn.includes(q) ||
      h.englishMatn.toLowerCase().includes(qLower) ||
      h.themes.some((t) => t.toLowerCase().includes(qLower))
  )
    .slice(0, limit)
    .map((h) => ({
      id: h.id.replace('-', ':'),
      collection: h.collection,
      number: h.number,
      text_ar: h.arabicMatn,
      text_en: h.englishMatn,
      breadth: h.breadth,
    }))

  // Response shape matching API.md: curl '.../v1/search/all?q=patience...' | jq '{quran_count, hadith_count}'
  return NextResponse.json({
    query: q,
    type,
    quran_count: quranMatches.length,
    hadith_count: hadithMatches.length,
    quran: quranMatches,
    hadith: hadithMatches,
  })
}
