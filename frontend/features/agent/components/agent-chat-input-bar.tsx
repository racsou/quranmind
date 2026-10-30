import React from 'react'
import { Send, Square, Lock } from 'lucide-react'

interface AgentChatInputBarProps {
  inputQuery: string
  setInputQuery: (q: string) => void
  isLoading: boolean
  isPaywalled: boolean
  selectedModel: string
  onSubmit: () => void
  onStop?: () => void
}

export function AgentChatInputBar({
  inputQuery,
  setInputQuery,
  isLoading,
  isPaywalled,
  selectedModel,
  onSubmit,
  onStop,
}: AgentChatInputBarProps) {
  return (
    <div className="p-4 bg-slate-50 border-t border-slate-200">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (isLoading) {
            onStop?.()
          } else {
            onSubmit()
          }
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onClick={() => {
              if (isPaywalled) window.location.href = '/dashboard/settings?subtab=billing'
            }}
            placeholder={
              isPaywalled
                ? '🔒 الوكيل مقفل لحسابك المجاني. اضغط هنا للانتقال لصفحة الفواتير واختيار باقة المحقق...'
                : isLoading
                ? 'جارٍ الاستدلال والتوليد...'
                : 'اكتب استفسارك القرآني أو العلمي هنا... (مثال: ما هو التناظر في «كل في فلك»؟)'
            }
            className={`w-full border rounded-xl px-4 py-3 text-sm placeholder-slate-400 outline-none transition-all font-sans ${
              isPaywalled
                ? 'bg-amber-50 border-amber-300 text-amber-800 cursor-pointer'
                : 'bg-white border-slate-300 text-slate-800 focus:border-teal-600 focus:ring-1 focus:ring-teal-600'
            }`}
          />
        </div>

        {isLoading ? (
          <button
            type="button"
            onClick={onStop}
            className="px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all shrink-0 cursor-pointer"
            title="إيقاف التوليد (Stop)"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>إيقاف</span>
          </button>
        ) : (
          <button
            type="submit"
            disabled={(!inputQuery.trim() && !isPaywalled) || isLoading}
            className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer ${
              isPaywalled
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-teal-700 hover:bg-teal-800 text-white disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            {isPaywalled ? (
              <>
                <span>ترقية الحساب</span>
                <Lock className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>إرسال</span>
                <Send className="w-4 h-4 rotate-180" />
              </>
            )}
          </button>
        )}
      </form>

      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
        <div className="flex items-center gap-2">
          <span>النموذج النشط:</span>
          <strong className="text-teal-800">
            {selectedModel === 'gemini-2.5-flash'
              ? 'Google Gemini 2.5 Flash'
              : selectedModel === 'gemini-2.5-pro'
              ? 'Google Gemini 2.5 Pro'
              : selectedModel}
          </strong>
        </div>
        <span>منهجية قطعية: التمييز الصارم بين النص القرآني والتأويلات البشرية</span>
      </div>
    </div>
  )
}
