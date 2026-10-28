import React from 'react'
import { Sparkles, GraduationCap, BookOpen, Award, ArrowLeft, ChevronRight } from 'lucide-react'

export type AccountType = 'student' | 'scholar' | 'patron' | 'skipped'

interface RoleSelectionGridProps {
  selectedRole: AccountType
  onSelectRole: (role: AccountType) => void
  onSkip: () => void
}

export function RoleSelectionGrid({ selectedRole, onSelectRole, onSkip }: RoleSelectionGridProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
          <Sparkles className="w-3.5 h-3.5 text-teal-700" /> الخطوة 1 من 2: اختيار نوع الحساب البحثي
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">اختر نوع الحساب الذي يناسب مسارك البحثي</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          يمكنك تحديد نوع الحساب الآن للبدء بالميزات المخصصة، أو التخطي والاستكشاف واختيار الخطة لاحقاً.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div
          onClick={() => onSelectRole('student')}
          className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group ${
            selectedRole === 'student'
              ? 'bg-teal-50/70 border-teal-600 shadow-md ring-1 ring-teal-600'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-800 transition">طالب علم / مستكشف</h3>
              <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                مجاني بالكامل (Free)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              تصفح المصحف الشريف بالرسم العثماني، الاستماع لتلاوات كبار القراء، وقراءة التفسير المعتمد.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-teal-700 font-semibold">
            <span>اختيار ومتابعة</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition" />
          </div>
        </div>

        <div
          onClick={() => onSelectRole('scholar')}
          className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group relative overflow-hidden ${
            selectedRole === 'scholar'
              ? 'bg-sky-50/70 border-sky-600 shadow-md ring-1 ring-sky-600'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}
        >
          <span className="absolute top-2 left-2 text-[9px] bg-sky-700 text-white px-2 py-0.5 rounded-full font-bold">
            الأكثر طلباً
          </span>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-800 transition">باحث ومحقق أكاديمي</h3>
              <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-semibold">
                المحقق (Pro Scholar)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              وصول للوكيل الذكي (Google Gemini 2.5)، مختبر التناظر، حساب الجُمّل، أسانيد الحديث، وتصدير الأبحاث.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-sky-700 font-semibold">
            <span>اختيار ومتابعة</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition" />
          </div>
        </div>

        <div
          onClick={() => onSelectRole('patron')}
          className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group ${
            selectedRole === 'patron'
              ? 'bg-amber-50/70 border-amber-600 shadow-md ring-1 ring-amber-600'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition">مؤسسة وقفية / راعٍ</h3>
              <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                الوقف الرقمي (Patron)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              دعم مشاريع القرآن الرقمية، بنية تحتية خاصة، وأولوية معالجة قصوى لكافة المشاريع والطلبة.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-amber-700 font-semibold">
            <span>اختيار ومتابعة</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition" />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="text-slate-500">لست متأكداً وتريد الاستكشاف أولاً؟</span>
        <button
          type="button"
          onClick={onSkip}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>تخطي والاستكشاف كزائر (تحديد الحساب عند اختيار الخطة لاحقاً)</span>
          <ChevronRight className="w-4 h-4 rotate-180" />
        </button>
      </div>
    </div>
  )
}
