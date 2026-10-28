'use client'

import React from 'react'
import { Search } from 'lucide-react'

interface TopbarSearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function TopbarSearchInput({ value, onChange }: TopbarSearchInputProps) {
  return (
    <div className="exact-search">
      <Search />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="إبحث في الآيات، الكلمات، التحليلات، أو الأحاديث والمصطلح..."
      />
    </div>
  )
}
