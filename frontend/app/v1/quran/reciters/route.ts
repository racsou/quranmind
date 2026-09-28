import { NextResponse } from 'next/server'

export async function GET() {
  const reciters = [
    {
      id: 'alafasy',
      name_ar: 'مشاري بن راشد العفاسي',
      name_en: 'Mishary Rashid Alafasy',
      style: 'Murattal',
      bitrate: '128kbps',
      cdn_base: 'https://everyayah.com/data/Alafasy_128kbps',
    },
    {
      id: 'husary',
      name_ar: 'محمود خليل الحصري',
      name_en: 'Mahmoud Khalil Al-Husary',
      style: 'Murattal',
      bitrate: '128kbps',
      cdn_base: 'https://everyayah.com/data/Husary_128kbps',
    },
    {
      id: 'abdulbasit',
      name_ar: 'عبد الباسط عبد الصمد',
      name_en: 'Abdul Basit Abdul Samad',
      style: 'Murattal',
      bitrate: '192kbps',
      cdn_base: 'https://everyayah.com/data/Abdul_Basit_Murattal_192kbps',
    },
  ]

  return NextResponse.json({
    count: reciters.length,
    data: reciters,
  })
}
