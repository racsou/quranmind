'use client'

import React, { useState, useEffect } from 'react'
import { BookOpen, Volume2, Sparkles, CheckCircle2 } from 'lucide-react'

export function MushafPreferencesTab() {
  const [script, setScript] = useState('uthmani-hafs')
  const [tafsir, setTafsir] = useState('ibn-kathir')
  const [reciter, setReciter] = useState('mishary')
  const [autoPlay, setAutoPlay] = useState(false)
  const [continuous, setContinuous] = useState(true)
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    try {
      setScript(localStorage.getItem('qm_mushaf_script') || 'uthmani-hafs')
      setTafsir(localStorage.getItem('qm_default_tafsir') || 'ibn-kathir')
      setReciter(localStorage.getItem('qm_preferred_reciter') || 'mishary')
      setAutoPlay(localStorage.getItem('qm_autoplay_verse') === 'true')
      setContinuous(localStorage.getItem('qm_continuous_playback') !== 'false')
    } catch {}
  }, [])

  const handleSave = () => {
    try {
      localStorage.setItem('qm_mushaf_script', script)
      localStorage.setItem('qm_default_tafsir', tafsir)
      localStorage.setItem('qm_preferred_reciter', reciter)
      localStorage.setItem('qm_autoplay_verse', String(autoPlay))
      localStorage.setItem('qm_continuous_playback', String(continuous))
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
          <span className="font-semibold">تم حفظ تفضيلات المصحف والواجهة البحثية بنجاح.</span>
        </div>
      )}

      <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-xs">
        <div>
          <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-teal-700" /> رسم المصحف والخط القرآني:
          </label>
          <select value={script} onChange={(e) => setScript(e.target.value)} className={selectClass}>
            <option value="uthmani-hafs">مصحف المدينة النبوية (رسم عثماني - رواية حفص عن عاصم)</option>
            <option value="warsh">رواية ورش عن نافع (رسم مغربي عثماني)</option>
            <option value="simple-imlaei">الرسم الإملائي المبسط للبحث والتحليل الإحصائي</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-700" /> التفسير المعتمد في لوحة الأدلة:
          </label>
          <select value={tafsir} onChange={(e) => setTafsir(e.target.value)} className={selectClass}>
            <option value="ibn-kathir">تفسير القرآن العظيم (ابن كثير)</option>
            <option value="al-tabari">جامع البيان عن تأويل آي القرآن (الطبري)</option>
            <option value="al-saadi">تيسير الكريم الرحمن في تفسير كلام المنان (السعدي)</option>
            <option value="al-qurtubi">الجامع لأحكام القرآن (القرطبي)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-teal-700" /> القارئ المفضل للتلاوة الصوتية:
          </label>
          <select value={reciter} onChange={(e) => setReciter(e.target.value)} className={selectClass}>
            <option value="mishary">مشاري بن راشد العفاسي (مرتل)</option>
            <option value="abdulbasit">عبد الباسط عبد الصمد (مرتل ومجود)</option>
            <option value="alhusary">محمود خليل الحصري (مرتل بالتحقيق)</option>
            <option value="alminshawi">محمد صديق المنشاوي (مرتل)</option>
          </select>
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          <label className="flex items-center gap-2 cursor-pointer text-slate-700">
            <input type="checkbox" checked={autoPlay} onChange={(e) => setAutoPlay(e.target.checked)} className="accent-teal-700 w-4 h-4 rounded" />
            <span>تشغيل التلاوة الصوتية فور تحديد الآية من المصحف</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-slate-700">
            <input type="checkbox" checked={continuous} onChange={(e) => setContinuous(e.target.checked)} className="accent-teal-700 w-4 h-4 rounded" />
            <span>المتابعة التلقائية والانتقال للآية التالية أثناء الاستماع</span>
          </label>
        </div>

        <div className="pt-2 flex justify-end">
          <button type="button" onClick={handleSave} className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs shadow-sm transition cursor-pointer">
            حفظ تفضيلات المصحف
          </button>
        </div>
      </div>
    </div>
  )
}
