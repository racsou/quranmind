/**
 * Personal Study Notes Engine — QuranMind
 * Features ported from Ilm architecture:
 * - Annotate any Ayah or Hadith
 * - Inline @mentions parser embedding Quran verses and Hadith citations
 * - Tag-based organization
 * - Color-coded highlights
 * - Full-text search across titles, contents, and references
 */

import { lookupVerse, type QuranVerse } from '@/lib/quran/quran-data'
import { HADITH_CORPUS, type HadithEntry } from '@/lib/hadith/mustalah-engine'

export type NoteHighlightColor = 'cyan' | 'emerald' | 'amber' | 'purple' | 'rose'

export interface EmbeddedAyahRef {
  surah: number
  ayah: number
  surahName: string
  text: string
  translation?: string
}

export interface EmbeddedHadithRef {
  collection: string
  number: number
  matn: string
  grade: string
}

export interface StudyNote {
  id: string
  title: string
  content: string
  tags: string[]
  color: NoteHighlightColor
  embeddedAyahs: EmbeddedAyahRef[]
  embeddedHadiths: EmbeddedHadithRef[]
  createdAt: string
  updatedAt: string
}

const DEFAULT_NOTES: StudyNote[] = [
  {
    id: 'note-1',
    title: 'تأملات التناظر البنيوي في آيات الفلك والسباحة',
    content: 'عند استقراء قوله تعالى @21:33 «كُلٌّ فِي فَلَكٍ يَسْبَحُونَ»، نلاحظ أن اللفظ ينعكس كلياً بحروفه ليطابق الحركة الدائرية للأفلاك. ومما يعضد هذا الفهم ما ورد في الحديث النبوي @bukhari:3199 حول سجود الشمس ودورانها المستمر.',
    tags: ['فلك', 'تناظر', 'إعجاز بياني', 'صحيح البخاري'],
    color: 'cyan',
    embeddedAyahs: [
      {
        surah: 21,
        ayah: 33,
        surahName: 'الأنبياء',
        text: 'وَهُوَ الَّذِي خَلَقَ اللَّيْلَ وَالنَّهَارَ وَالشَّمْسَ وَالْقَمَرَ ۖ كُلٌّ فِي فَلَكٍ يَسْبَحُونَ',
        translation: 'And it is He who created the night and the day and the sun and the moon; all in an orbit are swimming.',
      },
    ],
    embeddedHadiths: [
      {
        collection: 'صحيح البخاري',
        number: 3199,
        matn: '«...فَإِنَّهَا تَذْهَبُ حَتَّى تَسْجُدَ تَحْتَ الْعَرْشِ، فَتَسْتَأْذِنَ فَيُؤْذَنَ لَهَا...»',
        grade: 'صحيح',
      },
    ],
    createdAt: '2026-09-20',
    updatedAt: '2026-09-24',
  },
  {
    id: 'note-2',
    title: 'حديث النيات وضابط الأمانة الإبستيمية',
    content: 'افتتح البخاري صحيحه بحديث @bukhari:1 للتأكيد على الإخلاص في طلب العلم والتحقيق. وفي سياق البحث العلمي القرآني، نلتزم بميثاق الأمانة والنزاهة بحيث لا ننسب للقرآن ما لم يثبت بالدليل القاطع.',
    tags: ['إخلاص', 'منهجية', 'ميثاق الأمانة'],
    color: 'emerald',
    embeddedAyahs: [],
    embeddedHadiths: [
      {
        collection: 'صحيح البخاري',
        number: 1,
        matn: '«إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى...»',
        grade: 'صحيح متفق عليه',
      },
    ],
    createdAt: '2026-09-21',
    updatedAt: '2026-09-23',
  },
]

const STORAGE_KEY = 'quranmind_personal_study_notes'

/**
 * Parses text for @mentions:
 * - @21:33 or @الأنبياء:33 -> Embeds Quran Ayah
 * - @bukhari:1 or @bukhari:3199 -> Embeds Hadith citation
 */
export function parseNoteMentions(text: string): {
  embeddedAyahs: EmbeddedAyahRef[]
  embeddedHadiths: EmbeddedHadithRef[]
} {
  const embeddedAyahs: EmbeddedAyahRef[] = []
  const embeddedHadiths: EmbeddedHadithRef[] = []

  // Ayah pattern: @(\d+):(\d+)
  const ayahRegex = /@(\d{1,3}):(\d{1,3})/g
  let match
  while ((match = ayahRegex.exec(text)) !== null) {
    const surah = parseInt(match[1], 10)
    const ayah = parseInt(match[2], 10)
    const verse = lookupVerse(surah, ayah)
    if (verse) {
      if (!embeddedAyahs.some((a) => a.surah === surah && a.ayah === ayah)) {
        embeddedAyahs.push({
          surah: verse.surah,
          ayah: verse.ayah,
          surahName: verse.surahName,
          text: verse.text,
          translation: verse.translation,
        })
      }
    }
  }

  // Hadith pattern: @bukhari:(\d+)
  const hadithRegex = /@bukhari:(\d+)/g
  while ((match = hadithRegex.exec(text)) !== null) {
    const num = parseInt(match[1], 10)
    const hadith = HADITH_CORPUS.find((h) => h.number === num)
    if (hadith) {
      if (!embeddedHadiths.some((h) => h.number === num)) {
        embeddedHadiths.push({
          collection: hadith.collection,
          number: hadith.number,
          matn: hadith.arabicMatn,
          grade: 'صحيح',
        })
      }
    }
  }

  return { embeddedAyahs, embeddedHadiths }
}

export function getStudyNotes(): StudyNote[] {
  if (typeof window === 'undefined') return DEFAULT_NOTES
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTES))
      return DEFAULT_NOTES
    }
    return JSON.parse(raw)
  } catch {
    return DEFAULT_NOTES
  }
}

export function saveStudyNotes(notes: StudyNote[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch {
    // ignore
  }
}

export function searchStudyNotes(notes: StudyNote[], query: string, activeTag?: string): StudyNote[] {
  let filtered = notes

  if (activeTag && activeTag !== 'all') {
    filtered = filtered.filter((n) => n.tags.includes(activeTag))
  }

  if (!query.trim()) return filtered

  const q = query.toLowerCase().trim()
  return filtered.filter(
    (n) =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q)) ||
      n.embeddedAyahs.some((a) => a.text.includes(q) || a.surahName.includes(q)) ||
      n.embeddedHadiths.some((h) => h.matn.includes(q))
  )
}
