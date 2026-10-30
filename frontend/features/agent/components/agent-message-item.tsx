import React, { useState } from 'react'
import {
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  BookOpen,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Scale,
  Scroll,
  BookMarked,
  Cpu,
  Layers,
} from 'lucide-react'
import { AgentChatMessage, ToolStep } from '../types/agent-message'

interface AgentMessageItemProps {
  message: AgentChatMessage
  selectedModel: string
  copiedId: string | null
  onCopy: (id: string, text: string) => void
}

function getToolMeta(name: string) {
  switch (name) {
    case 'search_quran':
      return { label: 'البحث في معجم المصحف الشريف', icon: Search, color: 'text-blue-600 bg-blue-50 border-blue-200' }
    case 'get_similar_ayahs':
      return { label: 'استخراج المتشابهات والنظم اللفظي', icon: Layers, color: 'text-amber-600 bg-amber-50 border-amber-200' }
    case 'check_symmetry':
      return { label: 'فحص التناظر الحرفي (Palindrome)', icon: Scale, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' }
    case 'calculate_gematria':
      return { label: 'حساب الجُمّل والأوزان الحرفية', icon: Cpu, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' }
    case 'get_hadith':
    case 'get_hadith_isnad':
      return { label: 'تخريج الإسناد ومصطلح الحديث', icon: Scroll, color: 'text-purple-600 bg-purple-50 border-purple-200' }
    case 'get_verse_tafsir':
      return { label: 'استدعاء كتب التفسير المعتمدة', icon: BookMarked, color: 'text-teal-600 bg-teal-50 border-teal-200' }
    default:
      return { label: `استدعاء الأداة: ${name}`, icon: Sparkles, color: 'text-slate-600 bg-slate-50 border-slate-200' }
  }
}

function ToolStepBadge({ step }: { step: ToolStep }) {
  const [expanded, setExpanded] = useState(false)
  const meta = getToolMeta(step.name)
  const Icon = meta.icon

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white text-xs shadow-2xs">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-2.5 hover:bg-slate-50 transition-colors text-right cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className={`p-1.5 rounded-lg border flex items-center justify-center ${meta.color}`}>
            <Icon className="w-3.5 h-3.5" />
          </span>
          <div>
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <span>{meta.label}</span>
              {step.status === 'calling' ? (
                <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200 animate-pulse">
                  جارٍ الاستعلام...
                </span>
              ) : (
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                  تم التنفيذ القطعي
                </span>
              )}
            </div>
            {step.summary && (
              <p className="text-[11px] text-slate-500 font-mono line-clamp-1">{step.summary}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <span className="text-[10px]">{expanded ? 'طي' : 'عرض التفاصيل'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {expanded && (
        <div className="p-3 bg-slate-50/70 border-t border-slate-200 space-y-2 text-[11px]" dir="ltr">
          {step.args && Object.keys(step.args).length > 0 && (
            <div>
              <span className="text-slate-500 font-bold block mb-0.5" dir="rtl">المعاملات المدخلة (Arguments):</span>
              <pre className="p-2 bg-white rounded border border-slate-200 text-slate-800 overflow-x-auto font-mono text-[10px]">
                {JSON.stringify(step.args, null, 2)}
              </pre>
            </div>
          )}
          {step.data && (
            <div>
              <span className="text-slate-500 font-bold block mb-0.5" dir="rtl">مخرجات الأداة المعتمدة (Output Data):</span>
              <pre className="p-2 bg-white rounded border border-slate-200 text-slate-800 overflow-x-auto font-mono text-[10px] max-h-48">
                {JSON.stringify(step.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function AgentMessageItem({ message, selectedModel, copiedId, onCopy }: AgentMessageItemProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 max-w-4xl ${isUser ? 'mr-auto flex-row-reverse' : 'ml-auto flex-row'}`}>
      <div
        className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center shadow-sm ${
          isUser ? 'bg-slate-200 border border-slate-300 text-slate-700' : 'bg-teal-700 text-white'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div className="flex-1 space-y-2 max-w-3xl">
        <div
          className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed border transition-all ${
            isUser
              ? 'bg-slate-100 border-slate-200 text-slate-900 rounded-tr-none'
              : 'bg-white border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
          }`}
        >
          {!isUser && (
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100 text-xs">
              <span className="font-semibold text-teal-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                {message.provider || 'QuranMind Intelligence'}{' '}
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-mono">
                  {message.modelUsed || selectedModel}
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{message.timestamp}</span>
            </div>
          )}

          {/* Render ReAct Tool Steps if present */}
          {message.toolSteps && message.toolSteps.length > 0 && (
            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>خطوات الاستدلال واستدعاء الأدوات ({message.toolSteps.length}):</span>
              </div>
              <div className="space-y-1.5">
                {message.toolSteps.map((step) => (
                  <ToolStepBadge key={step.id} step={step} />
                ))}
              </div>
            </div>
          )}

          {/* Render Markdown / Text content */}
          <div className="whitespace-pre-wrap font-sans text-slate-800 leading-relaxed text-sm">
            {message.content}
            {message.isStreaming && (
              <span className="inline-block w-2 h-4 bg-teal-600 mr-1 animate-pulse align-middle" />
            )}
          </div>

          {/* Render rich evidence data if available */}
          {message.data && (
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
              {message.data.symmetryInsight && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> تناظر حرفي تام (100% Palindrome)
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-medium">
                      ملاحظة قطعية
                    </span>
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed font-serif">{message.data.symmetryInsight}</p>
                </div>
              )}

              {message.data.matchedVerses && message.data.matchedVerses.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-teal-800 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-teal-600" /> الآيات القرآنية ذات الصلة الموثقة:
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {message.data.matchedVerses.map((v) => (
                      <div key={v.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-teal-800 font-bold">سورة {v.surahName} - الآية [{v.ayah}]</span>
                          <button onClick={() => onCopy(v.id, v.text)} title="نسخ الآية" className="p-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
                            {copiedId === v.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <p className="text-base text-slate-900 font-serif leading-loose" dir="rtl">«{v.text}»</p>
                        {v.translation && <p className="text-[11px] text-slate-500 italic" dir="ltr">"{v.translation}"</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {message.data.summaryPoints && message.data.summaryPoints.length > 0 && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-slate-700 block mb-1">النتائج المستخلصة:</span>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                    {message.data.summaryPoints.map((pt, idx) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {message.data.disclaimer && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-[11px] text-amber-800 leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{message.data.disclaimer}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400">
          <button onClick={() => onCopy(message.id, message.content)} className="flex items-center gap-1 hover:text-teal-700 transition-colors cursor-pointer">
            {copiedId === message.id ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" /> تم النسخ
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> نسخ الإجابة
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
