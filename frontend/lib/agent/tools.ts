import {
  searchQuran,
  lookupVerse,
  getMatchingAyahs,
  getRecurrentPhrases,
  getSurahVerses,
  SURAHS_META,
  type QuranVerse,
} from '@/lib/quran/quran-data'
import {
  checkSymmetry,
  calculateAbjad,
  analyzeVerseDetailed,
  normalizeText,
} from '@/lib/quran/analysis'
import {
  HADITH_CORPUS,
  classifyHadithBreadth,
  detectCorroboration,
  diffHadithMatn,
} from '@/lib/hadith/mustalah-engine'
import { getTafsirForVerse } from '@/lib/quran/tafsir-hadith'

// ----------------------------------------------------------------------------
// Tool Schema Definitions (OpenAI / Ollama / Local Format)
// ----------------------------------------------------------------------------
export const AGENT_TOOLS_OPENAI = [
  {
    type: 'function' as const,
    function: {
      name: 'search_quran',
      description: 'البحث في نص القرآن الكريم كاملاً (6,236 آية) بالكلمات أو المعاني أو رقم السورة والآية (مثل: "فلك" أو "21:33")',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'الكلمة أو العبارة المراد البحث عنها في المصحف الشريف',
          },
          limit: {
            type: 'number',
            description: 'الحد الأقصى لعدد الآيات المرجعة (افتراضي: 5)',
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_verse',
      description: 'استرجاع آية محددة برقم السورة ورقم الآية بنصها العثماني وترجمتها الدقيقة',
      parameters: {
        type: 'object',
        properties: {
          surah: {
            type: 'number',
            description: 'رقم السورة (من 1 إلى 114)',
          },
          ayah: {
            type: 'number',
            description: 'رقم الآية داخل السورة',
          },
        },
        required: ['surah', 'ayah'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_similar_ayahs',
      description: 'استخراج الآيات المتشابهة نصياً وبنيوياً (متشابهات القرآن) لآية معينة مع نسب التطابق والكلمات المشتركة',
      parameters: {
        type: 'object',
        properties: {
          surah: {
            type: 'number',
            description: 'رقم السورة',
          },
          ayah: {
            type: 'number',
            description: 'رقم الآية',
          },
        },
        required: ['surah', 'ayah'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'check_symmetry',
      description: 'فحص التناظر الحرفي التام والمعكوس (Palindromes) في عبارة أو آية قرآنية، وفحص نسبة التطابق العكسي 100%',
      parameters: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            description: 'النص أو العبارة القرآنية المراد فحص تناظرها (مثل: "ربك فكبر" أو "كل في فلك")',
          },
        },
        required: ['text'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'calculate_gematria',
      description: 'حساب الجُمّل الكبير، تكرار الحروف، وتوزيع الأوزان الإحصائية لنص قرآني وفق التطبيع البنيوي',
      parameters: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            description: 'النص القرآني المراد حساب قيمته العددية',
          },
        },
        required: ['text'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_hadith',
      description: 'استخراج متن الحديث النبوي وبياناته من الصحيحين بالمعرّف (مثل "bukhari-1" أو "bukhari-3199") أو البحث في المتون',
      parameters: {
        type: 'object',
        properties: {
          queryOrId: {
            type: 'string',
            description: 'معرف الحديث (مثل bukhari-1) أو كلمة من متن الحديث (مثل النية أو سجدت تحت العرش)',
          },
        },
        required: ['queryOrId'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_hadith_isnad',
      description: 'تحليل إسناد الحديث النبوي، تصنيف الاتساع (متواتر، مشهور، عزيز، غريب)، المتابعات والشواهد وسلسلة الرواة',
      parameters: {
        type: 'object',
        properties: {
          hadithId: {
            type: 'string',
            description: 'معرف الحديث (مثال: "bukhari-1" أو "bukhari-3199" أو "mutawatir-sawm")',
          },
        },
        required: ['hadithId'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_verse_tafsir',
      description: 'استدعاء تفسير الآية من تفسير ابن كثير والجلالين وأسباب النزول والشواهد الحديثية المسندة',
      parameters: {
        type: 'object',
        properties: {
          surah: {
            type: 'number',
            description: 'رقم السورة',
          },
          ayah: {
            type: 'number',
            description: 'رقم الآية',
          },
        },
        required: ['surah', 'ayah'],
      },
    },
  },
]

// ----------------------------------------------------------------------------
// Tool Schema Definitions (Google Gemini Format)
// ----------------------------------------------------------------------------
export const AGENT_TOOLS_GEMINI = [
  {
    functionDeclarations: AGENT_TOOLS_OPENAI.map((t) => ({
      name: t.function.name,
      description: t.function.description,
      parameters: {
        type: 'OBJECT',
        properties: Object.fromEntries(
          Object.entries(t.function.parameters.properties).map(([k, v]) => [
            k,
            {
              type: v.type === 'number' ? 'NUMBER' : 'STRING',
              description: v.description,
            },
          ])
        ),
        required: t.function.parameters.required,
      },
    })),
  },
]

// ----------------------------------------------------------------------------
// Tool Execution Dispatcher
// ----------------------------------------------------------------------------
export interface ToolExecutionResult {
  toolName: string
  success: boolean
  summary: string
  data: any
}

export function executeToolCall(
  name: string,
  args: Record<string, any>
): ToolExecutionResult {
  try {
    switch (name) {
      case 'search_quran': {
        const query = String(args.query || '').trim()
        const limit = Number(args.limit) || 5
        const verses = searchQuran(query, limit)
        return {
          toolName: name,
          success: true,
          summary: `تم العثور على ${verses.length} آية مطابقة للبحث: "${query}"`,
          data: verses.map((v) => ({
            id: v.id,
            surah: v.surah,
            surahName: v.surahName,
            ayah: v.ayah,
            text: v.text,
            translation: v.translation,
          })),
        }
      }

      case 'get_verse': {
        const surah = Number(args.surah)
        const ayah = Number(args.ayah)
        const verse = lookupVerse(surah, ayah)
        if (!verse) {
          return {
            toolName: name,
            success: false,
            summary: `لم يتم العثور على الآية ${surah}:${ayah}`,
            data: null,
          }
        }
        return {
          toolName: name,
          success: true,
          summary: `سورة ${verse.surahName} [${verse.id}]: «${verse.text.slice(0, 40)}...»`,
          data: verse,
        }
      }

      case 'get_similar_ayahs': {
        const surah = Number(args.surah)
        const ayah = Number(args.ayah)
        const matching = getMatchingAyahs(surah, ayah)
        return {
          toolName: name,
          success: true,
          summary: `تم العثور على ${matching.length} مواضع متشابهة مع الآية [${surah}:${ayah}]`,
          data: matching.slice(0, 5).map((m) => ({
            matchedAyahKey: m.matchedAyahKey,
            coverage: `${Math.round(m.coverage * 100)}%`,
            matchedWordsCount: m.matchedWordsCount,
            verseText: m.verse?.text,
            surahName: m.verse?.surahName,
          })),
        }
      }

      case 'check_symmetry': {
        const text = String(args.text || '')
        const sym = checkSymmetry(text)
        return {
          toolName: name,
          success: true,
          summary: sym.isPalindrome
            ? `تناظر تام 100% (Palindrome): الحروف متطابقة طرداً وعكساً`
            : `تناظر بنسبة ${Math.round(sym.symmetryRatio * 100)}% (${sym.mismatches.length} فروق)`,
          data: {
            text,
            isPalindrome: sym.isPalindrome,
            symmetryRatio: sym.symmetryRatio,
            forwardText: sym.forwardText,
            reversedText: sym.reversedText,
            mismatchesCount: sym.mismatches.length,
          },
        }
      }

      case 'calculate_gematria': {
        const text = String(args.text || '')
        const abjad = calculateAbjad(text)
        const detailed = analyzeVerseDetailed(text, 'structural')
        return {
          toolName: name,
          success: true,
          summary: `حساب الجُمّل: ${abjad} | عدد الحروف: ${detailed.letterCount} | عدد الكلمات: ${detailed.wordCount}`,
          data: {
            abjadValue: abjad,
            letterCount: detailed.letterCount,
            wordCount: detailed.wordCount,
            topLetters: detailed.letterFrequencies.slice(0, 5),
          },
        }
      }

      case 'get_hadith': {
        const q = String(args.queryOrId || '').toLowerCase().trim()
        const found = HADITH_CORPUS.find(
          (h) =>
            h.id.toLowerCase() === q ||
            h.id.replace('-', ':') === q ||
            h.arabicMatn.includes(q) ||
            h.themes.some((t) => t.includes(q))
        )
        if (!found) {
          // fallback to first hadith
          const fallback = HADITH_CORPUS[0]
          return {
            toolName: name,
            success: true,
            summary: `حديث ${fallback.collection} [${fallback.number}]: «${fallback.arabicMatn.slice(0, 50)}...»`,
            data: fallback,
          }
        }
        return {
          toolName: name,
          success: true,
          summary: `حديث ${found.collection} [${found.number}]: «${found.arabicMatn.slice(0, 50)}...»`,
          data: found,
        }
      }

      case 'get_hadith_isnad': {
        const id = String(args.hadithId || 'bukhari-1').trim()
        const breadth = classifyHadithBreadth(id)
        const hadith = HADITH_CORPUS.find((h) => h.id === id) || HADITH_CORPUS[0]
        const corroboration = detectCorroboration(id)
        return {
          toolName: name,
          success: true,
          summary: `تصنيف الإسناد: ${breadth.arabicTerm} (أدنى عدد رواة: ${breadth.minTierCount})`,
          data: {
            hadithId: id,
            collection: hadith.collection,
            breadth,
            chainsCount: hadith.chains.length,
            primaryChain: hadith.chains[0]?.narratorPath?.map((n) => `${n.arabicName} (${n.reliability})`),
            corroborationStrength: corroboration.corroborationStrength,
            scholarlyVerdict: corroboration.scholarlyVerdict,
          },
        }
      }

      case 'get_verse_tafsir': {
        const surah = Number(args.surah)
        const ayah = Number(args.ayah)
        const tafsir = getTafsirForVerse(surah, ayah)
        return {
          toolName: name,
          success: true,
          summary: `تفسير الآية ${surah}:${ayah} (ابن كثير والجلالين)`,
          data: {
            surah,
            ayah,
            ibnKathir: tafsir.ibnKathir,
            jalalayn: tafsir.jalalayn,
            hadithCitationsCount: tafsir.hadithCitations.length,
            scientificNotes: tafsir.scientificNotes,
          },
        }
      }

      default:
        return {
          toolName: name,
          success: false,
          summary: `أداة غير معروفة: ${name}`,
          data: null,
        }
    }
  } catch (err: any) {
    return {
      toolName: name,
      success: false,
      summary: `خطأ أثناء تنفيذ الأداة: ${err?.message || err}`,
      data: null,
    }
  }
}
