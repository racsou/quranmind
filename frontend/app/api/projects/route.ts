import { NextRequest, NextResponse } from 'next/server'
import { db, fallbackStore } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { getServiceSupabase, isSupabaseConfigured } from '@/lib/supabase/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId') || 'demo-user'

    if (isSupabaseConfigured) {
      try {
        const supabase = getServiceSupabase()
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .or(`user_id.eq.${userId},user_id.eq.demo-user`)
          .order('created_at', { ascending: false })

        if (!error && data) {
          return NextResponse.json({ success: true, source: 'supabase', data })
        }
      } catch (e) {
        console.warn('Supabase fetch failed in projects, checking local:', e)
      }
    }

    if (db) {
      const userProjects = await db
        .select()
        .from(projects)
        .where(eq(projects.userId, userId))
        .orderBy(desc(projects.createdAt))

      return NextResponse.json({ success: true, data: userProjects })
    }

    // Fallback store
    const list = fallbackStore.getProjects(userId)
    return NextResponse.json({ success: true, data: list, source: 'fallback_store' })
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
    const { title, description, hypothesis, userId = 'demo-user' } = body

    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: 'عنوان المشروع مطلوب' },
        { status: 400 }
      )
    }

    if (isSupabaseConfigured) {
      try {
        const supabase = getServiceSupabase()
        const newProject = {
          user_id: userId,
          title: title.trim(),
          description: description?.trim() || null,
          hypothesis: hypothesis?.trim() || null,
          status: 'active',
        }
        const { data, error } = await supabase.from('projects').insert(newProject).select().single()
        if (!error && data) {
          return NextResponse.json({ success: true, source: 'supabase', data })
        }
      } catch (e) {
        console.warn('Supabase insert failed, trying local DB:', e)
      }
    }

    if (db) {
      const [inserted] = await db
        .insert(projects)
        .values({
          userId,
          title: title.trim(),
          description: description?.trim() || null,
          hypothesis: hypothesis?.trim() || null,
          status: 'active',
        })
        .returning()

      return NextResponse.json({ success: true, data: inserted })
    }

    // Fallback store
    const newProj = fallbackStore.addProject({
      userId,
      title: title.trim(),
      description: description?.trim() || null,
      hypothesis: hypothesis?.trim() || null,
      status: 'active',
    })

    return NextResponse.json({ success: true, data: newProj, source: 'fallback_store' })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
