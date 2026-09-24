import { NextResponse } from 'next/server'

export async function GET() {
  const spec = {
    openapi: '3.1.0',
    info: {
      title: 'QuranMind Public REST API',
      version: '1.0.0',
      description: 'Production OpenAPI 3.1 Specification for Quranic Text, Morphology, Roots, Hadith Mustalah Breadth, Corroboration Detection, and Matn Diffing.',
      contact: {
        name: 'QuranMind Academic Lab',
        url: 'https://quranmind.ai',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/v1',
        description: 'Local development server',
      },
      {
        url: 'https://api.quranmind.ai/v1',
        description: 'Production edge server',
      },
    ],
    paths: {
      '/quran/ayah': {
        get: {
          summary: 'Get Verse Details with Morphology & Abjad',
          parameters: [
            { name: 'surah', in: 'query', required: true, schema: { type: 'integer', default: 21 } },
            { name: 'ayah', in: 'query', required: true, schema: { type: 'integer', default: 33 } },
          ],
          responses: {
            '200': { description: 'Verse retrieved successfully' },
          },
        },
      },
      '/quran/search': {
        get: {
          summary: 'Full-text Search across all 6,236 Ayahs',
          parameters: [
            { name: 'q', in: 'query', required: true, schema: { type: 'string', example: 'فلك' } },
            { name: 'limit', in: 'query', required: false, schema: { type: 'integer', default: 20 } },
          ],
          responses: {
            '200': { description: 'Search results' },
          },
        },
      },
      '/hadith': {
        get: {
          summary: 'Get Hadiths with Breadth and Isnad Chains',
          parameters: [
            { name: 'id', in: 'query', required: false, schema: { type: 'string', example: 'bukhari-1' } },
            { name: 'collection', in: 'query', required: false, schema: { type: 'string' } },
          ],
          responses: {
            '200': { description: 'Hadiths retrieved' },
          },
        },
      },
      '/hadith/diff': {
        post: {
          summary: 'Word-level Matn Diffing between two narrations',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    textA: { type: 'string' },
                    textB: { type: 'string' },
                    sourceA: { type: 'string' },
                    sourceB: { type: 'string' },
                  },
                  required: ['textA', 'textB'],
                },
              },
            },
          },
          responses: {
            '200': { description: 'Matn diff comparison matrix' },
          },
        },
      },
      '/mustalah/breadth': {
        get: {
          summary: 'Classify Hadith Breadth (Mutawatir, Mashhur, Aziz, Gharib)',
          parameters: [
            { name: 'hadithId', in: 'query', required: true, schema: { type: 'string', default: 'bukhari-1' } },
          ],
          responses: {
            '200': { description: 'Breadth classification with tier counts' },
          },
        },
      },
      '/mustalah/corroboration': {
        get: {
          summary: 'Detect Corroboration (Mutabaat and Shawahid)',
          parameters: [
            { name: 'hadithId', in: 'query', required: true, schema: { type: 'string', default: 'bukhari-1' } },
          ],
          responses: {
            '200': { description: 'Parallel isnad chains and supporting shawahid' },
          },
        },
      },
    },
  }

  return NextResponse.json(spec)
}
