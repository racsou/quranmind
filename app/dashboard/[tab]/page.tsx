import { QuranMindDashboard } from '@/components/quranmind-dashboard'

const content: Record<string, { title: string; intro: string; rows: string[] }> = {
  quran: { title: 'القرآن الكريم', intro: 'تصفح الآيات مع أدوات البحث والتفسير والتحليل المتقدمة.', rows: ['سورة الفلق — الآيات 1 إلى 5', 'سورة البقرة — آية الكرسي', 'سورة النحل — دلائل الخلق'] },
  analysis: { title: 'التحليل العلمي', intro: 'حلل الآيات لغوياً وعددياً واربطها بالمراجع العلمية.', rows: ['تحليل التناظر في سورة الفلق', 'دلالات الرقم 7 في القرآن', 'مقارنة الألفاظ والاشتقاقات'] },
  assistant: { title: 'الوكيل الذكي', intro: 'مساعد بحثي يجيب عن أسئلتك ويجمع الأدلة من مصادر متعددة.', rows: ['ما دلالة تكرار كلمة النور؟', 'اعرض الآيات المرتبطة بالكون', 'لخص مشروع التناظر'] },
  projects: { title: 'المشاريع البحثية', intro: 'نظم فرضياتك وملاحظاتك ونتائجك في مساحات بحثية قابلة للتطوير.', rows: ['معجزة التناظر في القرآن', 'الحقائق العلمية في القرآن', 'العدد والأرقام في القرآن', 'دلالات الحروف والكلمات'] },
  library: { title: 'المكتبة العلمية', intro: 'مراجع وأبحاث ومصادر منظمة لدعم البحث القرآني.', rows: ['موسوعة التفسير الموضوعي', 'أبحاث الإعجاز العلمي', 'معجم الألفاظ القرآنية', 'مراجع علم الفلك والكون'] },
  statistics: { title: 'الإحصائيات', intro: 'استكشف الأنماط العددية والإحصاءات الخاصة بالآيات والكلمات.', rows: ['عدد مرات تكرار الكلمات', 'توزيع الحروف في السور', 'أنماط التناظر والتماثل'] },
  settings: { title: 'الإعدادات', intro: 'تحكم في تفضيلات مساحة العمل وحسابك التجريبي.', rows: ['الملف الشخصي والهوية البحثية', 'تفضيلات اللغة والعرض', 'إدارة التنبيهات والخصوصية'] },
}

export default async function DashboardTabPage({ params }: { params: Promise<{ tab: string }> }) { const { tab } = await params; const data = content[tab] ?? content.quran; return <QuranMindDashboard title={data.title}><section className="qm-card"><h2>{data.title}</h2><p className="qm-muted">{data.intro}</p><div className="qm-list">{data.rows.map((row) => <div className="qm-list-item" key={row}><span>{row}</span><span className="qm-badge">بيانات تجريبية</span></div>)}</div></section></QuranMindDashboard> }
