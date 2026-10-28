'use client'

import React from 'react'
import { Bell, Sparkles } from 'lucide-react'
import { UserProfileButton } from '@/components/user-profile-button'
import { NavItem, allNavItems } from '../../config/dashboard-nav-items'

export function TopbarActions({ onSelectTab }: { onSelectTab: (item: NavItem) => void }) {
  const handleOpenSettings = () => {
    const settingsItem = allNavItems.find((n) => n.id === 'settings')
    if (settingsItem) onSelectTab(settingsItem)
  }

  return (
    <div className="exact-top-actions">
      <button
        type="button"
        className="exact-top-btn"
        title="الترقية للنسخة الأكاديمية"
        onClick={handleOpenSettings}
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
        <span>باقة المحقق</span>
      </button>

      <button
        type="button"
        title="التنبيهات"
        className="p-1.5 text-slate-500 hover:text-slate-800 transition"
      >
        <Bell className="w-4 h-4" />
      </button>

      <span className="top-divider" />
      <UserProfileButton />
    </div>
  )
}
