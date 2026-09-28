import { NextRequest, NextResponse } from 'next/server'
import { FAMILIES } from '../../route'
import { detectCorroboration, classifyHadithBreadth } from '@/lib/hadith/mustalah-engine'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const family = FAMILIES.find((f) => f.id.toLowerCase() === id.toLowerCase())

  if (!family) {
    return NextResponse.json(
      { code: 'NOT_FOUND', message: `Hadith Family '${id}' not found.` },
      { status: 404 }
    )
  }

  const primaryHadithId = family.hadiths[0].replace(':', '-')
  const breadthResult = classifyHadithBreadth(primaryHadithId)
  const corroboration = detectCorroboration(primaryHadithId)

  return NextResponse.json({
    family_id: family.id,
    breadth: breadthResult?.breadth || family.breadth,
    breadth_explanation: breadthResult?.description,
    tier_counts: breadthResult?.minTierCount,
    corroboration: {
      mutabaat: corroboration.mutabaat,
      shawahid: corroboration.shawahid,
      overall_strength: corroboration.corroborationStrength,
      summary: corroboration.scholarlyVerdict,
    },
  })
}
