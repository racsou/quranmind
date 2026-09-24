import { NextRequest, NextResponse } from 'next/server'
import { SCHOLARLY_ARCHIVE } from '@/lib/quran/tafsir-hadith'
import { lookupVerse } from '@/lib/quran/quran-data'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ s: string; a: string }> }
) {
  const { s, a } = await params
  const surahNum = parseInt(s, 10)
  const ayahNum = parseInt(a, 10)
  const key = `${surahNum}:${ayahNum}`

  const verse = lookupVerse(surahNum, ayahNum)
  if (!verse) {
    return NextResponse.json(
      { code: 'NOT_FOUND', message: `Ayah ${key} not found.` },
      { status: 404 }
    )
  }

  const archive = SCHOLARLY_ARCHIVE[key]

  return NextResponse.json({
    surah: surahNum,
    ayah: ayahNum,
    text_ar: verse.text,
    tafsir_ibn_kathir: archive?.ibnKathir || `تفسير سورة ${verse.surahName} الآية ${verse.ayah} من كتاب تفسير القرآن العظيم للحافظ ابن كثير رحمه الله.`,
    tafsir_jalalayn: archive?.jalalayn || null,
    scientific_notes: archive?.scientificNotes || null,
  })
}
