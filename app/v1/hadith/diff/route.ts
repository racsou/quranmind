import { NextRequest, NextResponse } from 'next/server'
import { diffHadithMatn } from '@/lib/hadith/mustalah-engine'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { textA, textB, sourceA = 'الرواية الأولى', sourceB = 'الرواية الثانية' } = body

    if (!textA || !textB) {
      return NextResponse.json(
        { success: false, error: 'Both textA and textB are required for matn diffing' },
        { status: 400 }
      )
    }

    const diff = diffHadithMatn(textA, textB, sourceA, sourceB)

    return NextResponse.json({
      success: true,
      version: '1.0',
      data: diff,
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Diff computation failed' },
      { status: 500 }
    )
  }
}
