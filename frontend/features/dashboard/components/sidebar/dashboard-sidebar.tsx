'use client'

import React from 'react'
import { NavItem } from '../../config/dashboard-nav-items'
import { SidebarBrand } from './sidebar-brand'
import { SidebarNavList } from './sidebar-nav-list'
import { SidebarProjectsList } from './sidebar-projects-list'
import { SidebarAyahQuote } from './sidebar-ayah-quote'
import { SidebarSystemFooter } from './sidebar-system-footer'

interface DashboardSidebarProps {
  activeTabId: string
  sidebarOpen: boolean
  onSelectTab: (item: NavItem) => void
}

export function DashboardSidebar({
  activeTabId,
  sidebarOpen,
  onSelectTab,
}: DashboardSidebarProps) {
  return (
    <aside className={`exact-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
      <SidebarBrand />
      <SidebarNavList activeTabId={activeTabId} onSelectTab={onSelectTab} />
      <SidebarProjectsList onSelectTab={onSelectTab} />
      <SidebarAyahQuote />
      <SidebarSystemFooter />
    </aside>
  )
}
