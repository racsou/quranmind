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

  const primaryChain = hadith.chains[0]

  return NextResponse.json({
    hadith: {
      id: hadith.id.replace('-', ':'),
      collection: hadith.collection,
      number: hadith.number,
      text_ar: hadith.arabicMatn,
      text_en: hadith.englishMatn,
      chapter: hadith.themes[0] || 'كتاب الإيمان',
      primary_narrator: hadith.primaryNarrator,
      breadth: hadith.breadth,
      min_narrators_in_tier: hadith.minNarratorsInTier,
      breadth_explanation: hadith.breadthExplanation,
      isnad: primaryChain?.narratorPath.map((n, idx) => ({
        tier: idx + 1,
        narrator_id: n.id,
        name_ar: n.arabicName,
        name_en: n.name,
        generation: n.generation,
        reliability: n.reliability,
      })) || [],
      variants: hadith.variants || [],
    },
  })
}
