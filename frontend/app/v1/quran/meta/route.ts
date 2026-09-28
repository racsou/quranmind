import { NextResponse } from 'next/server'
import { SURAHS_META } from '@/lib/quran/quran-data'

export async function GET() {
  const totalAyahs = SURAHS_META.reduce((acc, s) => acc + s.numberOfAyahs, 0)
  const meccanCount = SURAHS_META.filter((s) => s.revelationType === 'Meccan').length
  const medinanCount = SURAHS_META.filter((s) => s.revelationType === 'Medinan').length

  return NextResponse.json({
    total_surahs: 114,
    total_ayahs: totalAyahs,
    revelation_types: {
      meccan: meccanCount,
      medinan: medinanCount,
    },
    total_juz: 30,
    total_hizb: 60,
    script_format: 'Uthmani (King Fahd Complex / QPC Hafs)',
    language: 'ar',
  })
}
