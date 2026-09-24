import { NextRequest, NextResponse } from 'next/server'
import { HADITH_CORPUS, type Narrator } from '@/lib/hadith/mustalah-engine'

export function getAllNarrators(): Narrator[] {
  const map = new Map<string, Narrator>()
  HADITH_CORPUS.forEach((h) => {
    h.chains.forEach((c) => {
      c.narratorPath.forEach((n) => {
        if (!map.has(n.id)) {
          map.set(n.id, n)
        }
      })
    })
  })
  return Array.from(map.values())
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.toLowerCase()
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '20', 10)

  let narrators = getAllNarrators()
  if (q) {
    narrators = narrators.filter((n) =>
      n.name.toLowerCase().includes(q) || n.arabicName.includes(q) || n.id.includes(q)
    )
  }

  const startIndex = (page - 1) * limit
  const paged = narrators.slice(startIndex, startIndex + limit).map((n) => ({
    id: n.id,
    name_ar: n.arabicName,
    name_en: n.name,
    generation: n.generation,
    reliability: n.reliability,
  }))

  return NextResponse.json({
    data: paged,
    page,
    limit,
    total: narrators.length,
    has_more: startIndex + limit < narrators.length,
  })
}
