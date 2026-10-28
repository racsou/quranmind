import { NextResponse } from 'next/server'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  code?: string
}

export const respond = {
  ok<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
    return NextResponse.json({ success: true, data }, { status })
  },
  fail(error: string, status = 400, code?: string): NextResponse<ApiResponse<never>> {
    return NextResponse.json(
      { success: false, error, ...(code ? { code } : {}) },
      { status }
    )
  },
}
