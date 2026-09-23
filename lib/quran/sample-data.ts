export type QuranVerse = {
  surah: number
  surahName: string
  ayah: number
  text: string
  transliteration: string
  juz: number
}

export const quranSample: readonly QuranVerse[] = [
  { surah: 21, surahName: 'الأنبياء', ayah: 33, text: 'وَهُوَ الَّذِي خَلَقَ اللَّيْلَ وَالنَّهَارَ وَالشَّمْسَ وَالْقَمَرَ ۖ كُلٌّ فِي فَلَكٍ يَسْبَحُونَ', transliteration: 'Wa huwa alladhee khalaqa allayla wannahara washshamsa walqamara kullun fee falakin yasbahoon', juz: 17 },
  { surah: 52, surahName: 'الطور', ayah: 49, text: 'وَمِنَ اللَّيْلِ فَسَبِّحْهُ وَإِدْبَارَ النُّجُومِ', transliteration: 'Wamina allayli fasabbihhu waidbara annujoom', juz: 27 },
  { surah: 36, surahName: 'يس', ayah: 40, text: 'لَا الشَّمْسُ يَنبَغِي لَهَا أَن تُدْرِكَ الْقَمَرَ وَلَا اللَّيْلُ سَابِقُ النَّهَارِ ۚ وَكُلٌّ فِي فَلَكٍ يَسْبَحُونَ', transliteration: 'La ashshamsu yanbaghee laha an tudrika alqamara wala allaylu sabiqu annahar', juz: 23 },
  { surah: 41, surahName: 'فصلت', ayah: 53, text: 'سَنُرِيهِمْ آيَاتِنَا فِي الْآفَاقِ وَفِي أَنفُسِهِمْ حَتَّىٰ يَتَبَيَّنَ لَهُمْ أَنَّهُ الْحَقُّ', transliteration: 'Sanureehim ayatina fee alafaqi wafee anfusihim', juz: 24 },
] as const

export function getVerse(surah: number, ayah: number) {
  return quranSample.find((verse) => verse.surah === surah && verse.ayah === ayah)
}

export function searchVerses(query: string) {
  const normalized = query.trim()
  if (!normalized) return quranSample
  return quranSample.filter((verse) => verse.text.includes(normalized) || verse.surahName.includes(normalized) || verse.transliteration.toLowerCase().includes(normalized.toLowerCase()))
}
