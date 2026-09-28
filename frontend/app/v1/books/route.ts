import { NextRequest, NextResponse } from 'next/server'

export const CLASSICAL_BOOKS = [
  {
    id: 1,
    name_ar: 'الجامع المسند الصحيح المختصر (صحيح البخاري)',
    name_en: 'Sahih al-Bukhari',
    author: 'محمد بن إسماعيل البخاري',
    category: 'hadith_corpus',
    total_pages: 1820,
    shamela_id: 11847,
  },
  {
    id: 2,
    name_ar: 'المسند الصحيح (صحيح مسلم)',
    name_en: 'Sahih Muslim',
    author: 'مسلم بن الحجاج النيسابوري',
    category: 'hadith_corpus',
    total_pages: 1640,
    shamela_id: 1727,
  },
  {
    id: 104,
    name_ar: 'فتح الباري بشرح صحيح البخاري',
    name_en: 'Fath al-Bari',
    author: 'ابن حجر العسقلاني',
    category: 'hadith_grading',
    total_pages: 5800,
    shamela_id: 23647,
  },
  {
    id: 201,
    name_ar: 'سير أعلام النبلاء',
    name_en: 'Siyar A`lam al-Nubala',
    author: 'شمس الدين الذهبي',
    category: 'hadith_grading',
    total_pages: 11200,
    shamela_id: 10965,
  },
  {
    id: 305,
    name_ar: 'سلسلة الأحاديث الصحيحة',
    name_en: 'Silsilat al-Ahadith al-Sahiha',
    author: 'محمد ناصر الدين الألباني',
    category: 'hadith_grading',
    total_pages: 4200,
    shamela_id: 9789,
  },
  {
    id: 401,
    name_ar: 'تفسير القرآن العظيم',
    name_en: 'Tafsir Ibn Kathir',
    author: 'إسماعيل بن عمر بن كثير',
    category: 'tafsir',
    total_pages: 3400,
    shamela_id: 23644,
  },
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')

  let books = CLASSICAL_BOOKS
  if (category) {
    books = books.filter((b) => b.category === category)
  }

  // API.md curl example: curl 'http://localhost:3000/v1/books?category=hadith_grading' | jq '.[].name_en'
  return NextResponse.json(books)
}
