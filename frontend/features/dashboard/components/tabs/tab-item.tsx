'use client'

import React from 'react'
import { X } from 'lucide-react'
import { NavItem } from '../../config/dashboard-nav-items'

interface TabItemProps {
  tab: NavItem
  isActive: boolean
  canClose: boolean
  onSelect: () => void
  onClose: (e: React.MouseEvent) => void
}

export function TabItem({
  tab,
  isActive,
  canClose,
  onSelect,
  onClose,
}: TabItemProps) {
  const Icon = tab.icon

  return (
    <div
      onClick={onSelect}
      className={`exact-tab-item ${isActive ? 'is-active' : ''}`}
    >
      <Icon className="tab-icon" />
      <span className="tab-label">{tab.label}</span>
      {tab.badge && <span className="tab-badge">{tab.badge}</span>}

      {canClose && (
        <button
          type="button"
          onClick={onClose}
          className="tab-close-btn"
          title="إغلاق التبويب"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}
