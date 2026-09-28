import { NextRequest, NextResponse } from 'next/server'
import { HADITH_CORPUS } from '@/lib/hadith/mustalah-engine'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { from_narrator, to_narrator } = body

    const matchedChains: any[] = []

    HADITH_CORPUS.forEach((h) => {
      h.chains.forEach((c) => {
        const ids = c.narratorPath.map((n) => n.id.toLowerCase())
        const names = c.narratorPath.map((n) => n.arabicName)

        const matchFrom = from_narrator
          ? ids.some((id) => id.includes(from_narrator.toLowerCase())) ||
            names.some((name) => name.includes(from_narrator))
          : true

        const matchTo = to_narrator
          ? ids.some((id) => id.includes(to_narrator.toLowerCase())) ||
            names.some((name) => name.includes(to_narrator))
          : true

        if (matchFrom && matchTo) {
          matchedChains.push({
            hadith_id: h.id.replace('-', ':'),
            chain_id: c.chainId,
            collection: c.collection,
            grade: c.isnadGrade,
            path: c.narratorPath.map((n) => ({
              id: n.id,
              name_ar: n.arabicName,
              generation: n.generation,
              reliability: n.reliability,
            })),
          })
        }
      })
    })

    return NextResponse.json({
      count: matchedChains.length,
      data: matchedChains,
    })
  } catch (err: any) {
    return NextResponse.json(
      { code: 'BAD_REQUEST', message: err?.message || 'Invalid JSON body' },
      { status: 400 }
    )
  }
}
