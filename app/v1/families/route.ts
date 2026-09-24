import { NextResponse } from 'next/server'
import { HADITH_CORPUS } from '@/lib/hadith/mustalah-engine'

export const FAMILIES = [
  {
    id: 'fam-niyyah',
    title_ar: 'حديث إنما الأعمال بالنيات',
    title_en: 'Hadith of Intentions',
    primary_companion: 'عمر بن الخطاب',
    hadiths: ['bukhari:1', 'muslim:1907'],
    breadth: 'gharib' as const,
  },
  {
    id: 'fam-sun-moon',
    title_ar: 'حديث سجود الشمس وجريان الأجرام',
    title_en: 'Hadith of Sun Prostration & Orbit',
    primary_companion: 'أبو ذر الغفاري',
    hadiths: ['bukhari:3199', 'muslim:159'],
    breadth: 'mashhur' as const,
  },
]

export async function GET() {
  return NextResponse.json({
    total: FAMILIES.length,
    data: FAMILIES.map((f) => ({
      id: f.id,
      title_ar: f.title_ar,
      title_en: f.title_en,
      primary_companion: f.primary_companion,
      hadiths_count: f.hadiths.length,
      hadiths: f.hadiths,
      breadth: f.breadth,
    })),
  })
}
