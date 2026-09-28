import { NextRequest, NextResponse } from 'next/server'
import { HADITH_CORPUS } from '@/lib/hadith/mustalah-engine'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '20', 10)
  const collection = searchParams.get('collection')

  let filtered = HADITH_CORPUS
  if (collection) {
    const colLower = collection.toLowerCase()
    filtered = filtered.filter((h) =>
      h.collection.toLowerCase().includes(colLower) || h.id.toLowerCase().startsWith(colLower)
    )
  }

  const startIndex = (page - 1) * limit
  const paged = filtered.slice(startIndex, startIndex + limit).map((h) => ({
    id: h.id.replace('-', ':'),
    collection: h.collection,
    number: h.number,
    primary_narrator: h.primaryNarrator,
    breadth: h.breadth,
    text_ar: h.arabicMatn,
    text_en: h.englishMatn,
    themes: h.themes,
    chains_count: h.chains.length,
  }))

  return NextResponse.json({
    data: paged,
    page,
    limit,
    total: filtered.length,
    has_more: startIndex + limit < filtered.length,
  })
}
