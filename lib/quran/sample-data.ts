import { QURAN_VERSES, lookupVerse, searchQuran, type QuranVerse } from './quran-data'

export type { QuranVerse }
export const quranSample = QURAN_VERSES

export function getVerse(surah: number, ayah: number) {
  return lookupVerse(surah, ayah)
}

export function searchVerses(query: string) {
  return searchQuran(query)
}
