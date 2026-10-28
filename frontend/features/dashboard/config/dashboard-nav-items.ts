import React from 'react'
import {
  BookOpen,
  BrainCircuit,
  FileCode,
  FileText,
  FlaskConical,
  FolderKanban,
  Home,
  LibraryBig,
  LineChart,
  Network,
  Settings,
} from 'lucide-react'

export interface NavItem {
  id: string
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

export const allNavItems: NavItem[] = [
  { id: 'overview', href: '/dashboard', label: 'الرئيسية', icon: Home },
  { id: 'quran', href: '/dashboard/quran', label: 'القرآن الكريم', icon: BookOpen },
  { id: 'analysis', href: '/dashboard/analysis', label: 'تحليل علمي وتناظر', icon: FlaskConical },
  { id: 'assistant', href: '/dashboard/assistant', label: 'الوكيل الذكي', icon: BrainCircuit },
  { id: 'hadith', href: '/dashboard/hadith', label: 'استوديو الحديث', icon: Network, badge: 'حديث' },
  { id: 'notes', href: '/dashboard/notes', label: 'الملاحظات الدراسية', icon: FileText, badge: '@' },
  { id: 'projects', href: '/dashboard/projects', label: 'المشاريع البحثية', icon: FolderKanban },
  { id: 'library', href: '/dashboard/library', label: 'المكتبة والمخطوطات', icon: LibraryBig },
  { id: 'statistics', href: '/dashboard/statistics', label: 'الإحصائيات', icon: LineChart },
  { id: 'api-docs', href: '/dashboard/api-docs', label: 'توثيق الـ API', icon: FileCode, badge: 'v1' },
  { id: 'settings', href: '/dashboard/settings', label: 'إعدادات الحساب', icon: Settings },
]
