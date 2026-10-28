import React from 'react'
import Link from 'next/link'
import { Lock, ArrowLeft } from 'lucide-react'

export function AgentPaywallBanner() {
  return (
    <div className="mx-4 mb-2 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
            <span>الوكيل البحثي القرآني يتطلب الترقية إلى باقة المحقق الأكاديمي (Pro)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-semibold">
              ميزة احترافية
            </span>
          </h4>
          <p className="text-[11px] text-slate-600 mt-0.5">
            تصفح المصحف الشريف والاستماع إلى تلاوات كبار القراء متاح مجاناً. للوصول إلى الوكيل الذكي (Google Gemini)، يرجى تفعيل اشتراكك.
          </p>
        </div>
      </div>
      <Link
        href="/dashboard/settings?subtab=billing"
        className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-1.5 shrink-0"
      >
        <span>اختيار الخطة والترقية الآن</span>
        <ArrowLeft className="w-3.5 h-3.5" />
      </Link>
    </div>
  )
}
