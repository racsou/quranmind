import { NextRequest, NextResponse } from 'next/server'
import { CLASSICAL_BOOKS } from '../../route'

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

  const { searchParams } = new URL(req.url)
  const start = parseInt(searchParams.get('start') || '1', 10)
  const size = parseInt(searchParams.get('size') || '1', 10)

  const pages = []
  for (let i = 0; i < size; i++) {
    const pageNum = start + i
    pages.push({
      book_id: book.id,
      page_index: pageNum,
      book_name_ar: book.name_ar,
      author: book.author,
      content_ar: `نص الصفحة رقم ${pageNum} من كتاب ${book.name_ar} للعلامة ${book.author} رحمه الله، محققاً ومقابلاً على النسخ المعتمدة في التراث الإسلامي.`,
    })
  }

  return NextResponse.json({
    book_id: book.id,
    start,
    size,
    pages,
  })
}
