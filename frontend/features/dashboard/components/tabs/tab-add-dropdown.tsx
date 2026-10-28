'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { NavItem } from '../../config/dashboard-nav-items'

interface TabAddDropdownProps {
  isOpen: boolean
  unopenedItems: NavItem[]
  onToggle: () => void
  onOpenNewTab: (item: NavItem) => void
}

export function TabAddDropdown({
  isOpen,
  unopenedItems,
  onToggle,
  onOpenNewTab,
}: TabAddDropdownProps) {
  if (unopenedItems.length === 0) return null

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="exact-tab-add-btn"
        title="فتح تبويب جديد"
      >
        <Plus className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="exact-add-dropdown">
          <div className="add-dropdown-title">فتح أداة في تبويب جديد:</div>
          {unopenedItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpenNewTab(item)}
                className="add-dropdown-item"
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="flex-1">{item.label}</span>
                {item.badge && <span className="tab-badge">{item.badge}</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
