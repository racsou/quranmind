import { NextRequest, NextResponse } from 'next/server'
import { HADITH_CORPUS } from '@/lib/hadith/mustalah-engine'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const normalizedId = id.replace(':', '-').toLowerCase()

  const hadith = HADITH_CORPUS.find((h) =>
    h.id.toLowerCase() === normalizedId || h.id.replace('-', ':').toLowerCase() === id.toLowerCase()
  )

  if (!hadith) {
    return NextResponse.json(
      { code: 'NOT_FOUND', message: `Hadith with ID '${id}' not found.` },
      { status: 404 }
    )
  }

  // Construct node-link graph from chains
  const nodesMap = new Map<string, any>()
  const links: Array<{ source: string; target: string; relationship: string }> = []

  hadith.chains.forEach((chain) => {
    for (let i = 0; i < chain.narratorPath.length; i++) {
      const n = chain.narratorPath[i]
      if (!nodesMap.has(n.id)) {
        nodesMap.set(n.id, {
          id: n.id,
          name_ar: n.arabicName,
          name_en: n.name,
          generation: n.generation,
          reliability: n.reliability,
          tier: i + 1,
        })
      }
      if (i > 0) {
        const prev = chain.narratorPath[i - 1]
        links.push({
          source: prev.id,
          target: n.id,
          relationship: 'heard_from',
        })
      }
    }
  })

  return NextResponse.json({
    hadith_id: hadith.id.replace('-', ':'),
    nodes: Array.from(nodesMap.values()),
    links,
  })
}
