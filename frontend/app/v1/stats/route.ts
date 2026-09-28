import { NextResponse } from 'next/server'
import { SURAHS_META } from '@/lib/quran/quran-data'
import { HADITH_CORPUS } from '@/lib/hadith/mustalah-engine'
import { CLASSICAL_BOOKS } from '../books/route'
import { getAllNarrators } from '../narrators/route'

export async function GET() {
  const totalAyahs = SURAHS_META.reduce((acc, s) => acc + s.numberOfAyahs, 0)
  const narrators = getAllNarrators()

  return NextResponse.json({
    quran: {
      surahs: 114,
      ayahs: totalAyahs,
    },
    hadith: {
      collections_indexed: 9,
      corpus_hadiths: HADITH_CORPUS.length,
      narrators_indexed: narrators.length,
    },
    library: {
      classical_books: CLASSICAL_BOOKS.length,
    },
  })
}
