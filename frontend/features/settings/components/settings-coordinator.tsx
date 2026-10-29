'use client'

import React, { useState } from 'react'
import { BrainCircuit, SlidersHorizontal, Settings } from 'lucide-react'
import { AiEnginesTab } from './ai-engines-tab'
import { MushafPreferencesTab } from './mushaf-preferences-tab'

export function SettingsCoordinator() {
  const [activeTab, setActiveTab] = useState<'ai' | 'preferences'>('ai')

  return (
    <div className="space-y-6 max-w-4xl mx-auto" dir="rtl">
      {/* Settings Header */}
      <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-teal-800 tracking-wider">
              LOCAL PLATFORM CONFIGURATION · البيئة المحلية المفتوحة
            </span>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mt-0.5">
              <Settings className="w-5 h-5 text-teal-700" />
              إعدادات المنصة والمحركات البحثية
            </h2>
          </div>
          <span className="text-[11px] font-medium px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
            وضع الباحث المحلي الكامل (Local Scholar)
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>إعداد محركات الذكاء الاصطناعي</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'preferences'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>تفضيلات المصحف والواجهة البحثية</span>
          </button>
        </div>
      </div>

      {/* Active Tab Content */}
      <div>
        {activeTab === 'ai' ? <AiEnginesTab /> : <MushafPreferencesTab />}
      </div>
    </div>
  )
}
