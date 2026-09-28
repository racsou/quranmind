import { NextRequest, NextResponse } from 'next/server'
import { HADITH_CORPUS } from '@/lib/hadith/mustalah-engine'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const idLower = id.toLowerCase()

  let foundNarrator: any = null
  const relatedHadiths: string[] = []

  HADITH_CORPUS.forEach((h) => {
    h.chains.forEach((c) => {
      const match = c.narratorPath.find((n) => n.id.toLowerCase() === idLower)
      if (match) {
        if (!foundNarrator) foundNarrator = match
        relatedHadiths.push(h.id.replace('-', ':'))
      }
    })
  })

  if (!foundNarrator) {
    return NextResponse.json(
      { code: 'NOT_FOUND', message: `Narrator with ID '${id}' not found.` },
      { status: 404 }
    )
  }

  return NextResponse.json({
    narrator: {
      id: foundNarrator.id,
      name_ar: foundNarrator.arabicName,
      name_en: foundNarrator.name,
      generation: foundNarrator.generation,
      reliability: foundNarrator.reliability,
      total_narrations_indexed: relatedHadiths.length,
      hadiths: Array.from(new Set(relatedHadiths)),
    },
  })
}
