import { getAllVerses, type QuranVerse } from './quran-data'
import { normalizeText, calculateAbjad } from './analysis'

export interface WordAnalysis {
  originalWord: string
  cleanWord: string
  root: string
  abjadValue: number
  occurrencesCount: number
  sampleVerses: Array<{
    surah: number
    ayah: number
    surahName: string
    verseText: string
  }>
}

// Well-known Quranic root mapping dictionary for accurate root matching
const QURANIC_ROOT_MAP: Record<string, string> = {
  // Cosmology & Astronomy
  فلك: 'فلك',
  الفلك: 'فلك',
  يسبحون: 'سبح',
  تسبح: 'سبح',
  نسبح: 'سبح',
  سبحانه: 'سبح',
  الشمس: 'شمس',
  شمس: 'شمس',
  القمر: 'قمر',
  قمر: 'قمر',
  الليل: 'ليل',
  والليل: 'ليل',
  النهار: 'نهر',
  والنهار: 'نهر',
  السماء: 'سمو',
  السماوات: 'سمو',
  والسماء: 'سمو',
  والأرض: 'ارض',
  الأرض: 'ارض',
  نجوم: 'نجم',
  النجوم: 'نجم',
  والنجم: 'نجم',
  كوكب: 'ككب',
  كواكب: 'ككب',
  بروج: 'برج',
  والبروج: 'برج',
  مدارات: 'دور',
  تجري: 'جري',
  جريان: 'جري',
  ضياء: 'ضوء',
  نور: 'نور',
  ونور: 'نور',
  منير: 'نور',
  سراج: 'سرج',
  سراجا: 'سرج',
  مصباح: 'صبح',

  // Creation & Nature
  خلق: 'خلق',
  خلقنا: 'خلق',
  يخلق: 'خلق',
  خالق: 'خلق',
  الخالق: 'خلق',
  ماء: 'موه',
  الماء: 'موه',
  والماء: 'موه',
  فتقناهما: 'فتق',
  رتقا: 'رتق',
  ذرة: 'ذرر',
  حبة: 'حبب',
  نبات: 'نبت',
  أنبتنا: 'نبت',
  جبال: 'جبل',
  والجبال: 'جبل',
  أوتادا: 'وتد',
  بحر: 'بحر',
  البحر: 'بحر',
  البحرين: 'بحر',
  برزخ: 'برزخ',

  // Palindromic & Symmetry terms
  فكبر: 'كبر',
  وربك: 'ربب',
  ربك: 'ربب',
  كل: 'كلل',
  في: 'في',
  طهر: 'طهر',
  وثيابك: 'ثوب',
  فاهجر: 'هجر',
  والرجز: 'رجز',
  فأنذر: 'نذر',
  أنذر: 'نذر',
  المدثر: 'دثر',

  // Divine attributes & Praise
  الله: 'اله',
  الرحمن: 'رحم',
  الرحيم: 'رحم',
  الحمد: 'حمد',
  العالمين: 'علم',
  مالك: 'ملك',
  الملك: 'ملك',
  الملكوت: 'ملك',
  الصمد: 'صمد',
  أحد: 'احد',
  عليم: 'علم',
  العليم: 'علم',
  حكيم: 'حكم',
  الحكيم: 'حكم',
  عزيز: 'عزز',
  العزيز: 'عزز',
  قدير: 'قدر',
  القدير: 'قدر',
  خبير: 'خبر',
  الخبير: 'خبر',
}

// Arabic prefix and suffix stripping rules for root extraction
export function extractArabicRoot(word: string): string {
  const clean = normalizeText(word, 'letters_only')

  // Check known dictionary first
  if (QURANIC_ROOT_MAP[clean]) {
    return QURANIC_ROOT_MAP[clean]
  }

  let stem = clean

  // Strip prefixes (الـ, والـ, فالـ, بالـ, كالـ, للـ, و, ف, ب, ل, س)
  if (stem.startsWith('وال') || stem.startsWith('فال') || stem.startsWith('بال') || stem.startsWith('كال')) {
    stem = stem.slice(3)
  } else if (stem.startsWith('ال') || stem.startsWith('لل')) {
    stem = stem.slice(2)
  } else if ((stem.startsWith('و') || stem.startsWith('ف') || stem.startsWith('ب') || stem.startsWith('ل') || stem.startsWith('س')) && stem.length > 4) {
    stem = stem.slice(1)
  }

  // Strip suffixes (ـون, ـين, ـات, ـهم, ـها, ـكم, ـنا, ـوا, ـه, ـي)
  if (stem.endsWith('ون') || stem.endsWith('ين') || stem.endsWith('ات') || stem.endsWith('هم') || stem.endsWith('كم') || stem.endsWith('نا') || stem.endsWith('وا')) {
    stem = stem.slice(0, -2)
  } else if ((stem.endsWith('ه') || stem.endsWith('ي') || stem.endsWith('ك') || stem.endsWith('ت')) && stem.length > 3) {
    stem = stem.slice(0, -1)
  }

  // If stem is 3 letters, likely a trilateral root
  if (stem.length === 3) {
    return stem
  }

  // If stem is 4 letters and starts with ya/ta/na/alif (present tense verb prefixes)
  if (stem.length === 4 && (stem.startsWith('ي') || stem.startsWith('ت') || stem.startsWith('ن') || stem.startsWith('ا') || stem.startsWith('م'))) {
    return stem.slice(1)
  }

  return stem.slice(0, 3) || clean
}

// Find all verses across the entire Quran sharing this root or word
export function findRootOccurrences(root: string, maxResults = 40): Array<{
  surah: number
  ayah: number
  surahName: string
  verseText: string
  matchedWord: string
}> {
  const cleanRoot = normalizeText(root, 'letters_only')
  const results: Array<{
    surah: number
    ayah: number
    surahName: string
    verseText: string
    matchedWord: string
  }> = []

  const all = getAllVerses()

  for (const v of all) {
    const rawWords = v.text.split(/\s+/).filter(Boolean)
    for (const w of rawWords) {
      const wRoot = extractArabicRoot(w)
      if (wRoot === cleanRoot || normalizeText(w, 'letters_only') === cleanRoot) {
        results.push({
          surah: v.surah,
          ayah: v.ayah,
          surahName: v.surahName,
          verseText: v.text,
          matchedWord: w,
        })
        break // One occurrence per verse is sufficient for concordance listing
      }
    }
    if (results.length >= maxResults) break
  }

  return results
}

// Analyze a specific word token
export function analyzeWordToken(word: string): WordAnalysis {
  const clean = normalizeText(word, 'letters_only')
  const root = extractArabicRoot(word)
  const abjadValue = calculateAbjad(word)
  const occurrences = findRootOccurrences(root, 25)

  return {
    originalWord: word,
    cleanWord: clean,
    root,
    abjadValue,
    occurrencesCount: occurrences.length,
    sampleVerses: occurrences.map((o) => ({
      surah: o.surah,
      ayah: o.ayah,
      surahName: o.surahName,
      verseText: o.verseText,
    })),
  }
}
