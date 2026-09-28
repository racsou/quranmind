import { NextRequest, NextResponse } from 'next/server'
import { classifyHadithBreadth, HADITH_CORPUS } from '@/lib/hadith/mustalah-engine'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const hadithId = searchParams.get('hadithId') || 'bukhari-1'

  const hadith = HADITH_CORPUS.find((h) => h.id === hadithId)
  if (!hadith) {
    return NextResponse.json({ success: false, error: 'Hadith not found' }, { status: 404 })
  }

  const breadthInfo = classifyHadithBreadth(hadithId)

  return NextResponse.json({
    success: true,
    version: '1.0',
    hadithId,
    hadithNumber: hadith.number,
    collection: hadith.collection,
    primaryNarrator: hadith.primaryNarrator,
    data: {
      classification: breadthInfo.breadth,
      title: breadthInfo.title,
      arabicTerm: breadthInfo.arabicTerm,
      minNarratorsInTier: breadthInfo.minTierCount,
      explanation: breadthInfo.description,
      chainBreakdown: hadith.chains.map((c) => ({
        chainId: c.chainId,
        isnadGrade: c.isnadGrade,
        narratorPath: c.narratorPath.map((n) => `${n.arabicName} (${n.reliability})`),
      })),
    },
  })
}
