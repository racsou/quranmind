'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  ArrowUpLeft,
  Atom,
  BarChart3,
  Beaker,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronDown,
  ChevronLeft,
  CircleHelp,
  Code2,
  FlaskConical,
  GitBranch,
  GitFork,
  Lightbulb,
  Mail,
  Menu,
  Network,
  Orbit,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Waves,
  X,
} from 'lucide-react'

const sections = [
  { title: 'الذكاء الاصطناعي', description: 'تحليل ذكي واستخراج النتائج والإحصاءات', icon: BrainCircuit, tone: 'violet' },
  { title: 'مقارنة الآيات', description: 'بحث في التشابهات والعلاقات بين الآيات والكلمات', icon: BookOpen, tone: 'cyan' },
  { title: 'الأنماط والتناسق', description: 'التماثل، الدوران، التكرار والنظم الإعجازي', icon: Network, tone: 'amber' },
  { title: 'دلالات الحروف والكلمات', description: 'معاني عميقة وتكرارات وتناسقات لغوية مدهشة', icon: Search, tone: 'blue' },
  { title: 'الحقائق العلمية', description: 'اكتشاف ما أثبته العلم الحديث من آيات القرآن', icon: Atom, tone: 'purple' },
  { title: 'الإحصائيات العددية', description: 'تحليل عدد الحروف والكلمات والأنماط العددية في القرآن', icon: BarChart3, tone: 'green' },
]

const signals = [
  { icon: Sun, title: 'دوران الأرض حول نفسها', text: 'تعاقب الليل والنهار وحركة مستمرة.' },
  { icon: Orbit, title: 'دوران الكواكب حول الشمس', text: 'متوافق مع معنى «كل في فلك يسبحون».' },
  { icon: Atom, title: 'الذرة وطبقاتها السبع', text: 'تناظر دقيق في النظام المذكور في القرآن.' },
  { icon: Infinity, title: 'التماثل في الأنساق الكونية', text: 'نرى أنماطاً متكررة في الكون من أصغر ذرة إلى أكبر مجرة.' },
]

function Infinity(props: React.ComponentProps<typeof Waves>) {
  return <Waves {...props} />
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <main dir="rtl" className="quranmind-site">
      <header className="site-header">
        <div className="header-inner">
          <a href="#top" className="brand" aria-label="QuranMind الرئيسية">
            <span className="brand-mark"><BookOpen size={29} strokeWidth={1.5} /></span>
            <span><strong>Quran<span>Mind</span></strong><small>القرآن · علم · حقيقة</small></span>
          </a>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="فتح القائمة">{menuOpen ? <X /> : <Menu />}</button>
          <nav className={menuOpen ? 'main-nav open' : 'main-nav'}>
            <a className="active" href="#top">الرئيسية</a><a href="#features">التحليلات</a><a href="#features">المواضيع</a><a href="#features">الآيات</a><a href="#stats">الإحصائيات</a><a href="#more">المزيد <ChevronDown size={13} /></a>
          </nav>
          <div className="header-actions"><div className="search-box"><Search size={17} /><span>ابحث عن آية، كلمة أو موضوع...</span></div><button aria-label="الوضع المضيء"><Sun size={20} /></button><button aria-label="حساب المستخدم"><CircleHelp size={21} /></button></div>
        </div>
      </header>

      <section id="top" className="hero-section">
        <div className="stars" />
        <div className="hero-copy"><p className="eyebrow">منصة مفتوحة للبحث والتدبر</p><h1>اكتشف أسرار القرآن<br /><span>بالعلم والذكاء الاصطناعي</span></h1><p className="hero-description">منصة متقدمة لتحليل القرآن الكريم واكتشاف الحقائق العلمية<br />والدلالات العددية واللغوية باستخدام الذكاء الاصطناعي.</p><div className="hero-points"><span><ShieldCheck /> رؤية شاملة وموثوقة</span><span><Beaker /> مقارنة مع العلوم الحديثة</span><span><BarChart3 /> دلالات الأرقام والحروف</span><span><Atom /> تحليل علمي لآيات القرآن</span></div></div>
        <div className="hero-art" aria-hidden="true"><div className="orbital orbital-one" /><div className="orbital orbital-two" /><div className="glow-orb" /><div className="quran-glyph">۞<small>وَفِي أَنفُسِكُمْ أَفَلَا تُبْصِرُونَ</small></div></div>
      </section>

      <section id="features" className="platform-section content-width"><div className="section-heading"><h2>أقسام المنصة</h2><span><Sparkles size={19} /></span></div><div className="section-grid">{sections.map(({ title, description, icon: Icon, tone }) => <article className={`feature-card ${tone}`} key={title}><div className="feature-icon"><Icon /></div><h3>{title}</h3><p>{description}</p><ArrowLeft className="feature-arrow" /></article>)}</div></section>

      <section id="stats" className="analysis-section content-width"><div className="analysis-card main-analysis"><div className="card-title"><h2>مثال من التحليل</h2><Sparkles /></div><div className="verse-card"><strong>رَبُّكَ فَكَبِّرْ <span>وَكُلٌّ فِي فَلَكٍ يَسْبَحُونَ</span></strong><small>(الأنبياء · 33)</small></div><div className="tabs"><span className="selected">التحليل العام</span><span>التناظر</span><span>العدد 7</span><span>الحقائق العلمية</span></div><div className="letter-panels"><div><h3>تناظر الحروف</h3><div className="letters"><b>ر</b><b>ب</b><b>ك</b><b>ف</b><b>ك</b><b>ر</b></div><p>تناظر في الحروف والكلمات وبنية متوازنة.</p></div><div><h3>العدد 7</h3><div className="number-seven">7</div><p>تكرار الرقم في مواضع مختلفة من الآيات.</p></div></div><div className="notice"><Lightbulb /> تكشف الأنماط أن هذا التناسق ليس مجرد صدفة، بل هو عظمة دقيقة تعكس حكمة الخالق.</div></div><aside className="analysis-card related"><div className="card-title"><h2>الحقائق العلمية المرتبطة</h2><Check /></div>{signals.map(({ icon: Icon, title, text }) => <div className="signal" key={title}><span><Icon /></span><div><strong>{title}</strong><p>{text}</p></div><ChevronLeft /></div>)}<div className="uncertain"><CircleHelp /><strong>حقائق غير مؤكدة</strong><p>بعض التفسيرات العددية قد تكون اجتهادية وتحتاج إلى مزيد من البحث.</p></div></aside><aside className="analysis-card discover"><div className="card-title"><h2>اكتشف الآن</h2><Sparkles /></div>{[['الحقائق العلمية في القرآن', FlaskConical], ['دلالات الأرقام في القرآن', BarChart3], ['تناظر الحروف والكلمات', Waves], ['معاني الكلمات', BookOpen], ['التحليل الشامل لآية محددة', Search]].map(([item, Icon], i) => <a href="#features" key={item as string}><span className={`discover-icon d-${i}`}><Icon /></span><strong>{item as string}</strong><ArrowLeft /></a>)}<div className="quote">القرآن ليس مجرد كتاب عبادة، بل هو أيضاً كتاب علم وهداية.</div></aside></section>

      <section id="more" className="support-section content-width"><div className="support-intro"><span className="open-source-badge"><Code2 size={18} /> مشروع مفتوح المصدر</span><h2>ساهم في بناء منصة<br /><span>تخدم الباحثين والمهتمين</span></h2><p>QuranMind مشروع مفتوح المصدر يهدف إلى تقديم أدوات علمية وشفافة لتدبر القرآن الكريم. بدعمك، نطوّر التحليلات ونفتح أبواب المعرفة للجميع.</p><div className="support-actions"><a className="primary-button" href="#contact"><GitBranch /> ساهم في المشروع <ArrowLeft size={17} /></a><a className="secondary-button" href="#donate">ادعم الفكرة</a></div></div><div className="support-grid"><a id="contact" href="mailto:contact@example.com" className="support-card"><Mail /><div><h3>تواصل معنا</h3><p>أرسل اقتراحاً أو شاركنا ملاحظاتك</p></div><ArrowUpLeft /></a><a href="https://github.com/example/quranmind" className="support-card" target="_blank" rel="noreferrer"><GitFork /><div><h3>مستودع المشروع</h3><p>اطّلع على الكود وشارك في التطوير</p></div><ArrowUpLeft /></a><a id="donate" href="#donate" className="support-card donation"><HeartIcon /><div><h3>ادعم استمرار المشروع</h3><p>تبرعك يساعدنا على بناء أدوات أفضل</p></div><ArrowUpLeft /></a></div></section>

      <footer className="site-footer"><div className="footer-brand"><span className="brand-mark"><BookOpen size={24} /></span><div><strong>Quran<span>Mind</span></strong><small>القرآن · علم · حقيقة</small></div></div><p>منصة مفتوحة لاكتشاف أسرار القرآن بالعلم والتقنية</p><div className="footer-links"><a href="#top">الرئيسية</a><a href="#features">أقسام المنصة</a><a href="#more">ساهم معنا</a><a href="#contact">تواصل</a></div><small className="copyright">© 2026 QuranMind · مشروع مفتوح المصدر</small></footer>
    </main>
  )
}

function HeartIcon() { return <span className="heart-icon" aria-hidden="true">♥</span> }
