import React from 'react'
import { Key } from 'lucide-react'

interface AgentConfigDrawerProps {
  apiKey: string
  setApiKey: (key: string) => void
  temperature: number
  setTemperature: (temp: number) => void
  selectedModel: string
  onClose: () => void
}

export function AgentConfigDrawer({
  apiKey,
  setApiKey,
  temperature,
  setTemperature,
  selectedModel,
  onClose,
}: AgentConfigDrawerProps) {
  return (
    <div className="bg-slate-50 border-b border-slate-200 p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs animate-in fade-in duration-200">
      <div>
        <label className="text-slate-700 font-semibold mb-1.5 flex items-center gap-1.5">
          <Key className="w-3.5 h-3.5 text-teal-700" />
          مفتاح Google Gemini API المخصص (اختياري):
        </label>
        <input
          type="password"
          placeholder="AIzaSy... (اتركه فارغاً للاعتماد على المفتاح العام)"
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value)
            try { localStorage.setItem('qm_gemini_api_key', e.target.value) } catch {}
          }}
          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 placeholder-slate-400 outline-none focus:border-teal-600 font-mono text-xs"
        />
        <p className="text-[11px] text-slate-500 mt-1">
          إذا لم تضف مفتاحاً خاصاً، ستعمل التحليلات عبر المفتاح الداخلي والمحرك الحسابي.
        </p>
      </div>

      <div>
        <label className="text-slate-700 font-semibold mb-1.5 flex items-center justify-between">
          <span>درجة الدقة والحرارة (Temperature):</span>
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
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          <span>0.0 (دقة رياضية حازمة)</span>
          <span>0.3 (موصى به للقرآن)</span>
          <span>1.0 (إبداعي)</span>
        </div>
      </div>

      <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between shadow-sm">
        <div>
          <span className="text-teal-800 font-bold block mb-1">المحرك المعتمد:</span>
          <p className="text-slate-600 text-[11px]">
            {selectedModel.startsWith('gemini')
              ? '⚡ Google Gemini + المحرك القطعي (Deterministic Normalized Engine)'
              : 'ذكاء اصطناعي عام + قاعدة بيانات المصحف الشريف'}
          </p>
        </div>
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded text-[11px] font-semibold cursor-pointer"
          >
            إغلاق الإعدادات
          </button>
        </div>
      </div>
    </div>
  )
}
