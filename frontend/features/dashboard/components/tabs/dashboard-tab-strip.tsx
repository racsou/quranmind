'use client'

import React from 'react'
import { NavItem } from '../../config/dashboard-nav-items'
import { TabItem } from './tab-item'
import { TabAddDropdown } from './tab-add-dropdown'

interface DashboardTabStripProps {
  openTabs: NavItem[]
  activeTabId: string
  addMenuOpen: boolean
  unopenedItems: NavItem[]
  onSelectTab: (tabId: string, href: string) => void
  onCloseTab: (e: React.MouseEvent, tabId: string) => void
  onToggleAddMenu: () => void
  onOpenNewTab: (item: NavItem) => void
}

export function DashboardTabStrip({
  openTabs,
  activeTabId,
  addMenuOpen,
  unopenedItems,
  onSelectTab,
  onCloseTab,
  onToggleAddMenu,
  onOpenNewTab,
}: DashboardTabStripProps) {
  return (
    <div className="exact-tab-strip">
      <div className="exact-tab-scroll">
        {openTabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            isActive={activeTabId === tab.id}
            canClose={openTabs.length > 1}
            onSelect={() => onSelectTab(tab.id, tab.href)}
            onClose={(e) => onCloseTab(e, tab.id)}
          />
        ))}

        <TabAddDropdown
          isOpen={addMenuOpen}
          unopenedItems={unopenedItems}
          onToggle={onToggleAddMenu}
          onOpenNewTab={onOpenNewTab}
        />
      </div>
    </div>
  )
}
