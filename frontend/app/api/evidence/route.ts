import { NextRequest, NextResponse } from 'next/server'
import { db, fallbackStore } from '@/lib/db'
import { evidenceItems } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { getServiceSupabase, isSupabaseConfigured } from '@/lib/supabase/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId') || undefined

    if (isSupabaseConfigured) {
      try {
        const supabase = getServiceSupabase()
        let query = supabase.from('evidence_items').select('*')
        if (projectId) query = query.eq('project_id', projectId)

        const { data, error } = await query.order('created_at', { ascending: false })
        if (!error && data) {
          return NextResponse.json({ success: true, source: 'supabase', data })
        }
      } catch (e) {
        console.warn('Supabase fetch failed in evidence, checking local:', e)
      }
    }

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

    if (isSupabaseConfigured) {
      try {
        const supabase = getServiceSupabase()
        const newEvidence = {
          project_id: projectId || null,
          user_id: userId,
          surah: Number(surah),
          ayah: Number(ayah),
          surah_name: surahName || null,
          verse_text: verseText,
          analysis_type: analysisType,
          classification,
          calculation_data: calculationData || null,
          sources: sources || null,
          notes: notes || null,
        }
        const { data, error } = await supabase.from('evidence_items').insert(newEvidence).select().single()
        if (!error && data) {
          return NextResponse.json({ success: true, source: 'supabase', data })
        }
      } catch (e) {
        console.warn('Supabase evidence insert failed, checking local DB:', e)
      }
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
