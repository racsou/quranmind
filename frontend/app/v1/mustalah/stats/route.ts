import { NextResponse } from 'next/server'
import { HADITH_CORPUS } from '@/lib/hadith/mustalah-engine'

export async function GET() {
  const breadthCounts = {
    mutawatir: HADITH_CORPUS.filter((h) => h.breadth === 'mutawatir').length,
    mashhur: HADITH_CORPUS.filter((h) => h.breadth === 'mashhur').length,
    aziz: HADITH_CORPUS.filter((h) => h.breadth === 'aziz').length,
    gharib: HADITH_CORPUS.filter((h) => h.breadth === 'gharib').length,
  }

  const totalChains = HADITH_CORPUS.reduce((acc, h) => acc + h.chains.length, 0)

  return NextResponse.json({
    total_hadiths_analyzed: HADITH_CORPUS.length,
    total_isnad_chains: totalChains,
    breadth_distribution: breadthCounts,
    methodology: 'Ibn Hajar Nukhbat al-Fikar & Classical Hadith Sciences',
  })
}
