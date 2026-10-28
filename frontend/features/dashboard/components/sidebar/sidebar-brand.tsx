'use client'

import React from 'react'
import Link from 'next/link'
import { BrainCircuit } from 'lucide-react'

export function SidebarBrand() {
  return (
    <Link href="/" className="exact-brand">
      <div className="exact-logo">
        <BrainCircuit />
      </div>
      <div>
        <strong>
          Quran<span>Mind</span>
        </strong>
        <small>القرآن · علم · حقيقة</small>
      </div>
    </Link>
  )
}
