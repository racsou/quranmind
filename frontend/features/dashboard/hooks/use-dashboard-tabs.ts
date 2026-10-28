'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { NavItem, allNavItems } from '../config/dashboard-nav-items'

export function useDashboardTabs(initialTab?: string) {
  const pathname = usePathname()

  const getTabIdFromPath = (path: string): string => {
    if (initialTab) return initialTab
    if (!path || path === '/dashboard') return 'overview'
    const match = path.match(/^\/dashboard\/([^/]+)/)
    return match ? match[1] : 'overview'
  }

  const initialTabId = getTabIdFromPath(pathname)

  const [openTabs, setOpenTabs] = useState<NavItem[]>(() => {
    const mainTab = allNavItems.find((n) => n.id === 'overview') || allNavItems[0]
    if (initialTabId && initialTabId !== 'overview') {
      const current = allNavItems.find((n) => n.id === initialTabId)
      if (current) return [mainTab, current]
    }
    return [mainTab]
  })

  const [activeTabId, setActiveTabId] = useState<string>(initialTabId)
  const [addMenuOpen, setAddMenuOpen] = useState(false)

  const handleSelectTab = (item: NavItem) => {
    if (!openTabs.some((t) => t.id === item.id)) {
      setOpenTabs((prev) => [...prev, item])
    }
    setActiveTabId(item.id)
    window.history.pushState(null, '', item.href)
  }

  const handleOpenNewTab = (item: NavItem) => {
    if (!openTabs.some((t) => t.id === item.id)) {
      setOpenTabs((prev) => [...prev, item])
    }
    setActiveTabId(item.id)
    setAddMenuOpen(false)
    window.history.pushState(null, '', item.href)
  }

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation()
    if (openTabs.length <= 1) return

    const indexToClose = openTabs.findIndex((t) => t.id === tabId)
    const newTabs = openTabs.filter((t) => t.id !== tabId)
    setOpenTabs(newTabs)

    if (activeTabId === tabId) {
      const nextTab = newTabs[Math.max(0, indexToClose - 1)] || newTabs[0]
      setActiveTabId(nextTab.id)
      window.history.pushState(null, '', nextTab.href)
    }
  }

  const unopenedItems = allNavItems.filter((item) => !openTabs.some((t) => t.id === item.id))

  return {
    openTabs,
    activeTabId,
    setActiveTabId,
    addMenuOpen,
    setAddMenuOpen,
    handleSelectTab,
    handleOpenNewTab,
    handleCloseTab,
    unopenedItems,
  }
}
