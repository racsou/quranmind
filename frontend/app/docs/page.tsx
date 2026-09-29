import type { Metadata } from 'next'
import { ApiDocsView } from '@/components/api-docs-view'

export const metadata: Metadata = {
  title: 'QuranMind REST API Documentation | توثيق الواجهة البرمجية',
  description:
    'Comprehensive API reference, interactive explorer, and SDK guides for Quran, Hadith, Narrators, Isnad graphs, and Classical Books.',
}

export default function DocsPage() {
  return <ApiDocsView />
}
