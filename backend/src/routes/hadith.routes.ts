import { Router, Request, Response } from 'express'
import { getServiceSupabase } from '../db/supabase.js'
import { config } from '../config/index.js'

const router = Router()

// 1. List Hadiths
router.get('/', async (req: Request, res: Response) => {
  try {
    const collection = req.query.collection as string
    const limit = parseInt(req.query.limit as string || '20', 10)

    if (config.isSupabaseConfigured()) {
      const supabase = getServiceSupabase()
      let query = supabase.from('hadiths').select('*').limit(limit)

      if (collection) {
        query = query.ilike('collection', `%${collection}%`)
      }

      const { data, error } = await query
      if (!error && data && data.length > 0) {
        return res.json({ success: true, count: data.length, data })
      }
    }

    // Fallback hadith
    res.json({
      success: true,
      count: 1,
      source: 'fallback',
      data: [
        {
          id: 'bukhari-1',
          collection: 'صحيح البخاري',
          hadith_number: 1,
          primary_narrator: 'عمر بن الخطاب رضي الله عنه',
          arabic_matn: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى...',
          breadth: 'gharib',
          themes: ['النية', 'الإخلاص'],
        },
      ],
    })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 2. Collections
router.get('/collections', async (req: Request, res: Response) => {
  try {
    if (config.isSupabaseConfigured()) {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase.from('hadith_collections').select('*')
      if (!error && data && data.length > 0) {
        return res.json({ success: true, count: data.length, data })
      }
    }

    res.json({
      success: true,
      count: 2,
      source: 'fallback',
      data: [
        { code: 'bukhari', name_ar: 'صحيح البخاري', name_en: 'Sahih al-Bukhari', total_hadiths: 7563, canonical: true },
        { code: 'muslim', name_ar: 'صحيح مسلم', name_en: 'Sahih Muslim', total_hadiths: 7500, canonical: true },
      ],
    })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 3. Books
router.get('/books', async (req: Request, res: Response) => {
  try {
    if (config.isSupabaseConfigured()) {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase.from('hadith_books').select('*')
      if (!error && data && data.length > 0) {
        return res.json({ success: true, count: data.length, data })
      }
    }

    res.json({
      success: true,
      count: 2,
      source: 'fallback',
      data: [
        { id: 1, name_ar: 'الجامع المسند الصحيح المختصر', name_en: 'Sahih al-Bukhari', author: 'البخاري' },
        { id: 2, name_ar: 'المسند الصحيح', name_en: 'Sahih Muslim', author: 'مسلم' },
      ],
    })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 4. Scholars
router.get('/scholars', async (req: Request, res: Response) => {
  try {
    if (config.isSupabaseConfigured()) {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase.from('hadith_scholars').select('*')
      if (!error && data && data.length > 0) {
        return res.json({ success: true, count: data.length, data })
      }
    }

    res.json({
      success: true,
      source: 'fallback',
      data: [
        { key: 'bukhari', name_ar: 'محمد بن إسماعيل البخاري', name_en: 'Al-Bukhari', death_year_ah: 256 },
        { key: 'muslim', name_ar: 'مسلم بن الحجاج النيسابوري', name_en: 'Muslim', death_year_ah: 261 },
      ],
    })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 5. Narrators
router.get('/narrators', async (req: Request, res: Response) => {
  try {
    const q = ((req.query.q as string) || '').toLowerCase()
    const page = parseInt(req.query.page as string || '1', 10)
    const limit = parseInt(req.query.limit as string || '20', 10)

    if (config.isSupabaseConfigured()) {
      const supabase = getServiceSupabase()
      let query = supabase.from('hadith_narrators').select('*', { count: 'exact' })

      if (q) {
        query = query.or(`name_ar.ilike.%${q}%,name_en.ilike.%${q}%`)
      }

      const from = (page - 1) * limit
      const to = from + limit - 1
      const { data, count, error } = await query.range(from, to)

      if (!error && data) {
        return res.json({
          success: true,
          page,
          limit,
          total: count || data.length,
          data,
        })
      }
    }

    res.json({
      success: true,
      page,
      limit,
      total: 1,
      source: 'fallback',
      data: [
        { id: 'narrator-umar', name_ar: 'عمر بن الخطاب رضي الله عنه', name_en: 'Umar ibn al-Khattab', generation: 'Sahabi', reliability: 'ثقة ثبت' },
      ],
    })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 6. Textual Matn Diffing
router.post('/diff', (req: Request, res: Response) => {
  try {
    const { textA, textB, sourceA = 'Narration A', sourceB = 'Narration B' } = req.body

    if (!textA || !textB) {
      return res.status(400).json({ success: false, error: 'textA and textB are required' })
    }

    const wordsA = textA.trim().split(/\s+/)
    const wordsB = textB.trim().split(/\s+/)

    const tokensA = wordsA.map((w: string) => ({
      word: w,
      status: wordsB.includes(w) ? 'identical' : 'omitted',
    }))

    const tokensB = wordsB.map((w: string) => ({
      word: w,
      status: wordsA.includes(w) ? 'identical' : 'added',
    }))

    const identicalCount = wordsA.filter((w: string) => wordsB.includes(w)).length
    const similarity = Math.round((identicalCount / Math.max(wordsA.length, wordsB.length)) * 100)

    res.json({
      success: true,
      diff: {
        sourceA,
        sourceB,
        similarityPercentage: similarity,
        tokensA,
        tokensB,
      },
    })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
