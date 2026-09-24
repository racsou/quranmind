'use client'

import React, { useState } from 'react'
import {
  User,
  Shield,
  CreditCard,
  BrainCircuit,
  Sliders,
  Check,
  CheckCircle2,
  KeyRound,
  Lock,
  Smartphone,
  ExternalLink,
  Download,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  BookOpen,
  Laptop,
  LogOut,
  Save,
  Eye,
  EyeOff,
  DollarSign,
  Receipt,
} from 'lucide-react'

export function UserSettingsView() {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'security' | 'billing' | 'ai' | 'preferences'>('profile')
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Profile Form State
  const [name, setName] = useState('د. رضوان أحمد')
  const [email, setEmail] = useState('researcher@quranmind.org')
  const [institution, setInstitution] = useState('جامعة الجزائر - كلية أصول الدين والدراسات الإسلامية')
  const [specialization, setSpecialization] = useState('الإعجاز العددي والتناظر البنائي واللغوي في القرآن')
  const [bio, setBio] = useState('باحث في علوم القرآن ومقارنة المتون والمخطوطات المبكرة، مهتم بتوظيف الذكاء الاصطناعي في خدمة النص القرآني.')

  // Password / Security State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)

  // AI Setup State
  const [selectedModel, setSelectedModel] = useState<'gpt-4o' | 'claude-3-5' | 'deepseek-r1' | 'llama-3'>('gpt-4o')
  const [customApiKey, setCustomApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [temperature, setTemperature] = useState(0.2)
  const [scholarlyMode, setScholarlyMode] = useState('scientific-symmetry')

  // Preferences State
  const [quranScript, setQuranScript] = useState('uthmani-hafs')
  const [defaultTafsir, setDefaultTafsir] = useState('ibn-kathir')
  const [themeMode, setThemeMode] = useState('dark-cyan')
  const [autoPlayAudio, setAutoPlayAudio] = useState(true)
  const [emailDigest, setEmailDigest] = useState(true)

  // Trigger Save Feedback
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">
      {/* Top Settings Header */}
      <div className="p-5 bg-[#03172b] border border-cyan-900/50 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-700 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#031527] rounded-2xl flex items-center justify-center text-xl font-bold text-cyan-300">
              ر.أ
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">{name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-cyan-950 border border-cyan-700 text-cyan-300 font-semibold">
                باحث أكاديمي موثق (Scholar)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{email} · {institution}</p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/80 border border-emerald-700/80 rounded-lg text-emerald-300 text-xs animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>تم حفظ التغييرات بنجاح</span>
          </div>
        )}
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none text-xs">
        {[
          { id: 'profile', label: 'الملف الشخصي والباحث', icon: User },
          { id: 'security', label: 'الأمان وكلمة المرور', icon: Shield },
          { id: 'billing', label: 'الاشتراك والفواتير', icon: CreditCard },
          { id: 'ai', label: 'محركات الذكاء الاصطناعي', icon: BrainCircuit },
          { id: 'preferences', label: 'تفضيلات المصحف والبحث', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeSubTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'bg-[#031527] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* ======================================================== */}
      {/* 1. PROFILE & ACADEMIC INFO TAB                           */}
      {/* ======================================================== */}
      {activeSubTab === 'profile' && (
        <form onSubmit={handleSave} className="p-6 bg-[#03172b] border border-cyan-900/40 rounded-2xl space-y-5 shadow-lg">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" /> المعلومات الأكاديمية والبيانات العامة
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              تُستخدم هذه المعلومات في توثيق الفرضيات وتصدير الدراسات بصفتك باحثاً معتمداً.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">الاسم الكامل واللقب العلمي</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#051c33] border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">البريد الإلكتروني للبحث</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#051c33] border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">المؤسسة / الجامعة / المركز البحثي</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full bg-[#051c33] border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">التخصص ومجال الاهتمام الرئيسي</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full bg-[#051c33] border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">النبذة العلمية (Bio)</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#051c33] border border-slate-700 rounded-lg p-3 text-xs text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold shadow-md shadow-cyan-600/30 flex items-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              <span>حفظ البيانات الأكاديمية</span>
            </button>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* 2. SECURITY & PASSWORD TAB                               */}
      {/* ======================================================== */}
      {activeSubTab === 'security' && (
        <div className="space-y-5">
          {/* Password Reset Form */}
          <form onSubmit={handleSave} className="p-6 bg-[#03172b] border border-cyan-900/40 rounded-2xl space-y-4 shadow-lg">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" /> تغيير كلمة المرور
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                تأكد من اختيار كلمة مرور قوية تحتوي على حروف وأرقام ورموز.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">كلمة المرور الحالية</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#051c33] border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-2.5 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">كلمة المرور الجديدة</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#051c33] border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">تأكيد كلمة المرور الجديدة</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#051c33] border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={!currentPassword || !newPassword}
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition flex items-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>تحديث كلمة المرور</span>
              </button>
            </div>
          </form>

          {/* 2FA & Active Sessions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 2FA Card */}
            <div className="p-5 bg-[#03172b] border border-cyan-900/40 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">المصادقة الثنائية (2FA)</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                  مفعلة
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                حماية حسابك عبر تطبيق المصادقة (Google Authenticator أو 1Password) عند تسجيل الدخول من جهاز جديد.
              </p>
              <button
                type="button"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className="text-xs text-cyan-400 hover:underline font-semibold"
              >
                إعادة ضبط مفتاح المصادقة الثنائية
              </button>
            </div>

            {/* Active Sessions */}
            <div className="p-5 bg-[#03172b] border border-cyan-900/40 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">الجلسات النشطة</span>
                </div>
                <span className="text-[11px] text-slate-400">جهازان متصلان</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between items-center text-slate-300 p-2 bg-[#020b18] rounded-lg">
                  <span>Linux (Chrome) · Algiers</span>
                  <span className="text-emerald-400 font-semibold">الجلسة الحالية</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 p-2 bg-[#020b18] rounded-lg">
                  <span>iOS Safari · Mobile App</span>
                  <span>منذ 3 ساعات</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. BILLING & SUBSCRIPTIONS (SlickPay & Stripe)           */}
      {/* ======================================================== */}
      {activeSubTab === 'billing' && (
        <div className="space-y-5">
          {/* Current Active Plan Card */}
          <div className="p-6 bg-gradient-to-r from-[#04203a] to-[#031527] border border-cyan-600/40 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">الخطة النشطة الحالية</span>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>اشتراك الباحث الأكاديمي (Pro Scholar)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950 border border-emerald-700 text-emerald-300">
                  نشط ومجدد تلقائياً
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                رسوم الاشتراك: <strong className="text-cyan-300">2,500 د.ج / شهرياً</strong> عبر بوابة SATIM / SlickPay (أو $19/mo عبر Stripe).
              </p>
              <p className="text-[11px] text-slate-400">تاريخ التجديد القادم: 24 أكتوبر 2026</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold shadow-md shadow-cyan-600/30 transition"
              >
                ترقية إلى الوقف الرقمي (Patron)
              </button>
              <button
                type="button"
                className="px-3 py-2 bg-[#062444] hover:bg-[#09355f] border border-cyan-800/60 text-slate-300 rounded-lg text-xs transition"
              >
                إدارة وسيلة الدفع
              </button>
            </div>
          </div>

          {/* Payment Gateways Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SlickPay Card */}
            <div className="p-5 bg-[#03172b] border border-cyan-900/40 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  بوابة SlickPay (الدفع المحلي SATIM)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  البطاقة الذهبية / CIB
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                البطاقة الافتراضية المعتمدة: <strong className="text-slate-200">الذهبية **** 4912</strong>
              </p>
              <div className="pt-2 text-[10px] text-slate-500 flex justify-between">
                <span>العمولة: 0 د.ج (المشروع يتكفل بالرسوم)</span>
                <span className="text-cyan-400 font-semibold">متصل مع SATIM EPG</span>
              </div>
            </div>

            {/* Stripe Card */}
            <div className="p-5 bg-[#03172b] border border-cyan-900/40 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-blue-400" />
                  بوابة Stripe (الدفع الدولي والوقف)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  Visa / Mastercard
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                متاحة للدفع بالدولار (USD) وللمساهمة في الوقف الرقمي العالمي.
              </p>
              <div className="pt-2 text-[10px] text-slate-500 flex justify-between">
                <span>تشفير 256-bit SSL</span>
                <span className="text-blue-400 font-semibold">Stripe Checkout Ready</span>
              </div>
            </div>
          </div>

          {/* Invoices History Table */}
          <div className="p-5 bg-[#03172b] border border-cyan-900/40 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-cyan-400" /> سجل فواتير الاشتراك والعمليات
            </h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="py-2 px-3">رقم الفاتورة</th>
                    <th className="py-2 px-3">التاريخ</th>
                    <th className="py-2 px-3">الخطة</th>
                    <th className="py-2 px-3">المبلغ</th>
                    <th className="py-2 px-3">بوابة الدفع</th>
                    <th className="py-2 px-3">الحالة</th>
                    <th className="py-2 px-3 text-center">إيصال</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  <tr>
                    <td className="py-2.5 px-3 font-mono text-cyan-300">PAY-0734462</td>
                    <td className="py-2.5 px-3 text-slate-400">2026-09-21</td>
                    <td className="py-2.5 px-3 font-semibold">اشتراك الباحث الأكاديمي</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-300">2,500 DZD</td>
                    <td className="py-2.5 px-3">SlickPay (SATIM)</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 font-bold">
                        مكتمل ✓
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button className="text-cyan-400 hover:text-cyan-200" title="تحميل الإيصال PDF">
                        <Download className="w-3.5 h-3.5 mx-auto" />
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-mono text-cyan-300">PAY-0591204</td>
                    <td className="py-2.5 px-3 text-slate-400">2026-08-21</td>
                    <td className="py-2.5 px-3 font-semibold">اشتراك الباحث الأكاديمي</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-300">2,500 DZD</td>
                    <td className="py-2.5 px-3">SlickPay (SATIM)</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 font-bold">
                        مكتمل ✓
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button className="text-cyan-400 hover:text-cyan-200" title="تحميل الإيصال PDF">
                        <Download className="w-3.5 h-3.5 mx-auto" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. AI MODEL & INFERENCE SETUP TAB                        */}
      {/* ======================================================== */}
      {activeSubTab === 'ai' && (
        <form onSubmit={handleSave} className="p-6 bg-[#03172b] border border-cyan-900/40 rounded-2xl space-y-5 shadow-lg">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-cyan-400" /> إعداد محركات الذكاء الاصطناعي (AI Inference Setup)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              اختر النموذج الأساسي لمعالجة الأسئلة البحثية وتوليد المخططات والدلائل في الوكيل الذكي ومساحة العمل.
            </p>
          </div>

          {/* Model Selection Grid */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">نموذج الاستدلال الافتراضي</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {[
                { id: 'gpt-4o', title: 'OpenAI GPT-4o', badge: 'متوازن وشامل', desc: 'الأفضل في استيعاب التناظر والبناء الهيكلي للآيات' },
                { id: 'claude-3-5', title: 'Claude 3.5 Sonnet', badge: 'دقة لغوية فائقة', desc: 'المثالي في الصياغة اللغوية والتفسير المقارن' },
                { id: 'deepseek-r1', title: 'DeepSeek R1', badge: 'منطق واستدلال', desc: 'متفوق في فحص أسانيد الحديث وعلم المصطلح' },
                { id: 'llama-3', title: 'Llama-3 (محلي)', badge: 'خصوصية كاملة', desc: 'يعمل محلياً بدون إرسال استعلامات لخوادم سحابية' },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedModel(m.id as any)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition space-y-1.5 ${
                    selectedModel === m.id
                      ? 'bg-cyan-950/80 border-cyan-400 shadow-md shadow-cyan-950/50'
                      : 'bg-[#020e1d] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{m.title}</span>
                    {selectedModel === m.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  <span className="inline-block text-[9px] px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 font-semibold">
                    {m.badge}
                  </span>
                  <p className="text-[10px] text-slate-400 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Custom API Key (BYOK) */}
          <div className="p-4 bg-[#020e1d] border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">مفتاح الـ API الخاص (Bring Your Own Key)</label>
              <span className="text-[10px] text-slate-400">اختياري للمستخدمين المتقدمين</span>
            </div>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full bg-[#051c33] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute left-3 top-2.5 text-slate-400 hover:text-white"
              >
                {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              في حال تركه فارغاً، يتم استخدام الحصة السحابية المضمنة في باقتك الأكاديمية تلقائياً.
            </p>
          </div>

          {/* Temperature & Scholarly Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-semibold">درجة الدقة / الإبداع (Temperature)</label>
                <span className="font-mono text-cyan-300">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.7"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0.0 (دقيق قطعي للمتون)</span>
                <span>0.7 (استكشافي للفرضيات)</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-slate-300 font-semibold block">المنهجية التفسيرية المفضلة للوكيل</label>
              <select
                value={scholarlyMode}
                onChange={(e) => setScholarlyMode(e.target.value)}
                className="w-full bg-[#051c33] border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-cyan-400"
              >
                <option value="scientific-symmetry">التركيز على التناظر البنائي والإعجاز العلمي</option>
                <option value="traditional-tafsir">التفسير بالمأثور وتوثيق أقوال السلف</option>
                <option value="linguistic-rhetoric">التحليل اللغوي والبلاغي والنظمي</option>
                <option value="hadith-isnad">تحقيق سلاسل الرواة والمصطلح الحديثي</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold shadow-md shadow-cyan-600/30 flex items-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              <span>حفظ إعدادات الذكاء الاصطناعي</span>
            </button>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* 5. PREFERENCES & RESEARCH SETUP                          */}
      {/* ======================================================== */}
      {activeSubTab === 'preferences' && (
        <form onSubmit={handleSave} className="p-6 bg-[#03172b] border border-cyan-900/40 rounded-2xl space-y-5 shadow-lg">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" /> تفضيلات المصحف والواجهة البحثية
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              خصص خط المصحف، مراجع التفسير، والمظهر العام لمنصة QuranMind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">خط الرسم القرآني المعتمد</label>
              <select
                value={quranScript}
                onChange={(e) => setQuranScript(e.target.value)}
                className="w-full bg-[#051c33] border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-cyan-400"
              >
                <option value="uthmani-hafs">الرسم العثماني (مصحف المدينة النبوية - رواية حفص)</option>
                <option value="warsh">رواية ورش عن نافع (رسم مغربي)</option>
                <option value="indopak">الرسم الهندي / الباكستاني الميسر</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">كتاب التفسير الافتراضي للبحث</label>
              <select
                value={defaultTafsir}
                onChange={(e) => setDefaultTafsir(e.target.value)}
                className="w-full bg-[#051c33] border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-cyan-400"
              >
                <option value="ibn-kathir">تفسير القرآن العظيم (ابن كثير)</option>
                <option value="tabari">جامع البيان عن تأويل آي القرآن (الطبري)</option>
                <option value="qurtubi">الجامع لأحكام القرآن (القرطبي)</option>
                <option value="sadi">تيسير الكريم الرحمن (السعدي)</option>
                <option value="ashur">التحرير والتنوير (ابن عاشور)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">المظهر البصري للمنصة</label>
              <select
                value={themeMode}
                onChange={(e) => setThemeMode(e.target.value)}
                className="w-full bg-[#051c33] border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-cyan-400"
              >
                <option value="dark-cyan">الوضع الليلي السيبراني (Dark Cyan - افتراضي)</option>
                <option value="oled-black">أسود دامس (OLED Black للشاشات الحديثة)</option>
                <option value="sepia-parchment">وضع المخطوطات القديمة (Sepia Manuscript)</option>
              </select>
            </div>

            <div className="flex flex-col justify-center space-y-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPlayAudio}
                  onChange={(e) => setAutoPlayAudio(e.target.checked)}
                  className="rounded accent-cyan-500 w-4 h-4"
                />
                <span className="text-slate-300">تشغيل التلاوة الصوتية تلقائياً عند تحديد الآية</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailDigest}
                  onChange={(e) => setEmailDigest(e.target.checked)}
                  className="rounded accent-cyan-500 w-4 h-4"
                />
                <span className="text-slate-300">استلام ملخص أسبوعي بالدراسات القرآنية الجديدة</span>
              </label>
            </div>
          </div>

          {/* Data Export Box */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-white">تصدير أبحاثك وملاحظاتك الشخصية</h4>
              <p className="text-[11px] text-slate-400">تنزيل نسخة احتياطية لكافة الملاحظات والمشاريع بصيغة JSON أو Markdown.</p>
            </div>
            <button
              type="button"
              className="px-3.5 py-1.5 bg-[#062444] hover:bg-[#09355f] border border-cyan-800/60 text-cyan-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير البيانات</span>
            </button>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold shadow-md shadow-cyan-600/30 flex items-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              <span>حفظ التفضيلات</span>
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
