import express from 'express'
import cors from 'cors'
import { config } from './config/index.js'
import healthRoutes from './routes/health.routes.js'
import quranRoutes from './routes/quran.routes.js'
import hadithRoutes from './routes/hadith.routes.js'
import usersRoutes from './routes/users.routes.js'
import projectsRoutes from './routes/projects.routes.js'

const app = express()

// Global Middleware
app.use(
  cors({
    origin: config.corsOrigin === '*' ? true : [config.corsOrigin, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Request Logger
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`)
  })
  next()
})

// Route Mounting
app.use('/api/health', healthRoutes)
app.use('/api/quran', quranRoutes)
app.use('/api/hadith', hadithRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/projects', projectsRoutes)

// Backward Compatibility Aliases for /v1 routes
app.use('/v1/quran', quranRoutes)
app.use('/v1/hadith', hadithRoutes)
app.use('/v1/users', usersRoutes)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'QuranMind SaaS API Server',
    status: 'online',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: {
      health: '/api/health',
      quranSurahs: '/api/quran/surahs',
      quranVerse: '/api/quran/verse?surah=2&ayah=255',
      quranSearch: '/api/quran/search?q=الرحمن',
      quranPhrases: '/api/quran/phrases',
      quranTafsir: '/api/quran/tafsir?surah=21&ayah=33',
      hadiths: '/api/hadith',
      hadithCollections: '/api/hadith/collections',
      hadithNarrators: '/api/hadith/narrators',
      users: '/api/users',
      projects: '/api/projects',
    },
  })
})

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
  })
})

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Unhandled Error]:', err)
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  })
})

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log('========================================================')
    console.log(`🚀 QuranMind Express Server running on port ${config.port}`)
    console.log(`📡 URL: http://localhost:${config.port}`)
    console.log(`💾 Supabase: ${config.isSupabaseConfigured() ? 'CONFIGURED ✓' : 'NOT CONFIGURED (Using fallback stores)'}`)
    console.log('========================================================')
  })
}

export default app
