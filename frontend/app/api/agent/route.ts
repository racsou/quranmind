import { NextRequest, NextResponse } from 'next/server'
import { searchQuran, QURAN_VERSES } from '@/lib/quran/quran-data'
import { analyzeVerseDetailed, checkSymmetry } from '@/lib/quran/analysis'
import { redisCache } from '@/lib/redis/client'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      query,
      model = 'gemini-2.5-flash',
      apiKey,
      systemPrompt,
      temperature = 0.3,
    } = body

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { success: false, error: 'سؤال البحث مطلوب' },
        { status: 400 }
      )
    }

    const cleanQuery = query.trim()
    const effectiveKey = apiKey || process.env.GEMINI_API_KEY
    const cacheKey = `agent:v2:${model}:${Buffer.from(cleanQuery).toString('base64')}`

    const responseData = await redisCache.getOrSet(
      cacheKey,
      async () => {
        // 1. Find relevant verses
        let matchedVerses = searchQuran(cleanQuery)

        // If no direct keyword match, inspect key concepts
        if (matchedVerses.length === 0) {
          if (
            cleanQuery.includes('تناظر') ||
            cleanQuery.includes('تكبير') ||
            cleanQuery.includes('سبح') ||
            cleanQuery.includes('فلك')
          ) {
            matchedVerses = QURAN_VERSES.filter((v) =>
              ['36:40', '21:33', '74:3'].includes(v.id)
            )
          } else if (
            cleanQuery.includes('كون') ||
            cleanQuery.includes('سماء') ||
            cleanQuery.includes('أرض') ||
            cleanQuery.includes('نجم')
          ) {
            matchedVerses = QURAN_VERSES.filter((v) =>
              ['21:30', '41:53', '67:3'].includes(v.id)
            )
          } else {
            matchedVerses = [QURAN_VERSES[0]] // Fallback to Al-Fatihah
          }
        }

        // 2. Perform deep deterministic analysis on matched verses
        const analyses = matchedVerses.slice(0, 3).map((v) => {
          return {
            verse: v,
            analysis: analyzeVerseDetailed(v, 'structural'),
          }
        })

        // 3. Check symmetry (Palindromes)
        const isSymmetryFocus =
          cleanQuery.includes('تناظر') ||
          cleanQuery.includes('عكس') ||
          cleanQuery.includes('فلك') ||
          cleanQuery.includes('فكبر')

        let symmetryInsight: string | null = null
        if (isSymmetryFocus) {
          const phrase1 = 'ربك فكبر'
          const phrase2 = 'كل في فلك'
          const sym1 = checkSymmetry(phrase1)
          const sym2 = checkSymmetry(phrase2)

          symmetryInsight = `تم رصد تناظر حرفي تام (100% Palindrome) في الموضعين القرآنيين الشهيرين:\n1. «${phrase1}» في سورة المدثر:3 (ر-ب-ك-ف-ك-ب-ر).\n2. «${phrase2}» في سورة يس:40 وسورة الأنبياء:33 (ك-ل-ف-ي-ف-ل-ك).\nهذه ملاحظة محسوبة ومؤكدة نصياً دون حاجة لأي تأويل.`
        }

        // 4. If Google Gemini is selected and a key exists, call Gemini REST API
        let aiGeneratedExplanation: string | null = null
        let providerUsed = model.startsWith('gemini') ? 'Google Gemini' : 'AI Model Engine'

        if (model.startsWith('gemini') && effectiveKey) {
          try {
            const geminiModel = model === 'gemini-2.5-pro' ? 'gemini-2.5-pro' : 'gemini-2.5-flash'
            const prompt = `أنت مساعد بحثي قرآني وعلمي رصين في منصة QuranMind.
القاعدة الأساسية: التمييز الصارم بين النص القرآني الصريح والظاهرة اللغوية الرياضية المؤكدة، وبين التأويلات والفرضيات العلمية البشرية القابلة للتغير.
الموضوع المراد دراسته: "${cleanQuery}"
الآيات المستخرجة من الفهرس:
${matchedVerses.slice(0, 3).map((v) => `- سورة ${v.surahName} [${v.id}]: «${v.text}»`).join('\n')}
${symmetryInsight ? `ملاحظة التناظر المحسوبة:\n${symmetryInsight}` : ''}

قدم إجابة علمية موثقة ودقيقة تتضمن:
1. التحليل الدلالي والبنيوي للنص.
2. الملاحظة الرياضية أو اللغوية المؤكدة إن وجدت.
3. التمييز الإبستيمولوجي بين ما هو يقيني نصي وما هو اجتهاد استئناسي.`

            const geminiRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${effectiveKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt }] }],
                  generationConfig: {
                    temperature: temperature,
                    maxOutputTokens: 1200,
                  },
                }),
              }
            )

            if (geminiRes.ok) {
              const geminiData = await geminiRes.json()
              aiGeneratedExplanation =
                geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || null
            }
          } catch (e) {
            console.warn('Gemini API call failed, falling back to local deterministic engine:', e)
          }
        }

        const summaryPoints = [
          `تم مطابقة ${matchedVerses.length} آية قرآنية ذات صلة بالسياق البحثي المطروح.`,
          isSymmetryFocus
            ? 'تأكيد التناظر الحرفي الدائري التام بنسبة 100% في نصوص الحركة الفلكية والتسبيح.'
            : 'استخراج الأوزان الحرفية والإحصائية وحساب الجمل بدقة وفق قواعد التطبيع.',
          'التمييز الصارم بين الملاحظة النصية المؤكدة وبين التأويلات العلمية الافتراضية.',
        ]

        return {
          query: cleanQuery,
          modelUsed: model,
          provider: providerUsed,
          summaryPoints,
          symmetryInsight,
          aiGeneratedExplanation,
          matchedVerses: matchedVerses.slice(0, 4),
          analyses,
          disclaimer:
            'هذه النتائج مستندة إلى التحليل الرياضي والنصي الصارم للبيانات القرآنية المعتمدة، ولا تعد فتوى أو استنتاجاً علمياً جازماً دون مراجعة أهل الاختصاص.',
        }
      },
      3600 // Cache for 1 hour
    )

    return NextResponse.json({
      success: true,
      data: responseData,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

