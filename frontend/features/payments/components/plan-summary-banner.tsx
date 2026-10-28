import React from 'react'
import { Award, BookOpen } from 'lucide-react'
import { PlanTier } from '@/config/plans'

interface PlanSummaryBannerProps {
  plan: PlanTier
  planName: string
  isDZD: boolean
  amount: number
}

export function PlanSummaryBanner({ plan, planName, isDZD, amount }: PlanSummaryBannerProps) {
  return (
    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
      <div className="space-y-0.5">
        <span className="text-[10px] text-teal-700 font-semibold uppercase tracking-wider">
          الباقة المختارة للترقية:
        </span>
        <div className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
          {plan === 'patron' ? (
            <Award className="w-4 h-4 text-amber-500" />
          ) : (
            <BookOpen className="w-4 h-4 text-teal-600" />
          )}
          <span>{planName}</span>
        </div>
      </div>
      <div className="text-left">
        <span className="text-base sm:text-lg font-black text-teal-700 font-mono">
          {isDZD ? `${amount.toLocaleString()} د.ج` : `$${amount}`}
        </span>
        <small className="block text-[10px] text-slate-500">شهرياً (بدون رسوم إضافية)</small>
      </div>
    </div>
  )
}
