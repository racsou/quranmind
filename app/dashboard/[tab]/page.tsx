import { QuranMindDashboard } from '@/components/quranmind-dashboard'
import { DashboardTabView } from '@/components/dashboard-tab-view'

const titles: Record<string, string> = {
  quran: 'القرآن الكريم',
  analysis: 'التحليل العلمي',
  assistant: 'الوكيل الذكي',
  projects: 'المشاريع البحثية',
  library: 'المكتبة العلمية',
  statistics: 'الإحصائيات الشاملة',
  settings: 'إعدادات النظام',
}

export default async function DashboardTabPage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = await params
  const title = titles[tab] || 'مساحة العمل'

  return (
    <QuranMindDashboard title={title}>
      <DashboardTabView tab={tab} />
    </QuranMindDashboard>
  )
}
