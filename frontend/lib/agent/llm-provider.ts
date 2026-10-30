import {
  AGENT_TOOLS_OPENAI,
  AGENT_TOOLS_GEMINI,
  executeToolCall,
  type ToolExecutionResult,
} from './tools'

export interface AgentChatMessageParam {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string
  tool_call_id?: string
  name?: string
  tool_calls?: Array<{
    id: string
    type: 'function'
    function: {
      name: string
      arguments: string
    }
  }>
}

export interface AgentStreamCallbacks {
  onToolCall?: (call: { id: string; name: string; args: Record<string, any> }) => void
  onToolResult?: (result: { id: string; name: string; summary: string; data: any }) => void
  onToken?: (token: string) => void
  onDone?: (fullText: string, toolsUsed: ToolExecutionResult[]) => void
  onError?: (err: Error) => void
}

export interface AgentRunOptions {
  query: string
  history?: Array<{ role: 'user' | 'assistant'; content: string }>
  model?: string
  provider?: 'ollama' | 'openai-compatible' | 'gemini' | 'auto'
  endpoint?: string // e.g. 'http://localhost:11434' or 'http://localhost:1234/v1'
  apiKey?: string
  temperature?: number
  maxToolRounds?: number
  signal?: AbortSignal
}

const SYSTEM_PROMPT = `أنت مساعد ذكي وباحث قرآني وحديثي متقدم في منصة QuranMind الأكاديمية.
قواعد التعامل والتواصل:
1. أجب عن الأسئلة العامة أو التحيات أو المحادثات اليومية (مثل النكت، التحيات، الأسئلة العامة) بشكل طبيعي وودود ومباشر دون تكلف أو جمود.
2. عند السؤال عن القرآن الكريم أو الحديث النبوي أو التفسير أو علوم اللغة:
   - استخدم الأدوات البرمجية المتاحة (Tools) للبحث الدقيق وتوثيق الآيات والأسانيد والمتشابهات والتناظر.
   - وثّق الآيات القرآنية بدقة بصيغة [اسم السورة: رقم الآية] مثل [البقرة: 255].
   - التمييز القطعي بين النص القرآني الصريح والظواهر المؤكدة، وبين الاجتهادات والتأويلات البشرية.
3. التزم باللغة العربية الفصحى الواضحة والصدق المعرفي دون اختلاق أي معلومات.`

/**
 * Normalizes provider choice based on model name and settings
 */
export function resolveProvider(
  model: string,
  configuredProvider?: string
): 'ollama' | 'openai-compatible' | 'gemini' {
  if (configuredProvider && configuredProvider !== 'auto') {
    return configuredProvider as 'ollama' | 'openai-compatible' | 'gemini'
  }
  if (model.startsWith('gemini')) return 'gemini'
  if (model.includes('gpt-') || model.includes('claude-')) return 'openai-compatible'
  return 'ollama'
}

/**
 * Execute real AI agent without simulation and stream tokens via callbacks
 */
export async function executeAgentStream(
  options: AgentRunOptions,
  callbacks: AgentStreamCallbacks
) {
  const {
    query,
    history = [],
    model = 'Qwen3-Hermes:latest',
    endpoint = 'http://localhost:11434',
    apiKey,
    temperature = 0.2,
    maxToolRounds = 3,
    signal,
  } = options

  const provider = resolveProvider(model, options.provider)
  const toolsExecuted: ToolExecutionResult[] = []

  // Initialize conversation messages with history
  const messages: AgentChatMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.slice(-8).map((h) => ({ role: h.role, content: h.content })),
    { role: 'user', content: query },
  ]

  try {
    if (signal?.aborted) return

    if (provider === 'gemini') {
      await runGeminiAgent(
        query,
        messages,
        model,
        apiKey || process.env.GEMINI_API_KEY || '',
        temperature,
        toolsExecuted,
        callbacks,
        signal
      )
    } else if (provider === 'openai-compatible') {
      await runOpenAIAgent(
        messages,
        model,
        endpoint,
        apiKey || 'local',
        temperature,
        maxToolRounds,
        toolsExecuted,
        callbacks,
        signal
      )
    } else {
      // Real Ollama agent
      await runOllamaAgent(
        messages,
        model,
        endpoint,
        temperature,
        maxToolRounds,
        toolsExecuted,
        callbacks,
        signal
      )
    }
  } catch (err: any) {
    if (signal?.aborted || err?.name === 'AbortError') {
      callbacks.onDone?.('', toolsExecuted)
      return
    }
    const errorMsg = `⚠️ خطأ في التواصل مع النموذج (${model} - ${provider}):\n${err?.message || err}\n\nيرجى التأكد من تشغيل الخادم المحلي (مثل \`ollama serve\`) وتثبيت النموذج، أو التحقق من الإعدادات.`
    callbacks.onToken?.(errorMsg)
    callbacks.onDone?.(errorMsg, toolsExecuted)
  }
}

/**
 * Real Ollama Runner with ReAct tool calling & token streaming
 */
async function runOllamaAgent(
  messages: AgentChatMessageParam[],
  model: string,
  endpoint: string,
  temperature: number,
  maxRounds: number,
  toolsExecuted: ToolExecutionResult[],
  callbacks: AgentStreamCallbacks,
  signal?: AbortSignal
) {
  const baseUrl = endpoint.replace(/\/+$/, '')
  let rounds = 0
  let isDone = false

  while (rounds < maxRounds && !isDone) {
    if (signal?.aborted) return
    rounds++

    let res: Response
    try {
      res = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages,
          tools: AGENT_TOOLS_OPENAI,
          stream: false,
          options: { temperature },
        }),
        signal,
      })
    } catch (fetchErr: any) {
      if (signal?.aborted || fetchErr?.name === 'AbortError') return
      throw fetchErr
    }

    if (!res.ok) {
      const errText = await res.text()
      // If tools not supported by this local model, fallback to pure streaming
      if (errText.includes('does not support tools') || errText.includes('tools not supported')) {
        await streamOllamaFinal(baseUrl, model, messages, temperature, toolsExecuted, callbacks, signal)
        return
      }
      if (res.status === 404 || errText.includes('not found')) {
        throw new Error(`النموذج "${model}" غير متوفر في خادم Ollama. يمكنك تنزيله عبر: \`ollama pull ${model}\` أو اختيار نموذج منصب مثل Qwen3-Hermes:latest أو llama3.2-3B:latest.`)
      }
      throw new Error(`خادم Ollama المحلي: ${res.status} ${errText}`)
    }

    const data = await res.json()
    const msg = data.message

    // Check if model called tools
    if (msg?.tool_calls && Array.isArray(msg.tool_calls) && msg.tool_calls.length > 0) {
      messages.push({
        role: 'assistant',
        content: msg.content || '',
        tool_calls: msg.tool_calls,
      })

      for (const call of msg.tool_calls) {
        if (signal?.aborted) return
        const fnName = call.function.name
        let fnArgs: Record<string, any> = {}
        try {
          fnArgs = typeof call.function.arguments === 'string'
            ? JSON.parse(call.function.arguments)
            : call.function.arguments || {}
        } catch {
          fnArgs = {}
        }

        const callId = call.id || `call-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
        callbacks.onToolCall?.({ id: callId, name: fnName, args: fnArgs })

        const result = executeToolCall(fnName, fnArgs)
        toolsExecuted.push(result)

        callbacks.onToolResult?.({
          id: callId,
          name: fnName,
          summary: result.summary,
          data: result.data,
        })

        messages.push({
          role: 'tool',
          tool_call_id: call.id,
          name: fnName,
          content: JSON.stringify(result.data ?? { summary: result.summary }),
        })
      }
    } else {
      isDone = true
      const finalContent = msg?.content || ''

      if (finalContent) {
        // Stream the actual model response chunk by chunk
        const words = finalContent.split(' ')
        for (const w of words) {
          if (signal?.aborted) return
          callbacks.onToken?.(w + ' ')
          await new Promise((r) => setTimeout(r, 12))
        }
        callbacks.onDone?.(finalContent, toolsExecuted)
        return
      }

      await streamOllamaFinal(baseUrl, model, messages, temperature, toolsExecuted, callbacks, signal)
      return
    }
  }

  await streamOllamaFinal(baseUrl, model, messages, temperature, toolsExecuted, callbacks, signal)
}

async function streamOllamaFinal(
  baseUrl: string,
  model: string,
  messages: AgentChatMessageParam[],
  temperature: number,
  toolsExecuted: ToolExecutionResult[],
  callbacks: AgentStreamCallbacks,
  signal?: AbortSignal
) {
  if (signal?.aborted) return

  let streamRes: Response
  try {
    streamRes = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        options: { temperature },
      }),
      signal,
    })
  } catch (err: any) {
    if (signal?.aborted || err?.name === 'AbortError') return
    throw err
  }

  if (!streamRes.ok || !streamRes.body) {
    throw new Error('فشل بدء تدفق الإجابة النهائية من Ollama')
  }

  const reader = streamRes.body.getReader()
  const decoder = new TextDecoder()
  let accumulated = ''

  while (true) {
    if (signal?.aborted) {
      try { reader.cancel() } catch {}
      break
    }
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n').filter(Boolean)
    for (const line of lines) {
      try {
        const parsed = JSON.parse(line)
        const token = parsed?.message?.content || ''
        if (token) {
          accumulated += token
          callbacks.onToken?.(token)
        }
      } catch {}
    }
  }

  callbacks.onDone?.(accumulated, toolsExecuted)
}

/**
 * Real OpenAI-Compatible Local Runner (LM Studio / vLLM / LocalAI)
 */
async function runOpenAIAgent(
  messages: AgentChatMessageParam[],
  model: string,
  endpoint: string,
  apiKey: string,
  temperature: number,
  maxRounds: number,
  toolsExecuted: ToolExecutionResult[],
  callbacks: AgentStreamCallbacks,
  signal?: AbortSignal
) {
  let baseUrl = endpoint.replace(/\/+$/, '')
  if (!baseUrl.endsWith('/v1')) {
    baseUrl = `${baseUrl}/v1`
  }

  let rounds = 0
  let isDone = false

  while (rounds < maxRounds && !isDone) {
    if (signal?.aborted) return
    rounds++
    let res: Response
    try {
      res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          tools: AGENT_TOOLS_OPENAI,
          temperature,
        }),
        signal,
      })
    } catch (err: any) {
      if (signal?.aborted || err?.name === 'AbortError') return
      throw err
    }

    if (!res.ok) {
      throw new Error(`خطأ في استجابة الخادم المحلي OpenAI-compatible: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    const choice = data.choices?.[0]
    const msg = choice?.message

    if (msg?.tool_calls && Array.isArray(msg.tool_calls) && msg.tool_calls.length > 0) {
      messages.push(msg)

      for (const call of msg.tool_calls) {
        if (signal?.aborted) return
        const fnName = call.function.name
        let fnArgs = {}
        try {
          fnArgs = JSON.parse(call.function.arguments)
        } catch {}

        const callId = call.id || `call-${Date.now()}`
        callbacks.onToolCall?.({ id: callId, name: fnName, args: fnArgs })

        const result = executeToolCall(fnName, fnArgs)
        toolsExecuted.push(result)

        callbacks.onToolResult?.({
          id: callId,
          name: fnName,
          summary: result.summary,
          data: result.data,
        })

        messages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: JSON.stringify(result.data ?? { summary: result.summary }),
        })
      }
    } else {
      isDone = true
      const content = msg?.content || ''
      const words = content.split(' ')
      for (const w of words) {
        if (signal?.aborted) return
        callbacks.onToken?.(w + ' ')
        await new Promise((r) => setTimeout(r, 15))
      }
      callbacks.onDone?.(content, toolsExecuted)
      return
    }
  }
}

/**
 * Real Google Gemini Cloud Runner
 */
async function runGeminiAgent(
  query: string,
  messages: AgentChatMessageParam[],
  model: string,
  apiKey: string,
  temperature: number,
  toolsExecuted: ToolExecutionResult[],
  callbacks: AgentStreamCallbacks,
  signal?: AbortSignal
) {
  if (!apiKey) {
    throw new Error('مفتاح Google Gemini API غير متوفر، يرجى إضافته في إعدادات المحرك أو استخدام النماذج المحلية.')
  }

  const geminiModel = model === 'gemini-2.5-pro' ? 'gemini-2.5-pro' : 'gemini-2.5-flash'

  // Format messages for Gemini API
  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content || ' ' }],
    }))

  let res: Response
  try {
    res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { temperature, maxOutputTokens: 2048 },
        }),
        signal,
      }
    )
  } catch (err: any) {
    if (signal?.aborted || err?.name === 'AbortError') return
    throw err
  }

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Google Gemini API error: ${res.status} ${errText}`)
  }

  const data = await res.json()
  const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

  // Stream tokens from real Gemini response
  const words = content.split(' ')
  for (const w of words) {
    if (signal?.aborted) return
    callbacks.onToken?.(w + ' ')
    await new Promise((r) => setTimeout(r, 12))
  }

  callbacks.onDone?.(content, toolsExecuted)
}
