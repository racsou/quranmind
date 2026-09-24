import { redirect } from 'next/navigation'
import { QuranMindDashboard } from '@/components/quranmind-dashboard'
import { DashboardTabView } from '@/components/dashboard-tab-view'

const titles: Record<string, string> = {
  quran: 'القرآن الكريم',
  analysis: 'التحليل العلمي والتناظر',
  assistant: 'الوكيل الذكي',
  hadith: 'استوديو الحديث ومصطلح الحديث',
  notes: 'الملاحظات الدراسية المتطورة',
  projects: 'المشاريع البحثية والفرضيات',
  library: 'المكتبة والمخطوطات المبكرة',
  statistics: 'الإحصائيات الشاملة',
  'api-docs': 'توثيق الـ API المفتوح',
  settings: 'إعدادات الحساب والنظام',
}

export default async function DashboardTabPage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = await params
  if (tab === 'admin') {
    redirect('/admin')
  }
  const title = titles[tab] || 'مساحة العمل'

  return (
    <QuranMindDashboard title={title} initialTab={tab}>
      <DashboardTabView tab={tab} />
    </QuranMindDashboard>
  )
}
