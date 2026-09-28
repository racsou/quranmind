import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'بوابة الإدارة المركزية والمدفوعات | QuranMind Admin',
  description: 'لوحة تحكم مدير النظام لإدارة المستخدمين وبوابات الدفع SlickPay و Stripe',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#010814] text-slate-100 font-sans" dir="rtl">
      {children}
    </div>
  )
}
