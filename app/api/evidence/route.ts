import { NextRequest, NextResponse } from 'next/server'
import { db, fallbackStore } from '@/lib/db'
import { evidenceItems } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId') || undefined

    if (db) {
      const query = db.select().from(evidenceItems)
      const items = projectId
        ? await query.where(eq(evidenceItems.projectId, projectId)).orderBy(desc(evidenceItems.createdAt))
        : await query.orderBy(desc(evidenceItems.createdAt))

      return NextResponse.json({ success: true, data: items })
    }

    const items = fallbackStore.getEvidence(projectId)
    return NextResponse.json({ success: true, data: items, source: 'fallback_store' })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      projectId,
      userId = 'demo-user',
      surah,
      ayah,
      surahName,
      verseText,
      analysisType,
      classification = 'verified',
      calculationData,
      sources,
      notes,
    } = body

    if (!surah || !ayah || !verseText || !analysisType) {
      return NextResponse.json(
        { success: false, error: 'بيانات الدليل غير مكتملة (السورة، الآية، النص، نوع التحليل)' },
        { status: 400 }
      )
    }

    if (db) {
      const [inserted] = await db
        .insert(evidenceItems)
        .values({
          projectId: projectId || null,
          userId,
          surah: Number(surah),
          ayah: Number(ayah),
          surahName,
          verseText,
          analysisType,
          classification,
          calculationData,
          sources,
          notes,
        })
        .returning()

      return NextResponse.json({ success: true, data: inserted })
    }

    const item = fallbackStore.addEvidence({
      projectId: projectId || null,
      userId,
      surah: Number(surah),
      ayah: Number(ayah),
      surahName,
      verseText,
      analysisType,
      classification,
      calculationData,
      sources,
      notes,
    })

    return NextResponse.json({ success: true, data: item, source: 'fallback_store' })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
