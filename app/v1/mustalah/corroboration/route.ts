import { NextRequest, NextResponse } from 'next/server'
import { detectCorroboration, HADITH_CORPUS } from '@/lib/hadith/mustalah-engine'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const hadithId = searchParams.get('hadithId') || 'bukhari-1'

  const hadith = HADITH_CORPUS.find((h) => h.id === hadithId)
  if (!hadith) {
    return NextResponse.json({ success: false, error: 'Hadith not found' }, { status: 404 })
  }

  const result = detectCorroboration(hadithId)

  return NextResponse.json({
    success: true,
    version: '1.0',
    data: result,
  })
}
