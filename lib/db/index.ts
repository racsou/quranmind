import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const databaseUrl = process.env.DATABASE_URL

function createDbClient() {
  if (!databaseUrl || databaseUrl.includes('placeholder')) {
    return null
  }

  try {
    const sql = neon(databaseUrl)
    return drizzle(sql, { schema })
  } catch (error) {
    console.warn('Failed to initialize Neon database connection:', error)
    return null
  }
}

export const db = createDbClient()

// Memory fallback store for development when DATABASE_URL is not set
class LocalDataStore {
  private projects: Map<string, schema.Project> = new Map([
    [
      'demo-proj-1',
      {
        id: 'demo-proj-1',
        userId: 'demo-user',
        title: 'معجزة التناظر في القرآن',
        description: 'دراسة التناظر اللفظي والبنيوي في آيات القرآن الكريم مثل «ربك فكبر» و«كل في فلك»',
        hypothesis: 'الألفاظ القرآنية ذات الدلالة الدورانية والفلكية تتبع نمطاً تناظرياً محسوباً بدقة',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    [
      'demo-proj-2',
      {
        id: 'demo-proj-2',
        userId: 'demo-user',
        title: 'الحقائق العلمية والأفلاك الكونية',
        description: 'توثيق مواضع الذكر الفلكي مع أحدث أرصاد علم الفلك الحديث',
        hypothesis: 'حركة الأجرام في المدارات محددة بمصطلح السباحة الفلكية',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  ])

  private evidence: Map<string, schema.EvidenceItem> = new Map([
    [
      'demo-evi-1',
      {
        id: 'demo-evi-1',
        projectId: 'demo-proj-1',
        userId: 'demo-user',
        surah: 21,
        ayah: 33,
        surahName: 'الأنبياء',
        verseText: 'وَهُوَ الَّذِي خَلَقَ اللَّيْلَ وَالنَّهَارَ وَالشَّمْسَ وَالْقَمَرَ ۖ كُلٌّ فِي فَلَكٍ يَسْبَحُونَ',
        analysisType: 'symmetry',
        classification: 'verified',
        calculationData: {
          letters: 46,
          words: 11,
          symmetryRatio: 1.0,
          normalizedText: 'كل في فلك',
          mathExplanation: 'تطابق الحروف عند القراءة من اليمين إلى اليسار والعكس (ك-ل-ف-ي-ف-ل-ك)',
        },
        sources: [
          {
            title: 'معجم ألفاظ القرآن الكريم ومفرداته',
            citation: 'تحليل البنية اللفظية في سورة الأنبياء',
          },
        ],
        notes: 'ملاحظة محسوبة ومؤكدة نصياً دون تأويل افتراضي',
        createdAt: new Date(),
      },
    ],
  ])

  getProjects(userId?: string): schema.Project[] {
    const all = Array.from(this.projects.values())
    if (!userId) return all
    return all.filter((p) => p.userId === userId || p.userId === 'demo-user')
  }

  addProject(data: Omit<schema.NewProject, 'id' | 'createdAt' | 'updatedAt'>): schema.Project {
    const id = `proj-${Date.now()}`
    const now = new Date()
    const project: schema.Project = {
      id,
      userId: data.userId,
      title: data.title,
      description: data.description ?? null,
      hypothesis: data.hypothesis ?? null,
      status: data.status ?? 'active',
      createdAt: now,
      updatedAt: now,
    }
    this.projects.set(id, project)
    return project
  }

  getEvidence(projectId?: string): schema.EvidenceItem[] {
    const all = Array.from(this.evidence.values())
    if (!projectId) return all
    return all.filter((e) => e.projectId === projectId)
  }

  addEvidence(data: schema.NewEvidenceItem): schema.EvidenceItem {
    const id = `evi-${Date.now()}`
    const item: schema.EvidenceItem = {
      id,
      projectId: data.projectId ?? null,
      userId: data.userId,
      surah: data.surah,
      ayah: data.ayah,
      surahName: data.surahName ?? null,
      verseText: data.verseText,
      analysisType: data.analysisType,
      classification: data.classification ?? 'hypothesis',
      calculationData: data.calculationData ?? null,
      sources: data.sources ?? null,
      notes: data.notes ?? null,
      createdAt: new Date(),
    }
    this.evidence.set(id, item)
    return item
  }
}

export const fallbackStore = new LocalDataStore()
