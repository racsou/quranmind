import { NextResponse } from 'next/server'

export async function GET() {
  const collections = [
    { code: 'bukhari', name_ar: 'صحيح البخاري', name_en: 'Sahih al-Bukhari', total_hadiths: 7563, canonical: true },
    { code: 'muslim', name_ar: 'صحيح مسلم', name_en: 'Sahih Muslim', total_hadiths: 7500, canonical: true },
    { code: 'abudawud', name_ar: 'سنن أبي داود', name_en: 'Sunan Abi Dawud', total_hadiths: 5274, canonical: true },
    { code: 'tirmidhi', name_ar: 'جامع الترمذي', name_en: 'Jami` at-Tirmidhi', total_hadiths: 3956, canonical: true },
    { code: 'nasai', name_ar: 'سنن النسائي', name_en: 'Sunan an-Nasa\'i', total_hadiths: 5758, canonical: true },
    { code: 'ibnmajah', name_ar: 'سنن ابن ماجه', name_en: 'Sunan Ibn Majah', total_hadiths: 4341, canonical: true },
    { code: 'malik', name_ar: 'موطأ مالك', name_en: 'Muwatta Malik', total_hadiths: 1858, canonical: false },
    { code: 'ahmad', name_ar: 'مسند أحمد', name_en: 'Musnad Ahmad', total_hadiths: 27647, canonical: false },
    { code: 'darimi', name_ar: 'سنن الدارمي', name_en: 'Sunan ad-Darimi', total_hadiths: 3550, canonical: false },
  ]

  return NextResponse.json({
    count: collections.length,
    data: collections,
  })
}
