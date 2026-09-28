import { NextResponse } from 'next/server'

export async function GET() {
  const scholars = [
    { key: 'bukhari', name_ar: 'محمد بن إسماعيل البخاري', name_en: 'Al-Bukhari', death_year_ah: 256 },
    { key: 'muslim', name_ar: 'مسلم بن الحجاج النيسابوري', name_en: 'Muslim ibn al-Hajjaj', death_year_ah: 261 },
    { key: 'abudawud', name_ar: 'أبو داود السجستاني', name_en: 'Abu Dawud', death_year_ah: 275 },
    { key: 'tirmidhi', name_ar: 'أبو عيسى محمد الترمذي', name_en: 'At-Tirmidhi', death_year_ah: 279 },
    { key: 'nasai', name_ar: 'أحمد بن شعيب النسائي', name_en: 'An-Nasa\'i', death_year_ah: 303 },
    { key: 'ibn_hajar', name_ar: 'ابن حجر العسقلاني', name_en: 'Ibn Hajar al-Asqalani', death_year_ah: 852 },
    { key: 'dhahabi', name_ar: 'شمس الدين الذهبي', name_en: 'Al-Dhahabi', death_year_ah: 748 },
    { key: 'albani', name_ar: 'محمد ناصر الدين الألباني', name_en: 'Al-Albani', death_year_ah: 1420 },
  ]

  return NextResponse.json({
    count: scholars.length,
    data: scholars,
  })
}
