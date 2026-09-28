import { NextResponse } from 'next/server'
import { getAllVerses, SURAHS_META } from '@/lib/quran/quran-data'
import { normalizeText, calculateAbjad } from '@/lib/quran/analysis'
import { redisCache } from '@/lib/redis/client'

export async function GET() {
  try {
    const cacheKey = 'quran:global_statistics'

    const stats = await redisCache.getOrSet(
      cacheKey,
      async () => {
        const verses = getAllVerses()
        let totalLetters = 0
        let totalWords = 0
        let totalAbjad = 0
        const charCounts: Record<string, number> = {}

        for (const v of verses) {
          const lettersOnly = normalizeText(v.text, 'letters_only')
          const words = normalizeText(v.text, 'structural').split(/\s+/).filter(Boolean)

          totalLetters += lettersOnly.length
          totalWords += words.length
          totalAbjad += calculateAbjad(v.text)

          for (const char of lettersOnly) {
            charCounts[char] = (charCounts[char] || 0) + 1
          }
        }

        const sortedChars = Object.entries(charCounts)
          .map(([char, count]) => ({
            char,
            count,
            percentage: Number(((count / totalLetters) * 100).toFixed(2)),
          }))
          .sort((a, b) => b.count - a.count)

        const meccanSurahs = SURAHS_META.filter((s) => s.revelationType === 'Meccan').length
        const medinanSurahs = SURAHS_META.filter((s) => s.revelationType === 'Medinan').length

        return {
          totalSurahs: 114,
          totalVerses: verses.length,
          totalWords,
          totalLetters,
          totalAbjadGematria: totalAbjad,
          revelationDistribution: {
            meccanSurahs,
            medinanSurahs,
          },
          topCharacters: sortedChars.slice(0, 14),
          palindromicKeyVerses: [
            { key: '74:3', text: 'وَرَبَّكَ فَكَبِّرْ', surah: 'المدثر', type: 'تناظر حرفي تام 100%' },
            { key: '36:40', text: 'كُلٌّ فِي فَلَكٍ يَسْبَحُونَ', surah: 'يس', type: 'تناظر دوراني فلكي' },
            { key: '21:33', text: 'كُلٌّ فِي فَلَكٍ يَسْبَحُونَ', surah: 'الأنبياء', type: 'تناظر دوراني فلكي' },
          ],
        }
      },
      86400 // Cache for 24 hours
    )

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
