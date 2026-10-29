'use client'

import React from 'react'
import { Columns, LayoutGrid } from 'lucide-react'
import { NavItem } from '../../config/dashboard-nav-items'
import { TabItem } from './tab-item'
import { TabAddDropdown } from './tab-add-dropdown'

interface DashboardTabStripProps {
  openTabs: NavItem[]
  activeTabId: string
  addMenuOpen: boolean
  unopenedItems: NavItem[]
  overviewMode?: 'panes' | 'overview'
  onToggleOverviewMode?: () => void
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
  overviewMode = 'panes',
  onToggleOverviewMode,
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

      {activeTabId === 'overview' && onToggleOverviewMode && (
        <div className="tab-strip-actions">
          <button
            type="button"
            onClick={onToggleOverviewMode}
            className={`tab-strip-toggle-btn ${overviewMode === 'panes' ? 'is-active' : ''}`}
            title={
              overviewMode === 'panes'
                ? 'التبديل إلى بطاقات الإحصائيات'
                : 'التبديل إلى الأعمدة الثلاثة'
            }
          >
            {overviewMode === 'panes' ? (
              <>
                <Columns className="w-3.5 h-3.5" />
                <span>التحليل الثلاثي</span>
              </>
            ) : (
              <>
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>ملخص الأنشطة</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
