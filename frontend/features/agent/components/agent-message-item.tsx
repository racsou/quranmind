import React from 'react'
import { Sparkles, Bot, User, Copy, Check, BookOpen, AlertCircle } from 'lucide-react'
import { AgentChatMessage } from '../types/agent-message'

interface AgentMessageItemProps {
  message: AgentChatMessage
  selectedModel: string
  copiedId: string | null
  onCopy: (id: string, text: string) => void
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

      <div className="flex-1 space-y-2 max-w-2xl">
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border transition-all ${
            isUser
              ? 'bg-slate-100 border-slate-200 text-slate-900 rounded-tr-none'
              : 'bg-white border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
          }`}
        >
          {!isUser && (
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs">
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

          <div className="whitespace-pre-wrap font-sans text-slate-800">{message.content}</div>

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
