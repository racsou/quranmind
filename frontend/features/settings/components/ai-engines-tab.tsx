'use client'

import React, { useState, useEffect } from 'react'
import { BrainCircuit, Key, Sliders, CheckCircle2, Eye, EyeOff, Server, Cpu, RefreshCw, AlertCircle } from 'lucide-react'

export function AiEnginesTab() {
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash')
  const [provider, setProvider] = useState('auto')
  const [endpoint, setEndpoint] = useState('http://localhost:11434')
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [temperature, setTemperature] = useState(0.2)
  const [scholarlyMode, setScholarlyMode] = useState('scientific-symmetry')
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Live model auto-detection state
  const [localOnline, setLocalOnline] = useState(false)
  const [localModels, setLocalModels] = useState<string[]>([])
  const [checkingModels, setCheckingModels] = useState(false)

  const checkLocalModels = async (targetEndpoint?: string) => {
    const ep = targetEndpoint || endpoint
    setCheckingModels(true)
    try {
      const res = await fetch(`/api/agent/models?endpoint=${encodeURIComponent(ep)}`)
      if (res.ok) {
        const data = await res.json()
        setLocalOnline(Boolean(data.online))
        if (Array.isArray(data.models)) {
          setLocalModels(data.models)
          // If no model set or set to generic, auto-pick first detected model
          if (data.online && data.models.length > 0 && !localStorage.getItem('qm_preferred_model')) {
            setSelectedModel(data.models[0])
          }
        }
      } else {
        setLocalOnline(false)
      }
    } catch {
      setLocalOnline(false)
    } finally {
      setCheckingModels(false)
    }
  }

  useEffect(() => {
    try {
      const savedM = localStorage.getItem('qm_preferred_model')
      if (savedM) setSelectedModel(savedM)
      setProvider(localStorage.getItem('qm_agent_provider') || 'auto')
      const savedEp = localStorage.getItem('qm_local_endpoint') || 'http://localhost:11434'
      setEndpoint(savedEp)
      setApiKey(localStorage.getItem('qm_gemini_api_key') || localStorage.getItem('qm_custom_api_key') || '')
      const t = localStorage.getItem('qm_temperature')
      if (t) setTemperature(parseFloat(t))
      setScholarlyMode(localStorage.getItem('qm_scholarly_mode') || 'scientific-symmetry')

      checkLocalModels(savedEp)
    } catch {}
  }, [])

  const handleSave = () => {
    try {
      localStorage.setItem('qm_preferred_model', selectedModel)
      localStorage.setItem('qm_agent_provider', provider)
      localStorage.setItem('qm_local_endpoint', endpoint.trim())
      localStorage.setItem('qm_gemini_api_key', apiKey.trim())
      localStorage.setItem('qm_temperature', temperature.toString())
      localStorage.setItem('qm_scholarly_mode', scholarlyMode)
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 2500)
    } catch {}
  }

  const selectClass = "w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-teal-600"

  return (
    <div className="space-y-5 animate-fade-in text-xs" dir="rtl">
      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">تم حفظ إعدادات محركات الذكاء الاصطناعي بنجاح.</span>
        </div>
      )}

      <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3.5 shadow-xs">
        {/* Detection Status Banner */}
        <div className="flex items-center justify-between p-2.5 rounded-xl border bg-slate-50 border-slate-200">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${localOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <div>
              <span className="font-bold text-slate-800">
                {localOnline
                  ? `خادم Ollama متصل (${localModels.length} نموذج جاهز للاستخدام)`
                  : 'خادم Ollama المحلي غير متصل'}
              </span>
              <p className="text-[11px] text-slate-500">
                {localOnline
                  ? 'تم استكشاف النماذج المنصبة على جهازك تلقائياً وإضافتها للقائمة.'
                  : 'يمكنك تشغيل الخادم المحلي عبر `ollama serve` أو استخدام Gemini السحابي.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => checkLocalModels()}
            disabled={checkingModels}
            className="px-2.5 py-1.5 bg-white border border-slate-300 hover:border-teal-600 text-slate-700 rounded-lg text-[11px] font-medium flex items-center gap-1 cursor-pointer transition shadow-2xs"
          >
            <RefreshCw className={`w-3 h-3 ${checkingModels ? 'animate-spin text-teal-600' : ''}`} />
            <span>فحص النماذج</span>
          </button>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
            <BrainCircuit className="w-4 h-4 text-teal-700" /> نموذج الذكاء الاصطناعي النشط:
          </label>
          <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className={selectClass}>
            {localModels.length > 0 && (
              <optgroup label="النماذج المنصبة محلياً (Ollama Detected)">
                {localModels.map((m) => (
                  <option key={m} value={m}>
                    🖥️ {m} (منصب محلياً)
                  </option>
                ))}
              </optgroup>
            )}

            <optgroup label="Google Gemini (الموصى به سحابياً)">
              <option value="gemini-2.5-flash">⚡ Google Gemini 2.5 Flash (فائق السرعة وخفيف)</option>
              <option value="gemini-2.5-pro">🧠 Google Gemini 2.5 Pro (استدلال متقدم وبحث معمق)</option>
            </optgroup>

            <optgroup label="نماذج محلية مقترحة للتنزيل">
              <option value="command-r7b-arabic">command-r7b-arabic (المعتمد في مستودع ilm)</option>
              <option value="qwen2.5:7b">Qwen 2.5 7B (دقيق في اللغة العربية)</option>
              <option value="llama3.3:8b">Llama 3.3 8B</option>
              <option value="deepseek-r1:8b">DeepSeek R1 8B (تفكير رياضي حازم)</option>
            </optgroup>

            <optgroup label="خوادم خارجية متوافقة">
              <option value="local-openai">خادم محلي مخصص (LM Studio / vLLM / LocalAI)</option>
              <option value="gpt-4o">OpenAI GPT-4o</option>
              <option value="claude-3-5">Anthropic Claude 3.5 Sonnet</option>
            </optgroup>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-teal-700" /> موفر الخدمة (Provider):
            </label>
            <select value={provider} onChange={(e) => setProvider(e.target.value)} className={selectClass}>
              <option value="auto">تلقائي (بحسب اسم النموذج المحدد)</option>
              <option value="ollama">Ollama محلياً (http://localhost:11434)</option>
              <option value="openai-compatible">خادم محلي متوافق (LM Studio / vLLM)</option>
              <option value="gemini">Google Gemini السحابي</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-teal-700" /> عنوان الخادم المحلي (Endpoint):
            </label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="http://localhost:11434"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono outline-none focus:border-teal-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Key className="w-4 h-4 text-teal-700" /> مفتاح Google Gemini API المخصص (اختياري للنمط السحابي):
            </span>
            <button type="button" onClick={() => setShowApiKey(!showApiKey)} className="text-slate-500 hover:text-slate-800 text-[11px] flex items-center gap-1 cursor-pointer">
              {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showApiKey ? 'إخفاء' : 'إظهار'}</span>
            </button>
          </label>
          <input
            type={showApiKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy... (اتركه فارغاً للاعتماد على المفتاح المدمج)"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono outline-none focus:border-teal-600"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-teal-700" /> درجة الدقة والحرارة (Temperature):
            </span>
            <span className="text-teal-800 font-mono font-bold">{temperature}</span>
          </label>
          <input type="range" min="0" max="1" step="0.05" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} className="w-full accent-teal-700 cursor-pointer" />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>0.0 (دقة رياضية حازمة)</span>
            <span>0.2 (موصى به للقرآن الكريم)</span>
            <span>1.0 (إبداعي واسع)</span>
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">النمط البحثي والمنهجي:</label>
          <select value={scholarlyMode} onChange={(e) => setScholarlyMode(e.target.value)} className={selectClass}>
            <option value="scientific-symmetry">التناظر البنيوي والإعجاز العلمي واللغوي (افتراضي)</option>
            <option value="lexical-derivation">الاشتقاق المعجمي وتتبع الجذور القرآنية</option>
            <option value="general-thematic">الاستدلال الموضوعي والمقارن</option>
          </select>
        </div>

        <div className="pt-2 flex justify-end">
          <button type="button" onClick={handleSave} className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs shadow-sm transition cursor-pointer">
            حفظ إعدادات الذكاء الاصطناعي
          </button>
        </div>
      </div>
    </div>
  )
}
