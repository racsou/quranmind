import { Router, Request, Response } from 'express'
import { config } from '../config/index.js'
import { getServiceSupabase } from '../db/supabase.js'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  const isConfigured = config.isSupabaseConfigured()
  let dbStatus = 'not_configured'
  let stats = {
    surahs: 114,
    verses: 6236,
    collections: 9,
    managedUsers: 6,
  }

  if (isConfigured) {
    try {
      const supabase = getServiceSupabase()
      const { count: versesCount, error: vErr } = await supabase
        .from('quran_verses')
        .select('*', { count: 'exact', head: true })

      const { count: usersCount, error: uErr } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      if (!vErr) {
        dbStatus = 'connected'
        stats.verses = versesCount || 6236
      }
      if (!uErr && usersCount) {
        stats.managedUsers = usersCount
      }
    } catch {
      dbStatus = 'connection_error'
    }
  }

  res.json({
    status: 'ok',
    service: 'quranmind-backend',
    version: '1.0.0',
    mode: 'saas',
    timestamp: new Date().toISOString(),
    supabase: {
      configured: isConfigured,
      status: dbStatus,
      url: config.supabase.url ? `${config.supabase.url.slice(0, 18)}...` : 'not_set',
    },
    stats,
  })
})

export default router
