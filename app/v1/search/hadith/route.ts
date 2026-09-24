import { NextRequest, NextResponse } from 'next/server'
import { HADITH_CORPUS } from '@/lib/hadith/mustalah-engine'

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

  const qLower = q.toLowerCase()
  const matches = HADITH_CORPUS.filter(
    (h) =>
      h.arabicMatn.includes(q) ||
      h.englishMatn.toLowerCase().includes(qLower) ||
      h.primaryNarrator.includes(q) ||
      h.themes.some((t) => t.toLowerCase().includes(qLower))
  ).slice(0, limit)

  return NextResponse.json({
    query: q,
    count: matches.length,
    data: matches.map((h) => ({
      id: h.id.replace('-', ':'),
      collection: h.collection,
      number: h.number,
      primary_narrator: h.primaryNarrator,
      text_ar: h.arabicMatn,
      text_en: h.englishMatn,
      breadth: h.breadth,
      themes: h.themes,
    })),
  })
}
