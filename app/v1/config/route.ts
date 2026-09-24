import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    version: '1.0',
    base_url: 'http://localhost:3000/v1',
    auth_required: false,
    rate_limits: {
      read_endpoints: '60 req/min/IP',
      ask_endpoints: '10 req/min/IP',
    },
    id_conventions: {
      hadith: '{collection_code}:{number} (e.g. bukhari:1, muslim:42)',
      quran: '/v1/quran/ayahs/{surah}/{ayah}',
    },
    interactive_docs: '/docs',
    openapi_spec: '/v1/openapi.json',
  })
}
