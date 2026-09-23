import type { QuranVerse } from './sample-data'

export type AnalysisResult = {
  normalizedText: string
  letters: number
  words: number
  uniqueLetters: number
  repeatedLetters: Array<{ letter: string; count: number }>
  classification: 'ملاحظة محسوبة' | 'تفسير محتمل'
}

const diacritics = /[\u064B-\u065F\u0670]/g
const punctuation = /[\u060C\u061B\u061F،؛؟.!]/g

export function normalizeArabic(text: string) {
  return text.replace(diacritics, '').replace(/[إأآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(punctuation, '').replace(/\s+/g, ' ').trim()
}

export function analyzeVerse(verse: QuranVerse): AnalysisResult {
  const normalizedText = normalizeArabic(verse.text)
  const lettersOnly = normalizedText.replace(/\s/g, '')
  const counts = new Map<string, number>()
  for (const letter of lettersOnly) counts.set(letter, (counts.get(letter) ?? 0) + 1)
  const repeatedLetters = [...counts.entries()].filter(([, count]) => count > 1).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([letter, count]) => ({ letter, count }))
  return { normalizedText, letters: lettersOnly.length, words: normalizedText.split(' ').filter(Boolean).length, uniqueLetters: counts.size, repeatedLetters, classification: 'ملاحظة محسوبة' }
}
