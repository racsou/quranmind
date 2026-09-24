import { NextRequest, NextResponse } from 'next/server'
import { FAMILIES } from '../route'
import { HADITH_CORPUS } from '@/lib/hadith/mustalah-engine'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const family = FAMILIES.find((f) => f.id.toLowerCase() === id.toLowerCase())

  if (!family) {
    return NextResponse.json(
      { code: 'NOT_FOUND', message: `Hadith Family '${id}' not found.` },
      { status: 404 }
    )
  }

  const relatedHadiths = HADITH_CORPUS.filter((h) =>
    family.hadiths.includes(h.id.replace('-', ':'))
  )

  return NextResponse.json({
    family: {
      ...family,
      hadiths_detail: relatedHadiths.map((h) => ({
        id: h.id.replace('-', ':'),
        collection: h.collection,
        number: h.number,
        text_ar: h.arabicMatn,
        breadth: h.breadth,
      })),
    },
  })
}
