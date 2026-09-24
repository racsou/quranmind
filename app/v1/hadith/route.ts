import { NextRequest, NextResponse } from 'next/server'
import { HADITH_CORPUS, classifyHadithBreadth } from '@/lib/hadith/mustalah-engine'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const collection = searchParams.get('collection')

  if (id) {
    const item = HADITH_CORPUS.find((h) => h.id === id)
    if (!item) {
      return NextResponse.json({ success: false, error: 'الحديث غير موجود' }, { status: 404 })
    }
    const breadthInfo = classifyHadithBreadth(item.id)
    return NextResponse.json({
      success: true,
      version: '1.0',
      data: {
        ...item,
        breadthDetails: breadthInfo,
      },
    })
  }

  let list = HADITH_CORPUS
  if (collection) {
    list = list.filter((h) => h.collection.includes(collection))
  }

  return NextResponse.json({
    success: true,
    version: '1.0',
    count: list.length,
    data: list.map((h) => ({
      id: h.id,
      collection: h.collection,
      number: h.number,
      primaryNarrator: h.primaryNarrator,
      arabicMatn: h.arabicMatn,
      breadth: h.breadth,
      themes: h.themes,
    })),
  })
}
