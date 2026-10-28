'use client'

import React from 'react'
import { NavItem } from '../../config/dashboard-nav-items'
import { TopbarSearchInput } from './topbar-search-input'
import { TopbarActions } from './topbar-actions'

interface DashboardTopbarProps {
  searchQuery: string
  onSearchChange: (val: string) => void
  onSelectTab: (item: NavItem) => void
}

export function DashboardTopbar({
  searchQuery,
  onSearchChange,
  onSelectTab,
}: DashboardTopbarProps) {
  return (
    <header className="exact-topbar">
      <TopbarSearchInput value={searchQuery} onChange={onSearchChange} />
      <TopbarActions onSelectTab={onSelectTab} />
    </header>
  )
}
