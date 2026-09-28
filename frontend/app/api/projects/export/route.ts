import { NextRequest, NextResponse } from 'next/server'
import { generateMarkdownDossier, generateHtmlDossier, type DossierExportOptions } from '@/lib/export/dossier-generator'
import { uploadResearchExport } from '@/lib/supabase/client'
import { lookupVerse } from '@/lib/quran/quran-data'
import { analyzeVerseDetailed, type NormalizationMode } from '@/lib/quran/analysis'
import { getTafsirForVerse } from '@/lib/quran/tafsir-hadith'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      projectTitle = 'تقرير بحثي قرآني',
      hypothesis,
      surah = 21,
      ayah = 33,
      normMode = 'structural',
      format = 'all', // 'markdown' | 'html' | 'all'
      authorName,
      notes,
    } = body

    const verse = lookupVerse(Number(surah), Number(ayah))
    if (!verse) {
      return NextResponse.json(
        { success: false, error: 'الآية المحددة غير موجودة' },
        { status: 404 }
      )
    }

    const analysis = analyzeVerseDetailed(verse, normMode as NormalizationMode)
    const tafsir = getTafsirForVerse(Number(surah), Number(ayah))

    const exportOptions: DossierExportOptions = {
      projectTitle,
      hypothesis,
      verse,
      analysis,
      tafsir,
      notes,
      authorName,
    }

    const markdown = generateMarkdownDossier(exportOptions)
    const html = generateHtmlDossier(exportOptions)

    // Generate unique filename for storage
    const timestamp = Date.now()
    const safeTitle = projectTitle.replace(/[^a-zA-Z0-9\u0621-\u064A]/g, '_').slice(0, 30)
    const fileName = `dossier_${surah}_${ayah}_${safeTitle}_${timestamp}.md`
    const htmlFileName = `dossier_${surah}_${ayah}_${safeTitle}_${timestamp}.html`

    // Upload to Supabase Storage
    let storageResult = null
    try {
      storageResult = await uploadResearchExport(fileName, markdown, 'text/markdown; charset=utf-8')
      await uploadResearchExport(htmlFileName, html, 'text/html; charset=utf-8')
    } catch (uploadErr) {
      console.warn('Storage upload note:', uploadErr)
      storageResult = {
        path: fileName,
        publicUrl: `/api/projects/export/download?file=${encodeURIComponent(fileName)}`,
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        fileName,
        htmlFileName,
        storagePath: storageResult.path,
        downloadUrl: storageResult.publicUrl,
        markdown,
        html,
      },
    })
  } catch (error: any) {
    console.error('Export error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'حدث خطأ أثناء تصدير الملف البحثي' },
      { status: 500 }
    )
  }
}
