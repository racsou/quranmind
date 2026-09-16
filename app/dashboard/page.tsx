import Link from 'next/link'
import { ArrowLeft, BookOpen, FlaskConical, Sparkles } from 'lucide-react'
import { QuranMindDashboard } from '@/components/quranmind-dashboard'

const stats = [{ label: 'آية محللة', value: '2,847' }, { label: 'حقيقة علمية موثقة', value: '184' }, { label: 'مشروع بحثي', value: '12' }]
const recent = ['تحليل التناظر في سورة الفلك', 'دراسة العدد 7 في القرآن', 'مقارنة دلائل الخلق']

export default function DashboardPage() { return <QuranMindDashboard title="لوحة التحكم"><div className="qm-grid">{stats.map((stat) => <div className="qm-card" key={stat.label}><span className="qm-stat-label">{stat.label}</span><div className="qm-stat">{stat.value}</div><span className="qm-badge">+12% هذا الشهر</span></div>)}</div><div className="qm-grid-wide"><section className="qm-card"><h2>آخر النشاطات البحثية</h2><div className="qm-list">{recent.map((item, index) => <div className="qm-list-item" key={item}><span>{item}</span><span className="qm-muted">منذ {index + 1} يوم</span></div>)}</div></section><section className="qm-card"><h2>ابدأ رحلة البحث</h2><p className="qm-muted">استخدم أدوات QuranMind لاستكشاف الآيات والروابط العلمية.</p><div className="qm-list"><Link className="qm-list-item" href="/dashboard/analysis"><span><FlaskConical /> تحليل آية</span><ArrowLeft /></Link><Link className="qm-list-item" href="/dashboard/assistant"><span><Sparkles /> اسأل الوكيل الذكي</span><ArrowLeft /></Link><Link className="qm-list-item" href="/dashboard/quran"><span><BookOpen /> تصفح القرآن</span><ArrowLeft /></Link></div></section></div></QuranMindDashboard> }
