import { NextRequest, NextResponse } from 'next/server'
import { CLASSICAL_BOOKS } from '../route'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const bookId = parseInt(id, 10)
  const book = CLASSICAL_BOOKS.find((b) => b.id === bookId)

  if (!book) {
    return NextResponse.json(
      { code: 'NOT_FOUND', message: `Book with ID ${id} not found.` },
      { status: 404 }
    )
  }

  return NextResponse.json(book)
}
