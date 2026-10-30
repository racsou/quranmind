import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const endpoint = url.searchParams.get('endpoint') || 'http://localhost:11434'
  const cleanEndpoint = endpoint.replace(/\/+$/, '')

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000)

    const res = await fetch(`${cleanEndpoint}/api/tags`, {
      method: 'GET',
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (res.ok) {
      const data = await res.json()
      const models = Array.isArray(data?.models)
        ? data.models
            .filter((m: any) => {
              // Exclude pure embedding models like nomic-embed-text
              const isEmbed = m.capabilities && !m.capabilities.includes('completion')
              const hasEmbedName = m.name?.includes('embed') || m.details?.family?.includes('bert')
              return !isEmbed && !hasEmbedName
            })
            .map((m: any) => m.name)
        : []

      return NextResponse.json({
        success: true,
        online: true,
        provider: 'ollama',
        endpoint: cleanEndpoint,
        models,
        message: models.length > 0
          ? `متصل بخادم Ollama المحلي (${models.length} نموذج متوفر)`
          : 'متصل بخادم Ollama (لا توجد نماذج منزلة حالياً)',
      })
    }
  } catch (err) {
    // Local server offline or timed out
  }

  // Fallback defaults when local Ollama is offline
  return NextResponse.json({
    success: true,
    online: false,
    provider: 'ollama',
    endpoint: cleanEndpoint,
    models: [
      'command-r7b-arabic',
      'qwen2.5:7b',
      'qwen2.5:14b',
      'llama3.3:8b',
      'deepseek-r1:8b',
    ],
    message: 'خادم Ollama المحلي غير متصل (قم بتشغيل `ollama serve` في الطرفية)',
  })
}
