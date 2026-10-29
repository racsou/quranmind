'use client'

import React, { useState, useEffect } from 'react'
import { BrainCircuit, Key, Sliders, CheckCircle2, Eye, EyeOff } from 'lucide-react'

export function AiEnginesTab() {
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash')
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [temperature, setTemperature] = useState(0.2)
  const [scholarlyMode, setScholarlyMode] = useState('scientific-symmetry')
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    try {
      setSelectedModel(localStorage.getItem('qm_preferred_model') || 'gemini-2.5-flash')
      setApiKey(localStorage.getItem('qm_gemini_api_key') || localStorage.getItem('qm_custom_api_key') || '')
      const t = localStorage.getItem('qm_temperature')
      if (t) setTemperature(parseFloat(t))
      setScholarlyMode(localStorage.getItem('qm_scholarly_mode') || 'scientific-symmetry')
    } catch {}
  }, [])

  const handleSave = () => {
    try {
      localStorage.setItem('qm_preferred_model', selectedModel)
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
        <div>
          <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
            <BrainCircuit className="w-4 h-4 text-teal-700" /> نموذج الذكاء الاصطناعي النشط:
          </label>
          <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className={selectClass}>
            <optgroup label="Google Gemini (الموصى به للقرآن)">
              <option value="gemini-2.5-flash">⚡ Google Gemini 2.5 Flash (فائق السرعة وخفيف)</option>
              <option value="gemini-2.5-pro">🧠 Google Gemini 2.5 Pro (استدلال متقدم وبحث معمق)</option>
            </optgroup>
            <optgroup label="نماذج إضافية">
              <option value="gpt-4o">OpenAI GPT-4o</option>
              <option value="claude-3-5">Anthropic Claude 3.5 Sonnet</option>
              <option value="deepseek-r1">DeepSeek R1 (تفكير رياضي حازم)</option>
            </optgroup>
          </select>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Key className="w-4 h-4 text-teal-700" /> مفتاح Google Gemini API المخصص (اختياري):
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
            placeholder="AIzaSy... (اتركه فارغاً للاعتماد على المفتاح المحلي المدمج)"
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
