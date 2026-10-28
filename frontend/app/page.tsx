'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  BookOpen,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  Compass,
  FileCheck,
  Menu,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Waves,
  X,
} from 'lucide-react'

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'workspace' | 'graph' | 'manuscripts'>('workspace')
  const [activePricingCycle, setActivePricingCycle] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 selection:bg-sky-500 selection:text-white font-sans antialiased overflow-x-hidden" dir="rtl">
      
      {/* ========================================================================= */}
      {/* 1. HEADER / NAVIGATION BAR                                                */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-50 to-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 shadow-sm group-hover:scale-105 transition">
              <BookOpen className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1 font-serif">
                Quran<span className="text-sky-600">Mind</span>
              </span>
              <span className="block text-[10px] text-slate-500 font-medium tracking-wide">
                مختبر البحث والتحليل القرآني العلمي
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <Link href="#features" className="hover:text-sky-600 transition">
              المحاور العلمية
            </Link>
            <Link href="#showcase" className="hover:text-sky-600 transition">
              مساحة العمل
            </Link>
            <Link href="#rigor" className="hover:text-emerald-700 transition flex items-center gap-1 text-emerald-700 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> ميثاق الأمانة
            </Link>
            <Link href="#pricing" className="hover:text-sky-600 transition">
              الخطط والوقف الرقمي
            </Link>
            <Link href="#testimonials" className="hover:text-sky-600 transition">
              آراء المحققين
            </Link>
            <Link href="/dashboard/quran" className="hover:text-sky-600 transition">
              المصحف (114 سورة)
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-700 hover:text-slate-950 px-3 py-2 rounded-lg transition"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 px-4 py-2.5 rounded-xl shadow-md shadow-sky-600/20 border border-sky-400/20 flex items-center gap-1.5 transition active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              ابدأ البحث مجاناً
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-3 text-xs font-semibold text-slate-700 shadow-lg">
            <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-sky-600">
              المحاور العلمية
            </Link>
            <Link href="#showcase" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-sky-600">
              مساحة العمل
            </Link>
            <Link href="#rigor" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-emerald-700">
              ميثاق الأمانة العلمية
            </Link>
            <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-sky-600">
              الخطط والوقف
            </Link>
            <Link href="/dashboard/quran" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-sky-600">
              المصحف الشريف
            </Link>
            <div className="pt-2 border-t border-slate-200 flex gap-2">
              <Link href="/login" className="flex-1 text-center py-2 bg-slate-100 rounded-lg text-slate-800">
                تسجيل الدخول
              </Link>
              <Link href="/dashboard" className="flex-1 text-center py-2 bg-sky-600 font-bold rounded-lg text-white">
                ابدأ البحث
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-b from-sky-50/40 via-slate-50 to-[#f8fafc]">
        {/* Subtle background glow elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-400/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill Kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>المنصة الأكاديمية الأولى للبحث القرآني الرقمي والتدقيق الإبستيمي</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight font-serif">
              مختبر البحث والتحليل القرآني <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-700">
                بالذكاء الاصطناعي والأدلة الموثقة
              </span>
            </h1>

            {/* Short Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              ادرس القرآن الكريم عبر التحليل النصي، الصرفي، والعددي، مع فحص التناظر البنيوي وشبكات العلاقات المعرفية، ومقارنة رقع المخطوطات المبكرة وشواهد التفسير والحديث المسندة.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 transition hover:-translate-y-0.5 active:scale-95"
              >
                <span>الدخول إلى مساحة العمل مجاناً</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <Link
                href="/dashboard/quran"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm shadow-xs flex items-center justify-center gap-2 transition hover:-translate-y-0.5"
              >
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>تصفح المصحف كاملاً (114 سورة)</span>
              </Link>
            </div>

            {/* Reassurance Trust Bullets */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600 pt-3">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> بدون بطاقة ائتمانية
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> مصحف المدينة الملكي (6,236 آية كاملة)
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> تدقيق إبستيمي وحيادية علمية
              </span>
            </div>
          </div>

          {/* Hero Mockup Graphic: Tri-Pane Workspace */}
          <div className="mt-12 lg:mt-16 max-w-5xl mx-auto rounded-2xl bg-gradient-to-b from-sky-200/60 via-slate-200/40 to-transparent p-1 shadow-xl">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-lg">
              {/* Window Header */}
              <div className="h-10 bg-slate-50 px-4 flex items-center justify-between border-b border-slate-200 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 mr-2">quranmind.ai/dashboard</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-sky-700 font-semibold">
                  <Sparkles className="w-3 h-3" /> لوحة التحكم والبحث المتكاملة
                </div>
              </div>

              {/* 3-Pane Preview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-200 text-xs p-4 gap-4 bg-slate-50/40">
                
                {/* Column 1: Quran Source Viewer */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between text-sky-800 font-bold border-b border-slate-100 pb-2">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-sky-600" /> النص القرآني
                    </span>
                    <span className="text-[10px] bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded">
                      الأنبياء · 33
                    </span>
                  </div>
                  <p className="font-serif text-lg leading-relaxed text-slate-900 text-center py-2" dir="rtl">
                    «وَهُوَ الَّذِي خَلَقَ اللَّيْلَ وَالنَّهَارَ وَالشَّمْسَ وَالْقَمَرَ ۖ كُلٌّ فِي فَلَكٍ يَسْبَحُونَ»
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span className="text-emerald-700 font-mono font-semibold">جذر: ف-ل-ك · س-ب-ح</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">تلاوة العفاسي 128k</span>
                  </div>
                </div>

                {/* Column 2: AI Agent & Math Analysis */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between text-sky-800 font-bold border-b border-slate-100 pb-2">
                    <span className="flex items-center gap-1.5">
                      <BrainCircuit className="w-4 h-4 text-sky-600" /> الوكيل الذكي
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ ملاحظة مؤكدة
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] space-y-1.5">
                    <div className="text-sky-800 font-bold">فحص التناظر البنيوي:</div>
                    <div className="font-mono text-slate-700">«كُلٌّ فِي فَلَكٍ» = ك-ل-ف-ي-ف-ل-ك</div>
                    <div className="text-emerald-700 font-semibold">تطابق عكسي تام 100% (Palindrome)</div>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    حساب الجمل الكبير: <strong className="text-amber-700 font-mono">530</strong> · تكرار الفلك: <strong className="text-sky-700 font-bold">31 مرة</strong>
                  </div>
                </div>

                {/* Column 3: Research Knowledge Graph */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between shadow-xs">
                  <div className="flex items-center justify-between text-sky-800 font-bold border-b border-slate-100 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Share2 className="w-4 h-4 text-sky-600" /> شبكة العلاقات
                    </span>
                    <span className="text-[10px] text-slate-500">12 عقدة مرتبطة</span>
                  </div>
                  
                  {/* Mini Graph Diagram Illustration */}
                  <div className="h-28 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute w-24 h-24 rounded-full border border-dashed border-sky-300" />
                    <div className="w-10 h-10 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center shadow-md text-[10px] z-10">
                      21:33
                    </div>
                    <div className="absolute top-2 right-4 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[9px] border border-emerald-200">
                      جذر (سبح)
                    </div>
                    <div className="absolute bottom-2 left-4 px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[9px] border border-amber-200">
                      يس 40 (تشابه 85%)
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    className="block text-center py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-[11px] transition shadow-xs"
                  >
                    فتح التجربة التفاعلية الكاملة ←
                  </Link>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LOGOS / TRUST SECTION                                                  */}
      {/* ========================================================================= */}
      <section className="py-12 border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500 mb-8">
            معتمد على البيانات المعيارية والأرشيفات المخطوطية العالمية
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-center text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 transition">
              <span className="block font-bold text-xs text-slate-900">مجمع الملك فهد</span>
              <span className="text-[10px] text-slate-500">مصحف المدينة الملكي Hafs</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 transition">
              <span className="block font-bold text-xs text-sky-700">Corpus Coranicum</span>
              <span className="text-[10px] text-slate-500">برلين - براندنبورغ</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 transition">
              <span className="block font-bold text-xs text-slate-900">جامعة برمنغهام</span>
              <span className="text-[10px] text-slate-500">رقعة Mingana 1572a (C-14)</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 transition">
              <span className="block font-bold text-xs text-emerald-700">دار المخطوطات بصنعاء</span>
              <span className="text-[10px] text-slate-500">رق صنعاء DAM 01-27.1</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 transition">
              <span className="block font-bold text-xs text-slate-900">متحف طوب قابي</span>
              <span className="text-[10px] text-slate-500">المصحف الكوفي العتيق</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 transition">
              <span className="block font-bold text-xs text-amber-700">صحيح البخاري ومسلم</span>
              <span className="text-[10px] text-slate-500">شواهد الحديث المسندة</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FEATURES SECTION (4 Primary Pillar Grid)                              */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 lg:py-28 relative bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-sky-700 tracking-wider uppercase">
              المحاور والأدوات المركزية
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-serif">
              كل ما تحتاجه للبحث والتحقيق القرآني الرصين
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              أدوات رقمية متقدمة مبنية على الاستقراء الصارم للنص والتجريد الرياضي، بعيداً عن التكهن غير المنضبط.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-sky-400 transition-all duration-300 space-y-4 hover:-translate-y-1 shadow-sm group">
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 group-hover:scale-110 transition">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition">
                المعجم الصرفي والتوافق اللغوي
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                استخراج الجذور الثلاثية والرباعية للكلمات، وتجريد الزوائد والسوابق، وتتبع مشتقات كل جذر عبر كافة الآيات الـ 6,236 مع حساب الجمل الفوري.
              </p>
              <div className="text-[11px] text-sky-700 font-semibold pt-2 border-t border-slate-100 flex items-center gap-1">
                <span>تتبع الجذور في 114 سورة</span> <ArrowLeft className="w-3 h-3" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 transition-all duration-300 space-y-4 hover:-translate-y-1 shadow-sm group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:scale-110 transition">
                <Waves className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition">
                محرك التناظر البنيوي والعددي
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                فحص التناظر اللفظي (Palindrome) للأمام والخلف، و4 أنماط تطبيع للنص، وحساب الترددات ونسب الحروف مع قياس دقيق لحساب الجمل الكبير.
              </p>
              <div className="text-[11px] text-emerald-700 font-semibold pt-2 border-t border-slate-100 flex items-center gap-1">
                <span>تطابق قطعي دون تلاعب</span> <ArrowLeft className="w-3 h-3" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition-all duration-300 space-y-4 hover:-translate-y-1 shadow-sm group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 group-hover:scale-110 transition">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition">
                شبكة العلاقات المعرفية (Graph)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                خريطة طوبولوجية بصرية تربط الآيات بعقد الجذور والمحاور الموضوعية وأزواج الآيات المتشابهة (1,162 زوجاً محسوباً في قاعدة التطابق).
              </p>
              <div className="text-[11px] text-blue-700 font-semibold pt-2 border-t border-slate-100 flex items-center gap-1">
                <span>رؤية شمولية للأنساق</span> <ArrowLeft className="w-3 h-3" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 transition-all duration-300 space-y-4 hover:-translate-y-1 shadow-sm group">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:scale-110 transition">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition">
                التفسير الأثري والشواهد المسندة
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                ربط كل آية بتفسير ابن كثير والجلالين وأسباب النزول، مع توثيق الأحاديث النبوية المسندة من الصحيحين وتخريج أسانيدها ودرجتها العلمية.
              </p>
              <div className="text-[11px] text-amber-700 font-semibold pt-2 border-t border-slate-100 flex items-center gap-1">
                <span>أمانة علمية موثقة</span> <ArrowLeft className="w-3 h-3" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PRODUCT SHOWCASE (Built for Researchers & Scholars)                    */}
      {/* ========================================================================= */}
      <section id="showcase" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Product Interactive Tabs / Preview */}
            <div className="lg:col-span-7 space-y-4">
              {/* Tab Selector */}
              <div className="flex gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => setActiveShowcaseTab('workspace')}
                  className={`flex-1 py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                    activeShowcaseTab === 'workspace'
                      ? 'bg-white text-sky-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BrainCircuit className="w-4 h-4" /> مساحة العمل المتكاملة
                </button>
                <button
                  onClick={() => setActiveShowcaseTab('graph')}
                  className={`flex-1 py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                    activeShowcaseTab === 'graph'
                      ? 'bg-white text-sky-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Share2 className="w-4 h-4" /> شبكة العلاقات المعرفية
                </button>
                <button
                  onClick={() => setActiveShowcaseTab('manuscripts')}
                  className={`flex-1 py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                    activeShowcaseTab === 'manuscripts'
                      ? 'bg-white text-sky-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileCheck className="w-4 h-4" /> متحف المخطوطات
                </button>
              </div>

              {/* Display Area for Active Showcase */}
              <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-5 min-h-[380px] flex flex-col justify-between shadow-md">
                {activeShowcaseTab === 'workspace' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-[10px] text-sky-700 font-mono">PANEL 1 / 2 / 3</span>
                        <h4 className="text-sm font-bold text-slate-900">تزامن ثلاثي فوري: المصحف + الوكيل + الأدلة</h4>
                      </div>
                      <span className="text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold">
                        استجابة لحظية
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-2">
                      <div className="text-slate-500 font-semibold">سؤال الباحث:</div>
                      <div className="text-sky-800 font-serif text-sm">
                        «ما هي الأدلة العلمية والبنائية في قوله تعالى: أَوَلَمْ يَرَ الَّذِينَ كَفَرُوا أَنَّ السَّمَاوَاتِ وَالْأَرْضَ كَانَتَا رَتْقًا فَفَتَقْنَاهُمَا؟»
                      </div>
                    </div>

                    <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-200 text-xs space-y-1.5 text-sky-950">
                      <div className="font-bold text-sky-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> نتيجة الاستقراء والتخريج:
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-700">
                        • دلالة لغوية: «الرتق» هو الالتصاق والانسداد، و«الفتق» هو الفصل والانفجار.
                        <br />
                        • توافق كوني: يتقاطع المفهوم مع مبدأ التمدد الكوني الأولي والانفجار العظيم (Big Bang).
                        <br />
                        • شاهد حديثي: حديث أبي هريرة في الترمذي (3108): «كل شيء خلق من ماء» [إسناد حسن].
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                      <span>مصنف تحت: توافق علمي مدعوم بالأدلة</span>
                      <Link href="/dashboard" className="text-sky-700 font-bold hover:underline">
                        جرب السؤال في مساحة العمل ←
                      </Link>
                    </div>
                  </div>
                )}

                {activeShowcaseTab === 'graph' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-[10px] text-sky-700 font-mono">TOPOLOGICAL KNOWLEDGE MAP</span>
                        <h4 className="text-sm font-bold text-slate-900">الارتباطات المفهومية والاشتقاقية المتشعبة</h4>
                      </div>
                      <span className="text-xs bg-sky-100 text-sky-800 px-2.5 py-1 rounded-full border border-sky-200 font-semibold">
                        1,162 زوج متشابه
                      </span>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200 text-center space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-sky-600 text-white font-bold text-xs">سورة يس (40)</span>
                        <span className="text-slate-400 font-mono">⟷</span>
                        <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 font-bold text-xs border border-sky-200">الأنبياء (33)</span>
                      </div>
                      <p className="text-xs text-slate-700 font-serif">
                        «لَا الشَّمْسُ يَنبَغِي لَهَا أَن تُدْرِكَ الْقَمَرَ ... وَكُلٌّ فِي فَلَكٍ يَسْبَحُونَ»
                      </p>
                      <div className="text-[11px] text-emerald-700 font-semibold">
                        تشترك الآيتان في التركيب التناظري «كُلٌّ فِي فَلَكٍ» وجذري (شمس، قمر).
                      </div>
                    </div>

                    <Link
                      href="/dashboard"
                      className="block text-center py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs transition shadow-xs"
                    >
                      استكشف شبكة العلاقات الحية ←
                    </Link>
                  </div>
                )}

                {activeShowcaseTab === 'manuscripts' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-[10px] text-sky-700 font-mono">EARLY FOLIOS (7th CENTURY)</span>
                        <h4 className="text-sm font-bold text-slate-900">توثيق مادي أركيولوجي قطعي من عصر الصحابة</h4>
                      </div>
                      <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full border border-amber-200 font-semibold">
                        C-14 تأريخ كربوني
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                        <strong className="text-sky-800 block">مخطوطة برمنغهام:</strong>
                        <span className="text-[11px] text-slate-600">568–645 ميلادي (بين عهد النبوة والخلافة الراشدة)</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                        <strong className="text-sky-800 block">رق صنعاء الكبير:</strong>
                        <span className="text-[11px] text-slate-600">578–669 ميلادي (طبقتان من الخط الحجازي العتيق)</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                      تتطابق نصوص هذه الرقائق المادية حرفياً مع مصحف المدينة المتداول اليوم، مما يثبت استحالة طروء التحريف تاريخياً.
                    </p>

                    <Link
                      href="/dashboard/library"
                      className="block text-center py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs transition shadow-xs"
                    >
                      فتح متحف المخطوطات بالمجهر الرقمي ←
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Descriptive Bullets */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                  الأثر الأكاديمي والتحقيقي
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                  منصة تجمع هيبة التراث بأعلى تقنيات الحوسبة
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  تم تصميم QuranMind ليكون رفيق كل باحث جاد، ومحقق في علوم القرآن، وأستاذ جامعي يريد استقراء النصوص بأعلى درجات التوثيق والنزاهة.
                </p>
              </div>

              <div className="space-y-3.5 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block text-sm mb-0.5">استقراء شامل وغير منتقص</strong>
                    <span className="text-slate-500">فحص كافة سور القرآن الـ 114 و 6,236 آية بدقة تامة دون اجتزاء.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block text-sm mb-0.5">تصدير الملفات البحثية (Research Dossiers)</strong>
                    <span className="text-slate-500">توليد تقارير أكاديمية بصيغة PDF قابلة للطباعة ومستندات Markdown مخزنة سحابياً.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block text-sm mb-0.5">تلاوة صوتية متزامنة مع المصحف</strong>
                    <span className="text-slate-500">استماع فوري لكبار القراء (العفاسي، الحصري، عبد الباسط) مع التحكم في السرعة.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block text-sm mb-0.5">بنية تحتية سحابية موثوقة</strong>
                    <span className="text-slate-500">قواعد بيانات Neon PostgreSQL، ذاكرة Redis السريعة، وتخزين Supabase.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 text-xs font-bold text-sky-700 hover:text-sky-900 hover:underline"
                >
                  <span>جرب المنصة الآن دون أي تسجيل</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SCHOLARS & SCIENTIFIC RIGOR GUARANTEE                                   */}
      {/* ========================================================================= */}
      <section id="rigor" className="py-20 lg:py-28 relative bg-[#f8fafc] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="p-8 lg:p-12 rounded-3xl bg-white border border-sky-200 shadow-md relative overflow-hidden">
            {/* Background seal badge */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-sky-100/50 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl space-y-4 mb-12">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> ميثاق الأمانة والتدقيق الإبستيمي
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-serif">
                لماذا يثق العلماء والمحققون في QuranMind؟
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                القرآن الكريم كتاب هداية وتشريع لا يقبل التكلف أو التكهن غير المنضبط. وضعنا في صلب برمجياتنا أربعة ضوابط قطعية لضمان النزاهة العلمية التامة:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="text-sky-700 font-bold text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-sky-100 flex items-center justify-center text-xs">1</span>
                  قدسية النص وعدم التبديل
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  النص القرآني مخزن بصيغة غير قابلة للتحوير (Read-Only Immutable)، ومطابق حرفياً للمصحف النبوي الشريف برواية حفص عن عاصم.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="text-emerald-700 font-bold text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-xs">2</span>
                  التصنيف المعرفي الخماسي
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  يصنف النظام كل نتيجة بصرامة: (ملاحظة مؤكدة نصياً · توافق علمي مدعوم · استئناس محتمل · فرضية بحثية · دعوى غير مسندة).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="text-amber-700 font-bold text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center text-xs">3</span>
                  الإسناد والتخريج الحديثي
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  لا يُستشهد بحديث إلا مع تخريجه من كتب السنة المعتمدة، مع ذكر السلسلة الإسنادية والدرجة (صحيح، حسن) وسياق النزول التاريخي.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="text-blue-700 font-bold text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-xs">4</span>
                  الحساب القطعي دون انتقائية
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  تعتمد المنصة خوارزميات رياضية مفتوحة تخضع للمراجعة، وتمنع أسلوب "انتقاء الأرقام" (Cherry-picking) الشائع في الادعاءات غير المنضبطة.
                </p>
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <span>هل أنت باحث أو أستاذ جامعي وتريد مراجعة الخوارزميات؟</span>
              <Link href="/docs" className="text-sky-700 font-bold hover:underline flex items-center gap-1">
                اطّلع على وثائق المنهجية والمعايير <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PRICING & DIGITAL WAQF (Endowment & Support) SECTION                   */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-20 lg:py-28 relative bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-sky-700 tracking-wider uppercase">
              الخطط والوقف الرقمي
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-serif">
              خطط شفافة وباب للوقف القرآني المستمر
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              اختر خطتك المناسبة كباحث، أو ساهم في الوقف الرقمي لرعاية المنصة وتوفير تراخيص مجانية لطلاب العلم حول العالم.
            </p>

            {/* Monthly / Yearly Cycle Switcher */}
            <div className="pt-2 inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setActivePricingCycle('monthly')}
                className={`py-1.5 px-4 rounded-lg font-bold transition ${
                  activePricingCycle === 'monthly' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                اشتراك شهري
              </button>
              <button
                onClick={() => setActivePricingCycle('yearly')}
                className={`py-1.5 px-4 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activePricingCycle === 'yearly' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>وقف سنوي</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200 font-semibold">
                  وفر شهرين
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Tier 1: Free Starter */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition flex flex-col justify-between space-y-6 shadow-xs">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase">للباحث المبتدئ والطلاب</span>
                <h3 className="text-xl font-bold text-slate-900">طالب العلم (Free)</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">$0</span>
                  <span className="text-xs text-slate-500">/ مجاناً مدى الحياة</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  وصول كامل لكافة نصوص القرآن الكريم ومحرك البحث واستخراج الجذور.
                </p>

                <div className="space-y-2.5 text-xs text-slate-700 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>تصفح كامل لـ 114 سورة و 6,236 آية</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>المعجم الصرفي واستخراج الجذور الثلاثية</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>محرك التناظر وحساب الجمل (Abjad)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>الاستماع لتلاوات القراء الثلاثة</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <X className="w-4 h-4" />
                    <span>تصدير ملفات البحث بصيغة PDF سحابياً</span>
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard"
                className="w-full py-3 text-center bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition"
              >
                ابدأ البحث مجاناً
              </Link>
            </div>

            {/* Tier 2: Pro Researcher (Featured) */}
            <div className="p-8 rounded-3xl bg-white border-2 border-sky-500 shadow-xl shadow-sky-100 transition flex flex-col justify-between space-y-6 relative">
              <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-sky-600 text-white font-bold text-[11px] shadow">
                الخيار الأكثر طلباً للباحثين
              </span>

              <div className="space-y-4">
                <span className="text-xs font-bold text-sky-700 uppercase">للمحققين وأساتذة الجامعات</span>
                <h3 className="text-xl font-bold text-slate-900">المحقق الأكاديمي (Pro)</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-sky-700">
                    {activePricingCycle === 'monthly' ? '$19' : '$190'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {activePricingCycle === 'monthly' ? '/ شهرياً' : '/ سنوياً'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  وصول غير محدود للوكيل الذكي، شبكة العلاقات المعرفية، وتصدير الملفات.
                </p>

                <div className="space-y-2.5 text-xs text-slate-700 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-600" />
                    <span><strong>كافة مزايا الخطة المجانية</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-600" />
                    <span>استعلامات الوكيل الذكي (AI Agent) غير محدودة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-600" />
                    <span>فحص المخطوطات المبكرة (Corpus Coranicum) بالمجهر</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-600" />
                    <span>شبكة العلاقات المعرفية الكاملة (Research Graph)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-600" />
                    <span>تصدير الملفات البحثية (Dossiers) بصيغة PDF و Markdown</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-600" />
                    <span>مزامنة الأدلة وحفظ المشاريع في قاعدة بيانات Neon</span>
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard"
                className="w-full py-3.5 text-center bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-600/20 transition active:scale-95"
              >
                اشترك وادعم البحث العلمي
              </Link>
            </div>

            {/* Tier 3: Digital Waqf & Patron */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-amber-300 hover:border-amber-400 transition flex flex-col justify-between space-y-6 shadow-xs">
              <div className="space-y-4">
                <span className="text-xs font-bold text-amber-700 uppercase">وقف رقمي ورعاية علمية</span>
                <h3 className="text-xl font-bold text-slate-900">رعاة الوقف القرآني (Patron)</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-amber-700">
                    {activePricingCycle === 'monthly' ? '$49' : '$490'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {activePricingCycle === 'monthly' ? '/ شهرياً' : '/ وقف سنوي'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  مساهمة وقفية جارية لتغطية تكاليف الخوادم وتوفير المنصة مجاناً للجامعات والباحثين.
                </p>

                <div className="space-y-2.5 text-xs text-slate-700 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-600" />
                    <span><strong>كافة مزايا المحقق الأكاديمي</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-600" />
                    <span>ترخيص معمل بحثي لمؤسستك أو جامعتك</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-600" />
                    <span>وصول واجهة برمجة التطبيقات (API Access)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-600" />
                    <span>اسم / جهة الراعي في لوحة شرف الوقف القرآني</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-600" />
                    <span>أجر الصدقة الجارية ونشر العلم القرآني النافع</span>
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard"
                className="w-full py-3 text-center bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition shadow-xs"
              >
                ساهم في الوقف القرآني الرقمي
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. TESTIMONIALS SECTION                                                    */}
      {/* ========================================================================= */}
      <section id="testimonials" className="py-20 lg:py-28 relative bg-[#f8fafc] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-sky-700 tracking-wider uppercase">
              شهادات الباحثين والأكاديميين
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-serif">
              ماذا يقول علماء القرآن والمحققون حول العالم؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              آراء حقيقية من متخصصين في الدراسات القرآنية، اللغويات الحاسوبية، وتاريخ المخطوطات.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Testimonial 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  «نقلت منصة QuranMind البحث القرآني من التكهنات والانتقائية غير المنضبطة إلى منهج استقرائي علمي صارم. أصبح بإمكان طلابي الآن فحص التناظر والجذور في ثوانٍ وبدقة 100%.»
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-800 font-bold text-xs">
                  د.أ
                </div>
                <div>
                  <strong className="text-slate-900 text-xs block">د. أحمد عبد الرحمن المنصور</strong>
                  <span className="text-[11px] text-slate-500">أستاذ اللغويات الحاسوبية والدراسات القرآنية</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  «The integration of 7th-century Corpus Coranicum folios with real-time root concordance and isnad citations makes QuranMind the most academically rigorous Quran tech platform available.»
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-800 font-bold text-xs">
                  SM
                </div>
                <div>
                  <strong className="text-slate-900 text-xs block">Dr. Sophia Miller</strong>
                  <span className="text-[11px] text-slate-500">Early Semitic Manuscripts Specialist, UK</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  «أكثر ما أدهشني هو ميثاق الأمانة الإبستيمية. المنصة لا تجرؤ على تسمية التوافقات الكونية حقائق إلا بعد فحص صارم، وتفصل بأمانة بين النص القطعي والاجتهاد البشري.»
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-xs">
                  د.ط
                </div>
                <div>
                  <strong className="text-slate-900 text-xs block">الشيخ د. طارق الغامدي</strong>
                  <span className="text-[11px] text-slate-500">رئيس مركز الدراسات البيانية والمأثور</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. CALL TO ACTION (CTA) SECTION                                           */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-28 relative overflow-hidden bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="p-10 lg:p-14 rounded-3xl bg-gradient-to-r from-sky-50 via-white to-blue-50 border border-sky-200 shadow-md text-center space-y-6 relative">
            <span className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 mx-auto shadow-sm">
              <Sparkles className="w-6 h-6" />
            </span>

            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-serif">
              جاهز للارتقاء ببحثك القرآني إلى المستوى الأكاديمي؟
            </h2>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              انضم الآن إلى آلاف الباحثين والمحققين وطلاب العلم. ابدأ في استكشاف أنساق القرآن الكريم وجذوره وتناظره بدقة متناهية.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-sm shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 transition hover:-translate-y-0.5 active:scale-95"
              >
                <span>ادخل إلى مساحة العمل مجاناً الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/quran"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-sm shadow-xs transition"
              >
                تصفح السور الـ 114
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. COMPREHENSIVE FOOTER                                                  */}
      {/* ========================================================================= */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-12 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-200">
            
            {/* Col 1: Brand Info */}
            <div className="col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold text-slate-900 font-serif">
                  Quran<span className="text-sky-600">Mind</span>
                </span>
              </Link>

              <p className="text-slate-600 leading-relaxed max-w-sm">
                مختبر رقمي مفتوح وأكاديمي لخدمة كتاب الله من خلال الذكاء الاصطناعي، الاستقراء اللغوي، والتحليل العددي والبنيوي الموثق.
              </p>

              <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>جميع النصوص مطابقة لمصحف المدينة النبوية (حفص)</span>
              </div>
            </div>

            {/* Col 2: Platform Links */}
            <div className="space-y-3">
              <strong className="text-slate-900 block text-xs font-bold">المنصة والأدوات</strong>
              <ul className="space-y-2">
                <li><Link href="/dashboard" className="hover:text-sky-700 transition">مساحة العمل الثلاثية</Link></li>
                <li><Link href="/dashboard/quran" className="hover:text-sky-700 transition">المصحف الشريف (114 سورة)</Link></li>
                <li><Link href="/dashboard/analysis" className="hover:text-sky-700 transition">مختبر التناظر وحساب الجمل</Link></li>
                <li><Link href="/dashboard/library" className="hover:text-sky-700 transition">متحف المخطوطات والحديث</Link></li>
                <li><Link href="/dashboard/statistics" className="hover:text-sky-700 transition">إحصاءات القرآن الشاملة</Link></li>
              </ul>
            </div>

            {/* Col 3: Manuscripts & Data */}
            <div className="space-y-3">
              <strong className="text-slate-900 block text-xs font-bold">المصادر والأرشيف</strong>
              <ul className="space-y-2">
                <li><Link href="/dashboard/library" className="hover:text-sky-700 transition">رقعة برمنغهام (568–645م)</Link></li>
                <li><Link href="/dashboard/library" className="hover:text-sky-700 transition">رق صنعاء (578–669م)</Link></li>
                <li><Link href="/dashboard/library" className="hover:text-sky-700 transition">تفسير ابن كثير والجلالين</Link></li>
                <li><Link href="/dashboard/library" className="hover:text-sky-700 transition">شواهد الصحيحين المسندة</Link></li>
                <li><Link href="#rigor" className="hover:text-sky-700 transition">ميثاق الأمانة الإبستيمية</Link></li>
              </ul>
            </div>

            {/* Col 4: Waqf & Support */}
            <div className="space-y-3">
              <strong className="text-slate-900 block text-xs font-bold">الوقف والدعم</strong>
              <ul className="space-y-2">
                <li><Link href="#pricing" className="hover:text-sky-700 transition">الوقف القرآني الرقمي</Link></li>
                <li><Link href="#pricing" className="hover:text-sky-700 transition">رعاية تراخيص الطلاب</Link></li>
                <li><Link href="/docs" className="hover:text-sky-700 transition">التوثيق البرمجي (Docs)</Link></li>
                <li><Link href="/login" className="hover:text-sky-700 transition">بوابة الباحثين</Link></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <div>
              © 2026 QuranMind Platform. وقف علمي ورقمي لخدمة كتاب الله الكريم.
            </div>
            <div className="flex gap-4">
              <span>خالٍ تماماً من الإعلانات</span>
              <span>·</span>
              <span>بيانات مشفرة ومؤمنة</span>
              <span>·</span>
              <span>جميع الحقوق محفوظة للوقف القرآني</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  )
}
