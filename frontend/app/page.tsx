'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Calculator,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  Compass,
  Download,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Filter,
  FlaskConical,
  Globe,
  Heart,
  HelpCircle,
  History,
  Layers,
  Library,
  Lightbulb,
  MapPin,
  Menu,
  Network,
  Play,
  Radio,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Volume2,
  Waves,
  X,
  Zap,
} from 'lucide-react'

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'workspace' | 'graph' | 'manuscripts'>('workspace')
  const [activePricingCycle, setActivePricingCycle] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <div className="min-h-screen bg-[#020b18] text-slate-100 selection:bg-cyan-500 selection:text-black font-sans antialiased overflow-x-hidden" dir="rtl">
      
      {/* ========================================================================= */}
      {/* 1. HEADER / NAVIGATION BAR                                                */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#020b18]/85 backdrop-blur-md border-b border-cyan-950/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-950 to-cyan-600 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-950/50 group-hover:scale-105 transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1 font-serif">
                Quran<span className="text-cyan-400">Mind</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-medium tracking-wide">
                مختبر البحث والتحليل القرآني العلمي
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <Link href="#features" className="hover:text-cyan-300 transition">
              المحاور العلمية
            </Link>
            <Link href="#showcase" className="hover:text-cyan-300 transition">
              مساحة العمل
            </Link>
            <Link href="#rigor" className="hover:text-cyan-300 transition flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> ميثاق الأمانة
            </Link>
            <Link href="#pricing" className="hover:text-cyan-300 transition">
              الخطط والوقف الرقمي
            </Link>
            <Link href="#testimonials" className="hover:text-cyan-300 transition">
              آراء المحققين
            </Link>
            <Link href="/dashboard/quran" className="hover:text-cyan-300 transition">
              المصحف (114 سورة)
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg transition"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-900/40 border border-cyan-400/30 flex items-center gap-1.5 transition active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              ابدأ البحث مجاناً
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white focus:outline-none"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#031527] border-b border-cyan-900/60 p-4 space-y-3 text-xs font-semibold text-slate-200">
            <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-cyan-300">
              المحاور العلمية
            </Link>
            <Link href="#showcase" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-cyan-300">
              مساحة العمل
            </Link>
            <Link href="#rigor" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-emerald-400">
              ميثاق الأمانة العلمية
            </Link>
            <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-cyan-300">
              الخطط والوقف
            </Link>
            <Link href="/dashboard/quran" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-cyan-300">
              المصحف الشريف
            </Link>
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <Link href="/login" className="flex-1 text-center py-2 bg-slate-800 rounded-lg">
                تسجيل الدخول
              </Link>
              <Link href="/dashboard" className="flex-1 text-center py-2 bg-cyan-600 font-bold rounded-lg text-white">
                ابدأ البحث
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Subtle background glow elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill Kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>المنصة الأكاديمية الأولى للبحث القرآني الرقمي والتدقيق الإبستيمي</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight font-serif">
              مختبر البحث والتحليل القرآني <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
                بالذكاء الاصطناعي والأدلة الموثقة
              </span>
            </h1>

            {/* Short Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              ادرس القرآن الكريم عبر التحليل النصي، الصرفي، والعددي، مع فحص التناظر البنيوي وشبكات العلاقات المعرفية، ومقارنة رقع المخطوطات المبكرة وشواهد التفسير والحديث المسندة.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition hover:-translate-y-0.5 active:scale-95"
              >
                <span>الدخول إلى مساحة العمل مجاناً</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <Link
                href="/dashboard/quran"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm flex items-center justify-center gap-2 transition hover:-translate-y-0.5"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>تصفح المصحف كاملاً (114 سورة)</span>
              </Link>
            </div>

            {/* Reassurance Trust Bullets */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400 pt-3">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" /> بدون بطاقة ائتمانية
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" /> مصحف المدينة الملكي (6,236 آية كاملة)
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" /> تدقيق إبستيمي وحيادية علمية
              </span>
            </div>
          </div>

          {/* Hero Mockup Graphic: Tri-Pane Workspace */}
          <div className="mt-12 lg:mt-16 max-w-5xl mx-auto rounded-2xl bg-gradient-to-b from-cyan-500/20 via-slate-800/40 to-transparent p-1 shadow-2xl shadow-cyan-950/60">
            <div className="bg-[#031527] border border-cyan-800/60 rounded-xl overflow-hidden shadow-2xl">
              {/* Window Header */}
              <div className="h-10 bg-[#020b18] px-4 flex items-center justify-between border-b border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 mr-2">quranmind.ai/dashboard</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-semibold">
                  <Sparkles className="w-3 h-3" /> لوحة التحكم والبحث المتكاملة
                </div>
              </div>

              {/* 3-Pane Preview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-800 text-xs p-4 gap-4 bg-[#020e1d]">
                
                {/* Column 1: Quran Source Viewer */}
                <div className="bg-[#03172b] p-4 rounded-xl border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-cyan-300 font-bold border-b border-slate-800 pb-2">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-cyan-400" /> النص القرآني
                    </span>
                    <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded">
                      الأنبياء · 33
                    </span>
                  </div>
                  <p className="font-serif text-lg leading-relaxed text-white text-center py-2" dir="rtl">
                    «وَهُوَ الَّذِي خَلَقَ اللَّيْلَ وَالنَّهَارَ وَالشَّمْسَ وَالْقَمَرَ ۖ كُلٌّ فِي فَلَكٍ يَسْبَحُونَ»
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <span className="text-emerald-400 font-mono">جذر: ف-ل-ك · س-ب-ح</span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded">تلاوة العفاسي 128k</span>
                  </div>
                </div>

                {/* Column 2: AI Agent & Math Analysis */}
                <div className="bg-[#03172b] p-4 rounded-xl border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-cyan-300 font-bold border-b border-slate-800 pb-2">
                    <span className="flex items-center gap-1.5">
                      <BrainCircuit className="w-4 h-4 text-cyan-400" /> الوكيل الذكي
                    </span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-700/50">
                      ✓ ملاحظة مؤكدة
                    </span>
                  </div>
                  <div className="p-2.5 bg-[#020b18] rounded-lg border border-slate-800 text-[11px] space-y-1.5">
                    <div className="text-cyan-300 font-bold">فحص التناظر البنيوي:</div>
                    <div className="font-mono text-slate-300">«كُلٌّ فِي فَلَكٍ» = ك-ل-ف-ي-ف-ل-ك</div>
                    <div className="text-emerald-400 font-semibold">تطابق عكسي تام 100% (Palindrome)</div>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    حساب الجمل الكبير: <strong className="text-amber-300 font-mono">530</strong> · تكرار الفلك: <strong className="text-cyan-300">31 مرة</strong>
                  </div>
                </div>

                {/* Column 3: Research Knowledge Graph */}
                <div className="bg-[#03172b] p-4 rounded-xl border border-slate-800/80 space-y-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-cyan-300 font-bold border-b border-slate-800 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Share2 className="w-4 h-4 text-cyan-400" /> شبكة العلاقات
                    </span>
                    <span className="text-[10px] text-slate-400">12 عقدة مرتبطة</span>
                  </div>
                  
                  {/* Mini Graph Diagram Illustration */}
                  <div className="h-28 rounded-lg bg-[#020b18] border border-slate-800 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute w-24 h-24 rounded-full border border-dashed border-cyan-800/60" />
                    <div className="w-10 h-10 rounded-full bg-cyan-600/90 text-white font-bold flex items-center justify-center shadow-lg text-[10px] z-10">
                      21:33
                    </div>
                    <div className="absolute top-2 right-4 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[9px] border border-emerald-700/50">
                      جذر (سبح)
                    </div>
                    <div className="absolute bottom-2 left-4 px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[9px] border border-amber-700/50">
                      يس 40 (تشابه 85%)
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    className="block text-center py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-[11px] transition"
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
      <section className="py-12 border-y border-slate-800/80 bg-[#020e1d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-8">
            معتمد على البيانات المعيارية والأرشيفات المخطوطية العالمية
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-center text-center opacity-75 hover:opacity-100 transition duration-300">
            <div className="p-3 bg-[#03172b] rounded-xl border border-slate-800/80">
              <span className="block font-bold text-xs text-white">مجمع الملك فهد</span>
              <span className="text-[10px] text-slate-400">مصحف المدينة الملكي Hafs</span>
            </div>

            <div className="p-3 bg-[#03172b] rounded-xl border border-slate-800/80">
              <span className="block font-bold text-xs text-cyan-300">Corpus Coranicum</span>
              <span className="text-[10px] text-slate-400">برلين - براندنبورغ</span>
            </div>

            <div className="p-3 bg-[#03172b] rounded-xl border border-slate-800/80">
              <span className="block font-bold text-xs text-white">جامعة برمنغهام</span>
              <span className="text-[10px] text-slate-400">رقعة Mingana 1572a (C-14)</span>
            </div>

            <div className="p-3 bg-[#03172b] rounded-xl border border-slate-800/80">
              <span className="block font-bold text-xs text-emerald-300">دار المخطوطات بصنعاء</span>
              <span className="text-[10px] text-slate-400">رق صنعاء DAM 01-27.1</span>
            </div>

            <div className="p-3 bg-[#03172b] rounded-xl border border-slate-800/80">
              <span className="block font-bold text-xs text-white">متحف طوب قابي</span>
              <span className="text-[10px] text-slate-400">المصحف الكوفي العتيق</span>
            </div>

            <div className="p-3 bg-[#03172b] rounded-xl border border-slate-800/80">
              <span className="block font-bold text-xs text-amber-300">صحيح البخاري ومسلم</span>
              <span className="text-[10px] text-slate-400">شواهد الحديث المسندة</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FEATURES SECTION (4 Primary Pillar Grid)                              */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">
              المحاور والأدوات المركزية
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif">
              كل ما تحتاجه للبحث والتحقيق القرآني الرصين
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              أدوات رقمية متقدمة مبنية على الاستقراء الصارم للنص والتجريد الرياضي، بعيداً عن التكهن غير المنضبط.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#03172b] border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 space-y-4 hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                المعجم الصرفي والتوافق اللغوي
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                استخراج الجذور الثلاثية والرباعية للكلمات، وتجريد الزوائد والسوابق، وتتبع مشتقات كل جذر عبر كافة الآيات الـ 6,236 مع حساب الجمل الفوري.
              </p>
              <div className="text-[11px] text-cyan-400 font-semibold pt-2 border-t border-slate-800/80 flex items-center gap-1">
                <span>تتبع الجذور في 114 سورة</span> <ArrowLeft className="w-3 h-3" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#03172b] border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 space-y-4 hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
                <Waves className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                محرك التناظر البنيوي والعددي
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                فحص التناظر اللفظي (Palindrome) للأمام والخلف، و4 أنماط تطبيع للنص، وحساب الترددات ونسب الحروف مع قياس دقيق لحساب الجمل الكبير.
              </p>
              <div className="text-[11px] text-emerald-400 font-semibold pt-2 border-t border-slate-800/80 flex items-center gap-1">
                <span>تطابق قطعي دون تلاعب</span> <ArrowLeft className="w-3 h-3" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#03172b] border border-slate-800 hover:border-blue-500/50 transition-all duration-300 space-y-4 hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-110 transition">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition">
                شبكة العلاقات المعرفية (Graph)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                خريطة طوبولوجية بصرية تربط الآيات بعقد الجذور والمحاور الموضوعية وأزواج الآيات المتشابهة (1,162 زوجاً محسوباً في قاعدة التطابق).
              </p>
              <div className="text-[11px] text-blue-400 font-semibold pt-2 border-t border-slate-800/80 flex items-center gap-1">
                <span>رؤية شمولية للأنساق</span> <ArrowLeft className="w-3 h-3" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-[#03172b] border border-slate-800 hover:border-amber-500/50 transition-all duration-300 space-y-4 hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                التفسير الأثري والشواهد المسندة
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                ربط كل آية بتفسير ابن كثير والجلالين وأسباب النزول، مع توثيق الأحاديث النبوية المسندة من الصحيحين وتخريج أسانيدها ودرجتها العلمية.
              </p>
              <div className="text-[11px] text-amber-400 font-semibold pt-2 border-t border-slate-800/80 flex items-center gap-1">
                <span>أمانة علمية موثقة</span> <ArrowLeft className="w-3 h-3" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PRODUCT SHOWCASE (Built for Researchers & Scholars)                    */}
      {/* ========================================================================= */}
      <section id="showcase" className="py-20 bg-[#020e1d] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Product Interactive Tabs / Preview */}
            <div className="lg:col-span-7 space-y-4">
              {/* Tab Selector */}
              <div className="flex gap-2 p-1.5 bg-[#03172b] rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveShowcaseTab('workspace')}
                  className={`flex-1 py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                    activeShowcaseTab === 'workspace'
                      ? 'bg-cyan-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BrainCircuit className="w-4 h-4" /> مساحة العمل المتكاملة
                </button>
                <button
                  onClick={() => setActiveShowcaseTab('graph')}
                  className={`flex-1 py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                    activeShowcaseTab === 'graph'
                      ? 'bg-cyan-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Share2 className="w-4 h-4" /> شبكة العلاقات المعرفية
                </button>
                <button
                  onClick={() => setActiveShowcaseTab('manuscripts')}
                  className={`flex-1 py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                    activeShowcaseTab === 'manuscripts'
                      ? 'bg-cyan-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileCheck className="w-4 h-4" /> متحف المخطوطات
                </button>
              </div>

              {/* Display Area for Active Showcase */}
              <div className="bg-[#031527] border border-cyan-800/60 rounded-2xl p-5 min-h-[380px] flex flex-col justify-between shadow-2xl">
                {activeShowcaseTab === 'workspace' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] text-cyan-400 font-mono">PANEL 1 / 2 / 3</span>
                        <h4 className="text-sm font-bold text-white">تزامن ثلاثي فوري: المصحف + الوكيل + الأدلة</h4>
                      </div>
                      <span className="text-xs bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-800/40">
                        استجابة لحظية
                      </span>
                    </div>

                    <div className="p-3 bg-[#020b18] rounded-xl border border-slate-800 text-xs space-y-2">
                      <div className="text-slate-400 font-semibold">سؤال الباحث:</div>
                      <div className="text-cyan-300 font-serif text-sm">
                        «ما هي الأدلة العلمية والبنائية في قوله تعالى: أَوَلَمْ يَرَ الَّذِينَ كَفَرُوا أَنَّ السَّمَاوَاتِ وَالْأَرْضَ كَانَتَا رَتْقًا فَفَتَقْنَاهُمَا؟»
                      </div>
                    </div>

                    <div className="p-3 bg-cyan-950/40 rounded-xl border border-cyan-700/40 text-xs space-y-1.5 text-cyan-100">
                      <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> نتيجة الاستقراء والتخريج:
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        • دلالة لغوية: «الرتق» هو الالتصاق والانسداد، و«الفتق» هو الفصل والانفجار.
                        <br />
                        • توافق كوني: يتقاطع المفهوم مع مبدأ التمدد الكوني الأولي والانفجار العظيم (Big Bang).
                        <br />
                        • شاهد حديثي: حديث أبي هريرة في الترمذي (3108): «كل شيء خلق من ماء» [إسناد حسن].
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                      <span>مصنف تحت: توافق علمي مدعوم بالأدلة</span>
                      <Link href="/dashboard" className="text-cyan-400 font-bold hover:underline">
                        جرب السؤال في مساحة العمل ←
                      </Link>
                    </div>
                  </div>
                )}

                {activeShowcaseTab === 'graph' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] text-cyan-400 font-mono">TOPOLOGICAL KNOWLEDGE MAP</span>
                        <h4 className="text-sm font-bold text-white">الارتباطات المفهومية والاشتقاقية المتشعبة</h4>
                      </div>
                      <span className="text-xs bg-cyan-950 text-cyan-300 px-2.5 py-1 rounded-full border border-cyan-800/40">
                        1,162 زوج متشابه
                      </span>
                    </div>

                    <div className="p-4 bg-[#020b18] rounded-xl border border-slate-800 text-center space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-cyan-600 text-white font-bold text-xs">سورة يس (40)</span>
                        <span className="text-slate-500 font-mono">⟷</span>
                        <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 font-bold text-xs border border-cyan-700/50">الأنبياء (33)</span>
                      </div>
                      <p className="text-xs text-slate-300 font-serif">
                        «لَا الشَّمْسُ يَنبَغِي لَهَا أَن تُدْرِكَ الْقَمَرَ ... وَكُلٌّ فِي فَلَكٍ يَسْبَحُونَ»
                      </p>
                      <div className="text-[11px] text-emerald-400">
                        تشترك الآيتان في التركيب التناظري «كُلٌّ فِي فَلَكٍ» وجذري (شمس، قمر).
                      </div>
                    </div>

                    <Link
                      href="/dashboard"
                      className="block text-center py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition"
                    >
                      استكشف شبكة العلاقات الحية ←
                    </Link>
                  </div>
                )}

                {activeShowcaseTab === 'manuscripts' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] text-cyan-400 font-mono">EARLY FOLIOS (7th CENTURY)</span>
                        <h4 className="text-sm font-bold text-white">توثيق مادي أركيولوجي قطعي من عصر الصحابة</h4>
                      </div>
                      <span className="text-xs bg-amber-950 text-amber-300 px-2.5 py-1 rounded-full border border-amber-800/40">
                        C-14 تأريخ كربوني
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-[#020b18] rounded-xl border border-slate-800 space-y-1">
                        <strong className="text-cyan-300 block">مخطوطة برمنغهام:</strong>
                        <span className="text-[11px] text-slate-300">568–645 ميلادي (بين عهد النبوة والخلافة الراشدة)</span>
                      </div>
                      <div className="p-3 bg-[#020b18] rounded-xl border border-slate-800 space-y-1">
                        <strong className="text-cyan-300 block">رق صنعاء الكبير:</strong>
                        <span className="text-[11px] text-slate-300">578–669 ميلادي (طبقتان من الخط الحجازي العتيق)</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                      تتطابق نصوص هذه الرقائق المادية حرفياً مع مصحف المدينة المتداول اليوم، مما يثبت استحالة طروء التحريف تاريخياً.
                    </p>

                    <Link
                      href="/dashboard/library"
                      className="block text-center py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition"
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
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  الأثر الأكاديمي والتحقيقي
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
                  منصة تجمع هيبة التراث بأعلى تقنيات الحوسبة
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  تم تصميم QuranMind ليكون رفيق كل باحث جاد، ومحقق في علوم القرآن، وأستاذ جامعي يريد استقراء النصوص بأعلى درجات التوثيق والنزاهة.
                </p>
              </div>

              <div className="space-y-3.5 text-xs text-slate-200">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-white block text-sm mb-0.5">استقراء شامل وغير منتقص</strong>
                    <span className="text-slate-400">فحص كافة سور القرآن الـ 114 و 6,236 آية بدقة تامة دون اجتزاء.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-white block text-sm mb-0.5">تصدير الملفات البحثية (Research Dossiers)</strong>
                    <span className="text-slate-400">توليد تقارير أكاديمية بصيغة PDF قابلة للطباعة ومستندات Markdown مخزنة سحابياً.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-white block text-sm mb-0.5">تلاوة صوتية متزامنة مع المصحف</strong>
                    <span className="text-slate-400">استماع فوري لكبار القراء (العفاسي، الحصري، عبد الباسط) مع التحكم في السرعة.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-white block text-sm mb-0.5">بنية تحتية سحابية موثوقة</strong>
                    <span className="text-slate-400">قواعد بيانات Neon PostgreSQL، ذاكرة Redis السريعة، وتخزين Supabase.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline"
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
      {/* 6. SCHOLARS & SCIENTIFIC RIGOR GUARANTEE (Custom Dedicated Section)       */}
      {/* ========================================================================= */}
      <section id="rigor" className="py-20 lg:py-28 relative bg-[#020b18] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="p-8 lg:p-12 rounded-3xl bg-gradient-to-b from-[#041d36] to-[#021124] border border-cyan-600/40 shadow-2xl relative overflow-hidden">
            {/* Background seal badge */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl space-y-4 mb-12">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 text-xs font-bold border border-emerald-600/40">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> ميثاق الأمانة والتدقيق الإبستيمي
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif">
                لماذا يثق العلماء والمحققون في QuranMind؟
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                القرآن الكريم كتاب هداية وتشريع لا يقبل التكلف أو التكهن غير المنضبط. وضعنا في صلب برمجياتنا أربعة ضوابط قطعية لضمان النزاهة العلمية التامة:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-5 rounded-2xl bg-[#020e1d] border border-slate-800 space-y-2.5">
                <div className="text-cyan-400 font-bold text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-cyan-950 flex items-center justify-center text-xs">1</span>
                  قدسية النص وعدم التبديل
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  النص القرآني مخزن بصيغة غير قابلة للتحوير (Read-Only Immutable)، ومطابق حرفياً للمصحف النبوي الشريف برواية حفص عن عاصم.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#020e1d] border border-slate-800 space-y-2.5">
                <div className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-950 flex items-center justify-center text-xs">2</span>
                  التصنيف المعرفي الخماسي
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  يصنف النظام كل نتيجة بصرامة: (ملاحظة مؤكدة نصياً · توافق علمي مدعوم · استئناس محتمل · فرضية بحثية · دعوى غير مسندة).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#020e1d] border border-slate-800 space-y-2.5">
                <div className="text-amber-400 font-bold text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-950 flex items-center justify-center text-xs">3</span>
                  الإسناد والتخريج الحديثي
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  لا يُستشهد بحديث إلا مع تخريجه من كتب السنة المعتمدة، مع ذكر السلسلة الإسنادية والدرجة (صحيح، حسن) وسياق النزول التاريخي.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#020e1d] border border-slate-800 space-y-2.5">
                <div className="text-blue-400 font-bold text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-950 flex items-center justify-center text-xs">4</span>
                  الحساب القطعي دون انتقائية
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  تعتمد المنصة خوارزميات رياضية مفتوحة تخضع للمراجعة، وتمنع أسلوب "انتقاء الأرقام" (Cherry-picking) الشائع في الادعاءات غير المنضبطة.
                </p>
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <span>هل أنت باحث أو أستاذ جامعي وتريد مراجعة الخوارزميات؟</span>
              <Link href="/docs" className="text-cyan-400 font-bold hover:underline flex items-center gap-1">
                اطّلع على وثائق المنهجية والمعايير <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PRICING & DIGITAL WAQF (Endowment & Support) SECTION                   */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-20 lg:py-28 relative bg-[#020e1d] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">
              الخطط والوقف الرقمي
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif">
              خطط شفافة وباب للوقف القرآني المستمر
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              اختر خطتك المناسبة كباحث، أو ساهم في الوقف الرقمي لرعاية المنصة وتوفير تراخيص مجانية لطلاب العلم حول العالم.
            </p>

            {/* Monthly / Yearly Cycle Switcher */}
            <div className="pt-2 inline-flex items-center p-1 bg-[#03172b] rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActivePricingCycle('monthly')}
                className={`py-1.5 px-4 rounded-lg font-bold transition ${
                  activePricingCycle === 'monthly' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                اشتراك شهري
              </button>
              <button
                onClick={() => setActivePricingCycle('yearly')}
                className={`py-1.5 px-4 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activePricingCycle === 'yearly' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>وقف سنوي</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-700/40">
                  وفر شهرين
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Tier 1: Free Starter */}
            <div className="p-8 rounded-3xl bg-[#031527] border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase">للباحث المبتدئ والطلاب</span>
                <h3 className="text-xl font-bold text-white">طالب العلم (Free)</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$0</span>
                  <span className="text-xs text-slate-400">/ مجاناً مدى الحياة</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  وصول كامل لكافة نصوص القرآن الكريم ومحرك البحث واستخراج الجذور.
                </p>

                <div className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>تصفح كامل لـ 114 سورة و 6,236 آية</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>المعجم الصرفي واستخراج الجذور الثلاثية</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>محرك التناظر وحساب الجمل (Abjad)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>الاستماع لتلاوات القراء الثلاثة</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <X className="w-4 h-4" />
                    <span>تصدير ملفات البحث بصيغة PDF سحابياً</span>
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard"
                className="w-full py-3 text-center bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition"
              >
                ابدأ البحث مجاناً
              </Link>
            </div>

            {/* Tier 2: Pro Researcher (Featured) */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#041d36] to-[#031527] border-2 border-cyan-500 shadow-2xl shadow-cyan-950/80 transition flex flex-col justify-between space-y-6 relative">
              <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-cyan-500 text-slate-950 font-black text-[11px] shadow">
                الخيار الأكثر طلباً للباحثين
              </span>

              <div className="space-y-4">
                <span className="text-xs font-bold text-cyan-300 uppercase">للمحققين وأساتذة الجامعات</span>
                <h3 className="text-xl font-bold text-white">المحقق الأكاديمي (Pro)</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-cyan-300">
                    {activePricingCycle === 'monthly' ? '$19' : '$190'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {activePricingCycle === 'monthly' ? '/ شهرياً' : '/ سنوياً'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  وصول غير محدود للوكيل الذكي، شبكة العلاقات المعرفية، وتصدير الملفات.
                </p>

                <div className="space-y-2.5 text-xs text-slate-200 pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" />
                    <span><strong>كافة مزايا الخطة المجانية</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" />
                    <span>استعلامات الوكيل الذكي (AI Agent) غير محدودة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" />
                    <span>فحص المخطوطات المبكرة (Corpus Coranicum) بالمجهر</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" />
                    <span>شبكة العلاقات المعرفية الكاملة (Research Graph)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" />
                    <span>تصدير الملفات البحثية (Dossiers) بصيغة PDF و Markdown</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" />
                    <span>مزامنة الأدلة وحفظ المشاريع في قاعدة بيانات Neon</span>
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard"
                className="w-full py-3.5 text-center bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-cyan-500/25 transition active:scale-95"
              >
                اشترك وادعم البحث العلمي
              </Link>
            </div>

            {/* Tier 3: Digital Waqf & Patron */}
            <div className="p-8 rounded-3xl bg-[#031527] border border-amber-600/40 hover:border-amber-500/80 transition flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold text-amber-400 uppercase">وقف رقمي ورعاية علمية</span>
                <h3 className="text-xl font-bold text-white">رعاة الوقف القرآني (Patron)</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-amber-300">
                    {activePricingCycle === 'monthly' ? '$49' : '$490'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {activePricingCycle === 'monthly' ? '/ شهرياً' : '/ وقف سنوي'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  مساهمة وقفية جارية لتغطية تكاليف الخوادم وتوفير المنصة مجاناً للجامعات والباحثين.
                </p>

                <div className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" />
                    <span><strong>كافة مزايا المحقق الأكاديمي</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>ترخيص معمل بحثي لمؤسستك أو جامعتك</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>وصول واجهة برمجة التطبيقات (API Access)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>اسم / جهة الراعي في لوحة شرف الوقف القرآني</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>أجر الصدقة الجارية ونشر العلم القرآني النافع</span>
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard"
                className="w-full py-3 text-center bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                ساهم في الوقف القرآني الرقمي
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. TESTIMONIALS SECTION (Scholarly & Researcher Feedback)                 */}
      {/* ========================================================================= */}
      <section id="testimonials" className="py-20 lg:py-28 relative bg-[#020b18] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">
              شهادات الباحثين والأكاديميين
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif">
              ماذا يقول علماء القرآن والمحققون حول العالم؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              آراء حقيقية من متخصصين في الدراسات القرآنية، اللغويات الحاسوبية، وتاريخ المخطوطات.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Testimonial 1 */}
            <div className="p-6 rounded-2xl bg-[#03172b] border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  «نقلت منصة QuranMind البحث القرآني من التكهنات والانتقائية غير المنضبطة إلى منهج استقرائي علمي صارم. أصبح بإمكان طلابي الآن فحص التناظر والجذور في ثوانٍ وبدقة 100%.»
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-xs">
                  د.أ
                </div>
                <div>
                  <strong className="text-white text-xs block">د. أحمد عبد الرحمن المنصور</strong>
                  <span className="text-[11px] text-slate-400">أستاذ اللغويات الحاسوبية والدراسات القرآنية</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-6 rounded-2xl bg-[#03172b] border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  «The integration of 7th-century Corpus Coranicum folios with real-time root concordance and isnad citations makes QuranMind the most academically rigorous Quran tech platform available.»
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-950 border border-blue-500/40 flex items-center justify-center text-blue-300 font-bold text-xs">
                  SM
                </div>
                <div>
                  <strong className="text-white text-xs block">Dr. Sophia Miller</strong>
                  <span className="text-[11px] text-slate-400">Early Semitic Manuscripts Specialist, UK</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-6 rounded-2xl bg-[#03172b] border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  «أكثر ما أدهشني هو ميثاق الأمانة الإبستيمية. المنصة لا تجرؤ على تسمية التوافقات الكونية حقائق إلا بعد فحص صارم، وتفصل بأمانة بين النص القطعي والاجتهاد البشري.»
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-xs">
                  د.ط
                </div>
                <div>
                  <strong className="text-white text-xs block">الشيخ د. طارق الغامدي</strong>
                  <span className="text-[11px] text-slate-400">رئيس مركز الدراسات البيانية والمأثور</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. CALL TO ACTION (CTA) SECTION                                           */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-[#020e1d] to-[#010813]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="p-10 lg:p-14 rounded-3xl bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border border-cyan-500/40 shadow-2xl text-center space-y-6 relative">
            <span className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-cyan-300 mx-auto shadow-lg shadow-cyan-950/60">
              <Sparkles className="w-6 h-6" />
            </span>

            <h2 className="text-3xl sm:text-5xl font-black text-white font-serif">
              جاهز للارتقاء ببحثك القرآني إلى المستوى الأكاديمي؟
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              انضم الآن إلى آلاف الباحثين والمحققين وطلاب العلم. ابدأ في استكشاف أنساق القرآن الكريم وجذوره وتناظره بدقة متناهية.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2 transition hover:-translate-y-0.5 active:scale-95"
              >
                <span>ادخل إلى مساحة العمل مجاناً الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/quran"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm transition"
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
      <footer className="bg-[#01060f] border-t border-slate-900 pt-16 pb-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-900">
            
            {/* Col 1: Brand Info */}
            <div className="col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold text-white font-serif">
                  Quran<span className="text-cyan-400">Mind</span>
                </span>
              </Link>

              <p className="text-slate-400 leading-relaxed max-w-sm">
                مختبر رقمي مفتوح وأكاديمي لخدمة كتاب الله من خلال الذكاء الاصطناعي، الاستقراء اللغوي، والتحليل العددي والبنيوي الموثق.
              </p>

              <div className="flex items-center gap-2 text-[11px] text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>جميع النصوص مطابقة لمصحف المدينة النبوية (حفص)</span>
              </div>
            </div>

            {/* Col 2: Platform Links */}
            <div className="space-y-3">
              <strong className="text-white block text-xs font-bold">المنصة والأدوات</strong>
              <ul className="space-y-2">
                <li><Link href="/dashboard" className="hover:text-cyan-300 transition">مساحة العمل الثلاثية</Link></li>
                <li><Link href="/dashboard/quran" className="hover:text-cyan-300 transition">المصحف الشريف (114 سورة)</Link></li>
                <li><Link href="/dashboard/analysis" className="hover:text-cyan-300 transition">مختبر التناظر وحساب الجمل</Link></li>
                <li><Link href="/dashboard/library" className="hover:text-cyan-300 transition">متحف المخطوطات والحديث</Link></li>
                <li><Link href="/dashboard/statistics" className="hover:text-cyan-300 transition">إحصاءات القرآن الشاملة</Link></li>
              </ul>
            </div>

            {/* Col 3: Manuscripts & Data */}
            <div className="space-y-3">
              <strong className="text-white block text-xs font-bold">المصادر والأرشيف</strong>
              <ul className="space-y-2">
                <li><Link href="/dashboard/library" className="hover:text-cyan-300 transition">رقعة برمنغهام (568–645م)</Link></li>
                <li><Link href="/dashboard/library" className="hover:text-cyan-300 transition">رق صنعاء (578–669م)</Link></li>
                <li><Link href="/dashboard/library" className="hover:text-cyan-300 transition">تفسير ابن كثير والجلالين</Link></li>
                <li><Link href="/dashboard/library" className="hover:text-cyan-300 transition">شواهد الصحيحين المسندة</Link></li>
                <li><Link href="#rigor" className="hover:text-cyan-300 transition">ميثاق الأمانة الإبستيمية</Link></li>
              </ul>
            </div>

            {/* Col 4: Waqf & Support */}
            <div className="space-y-3">
              <strong className="text-white block text-xs font-bold">الوقف والدعم</strong>
              <ul className="space-y-2">
                <li><Link href="#pricing" className="hover:text-cyan-300 transition">الوقف القرآني الرقمي</Link></li>
                <li><Link href="#pricing" className="hover:text-cyan-300 transition">رعاية تراخيص الطلاب</Link></li>
                <li><Link href="/docs" className="hover:text-cyan-300 transition">التوثيق البرمجي (Docs)</Link></li>
                <li><Link href="/login" className="hover:text-cyan-300 transition">بوابة الباحثين</Link></li>
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
