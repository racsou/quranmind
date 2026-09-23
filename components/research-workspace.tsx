'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft, BookOpen, CheckCircle2, ChevronDown, FlaskConical, Menu, Search, Sparkles, X } from 'lucide-react'
import { analyzeVerse } from '@/lib/quran/analysis'
import { quranSample, searchVerses } from '@/lib/quran/sample-data'

const navigation = [{ label: 'الرئيسية', icon: Sparkles }, { label: 'القرآن الكريم', icon: BookOpen }, { label: 'التحليل العلمي', icon: FlaskConical }, { label: 'المشاريع البحثية', icon: BookOpen }, { label: 'المكتبة العلمية', icon: BookOpen }, { label: 'الإحصائيات', icon: FlaskConical }]

export function ResearchWorkspace() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(quranSample[0])
  const [messages, setMessages] = useState(['مرحباً بك في مساحة البحث. اطرح سؤالاً عن آية أو نمط لغوي وسأعرض الحسابات والأدلة بوضوح.'])
  const analysis = useMemo(() => analyzeVerse(selected), [selected])
  const results = useMemo(() => searchVerses(query), [query])
  function askQuestion() { if (!query.trim()) return; setMessages((items) => [...items, `سؤال البحث: ${query}`, 'تم العثور على آيات مرتبطة. هذه لوحة تجريبية تعرض ملاحظات محسوبة من بيانات قرآنية نموذجية.']); setQuery('') }
  return <div className="research-workspace" dir="rtl">
    <button className="workspace-menu" onClick={() => setSidebarOpen((value) => !value)} aria-label="فتح القائمة">{sidebarOpen ? <X /> : <Menu />}</button>
    <aside className={`workspace-sidebar ${sidebarOpen ? 'open' : ''}`}><div className="workspace-logo"><span><Sparkles /></span><div><strong>Quran<span>Mind</span></strong><small>مختبر البحث القرآني</small></div></div><nav>{navigation.map(({ label, icon: Icon }, index) => <button key={label} className={index === 0 ? 'active' : ''} onClick={() => setSidebarOpen(false)}><Icon />{label}</button>)}</nav><div className="workspace-project"><small>المشروع الحالي</small><strong>التناظر في الآيات الكونية</strong><span>بيانات تجريبية · للعرض فقط</span></div></aside>
    <section className="agent-panel"><header><div><span className="panel-kicker">الوكيل البحثي</span><h1><Sparkles /> المساعد الذكي</h1></div><span className="online"><i /> متصل</span></header><div className="message-list">{messages.map((message, index) => <div className={index % 3 === 1 ? 'message user-message' : 'message'} key={`${message}-${index}`}>{index % 3 !== 1 && <Sparkles /> }<p>{message}</p></div>)}</div><div className="prompt-box"><textarea value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); askQuestion() } }} placeholder="اكتب سؤالاً بحثياً عن القرآن..." aria-label="سؤال بحثي" /><button onClick={askQuestion} aria-label="إرسال السؤال"><ArrowLeft /></button><small>بيانات تجريبية · لا تمثل فتوى أو نتيجة علمية نهائية</small></div></section>
    <section className="quran-panel"><header><div><span className="panel-kicker">النص المصدر</span><h2>القرآن الكريم</h2></div><div className="verse-select">الأنبياء · 33 <ChevronDown /></div></header><div className="verse-view"><span className="surah-label">سورة الأنبياء</span><p>{selected.text}</p><small>الآية {selected.ayah} · الجزء {selected.juz}</small></div><div className="search-results"><label><Search /> <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث في الآيات..." /></label>{results.map((verse) => <button key={`${verse.surah}-${verse.ayah}`} className={verse === selected ? 'selected' : ''} onClick={() => setSelected(verse)}><span>{verse.surahName} · {verse.ayah}</span><small>{verse.text}</small></button>)}</div></section>
    <section className="evidence-panel"><header><span className="panel-kicker">الأدلة والتحليل</span><h2>نتيجة التحليل</h2><span className="verified"><CheckCircle2 /> ملاحظة محسوبة</span></header><div className="evidence-card"><h3>التحليل اللغوي والعددي</h3><div className="metric-row"><div><strong>{analysis.letters}</strong><span>عدد الحروف</span></div><div><strong>{analysis.words}</strong><span>عدد الكلمات</span></div><div><strong>{analysis.uniqueLetters}</strong><span>حروف فريدة</span></div></div><p className="normalized">{analysis.normalizedText}</p></div><div className="evidence-card"><h3>أكثر الحروف تكراراً</h3><div className="letter-cloud">{analysis.repeatedLetters.map(({ letter, count }) => <span key={letter}>{letter}<small>{count}</small></span>)}</div></div><div className="evidence-note"><strong>حدود الاستنتاج</strong><p>هذه أرقام مشتقة من نص نموذجي وفق قواعد التطبيع المعروضة. لا تكفي وحدها لإثبات دعوى علمية أو إعجازية.</p></div></section>
  </div>
}
