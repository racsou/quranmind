import React from 'react'
import { BrainCircuit, Sliders, Download, RotateCcw, Trash2 } from 'lucide-react'

interface AgentHeaderBarProps {
  selectedModel: string
  showConfig: boolean
  onToggleConfig: () => void
  onModelChange: (model: string) => void
  onExportChat: () => void
  onResetChat: () => void
  onResetAllDefaults: () => void
}

export function AgentHeaderBar({
  selectedModel,
  showConfig,
  onToggleConfig,
  onModelChange,
  onExportChat,
  onResetChat,
  onResetAllDefaults,
}: AgentHeaderBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-50 border-b border-slate-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center shadow-md">
          <BrainCircuit className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">الوكيل البحثي الذكي (QuranMind Agent Studio)</h2>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              متصل وجاهز
            </span>
          </div>
          <p className="text-xs text-slate-500">استدلال متقدم على نصوص القرآن الكريم ومحرك التحليل القطعي</p>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-2">
        <select
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value)}
          className="bg-white border border-slate-300 text-slate-700 text-xs font-medium rounded-lg px-3 py-1.5 pr-2 pl-7 outline-none hover:border-slate-400 transition-colors cursor-pointer"
        >
          <optgroup label="Google Gemini (الموصى به)">
            <option value="gemini-2.5-flash">⚡ Google Gemini 2.5 Flash (فائق السرعة)</option>
            <option value="gemini-2.5-pro">🧠 Google Gemini 2.5 Pro (استدلال وبحث معمق)</option>
          </optgroup>
          <optgroup label="نماذج ذكاء اصطناعي إضافية">
            <option value="gpt-4o">OpenAI GPT-4o</option>
            <option value="claude-3-5">Anthropic Claude 3.5 Sonnet</option>
            <option value="deepseek-r1">DeepSeek R1 (تفكير رياضي)</option>
          </optgroup>
        </select>

        <button
          onClick={onToggleConfig}
          title="إعدادات المفاتيح ودرجة الحرارة"
          className={`p-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
            showConfig ? 'bg-teal-50 border-teal-600 text-teal-800' : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span className="hidden sm:inline">الإعدادات</span>
        </button>

        <button
          onClick={onExportChat}
          title="تصدير الجلسة كملف Markdown"
          className="p-1.5 rounded-lg bg-white border border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-900 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">تصدير</span>
        </button>

        <button
          onClick={onResetChat}
          title="مسح المحادثة والبدء من جديد"
          className="p-1.5 rounded-lg bg-white border border-slate-300 hover:border-amber-400 text-slate-600 hover:text-amber-700 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">مسح</span>
        </button>

        <button
          onClick={onResetAllDefaults}
          title="استعادة كافة الإعدادات والافتراضيات"
          className="px-2.5 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-600" />
          <span className="hidden md:inline">استعادة الافتراضيات</span>
        </button>
      </div>
    </div>
  )
}
