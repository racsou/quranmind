import React, { useState } from 'react'
import { Key, Server, Cpu, Sliders, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'

interface AgentConfigDrawerProps {
  apiKey: string
  setApiKey: (key: string) => void
  temperature: number
  setTemperature: (temp: number) => void
  selectedModel: string
  provider: 'ollama' | 'openai-compatible' | 'gemini' | 'auto'
  setProvider: (p: 'ollama' | 'openai-compatible' | 'gemini' | 'auto') => void
  endpoint: string
  setEndpoint: (ep: string) => void
  localOnline: boolean
  onClose: () => void
  onTestConnection?: () => Promise<boolean>
}

export function AgentConfigDrawer({
  apiKey,
  setApiKey,
  temperature,
  setTemperature,
  selectedModel,
  provider,
  setProvider,
  endpoint,
  setEndpoint,
  localOnline,
  onClose,
  onTestConnection,
}: AgentConfigDrawerProps) {
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null)

  const handleTest = async () => {
    if (!onTestConnection) return
    setTesting(true)
    setTestResult(null)
    try {
      const ok = await onTestConnection()
      setTestResult({
        ok,
        msg: ok ? 'تم الاتصال بالخادم بنجاح!' : 'تعذر الاتصال بالخادم، تأكد من تشغيله.',
      })
    } catch {
      setTestResult({ ok: false, msg: 'حدث خطأ أثناء فحص الاتصال.' })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="bg-slate-50 border-b border-slate-200 p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs animate-in fade-in duration-200">
      {/* 1. Model Provider & Local Server Endpoint */}
      <div className="space-y-2">
        <label className="text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
          <Server className="w-3.5 h-3.5 text-teal-700" />
          بيئة ومزود النموذج (Model Runtime):
        </label>
        <select
          value={provider}
          onChange={(e) => {
            const p = e.target.value as any
            setProvider(p)
            try { localStorage.setItem('qm_agent_provider', p) } catch {}
          }}
          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 outline-none focus:border-teal-600"
        >
          <option value="auto">تلقائي (بحسب اسم النموذج المحدد)</option>
          <option value="ollama">🖥️ Ollama محلياً (http://localhost:11434)</option>
          <option value="openai-compatible">⚡ خادم محلي متوافق (LM Studio / vLLM)</option>
          <option value="gemini">☁️ Google Gemini السحابي</option>
        </select>

        <div>
          <label className="text-slate-600 text-[11px] font-medium block mb-1">
            عنوان الخادم المحلي (Endpoint):
          </label>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={endpoint}
              onChange={(e) => {
                setEndpoint(e.target.value)
                try { localStorage.setItem('qm_local_endpoint', e.target.value) } catch {}
              }}
              placeholder="http://localhost:11434"
              className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 font-mono text-[11px] outline-none focus:border-teal-600"
            />
            <button
              type="button"
              onClick={handleTest}
              disabled={testing}
              title="فحص الاتصال بالخادم"
              className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[11px] font-medium transition cursor-pointer flex items-center gap-1 shrink-0"
            >
              <RefreshCw className={`w-3 h-3 ${testing ? 'animate-spin' : ''}`} />
              <span>فحص</span>
            </button>
          </div>
          {testResult && (
            <div className={`mt-1 text-[10px] flex items-center gap-1 ${testResult.ok ? 'text-emerald-700' : 'text-amber-700'}`}>
              {testResult.ok ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
              <span>{testResult.msg}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Temperature & Accuracy */}
      <div className="space-y-2">
        <label className="text-slate-700 font-semibold mb-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-teal-700" />
            درجة الدقة والحرارة (Temperature):
          </span>
          <span className="text-teal-700 font-mono font-bold">{temperature}</span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={temperature}
          onChange={(e) => {
            const val = parseFloat(e.target.value)
            setTemperature(val)
            try { localStorage.setItem('qm_temperature', val.toString()) } catch {}
          }}
          className="w-full accent-teal-700 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>0.0 (دقة رياضية حازمة)</span>
          <span>0.2 (موصى به للقرآن)</span>
          <span>1.0 (إبداعي)</span>
        </div>

        <div>
          <label className="text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-teal-700" />
            مفتاح Gemini API (اختياري للنمط السحابي):
          </label>
          <input
            type="password"
            placeholder="AIzaSy... (اتركه فارغاً للاعتماد على المفتاح المحلي المدمج)"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value)
              try { localStorage.setItem('qm_gemini_api_key', e.target.value) } catch {}
            }}
            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 placeholder-slate-400 outline-none focus:border-teal-600 font-mono text-[11px]"
          />
        </div>
      </div>

      {/* 3. Status card & close */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between shadow-xs">
        <div>
          <span className="text-teal-800 font-bold block mb-1 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-teal-700" /> حالة المحرك والنموذج النشط:
          </span>
          <p className="text-slate-600 text-[11px] leading-relaxed mb-1.5">
            النموذج: <span className="font-mono font-semibold text-slate-900">{selectedModel}</span>
          </p>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            محرك الوكيل يدعم استدعاء الأدوات تلقائياً (ReAct) للبحث في 6236 آية، استخراج المتشابهات، وحساب التناظر ومصطلح الحديث.
          </p>
        </div>
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition"
          >
            إغلاق الإعدادات
          </button>
        </div>
      </div>
    </div>
  )
}
