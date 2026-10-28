'use client'

import React from 'react'
import { ChevronDown } from 'lucide-react'
import { NavItem, allNavItems } from '../../config/dashboard-nav-items'

const DEFAULT_PROJECTS = [
  'معجزة التناظر في القرآن',
  'الحقائق العلمية في القرآن',
  'العدد والأرقام في القرآن',
  'دلالات الحروف والكلمات',
  'الكون والذرة',
]

export function SidebarProjectsList({ onSelectTab }: { onSelectTab: (item: NavItem) => void }) {
  const handleOpenProjects = () => {
    const projectItem = allNavItems.find((n) => n.id === 'projects')
    if (projectItem) onSelectTab(projectItem)
  }

  return (
    <div className="exact-projects">
      <div className="exact-project-title">
        المشاريع الحالية <ChevronDown className="w-3.5 h-3.5" />
      </div>
      {DEFAULT_PROJECTS.map((item, i) => (
        <button
          key={item}
          type="button"
          className="exact-project-item"
          onClick={handleOpenProjects}
        >
          <i className={`project-dot dot-${i % 5}`} />
          <span>{item}</span>
          <b>•</b>
        </button>
      ))}
      <button
        type="button"
        className="exact-new-project"
        onClick={handleOpenProjects}
      >
        مشروع جديد
      </button>
    </div>
  )
}
