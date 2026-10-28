'use client'

import React from 'react'
import {
  allNavItems,
  type NavItem,
} from '@/features/dashboard/config/dashboard-nav-items'
import { DashboardShell } from '@/features/dashboard/components/dashboard-shell'

export { allNavItems, type NavItem }
export const dashboardTabs = allNavItems
export const dashboardMock = { stats: [], recent: [] }

export function QuranMindDashboard({
  children,
  title,
  initialTab,
}: {
  children?: React.ReactNode
  title?: string
  initialTab?: string
}) {
  return (
    <DashboardShell initialTab={initialTab}>
      {children}
    </DashboardShell>
  )
}
