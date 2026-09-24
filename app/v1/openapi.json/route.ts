import { NextResponse } from 'next/server'

export async function GET() {
  const spec = {
    openapi: '3.1.0',
    info: {
      title: 'QuranMind & Ilm Public REST API',
      version: '1.0.0',
      description:
        'Public REST API for Quran, Hadith, Narrators, Isnad chains, Multi-Scholar Gradings, Word Morphology, Classical Books, Hybrid Search, and Streaming GraphRAG.',
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
    tags: [
      { name: 'Quran', description: 'Surahs, Ayahs, Word Morphology, Tafsir, and Reciters' },
      { name: 'Hadith', description: 'Canonical Collections, Hadiths, Isnad Chains, and Multi-Scholar Gradings' },
      { name: 'Narrators', description: 'Biographical Narrator Registry and Chain Paths' },
      { name: 'Isnad', description: 'Isnad Graph Search and Connection Discovery' },
      { name: 'Families', description: 'Hadith Meaning Families and Shawahid Corroboration' },
      { name: 'Mustalah', description: 'Breadth Classification (Mutawatir, Mashhur, Aziz, Gharib) and Stats' },
      { name: 'Books', description: 'Classical Reference Works and Shamela Pages' },
      { name: 'Search', description: 'Full-Text and Hybrid Search across Quran and Hadith' },
      { name: 'Ask', description: 'Streaming AI Research Assistant (Server-Sent Events)' },
      { name: 'Meta', description: 'System Configuration and Corpus Statistics' },
    ],
    paths: {
      '/quran/surahs': {
        get: {
          tags: ['Quran'],
          summary: 'List all 114 Surahs',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 114 } },
          ],
          responses: { '200': { description: 'List of surahs with revelation types and ayah counts' } },
        },
      },
      '/quran/surahs/{n}': {
        get: {
          tags: ['Quran'],
          summary: 'Get Surah Details and Full Verse Text',
          parameters: [
            { name: 'n', in: 'path', required: true, schema: { type: 'integer', example: 1 } },
          ],
          responses: { '200': { description: 'Surah metadata and array of ayahs' } },
        },
      },
      '/quran/meta': {
        get: {
          tags: ['Quran'],
          summary: 'Quran Corpus Statistics and Overview',
          responses: { '200': { description: 'Total surahs, ayahs, and revelation breakdown' } },
        },
      },
      '/quran/ayahs': {
        get: {
          tags: ['Quran'],
          summary: 'Paginated Ayahs Lookup',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'surah', in: 'query', schema: { type: 'integer' } },
          ],
          responses: { '200': { description: 'Paginated list of Quranic verses' } },
        },
      },
      '/quran/ayahs/{s}/{a}/words': {
        get: {
          tags: ['Quran'],
          summary: 'Word-by-word Morphology for a Verse',
          parameters: [
            { name: 's', in: 'path', required: true, schema: { type: 'integer', example: 2 } },
            { name: 'a', in: 'path', required: true, schema: { type: 'integer', example: 255 } },
          ],
          responses: { '200': { description: 'Array of word tokens with clean root, lemma, and abjad' } },
        },
      },
      '/quran/ayahs/{s}/{a}/similar': {
        get: {
          tags: ['Quran'],
          summary: 'Find Similar Verses (Mutashabihat)',
          parameters: [
            { name: 's', in: 'path', required: true, schema: { type: 'integer', example: 21 } },
            { name: 'a', in: 'path', required: true, schema: { type: 'integer', example: 33 } },
          ],
          responses: { '200': { description: 'Matching verses with lexical overlap score' } },
        },
      },
      '/quran/ayahs/{s}/{a}/tafsir': {
        get: {
          tags: ['Quran'],
          summary: 'Classical Tafsir for an Ayah',
          parameters: [
            { name: 's', in: 'path', required: true, schema: { type: 'integer', example: 36 } },
            { name: 'a', in: 'path', required: true, schema: { type: 'integer', example: 40 } },
          ],
          responses: { '200': { description: 'Tafsir Ibn Kathir, Jalalayn, and scientific notes' } },
        },
      },
      '/quran/ayahs/{s}/{a}/hadiths': {
        get: {
          tags: ['Quran'],
          summary: 'Related Hadith Citations for an Ayah',
          parameters: [
            { name: 's', in: 'path', required: true, schema: { type: 'integer', example: 36 } },
            { name: 'a', in: 'path', required: true, schema: { type: 'integer', example: 40 } },
          ],
          responses: { '200': { description: 'Hadith citations explaining or linked to this ayah' } },
        },
      },
      '/quran/reciters': {
        get: {
          tags: ['Quran'],
          summary: 'Available Audio Reciters and CDN Audio URLs',
          responses: { '200': { description: 'Reciters list with bitrate and styles' } },
        },
      },
      '/collections': {
        get: {
          tags: ['Hadith'],
          summary: 'List Canonical Hadith Collections',
          responses: { '200': { description: 'List of Kutub al-Sittah and secondary books' } },
        },
      },
      '/hadiths': {
        get: {
          tags: ['Hadith'],
          summary: 'List Hadiths with Filters and Breadth',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'collection', in: 'query', schema: { type: 'string', example: 'bukhari' } },
          ],
          responses: { '200': { description: 'Paginated hadith entries' } },
        },
      },
      '/hadiths/{id}': {
        get: {
          tags: ['Hadith'],
          summary: 'Get Hadith by Slug (e.g. bukhari:1, muslim:42)',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', example: 'bukhari:1' } },
          ],
          responses: { '200': { description: 'Hadith matn, isnad, and breadth classification' } },
        },
      },
      '/hadiths/{id}/chain': {
        get: {
          tags: ['Hadith'],
          summary: 'Get Isnad Graph Nodes and Links',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', example: 'bukhari:1' } },
          ],
          responses: { '200': { description: 'Isnad network nodes and transmission links' } },
        },
      },
      '/hadiths/{id}/gradings': {
        get: {
          tags: ['Hadith'],
          summary: 'Multi-Scholar Evaluation & Gradings',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', example: 'abudawud:1' } },
          ],
          responses: { '200': { description: 'Scholar verdicts with source books and page indexes' } },
        },
      },
      '/hadiths/diff': {
        post: {
          tags: ['Hadith'],
          summary: 'Word-Level Matn Diffing Between Two Narrations',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    textA: { type: 'string' },
                    textB: { type: 'string' },
                  },
                  required: ['textA', 'textB'],
                },
              },
            },
          },
          responses: { '200': { description: 'Diff matrix highlighting additions, omissions, and substitutions' } },
        },
      },
      '/scholars': {
        get: {
          tags: ['Hadith'],
          summary: 'List Classical Hadith Critics and Scholars',
          responses: { '200': { description: 'List of hadith grading scholars' } },
        },
      },
      '/narrators': {
        get: {
          tags: ['Narrators'],
          summary: 'Search Narrator Registry',
          parameters: [
            { name: 'q', in: 'query', schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          ],
          responses: { '200': { description: 'Paginated list of narrators' } },
        },
      },
      '/narrators/{id}': {
        get: {
          tags: ['Narrators'],
          summary: 'Narrator Biographical Profile and Transmissions',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', example: 'umar_ibn_khattab' } },
          ],
          responses: { '200': { description: 'Narrator reliability, generation, and related hadiths' } },
        },
      },
      '/isnad/search': {
        post: {
          tags: ['Isnad'],
          summary: 'Search Isnad Transmission Paths',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    from_narrator: { type: 'string' },
                    to_narrator: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { '200': { description: 'Matching transmission chains' } },
        },
      },
      '/families': {
        get: {
          tags: ['Families'],
          summary: 'List Hadith Semantic Families',
          responses: { '200': { description: 'Clusters of related narrations and mutabaat' } },
        },
      },
      '/families/{id}': {
        get: {
          tags: ['Families'],
          summary: 'Hadith Family Details',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', example: 'fam-niyyah' } },
          ],
          responses: { '200': { description: 'Family details and member hadiths' } },
        },
      },
      '/families/{id}/mustalah': {
        get: {
          tags: ['Families', 'Mustalah'],
          summary: 'Mustalah Analysis for a Hadith Family',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', example: 'fam-niyyah' } },
          ],
          responses: { '200': { description: 'Mutabaat, shawahid, and tier counts' } },
        },
      },
      '/mustalah/stats': {
        get: {
          tags: ['Mustalah'],
          summary: 'Global Mustalah Corpus Statistics',
          responses: { '200': { description: 'Breadth distribution and isnad counts' } },
        },
      },
      '/books': {
        get: {
          tags: ['Books'],
          summary: 'List Classical Islamic Reference Books',
          parameters: [
            { name: 'category', in: 'query', schema: { type: 'string', example: 'hadith_grading' } },
          ],
          responses: { '200': { description: 'List of classical works' } },
        },
      },
      '/books/{id}': {
        get: {
          tags: ['Books'],
          summary: 'Get Book Details',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 104 } },
          ],
          responses: { '200': { description: 'Book metadata and Shamela ID' } },
        },
      },
      '/books/{id}/pages': {
        get: {
          tags: ['Books'],
          summary: 'Fetch Book Pages by Index',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 104 } },
            { name: 'start', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'size', in: 'query', schema: { type: 'integer', default: 1 } },
          ],
          responses: { '200': { description: 'Original Arabic page text' } },
        },
      },
      '/search/all': {
        get: {
          tags: ['Search'],
          summary: 'Hybrid Search across Quran and Hadith',
          parameters: [
            { name: 'q', in: 'query', required: true, schema: { type: 'string', example: 'patience' } },
            { name: 'type', in: 'query', schema: { type: 'string', default: 'hybrid' } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 5 } },
          ],
          responses: { '200': { description: 'Results grouped with quran_count and hadith_count' } },
        },
      },
      '/search/quran': {
        get: {
          tags: ['Search'],
          summary: 'Search Quranic Verses',
          parameters: [
            { name: 'q', in: 'query', required: true, schema: { type: 'string', example: 'فلك' } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          ],
          responses: { '200': { description: 'Matching ayahs with text and translation' } },
        },
      },
      '/search/hadith': {
        get: {
          tags: ['Search'],
          summary: 'Search Hadith Matn and Narrators',
          parameters: [
            { name: 'q', in: 'query', required: true, schema: { type: 'string', example: 'نية' } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          ],
          responses: { '200': { description: 'Matching hadiths' } },
        },
      },
      '/ask/{target}': {
        post: {
          tags: ['Ask'],
          summary: 'Streaming Q&A Assistant via Server-Sent Events',
          parameters: [
            { name: 'target', in: 'path', required: true, schema: { type: 'string', enum: ['quran', 'hadith', 'all', 'tafsir'], default: 'quran' } },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    question: { type: 'string', example: 'What does the Quran say about gratitude?' },
                  },
                  required: ['question'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'SSE stream sending sources, token deltas, and completion marker',
              content: { 'text/event-stream': {} },
            },
          },
        },
      },
      '/config': {
        get: {
          tags: ['Meta'],
          summary: 'API Configuration, Rate Limits, and Conventions',
          responses: { '200': { description: 'Base URL, rate limits, and slug conventions' } },
        },
      },
      '/stats': {
        get: {
          tags: ['Meta'],
          summary: 'Overall Corpus and Database Counts',
          responses: { '200': { description: 'Total ayahs, hadiths, narrators, and books' } },
        },
      },
    },
  }

  return NextResponse.json(spec)
}
