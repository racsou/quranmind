import type { QuranVerse } from './quran-data'

export type NormalizationMode = 'exact' | 'no_diacritics' | 'structural' | 'letters_only'

export interface LetterCount {
  letter: string
  count: number
  percentage: number
}

export interface SymmetryAnalysis {
  isPalindrome: boolean
  symmetryRatio: number // 0 to 1 (1.0 = 100% symmetric)
  forwardText: string
  reversedText: string
  matchingPairs: Array<[string, string]>
  mismatches: Array<{ index: number; forward: string; reverse: string }>
}

export interface DetailedAnalysisResult {
  mode: NormalizationMode
  originalText: string
  normalizedText: string
  letterCount: number
  wordCount: number
  uniqueLettersCount: number
  abjadValue: number
  letterFrequencies: LetterCount[]
  symmetry: SymmetryAnalysis
  classification:
    | 'verified'
    | 'scientifically_supported'
    | 'possible_correspondence'
    | 'hypothesis'
    | 'disputed'
    | 'unsupported'
  evidenceStatement: string
}

// Arabic diacritics Unicode range (Tashkeel)
const TASHKEEL_REGEX = /[\u0617-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g
// Quranic stop signs and punctuation
const PUNCTUATION_REGEX = /[\u060C\u061B\u061F،؛؟.\-—()[\]{}«»ۚۖۗۘۙۜ]/g
// Non-Arabic characters
const NON_ARABIC_REGEX = /[^\u0621-\u064A\u0671]/g

export function normalizeText(text: string, mode: NormalizationMode = 'structural'): string {
  switch (mode) {
    case 'exact':
      return text.trim()

    case 'no_diacritics':
      return text.replace(TASHKEEL_REGEX, '').replace(/\s+/g, ' ').trim()

    case 'structural':
      return text
        .replace(TASHKEEL_REGEX, '')
        .replace(PUNCTUATION_REGEX, '')
        .replace(/[إأآٱ]/g, 'ا')
        .replace(/ى/g, 'ي')
        .replace(/ة/g, 'ه')
        .replace(/\s+/g, ' ')
        .trim()

    case 'letters_only':
      return text
        .replace(TASHKEEL_REGEX, '')
        .replace(PUNCTUATION_REGEX, '')
        .replace(NON_ARABIC_REGEX, '')
        .replace(/[إأآٱ]/g, 'ا')
        .replace(/ى/g, 'ي')
        .replace(/ة/g, 'ه')
        .replace(/\s+/g, '')
        .trim()
  }
}

// Traditional Abjad Gematria values (حساب الجمل الكبير)
const ABJAD_VALUES: Record<string, number> = {
  ا: 1,
  أ: 1,
  إ: 1,
  آ: 1,
  ء: 1,
  ئ: 1,
  ؤ: 1,
  ب: 2,
  ج: 3,
  د: 4,
  ه: 5,
  ة: 5,
  و: 6,
  ز: 7,
  ح: 8,
  ط: 9,
  ي: 10,
  ى: 10,
  ك: 20,
  ل: 30,
  م: 40,
  ن: 50,
  س: 60,
  ع: 70,
  ف: 80,
  ص: 90,
  ق: 100,
  ر: 200,
  ش: 300,
  ت: 400,
  ث: 500,
  خ: 600,
  ذ: 700,
  ض: 800,
  ظ: 900,
  غ: 1000,
}

export function calculateAbjad(text: string): number {
  const letters = normalizeText(text, 'letters_only')
  let total = 0
  for (const char of letters) {
    total += ABJAD_VALUES[char] || 0
  }
  return total
}

export function checkSymmetry(text: string): SymmetryAnalysis {
  const letters = normalizeText(text, 'letters_only')
  const chars = Array.from(letters)
  const reversed = [...chars].reverse()
  const len = chars.length

  if (len === 0) {
    return {
      isPalindrome: false,
      symmetryRatio: 0,
      forwardText: '',
      reversedText: '',
      matchingPairs: [],
      mismatches: [],
    }
  }

  let matches = 0
  const matchingPairs: Array<[string, string]> = []
  const mismatches: Array<{ index: number; forward: string; reverse: string }> = []

  for (let i = 0; i < len; i++) {
    const f = chars[i]
    const r = reversed[i]
    if (f === r) {
      matches++
      matchingPairs.push([f, r])
    } else {
      mismatches.push({ index: i, forward: f, reverse: r })
    }
  }

  const symmetryRatio = Number((matches / len).toFixed(4))
  const isPalindrome = matches === len

  return {
    isPalindrome,
    symmetryRatio,
    forwardText: chars.join(' - '),
    reversedText: reversed.join(' - '),
    matchingPairs,
    mismatches,
  }
}

export function analyzeVerseDetailed(
  verseOrText: QuranVerse | string,
  mode: NormalizationMode = 'structural'
): DetailedAnalysisResult {
  const rawText = typeof verseOrText === 'string' ? verseOrText : verseOrText.text
  const normalized = normalizeText(rawText, mode)
  const lettersOnly = normalizeText(rawText, 'letters_only')

  // Counting
  const letterMap = new Map<string, number>()
  for (const char of lettersOnly) {
    letterMap.set(char, (letterMap.get(char) ?? 0) + 1)
  }

  const totalLetters = lettersOnly.length
  const words = normalized.split(/\s+/).filter(Boolean)
  const letterFrequencies: LetterCount[] = Array.from(letterMap.entries())
    .map(([letter, count]) => ({
      letter,
      count,
      percentage: totalLetters > 0 ? Number(((count / totalLetters) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.count - a.count)

  const symmetry = checkSymmetry(rawText)
  const abjadValue = calculateAbjad(rawText)

  // Evidence classification
  let classification: DetailedAnalysisResult['classification'] = 'verified'
  let evidenceStatement = `ملاحظة إحصائية وعددية محسوبة بدقة على النص القرآني (${totalLetters} حرفاً، ${words.length} كلمات).`

  if (symmetry.isPalindrome) {
    evidenceStatement = `تناظر تام 100% (Palindrome) مؤكد حسابياً عند القراءة من اليمين أو اليسار دون أي اختلاف في ترتيب الحروف.`
  } else if (symmetry.symmetryRatio > 0.7) {
    classification = 'possible_correspondence'
    evidenceStatement = `تناظر نسبي جزئي بنسبة ${Math.round(symmetry.symmetryRatio * 100)}%، يتطلب فحص السياق النحوي والاشتقاقي.`
  }

  return {
    mode,
    originalText: rawText,
    normalizedText: normalized,
    letterCount: totalLetters,
    wordCount: words.length,
    uniqueLettersCount: letterMap.size,
    abjadValue,
    letterFrequencies,
    symmetry,
    classification,
    evidenceStatement,
  }
}

// Backward compatibility helper for existing workspace code
export function analyzeVerse(verse: QuranVerse) {
  const detailed = analyzeVerseDetailed(verse, 'structural')
  return {
    normalizedText: detailed.normalizedText,
    letters: detailed.letterCount,
    words: detailed.wordCount,
    uniqueLetters: detailed.uniqueLettersCount,
    repeatedLetters: detailed.letterFrequencies.filter((l) => l.count > 1).slice(0, 7),
    classification: 'ملاحظة محسوبة' as const,
  }
}
