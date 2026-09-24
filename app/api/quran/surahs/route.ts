import { NextResponse } from 'next/server'
import { SURAHS_META } from '@/lib/quran/quran-data'

export async function GET() {
  return NextResponse.json({
    success: true,
    count: SURAHS_META.length,
    data: SURAHS_META,
  })
}
