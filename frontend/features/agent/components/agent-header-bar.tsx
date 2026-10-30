import React from 'react'
import { BrainCircuit, Sliders, Download, RotateCcw, Trash2, Cpu, Cloud, RefreshCw, Menu } from 'lucide-react'

interface AgentHeaderBarProps {
  selectedModel: string
  showConfig: boolean
  showSessions: boolean
  localOnline: boolean
  localModels: string[]
  onToggleConfig: () => void
  onToggleSessions: () => void
  onModelChange: (model: string) => void
  onExportChat: () => void
  onResetChat: () => void
  onResetAllDefaults: () => void
  onRefreshModels?: () => void
}

export function AgentHeaderBar({
  selectedModel,
  showConfig,
  showSessions,
  localOnline,
  localModels,
  onToggleConfig,
  onToggleSessions,
  onModelChange,
  onExportChat,
  onResetChat,
  onResetAllDefaults,
  onRefreshModels,
}: AgentHeaderBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-50 border-b border-slate-200">
      <div className="flex items-center gap-3">
        {/* Three Dashes Menu Icon Button to toggle Sessions */}
        <button
          onClick={onToggleSessions}
          className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
            showSessions
              ? 'bg-teal-700 border-teal-800 text-white'
              : 'bg-white border-slate-300 hover:border-teal-600 text-slate-700 hover:text-teal-800'
          }`}
          title="سجل الجلسات والمحادثات (ثلاث شرطات)"
        >
          <Menu className="w-4 h-4" />
          <span className="text-xs font-bold hidden sm:inline">الجلسات</span>
        </button>

        <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center shadow-md">
          <BrainCircuit className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">الوكيل البحثي الذكي (QuranMind Agent Studio)</h2>
            {localOnline ? (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800" title="خادم Ollama المحلي متصل ويعمل بكفاءة">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <Cpu className="w-3 h-3 text-emerald-700" />
                المحرك المحلي متصل
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 border border-amber-200 text-amber-800" title="خادم Ollama غير مشغل - المحرك يعمل عبر Gemini أو النماذج السحابية">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <Cloud className="w-3 h-3 text-amber-600" />
                النمط السحابي
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            استدلال متقدم على نصوص القرآن الكريم ومصطلح الحديث باستدعاء الأدوات التلقائي (ReAct)
          </p>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-2">
        <div className="relative flex items-center">
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="bg-white border border-slate-300 text-slate-700 text-xs font-medium rounded-lg px-3 py-1.5 pr-2 pl-7 outline-none hover:border-slate-400 transition-colors cursor-pointer"
          >
            {localModels.length > 0 && (
              <optgroup label="النماذج المنصبة محلياً (Ollama Detected)">
                {localModels.map((m) => (
                  <option key={m} value={m}>
                    🖥️ {m}
                  </option>
                ))}
              </optgroup>
            )}
            <optgroup label="Google Gemini (الموصى به سحابياً)">
              <option value="gemini-2.5-flash">⚡ Google Gemini 2.5 Flash</option>
              <option value="gemini-2.5-pro">🧠 Google Gemini 2.5 Pro</option>
            </optgroup>
            <optgroup label="نماذج إضافية">
              <option value="command-r7b-arabic">command-r7b-arabic</option>
              <option value="qwen2.5:7b">qwen2.5:7b</option>
              <option value="local-openai">خادم محلي مخصص (LM Studio / vLLM)</option>
            </optgroup>
          </select>

          {onRefreshModels && (
            <button
              onClick={onRefreshModels}
              title="تحديث قائمة النماذج المحلية من Ollama"
              className="mr-1.5 p-1 rounded-md text-slate-400 hover:text-teal-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={onToggleConfig}
          title="إعدادات الخادم المحلي والمفاتيح ودرجة الحرارة"
          className={`p-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
            showConfig ? 'bg-teal-50 border-teal-600 text-teal-800' : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span className="hidden sm:inline">إعدادات المحرك</span>
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
          title="مسح محادثة الجلسة الحالية والبدء من جديد"
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
