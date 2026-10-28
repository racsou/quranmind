'use client'

import React from 'react'
import { NavItem, allNavItems } from '../../config/dashboard-nav-items'

interface SidebarNavListProps {
  activeTabId: string
  onSelectTab: (item: NavItem) => void
}

export function SidebarNavList({ activeTabId, onSelectTab }: SidebarNavListProps) {
  return (
    <nav className="exact-nav-list">
      {allNavItems.map((item) => {
        const Icon = item.icon
        const isActive = activeTabId === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item)}
            className={`exact-nav-btn ${isActive ? 'active' : ''}`}
          >
            <Icon />
            <span className="flex-1 text-right">{item.label}</span>
            {item.badge && (
              <span
                className={`exact-nav-badge ${
                  item.badge === 'حديث' ? 'badge-hadith' : ''
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
