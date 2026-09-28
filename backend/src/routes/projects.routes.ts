import { Router, Request, Response } from 'express'
import { getServiceSupabase } from '../db/supabase.js'
import { config } from '../config/index.js'
import { randomUUID } from 'crypto'

const router = Router()

// In-memory fallback
let FALLBACK_PROJECTS: any[] = [
  {
    id: 'd1000000-0000-0000-0000-000000000001',
    user_id: 'demo-user',
    title: 'معجزة التناظر في القرآن',
    description: 'دراسة التناظر اللفظي والبنيوي في آيات القرآن الكريم مثل «ربك فكبر» و«كل في فلك»',
    hypothesis: 'الألفاظ القرآنية ذات الدلالة الدورانية والفلكية تتبع نمطاً تناظرياً محسوباً بدقة',
    status: 'active',
    created_at: new Date().toISOString(),
  },
]

let FALLBACK_EVIDENCE: any[] = [
  {
    id: 'e1000000-0000-0000-0000-000000000001',
    project_id: 'd1000000-0000-0000-0000-000000000001',
    user_id: 'demo-user',
    surah: 21,
    ayah: 33,
    surah_name: 'الأنبياء',
    verse_text: 'وَهُوَ الَّذِي خَلَقَ اللَّيْلَ وَالنَّهَارَ وَالشَّمْسَ وَالْقَمَرَ ۖ كُلٌّ فِي فَلَكٍ يَسْبَحُونَ',
    analysis_type: 'symmetry',
    classification: 'verified',
    calculation_data: { letters: 46, words: 11, symmetryRatio: 1.0, mathExplanation: 'تطابق الحروف عند القراءة من اليمين لليسار' },
    created_at: new Date().toISOString(),
  },
]

// 1. List Projects
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'demo-user'

    if (config.isSupabaseConfigured()) {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .or(`user_id.eq.${userId},user_id.eq.demo-user`)
        .order('created_at', { ascending: false })

      if (!error && data) {
        return res.json({ success: true, count: data.length, data })
      }
    }

    const list = FALLBACK_PROJECTS.filter((p) => p.user_id === userId || p.user_id === 'demo-user')
    res.json({ success: true, source: 'fallback', count: list.length, data: list })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 2. Create Project
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, hypothesis, userId = 'demo-user' } = req.body

    if (!title) {
      return res.status(400).json({ success: false, error: 'Project title is required' })
    }

    const newProject = {
      id: randomUUID(),
      user_id: userId,
      title,
      description: description || null,
      hypothesis: hypothesis || null,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (config.isSupabaseConfigured()) {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase.from('projects').insert(newProject).select().single()
      if (!error && data) {
        return res.status(201).json({ success: true, data })
      }
    }

    FALLBACK_PROJECTS.push(newProject)
    res.status(201).json({ success: true, source: 'fallback', data: newProject })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 3. Get Project With Evidence
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (config.isSupabaseConfigured()) {
      const supabase = getServiceSupabase()
      const { data: project, error: pError } = await supabase.from('projects').select('*').eq('id', id).single()
      const { data: evidence, error: eError } = await supabase.from('evidence_items').select('*').eq('project_id', id)

      if (!pError && project) {
        return res.json({
          success: true,
          data: {
            ...project,
            evidence: !eError && evidence ? evidence : [],
          },
        })
      }
    }

    const project = FALLBACK_PROJECTS.find((p) => p.id === id)
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' })

    const evidence = FALLBACK_EVIDENCE.filter((e) => e.project_id === id)
    res.json({ success: true, source: 'fallback', data: { ...project, evidence } })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 4. Add Evidence Item
router.post('/:id/evidence', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { surah, ayah, surahName, verseText, analysisType, classification = 'hypothesis', calculationData, notes, userId = 'demo-user' } = req.body

    if (!surah || !ayah || !verseText || !analysisType) {
      return res.status(400).json({ success: false, error: 'surah, ayah, verseText, and analysisType are required' })
    }

    const newEvidence = {
      id: randomUUID(),
      project_id: id,
      user_id: userId,
      surah,
      ayah,
      surah_name: surahName || null,
      verse_text: verseText,
      analysis_type: analysisType,
      classification,
      calculation_data: calculationData || null,
      notes: notes || null,
      created_at: new Date().toISOString(),
    }

    if (config.isSupabaseConfigured()) {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase.from('evidence_items').insert(newEvidence).select().single()
      if (!error && data) {
        return res.status(201).json({ success: true, data })
      }
    }

    FALLBACK_EVIDENCE.push(newEvidence)
    res.status(201).json({ success: true, source: 'fallback', data: newEvidence })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
