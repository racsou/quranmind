import { NextRequest } from 'next/server'
import { executeAgentStream } from '@/lib/agent/llm-provider'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      query,
      history = [],
      model = 'gemini-2.5-flash',
      provider = 'auto',
      endpoint = 'http://localhost:11434',
      apiKey,
      temperature = 0.2,
    } = body

    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'سؤال البحث مطلوب' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (data: Record<string, any>) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
        }

        const onAbort = () => {
          try {
            controller.close()
          } catch {}
        }
        req.signal.addEventListener('abort', onAbort)

        try {
          await executeAgentStream(
            {
              query,
              history,
              model,
              provider,
              endpoint,
              apiKey,
              temperature,
              signal: req.signal,
            },
            {
              onToolCall: (call) => {
                sendEvent({ type: 'tool_call', call })
              },
              onToolResult: (result) => {
                sendEvent({ type: 'tool_result', result })
              },
              onToken: (token) => {
                sendEvent({ type: 'token', token })
              },
              onDone: (fullText, toolsUsed) => {
                req.signal.removeEventListener('abort', onAbort)
                sendEvent({ type: 'done', fullText, toolsUsed })
                try {
                  controller.close()
                } catch {}
              },
              onError: (err) => {
                req.signal.removeEventListener('abort', onAbort)
                sendEvent({ type: 'error', error: err.message })
                try {
                  controller.close()
                } catch {}
              },
            }
          )
        } catch (err: any) {
          req.signal.removeEventListener('abort', onAbort)
          if (!req.signal.aborted) {
            sendEvent({ type: 'error', error: err?.message || 'فشل تشغيل الوكيل الذكي' })
            try {
              controller.close()
            } catch {}
          }
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    })
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error?.message || 'خطأ في الخادم' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
