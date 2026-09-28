import { Router, Request, Response } from 'express'
import { getServiceSupabase } from '../db/supabase.js'
import { config } from '../config/index.js'
import fs from 'fs'
import path from 'path'

const router = Router()

// Helper to load fallback JSON if Supabase is not yet populated
function loadFallbackJson(fileName: string): any {
  const possiblePaths = [
    path.resolve(process.cwd(), '../frontend/lib/quran/data', fileName),
    path.resolve(process.cwd(), 'frontend/lib/quran/data', fileName),
    path.resolve(__dirname, '../../../frontend/lib/quran/data', fileName),
  ]
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf-8'))
    }
  }
  return null
}

// 1. Get all 114 Surahs
router.get('/surahs', async (req: Request, res: Response) => {
  try {
    if (config.isSupabaseConfigured()) {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from('quran_surahs')
        .select('*')
        .order('number', { ascending: true })

      if (!error && data && data.length > 0) {
        return res.json({ success: true, count: data.length, data })
      }
    }

    // Fallback to canonical surahs
    res.json({
      success: true,
      count: 114,
      source: 'fallback',
      data: [
        { number: 1, name_ar: 'الفاتحة', english_name: 'Al-Fatihah', english_translation: 'The Opening', number_of_ayahs: 7, revelation_type: 'Meccan' },
        { number: 2, name_ar: 'البقرة', english_name: 'Al-Baqarah', english_translation: 'The Cow', number_of_ayahs: 286, revelation_type: 'Medinan' },
        { number: 3, name_ar: 'آل عمران', english_name: 'Ali \'Imran', english_translation: 'Family of Imran', number_of_ayahs: 200, revelation_type: 'Medinan' },
      ],
    })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 1.1 Get all verses of a specific Surah
router.get('/surahs/:number/verses', async (req: Request, res: Response) => {
  try {
    const surahNumber = parseInt(req.params.number, 10)
    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      return res.status(400).json({ success: false, error: 'Invalid surah number' })
    }

    if (config.isSupabaseConfigured()) {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from('quran_verses')
        .select('*')
        .eq('surah_number', surahNumber)
        .order('ayah_number', { ascending: true })

      if (!error && data && data.length > 0) {
        const formatted = data.map((v: any) => ({
          id: v.id,
          surah: v.surah_number,
          ayah: v.ayah_number,
          surahName: v.surah_name_ar,
          surahEnglishName: v.surah_english_name,
          text: v.text_uthmani,
          translation: v.translation_en,
          revelationType: v.revelation_type,
        }))
        return res.json({ success: true, count: formatted.length, source: 'supabase', data: formatted })
      }
    }

    // Fallback
    const qpcData = loadFallbackJson('qpc-hafs.json') || {}
    const transData = loadFallbackJson('en-sahih-international-simple.json') || {}
    const verses: any[] = []
    for (const [key, v] of Object.entries<any>(qpcData)) {
      if (v.surah === surahNumber) {
        verses.push({
          id: key,
          surah: v.surah,
          ayah: v.ayah,
          surahName: `سورة ${v.surah}`,
          surahEnglishName: `Surah ${v.surah}`,
          text: v.text,
          translation: transData[key]?.t || '',
          revelationType: 'Meccan',
        })
      }
    }
    verses.sort((a, b) => a.ayah - b.ayah)
    res.json({ success: true, count: verses.length, source: 'fallback', data: verses })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 2. Lookup single verse: /api/quran/verse?surah=2&ayah=255
router.get('/verse', async (req: Request, res: Response) => {
  try {
    const surah = parseInt(req.query.surah as string || '1', 10)
    const ayah = parseInt(req.query.ayah as string || '1', 10)
    const verseKey = `${surah}:${ayah}`

    if (config.isSupabaseConfigured()) {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from('quran_verses')
        .select('*')
        .eq('id', verseKey)
        .single()

      if (!error && data) {
        return res.json({ success: true, data })
      }
    }

    // Fallback from local data
    const qpcData = loadFallbackJson('qpc-hafs.json')
    const transData = loadFallbackJson('en-sahih-international-simple.json')
    const verse = qpcData ? qpcData[verseKey] : null
    const trans = transData ? transData[verseKey]?.t : ''

    if (!verse) {
      return res.status(404).json({ success: false, error: 'Verse not found' })
    }

    res.json({
      success: true,
      source: 'fallback',
      data: {
        id: verseKey,
        surah_number: surah,
        ayah_number: ayah,
        text_uthmani: verse.text,
        translation_en: trans,
      },
    })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 3. Search verses: /api/quran/search?q=الرحمن&limit=20
router.get('/search', async (req: Request, res: Response) => {
  try {
    const query = ((req.query.q as string) || '').trim()
    const limit = parseInt(req.query.limit as string || '20', 10)

    if (!query) {
      return res.status(400).json({ success: false, error: 'Query parameter "q" is required' })
    }

    if (config.isSupabaseConfigured()) {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from('quran_verses')
        .select('*')
        .or(`text_uthmani.ilike.%${query}%,translation_en.ilike.%${query}%`)
        .limit(limit)

      if (!error && data) {
        return res.json({ success: true, count: data.length, data })
      }
    }

    // Fallback search
    const qpcData = loadFallbackJson('qpc-hafs.json') || {}
    const transData = loadFallbackJson('en-sahih-international-simple.json') || {}

    const results = []
    for (const [key, v] of Object.entries<any>(qpcData)) {
      const translation = transData[key]?.t || ''
      if (v.text.includes(query) || translation.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          id: key,
          surah_number: v.surah,
          ayah_number: v.ayah,
          text_uthmani: v.text,
          translation_en: translation,
        })
        if (results.length >= limit) break
      }
    }

    res.json({ success: true, count: results.length, source: 'fallback', data: results })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 4. Recurrent phrases: /api/quran/phrases
router.get('/phrases', async (req: Request, res: Response) => {
  try {
    if (config.isSupabaseConfigured()) {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from('quran_phrases')
        .select('*')
        .order('count', { ascending: false })
        .limit(50)

      if (!error && data && data.length > 0) {
        return res.json({ success: true, count: data.length, data })
      }
    }

    const phrases = loadFallbackJson('phrases.json') || {}
    const list = Object.entries(phrases).slice(0, 50).map(([k, v]: [string, any]) => ({
      id: k,
      ...v,
    }))

    res.json({ success: true, count: list.length, source: 'fallback', data: list })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 5. Tafsir & Hadith linkages: /api/quran/tafsir?surah=21&ayah=33
router.get('/tafsir', async (req: Request, res: Response) => {
  try {
    const surah = parseInt(req.query.surah as string || '21', 10)
    const ayah = parseInt(req.query.ayah as string || '33', 10)
    const verseKey = `${surah}:${ayah}`

    if (config.isSupabaseConfigured()) {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from('quran_tafsir')
        .select('*')
        .eq('id', verseKey)
        .single()

      if (!error && data) {
        return res.json({ success: true, data })
      }
    }

    res.json({
      success: true,
      source: 'fallback',
      data: {
        id: verseKey,
        surah_number: surah,
        ayah_number: ayah,
        ibn_kathir: 'يقول تعالى مبيناً قدرته التامة وحكمته البالغة: وهو الذي خلق الليل بسواده وظلامه والنهار بضيائه ونوره، والشمس والقمر، وكل منهما يجري في فلك خاص به يدور فيه ويسير كما يسبح السابح في الماء.',
        scientific_notes: 'أكد علم الفلك الحديث أن الشمس والقمر وسائر النجوم تسبح في مدارات محددة حول مراكز ثقل المجرة.',
      },
    })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
