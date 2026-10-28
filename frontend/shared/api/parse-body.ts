import { NextRequest } from 'next/server'

export type ValidationSchema<T> = {
  safeParse?: (data: unknown) =>
    | { success: true; data: T }
    | { success: false; error: { errors: Array<{ message: string; path?: (string | number)[] }> } }
  parse?: (data: unknown) => T
}

export type ParseBodyResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function parseBody<T = unknown>(
  req: NextRequest,
  schema?: ValidationSchema<T>
): Promise<ParseBodyResult<T>> {
  try {
    const raw = await req.json()
    if (!schema) {
      return { success: true, data: raw as T }
    }
    if (schema.safeParse) {
      const result = schema.safeParse(raw)
      if (result.success) return { success: true, data: result.data }
      const firstError = result.error.errors?.[0]
      const msg = firstError?.message || 'بيانات الطلب غير صالحة'
      return { success: false, error: msg }
    }
    if (schema.parse) {
      const data = schema.parse(raw)
      return { success: true, data }
    }
    return { success: true, data: raw as T }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'تعذر قراءة بيانات الطلب (JSON)'
    return { success: false, error: msg }
  }
}
