'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Search,
  Copy,
  Check,
  ExternalLink,
  Code,
  Terminal,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Activity,
  FileCode,
  Download,
  RefreshCw,
  Play,
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
  Zap,
  Database,
  Network,
  LibraryBig,
  Globe,
  Sliders,
  CheckCircle2,
  Layers,
  FileText,
  Send,
  Hash,
  Filter,
  Server,
  Clock,
  Key,
  AlertCircle,
  Info,
  ListTree,
  FolderKanban,
  UserCheck,
  Languages,
} from 'lucide-react'

export interface ApiParam {
  name: string
  in: 'path' | 'query' | 'header' | 'body'
  type: string
  required?: boolean
  defaultVal?: string
  description: string
  example?: string
}

export interface ApiEndpoint {
  id: string
  category: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  title: string
  titleAr: string
  desc: string
  descAr?: string
  params?: ApiParam[]
  requestBody?: string
  curlExample: string
  jsExample: string
  pythonExample: string
  responseExample: string
  testUrl: string
  isStreaming?: boolean
}

export interface ApiCategory {
  id: string
  label: string
  labelAr: string
  icon: React.ComponentType<{ className?: string }>
  desc: string
  badgeColor?: string
}

const CATEGORIES: ApiCategory[] = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    labelAr: 'البداية السريعة والأساسيات',
    icon: Zap,
    desc: 'Core architecture, Base URLs, Rate Limits, and SDK generation.',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
  {
    id: 'quran',
    label: 'Quranic Corpus',
    labelAr: 'القرآن الكريم والتحليل الصرفي',
    icon: BookOpen,
    desc: 'Surahs, verses, word morphology, tafsir, similarities, and audio.',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  },
  {
    id: 'hadith',
    label: 'Hadith & Sunnah',
    labelAr: 'الحديث الشريف ودواوين السنة',
    icon: FileText,
    desc: 'Canonical collections, matn search, isnad chains, and scholar gradings.',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  {
    id: 'narrators',
    label: 'Narrators & Isnad',
    labelAr: 'الرواة وشبكات الإسناد',
    icon: Network,
    desc: 'Biographical dictionary, transmitter networks, and isnad pathfinder.',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  },
  {
    id: 'mustalah',
    label: 'Families & Mustalah',
    labelAr: 'العوائل ومصطلح الحديث',
    icon: ListTree,
    desc: 'Semantic clusters, mutabaat, shawahid, and breadth analysis.',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  },
  {
    id: 'books',
    label: 'Classical Library',
    labelAr: 'المكتبة الإسلامية وكتب التراث',
    icon: LibraryBig,
    desc: 'Digitized classical source texts and Shamela reference pages.',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  },
  {
    id: 'search',
    label: 'Hybrid Search',
    labelAr: 'محرك البحث الهجين والمتزامن',
    icon: Search,
    desc: 'Cross-corpus unified search across Quran and Hadith.',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  },
  {
    id: 'ask',
    label: 'AI Research Agent',
    labelAr: 'الوكيل الذكي والبحث المتقدم',
    icon: Sparkles,
    desc: 'Streaming Server-Sent Events (SSE) research assistant via GraphRAG.',
    badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
  },
  {
    id: 'meta',
    label: 'System & Config',
    labelAr: 'إعدادات النظام ومواصفة OpenAPI',
    icon: Sliders,
    desc: 'API status, rate conventions, corpus stats, and OpenAPI spec.',
    badgeColor: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
  },
  {
    id: 'backend',
    label: 'Backend Services',
    labelAr: 'خدمات السيرفر والمشاريع البحثية',
    icon: Server,
    desc: 'Microservices health check, research projects, and researcher profiles.',
    badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  },
]

const ENDPOINTS: ApiEndpoint[] = [
  // ================= QURAN =================
  {
    id: 'quran-surahs',
    category: 'quran',
    method: 'GET',
    path: '/v1/quran/surahs',
    title: 'List all 114 Surahs',
    titleAr: 'قائمة سور القرآن الكريم الـ 114',
    desc: 'Returns a paginated or complete directory of all 114 Surahs with revelation classification, Arabic name, English transliteration, and ayah count.',
    descAr: 'استرجاع دليل شامل لجميع سور القرآن الكريم مع تحديد نوع النزول (مكية/مدنية) وعدد الآيات.',
    params: [
      { name: 'page', in: 'query', type: 'integer', defaultVal: '1', description: 'Page number for pagination (1-indexed).' },
      { name: 'limit', in: 'query', type: 'integer', defaultVal: '114', description: 'Number of surahs per page.' },
    ],
    curlExample: `curl -X GET "http://localhost:3000/v1/quran/surahs?limit=5" \\
  -H "Accept: application/json"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/quran/surahs?limit=5');
const data = await res.json();
console.log(data);`,
    pythonExample: `import requests

res = requests.get('http://localhost:3000/v1/quran/surahs', params={'limit': 5})
print(res.json())`,
    responseExample: `{
  "data": [
    {
      "number": 1,
      "name_ar": "الفاتحة",
      "name_en": "Al-Fatihah",
      "name_translation": "The Opening",
      "ayahs_count": 7,
      "revelation_type": "meccan"
    },
    {
      "number": 2,
      "name_ar": "البقرة",
      "name_en": "Al-Baqarah",
      "name_translation": "The Cow",
      "ayahs_count": 286,
      "revelation_type": "medinan"
    }
  ],
  "page": 1,
  "limit": 5,
  "total": 114,
  "has_more": true
}`,
    testUrl: '/v1/quran/surahs?limit=3',
  },
  {
    id: 'quran-surah-detail',
    category: 'quran',
    method: 'GET',
    path: '/v1/quran/surahs/{n}',
    title: 'Get Surah Details & Verse Array',
    titleAr: 'استعلام السورة بجميع آياتها وبياناتها',
    desc: 'Fetches complete surah metadata and an ordered array of verses with Arabic text, transliteration, English translation, and revelation order.',
    descAr: 'جلب بيانات السورة الكاملة مع مصفوفة الآيات بنصها القرآني والترجمة والتصنيف.',
    params: [
      { name: 'n', in: 'path', type: 'integer', required: true, example: '1', description: 'Surah index number (1 to 114).' },
    ],
    curlExample: `curl -X GET "http://localhost:3000/v1/quran/surahs/1" \\
  -H "Accept: application/json"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/quran/surahs/1');
const surah = await res.json();
console.log(surah.surah.name_en, surah.ayahs.length);`,
    pythonExample: `import requests

res = requests.get('http://localhost:3000/v1/quran/surahs/1')
surah = res.json()
print(surah['surah']['name_en'], len(surah['ayahs']))`,
    responseExample: `{
  "surah": {
    "number": 1,
    "name_ar": "الفاتحة",
    "name_en": "Al-Fatihah",
    "name_translation": "The Opening",
    "ayahs_count": 7,
    "revelation_type": "meccan"
  },
  "ayahs": [
    {
      "ayah_number": 1,
      "text_ar": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "text_en": "In the name of Allah, the Entirely Merciful, the Especially Merciful."
    },
    {
      "ayah_number": 2,
      "text_ar": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      "text_en": "[All] praise is [due] to Allah, Lord of the worlds -"
    }
  ]
}`,
    testUrl: '/v1/quran/surahs/1',
  },
  {
    id: 'quran-meta',
    category: 'quran',
    method: 'GET',
    path: '/v1/quran/meta',
    title: 'Corpus Statistics & Overview',
    titleAr: 'إحصائيات وخصائص مجمل المصحف الشريف',
    desc: 'Returns global metrics for the Quranic text: total surahs, ayahs, Meccan vs Medinan breakdown, word counts, and structural index.',
    descAr: 'إحصائيات مجمل القرآن الكريم من أعداد السور والآيات وتوزيع المكي والمدني.',
    curlExample: `curl -X GET "http://localhost:3000/v1/quran/meta"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/quran/meta');
const meta = await res.json();
console.log(meta);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/quran/meta')
print(res.json())`,
    responseExample: `{
  "total_surahs": 114,
  "total_ayahs": 6236,
  "meccan_surahs": 86,
  "medinan_surahs": 28,
  "standard": "Kufic / Hafs 'an 'Asim",
  "version": "1.0"
}`,
    testUrl: '/v1/quran/meta',
  },
  {
    id: 'quran-ayahs',
    category: 'quran',
    method: 'GET',
    path: '/v1/quran/ayahs',
    title: 'Paginated Ayahs Lookup',
    titleAr: 'استعراض الآيات القرآنية بالصفحات والفلترة',
    desc: 'Browse verses across the Quran with optional filtering by Surah number, pagination control, and full verse details.',
    descAr: 'استعراض الآيات مع الفلترة بالسورة وخيارات التصفح.',
    params: [
      { name: 'page', in: 'query', type: 'integer', defaultVal: '1', description: 'Page number (1-indexed).' },
      { name: 'limit', in: 'query', type: 'integer', defaultVal: '20', description: 'Maximum verses per page.' },
      { name: 'surah', in: 'query', type: 'integer', description: 'Filter verses belonging to a specific surah number.' },
    ],
    curlExample: `curl -X GET "http://localhost:3000/v1/quran/ayahs?surah=1&limit=7"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/quran/ayahs?surah=1&limit=7');
const ayahs = await res.json();
console.log(ayahs);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/quran/ayahs', params={'surah': 1, 'limit': 7})
print(res.json())`,
    responseExample: `{
  "data": [
    {
      "surah": 1,
      "ayah": 1,
      "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "translation": "In the name of Allah, the Entirely Merciful, the Especially Merciful."
    }
  ],
  "page": 1,
  "limit": 7,
  "total": 7,
  "has_more": false
}`,
    testUrl: '/v1/quran/ayahs?surah=1&limit=7',
  },
  {
    id: 'quran-ayah-words',
    category: 'quran',
    method: 'GET',
    path: '/v1/quran/ayahs/{s}/{a}/words',
    title: 'Word Morphology & Abjad Weights',
    titleAr: 'التحليل الصرفي كلمة بكلمة وحساب الجمل',
    desc: 'Detailed word-level tokenization for a given verse. Provides root, lemma, grammatical part-of-speech, and individual Abjad (حساب الجمل الكبير) numerical weight.',
    descAr: 'التحليل المعجمي والصرفي للكلمات مع حساب الجمل والقيمة العددية لكل كلمة وجذرها.',
    params: [
      { name: 's', in: 'path', type: 'integer', required: true, example: '2', description: 'Surah number (e.g. 2 for Al-Baqarah).' },
      { name: 'a', in: 'path', type: 'integer', required: true, example: '255', description: 'Ayah number (e.g. 255 for Ayat al-Kursi).' },
    ],
    curlExample: `curl -X GET "http://localhost:3000/v1/quran/ayahs/2/255/words" | jq '.[0]'`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/quran/ayahs/2/255/words');
const words = await res.json();
console.log(words[0]);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/quran/ayahs/2/255/words')
print(res.json()[0])`,
    responseExample: `[
  {
    "position": 1,
    "word": "اللَّهُ",
    "clean": "الله",
    "root": "اله",
    "abjad_value": 66,
    "letters_count": 4,
    "type": "proper_noun"
  },
  {
    "position": 2,
    "word": "لَا",
    "clean": "لا",
    "root": "لا",
    "abjad_value": 31,
    "letters_count": 2,
    "type": "particle"
  }
]`,
    testUrl: '/v1/quran/ayahs/2/255/words',
  },
  {
    id: 'quran-ayah-similar',
    category: 'quran',
    method: 'GET',
    path: '/v1/quran/ayahs/{s}/{a}/similar',
    title: 'Similar Verses (Mutashabihat)',
    titleAr: 'الآيات المتشابهة لفظياً وبنائياً (المتشابهات)',
    desc: 'Discovers lexically and syntactically parallel verses across the Quran, returning similarity scores and matching substrings.',
    descAr: 'استخراج المتشابهات اللفظية والتركيبية في القرآن مع نسب التطابق والشواهد.',
    params: [
      { name: 's', in: 'path', type: 'integer', required: true, example: '36', description: 'Surah number (e.g. 36 for Ya-Sin).' },
      { name: 'a', in: 'path', type: 'integer', required: true, example: '40', description: 'Ayah number.' },
    ],
    curlExample: `curl -X GET "http://localhost:3000/v1/quran/ayahs/36/40/similar"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/quran/ayahs/36/40/similar');
const matches = await res.json();
console.log(matches);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/quran/ayahs/36/40/similar')
print(res.json())`,
    responseExample: `{
  "source_verse": "36:40",
  "similar_verses": [
    {
      "surah": 21,
      "ayah": 33,
      "text": "وَهُوَ الَّذِي خَلَقَ اللَّيْلَ وَالنَّهَارَ وَالشَّمْسَ وَالْقَمَرَ كُلٌّ فِي فَلَكٍ يَسْبَحُونَ",
      "similarity_score": 0.88,
      "shared_phrases": ["وَالشَّمْسَ وَالْقَمَرَ", "كُلٌّ فِي فَلَكٍ يَسْبَحُونَ"]
    }
  ]
}`,
    testUrl: '/v1/quran/ayahs/36/40/similar',
  },
  {
    id: 'quran-ayah-tafsir',
    category: 'quran',
    method: 'GET',
    path: '/v1/quran/ayahs/{s}/{a}/tafsir',
    title: 'Classical Tafsir & Scientific Notes',
    titleAr: 'التفاسير المعتمدة والملاحظات العلمية للآية',
    desc: 'Returns classical exegetical commentaries (e.g. Tafsir Ibn Kathir, al-Jalalayn, al-Tabari) alongside modern scientific correlation notes.',
    descAr: 'عرض تفسير ابن كثير والجلالين مع الملاحظات العلمية والربط الإبستيمي.',
    params: [
      { name: 's', in: 'path', type: 'integer', required: true, example: '21', description: 'Surah number.' },
      { name: 'a', in: 'path', type: 'integer', required: true, example: '33', description: 'Ayah number.' },
    ],
    curlExample: `curl -X GET "http://localhost:3000/v1/quran/ayahs/21/33/tafsir"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/quran/ayahs/21/33/tafsir');
const tafsir = await res.json();
console.log(tafsir);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/quran/ayahs/21/33/tafsir')
print(res.json())`,
    responseExample: `{
  "surah": 21,
  "ayah": 33,
  "tafsir_ibn_kathir": "يقول تعالى مذكراً بقدرته التامة على خلقه... ومعنى في فلك يسبحون أي يدورون.",
  "tafsir_jalalayn": "كُلٌّ تنوينه عوض عن المضاف إليه، أي كل من الشمس والقمر والنجوم في فلك مستدير.",
  "scientific_notes": "تناسق لفظي وبصري مع مفهوم المدارات الفلكية المغلقة والتناظر التام في جملة (كل في فلك)."
}`,
    testUrl: '/v1/quran/ayahs/21/33/tafsir',
  },
  {
    id: 'quran-ayah-hadiths',
    category: 'quran',
    method: 'GET',
    path: '/v1/quran/ayahs/{s}/{a}/hadiths',
    title: 'Related Hadith Citations',
    titleAr: 'الأحاديث النبوية المفسرة للآية أو الشاهدة لها',
    desc: 'Extracts authenticated prophetic traditions linked to the revelation reasons (Asbab al-Nuzul) or direct exegesis of the verse.',
    descAr: 'الأحاديث النبوية الصحيحة المروية في أسباب النزول وتفسير الآية.',
    params: [
      { name: 's', in: 'path', type: 'integer', required: true, example: '36', description: 'Surah number.' },
      { name: 'a', in: 'path', type: 'integer', required: true, example: '40', description: 'Ayah number.' },
    ],
    curlExample: `curl -X GET "http://localhost:3000/v1/quran/ayahs/36/40/hadiths"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/quran/ayahs/36/40/hadiths');
const hadiths = await res.json();
console.log(hadiths);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/quran/ayahs/36/40/hadiths')
print(res.json())`,
    responseExample: `{
  "surah": 36,
  "ayah": 40,
  "hadiths_count": 2,
  "hadiths": [
    {
      "id": "bukhari:3199",
      "collection": "Sahih al-Bukhari",
      "text": "عن أبي ذر رضي الله عنه قال: قال النبي صلى الله عليه وسلم لأبي ذر حين غربت الشمس: تدري أين تذهب؟...",
      "grade": "Sahih"
    }
  ]
}`,
    testUrl: '/v1/quran/ayahs/36/40/hadiths',
  },
  {
    id: 'quran-reciters',
    category: 'quran',
    method: 'GET',
    path: '/v1/quran/reciters',
    title: 'Audio Reciters & CDN Audio Streams',
    titleAr: 'القراء والتلاوات وروابط البث الصوتي',
    desc: 'Lists world-renowned reciters (e.g. Al-Afasy, Al-Husary, Al-Ghamdi, Abdulbasit), available riwayat (Hafs, Warsh), bitrates, and CDN audio endpoints.',
    descAr: 'قائمة القراء المعتمدين وروابط البث الصوتي بجودات متعددة وروايات حفص وورش.',
    curlExample: `curl -X GET "http://localhost:3000/v1/quran/reciters"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/quran/reciters');
const reciters = await res.json();
console.log(reciters);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/quran/reciters')
print(res.json())`,
    responseExample: `[
  {
    "id": "mishari_alafasy",
    "name_ar": "مشاري راشد العفاسي",
    "name_en": "Mishary Rashid Alafasy",
    "riwayah": "Hafs 'an 'Asim",
    "audio_server": "https://server8.mp3quran.net/afs/",
    "bitrate": "128kbps"
  },
  {
    "id": "mahmoud_alhusary",
    "name_ar": "محمود خليل الحصري",
    "name_en": "Mahmoud Khalil Al-Husary",
    "riwayah": "Murattal",
    "audio_server": "https://server13.mp3quran.net/husr/",
    "bitrate": "128kbps"
  }
]`,
    testUrl: '/v1/quran/reciters',
  },

  // ================= HADITH =================
  {
    id: 'hadith-collections',
    category: 'hadith',
    method: 'GET',
    path: '/v1/collections',
    title: 'Canonical Hadith Compendiums',
    titleAr: 'دواوين وكتب السنة النبوية المعتمدة',
    desc: 'Retrieves metadata for canonical collections: Kutub al-Tis\'ah (Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa\'i, Ibn Majah, Muwatta, Musnad Ahmad, Sunan al-Darimi).',
    descAr: 'قائمة كتب الحديث الستة والمسانيد المعتمدة مع تعريفاتها.',
    curlExample: `curl -X GET "http://localhost:3000/v1/collections"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/collections');
const collections = await res.json();
console.log(collections);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/collections')
print(res.json())`,
    responseExample: `[
  {
    "code": "bukhari",
    "name_ar": "صحيح البخاري",
    "name_en": "Sahih al-Bukhari",
    "author": "Muhammad ibn Isma'il al-Bukhari",
    "total_hadiths": 7563,
    "is_canonical": true
  },
  {
    "code": "muslim",
    "name_ar": "صحيح مسلم",
    "name_en": "Sahih Muslim",
    "author": "Muslim ibn al-Hajjaj",
    "total_hadiths": 7500,
    "is_canonical": true
  }
]`,
    testUrl: '/v1/collections',
  },
  {
    id: 'hadith-list',
    category: 'hadith',
    method: 'GET',
    path: '/v1/hadiths',
    title: 'List Hadiths with Filters & Breadth',
    titleAr: 'استعلام متون وأسانيد الأحاديث النبوية',
    desc: 'Paginated listing and search of hadith records. Supports filtering by collection slug, narrator, and breadth category (Mutawatir, Mashhur, Aziz, Gharib).',
    descAr: 'استعراض الأحاديث النبوية مع الفلترة حسب الكتاب أو الراوي ورتبة الاتساع.',
    params: [
      { name: 'page', in: 'query', type: 'integer', defaultVal: '1', description: 'Page number (1-indexed).' },
      { name: 'limit', in: 'query', type: 'integer', defaultVal: '20', description: 'Results per page.' },
      { name: 'collection', in: 'query', type: 'string', example: 'bukhari', description: 'Filter by collection code (e.g. bukhari, muslim).' },
    ],
    curlExample: `curl -X GET "http://localhost:3000/v1/hadiths?collection=bukhari&limit=2"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/hadiths?collection=bukhari&limit=2');
const data = await res.json();
console.log(data);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/hadiths', params={'collection': 'bukhari', 'limit': 2})
print(res.json())`,
    responseExample: `{
  "data": [
    {
      "id": "bukhari:1",
      "collection": "bukhari",
      "number": 1,
      "primary_narrator": "Umar ibn al-Khattab",
      "breadth": "gharib",
      "text_ar": "إنما الأعمال بالنيات وإنما لكل امرئ ما نوى...",
      "text_en": "Actions are but by intention, and every man shall have only that which he intended...",
      "themes": ["intention", "faith", "hijrah"],
      "chains_count": 4
    }
  ],
  "page": 1,
  "limit": 2,
  "total": 12,
  "has_more": true
}`,
    testUrl: '/v1/hadiths?collection=bukhari&limit=2',
  },
  {
    id: 'hadith-detail',
    category: 'hadith',
    method: 'GET',
    path: '/v1/hadiths/{id}',
    title: 'Get Hadith by Canonical Slug',
    titleAr: 'استعلام الحديث بالمعرّف الموحد الدائم',
    desc: 'Fetches full Arabic matn, English translation, primary narrator, transmission chains, and breadth grading for an exact slug (e.g. bukhari:1, muslim:42).',
    descAr: 'جلب متن الحديث الكامل وسلسلة رواته وتصنيفه بمعرفه الدائم.',
    params: [
      { name: 'id', in: 'path', type: 'string', required: true, example: 'bukhari:1', description: 'Canonical slug in format {collection}:{number}.' },
    ],
    curlExample: `curl -X GET "http://localhost:3000/v1/hadiths/bukhari:1" | jq '.hadith.text_en'`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/hadiths/bukhari:1');
const hadith = await res.json();
console.log(hadith);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/hadiths/bukhari:1')
print(res.json())`,
    responseExample: `{
  "hadith": {
    "id": "bukhari:1",
    "collection": "Sahih al-Bukhari",
    "number": 1,
    "primary_narrator": "عمر بن الخطاب",
    "breadth": "gharib",
    "text_ar": "سَمِعْتُ عُمَرَ بْنَ الخَطَّابِ رَضِيَ اللَّهُ عَنْهُ عَلَى المِنْبَرِ قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ...",
    "text_en": "I heard Allah's Messenger saying, 'The reward of deeds depends upon the intentions...'"
  }
}`,
    testUrl: '/v1/hadiths/bukhari:1',
  },
  {
    id: 'hadith-chain',
    category: 'hadith',
    method: 'GET',
    path: '/v1/hadiths/{id}/chain',
    title: 'Isnad Network Graph & Links',
    titleAr: 'شبكة مسالك الإسناد والعقد الرابطة للحديث',
    desc: 'Constructs graph nodes (narrators) and directed edges (hearing/transmission terms like حدثنا and عن) demonstrating the full transmission hierarchy.',
    descAr: 'شبكة الإسناد التفاعلية العقدية الموضحة لطرق الرواية ومصطلحات الأداء والتحمل.',
    params: [
      { name: 'id', in: 'path', type: 'string', required: true, example: 'bukhari:1', description: 'Hadith canonical slug.' },
    ],
    curlExample: `curl -X GET "http://localhost:3000/v1/hadiths/bukhari:1/chain" | jq '.nodes | length'`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/hadiths/bukhari:1/chain');
const graph = await res.json();
console.log('Total Narrator Nodes:', graph.nodes.length);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/hadiths/bukhari:1/chain')
graph = res.json()
print('Nodes:', len(graph['nodes']))`,
    responseExample: `{
  "hadith_id": "bukhari:1",
  "nodes": [
    { "id": "umar_ibn_khattab", "name": "عمر بن الخطاب", "tabaqah": 1, "tier": "sahabi" },
    { "id": "alqama_ibn_waqqas", "name": "علقمة بن وقاص الليثي", "tabaqah": 2, "tier": "thiqah" },
    { "id": "muhammad_ibn_ibrahim", "name": "محمد بن إبراهيم التيمي", "tabaqah": 3, "tier": "thiqah" },
    { "id": "yahya_ibn_said", "name": "يحيى بن سعيد الأنصاري", "tabaqah": 4, "tier": "thiqah_hafiz" }
  ],
  "links": [
    { "source": "yahya_ibn_said", "target": "muhammad_ibn_ibrahim", "term": "سمع" },
    { "source": "muhammad_ibn_ibrahim", "target": "alqama_ibn_waqqas", "term": "حدثنا" },
    { "source": "alqama_ibn_waqqas", "target": "umar_ibn_khattab", "term": "سمعت" }
  ]
}`,
    testUrl: '/v1/hadiths/bukhari:1/chain',
  },
  {
    id: 'hadith-gradings',
    category: 'hadith',
    method: 'GET',
    path: '/v1/hadiths/{id}/gradings',
    title: 'Multi-Scholar Gradings & Verifications',
    titleAr: 'أحكام وأقوال أئمة الجرح والتعديل المتعددة',
    desc: 'Returns consensus and varying verdicts from classical authorities (Al-Albani, Ibn Hajar, Al-Dhahabi, Ibn Ma\'in) with original book citations and page indices.',
    descAr: 'أحكام النقاد والعلماء مع عزو كل حكم إلى مصدره وصفحته في كتب الرجال والتخريج.',
    params: [
      { name: 'id', in: 'path', type: 'string', required: true, example: 'abudawud:1', description: 'Canonical hadith slug.' },
    ],
    curlExample: `curl -X GET "http://localhost:3000/v1/hadiths/abudawud:1/gradings"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/hadiths/abudawud:1/gradings');
const gradings = await res.json();
console.log(gradings);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/hadiths/abudawud:1/gradings')
print(res.json())`,
    responseExample: `{
  "hadith_id": "abudawud:1",
  "consensus": "sahih",
  "gradings": [
    {
      "scholar_key": "al-albani",
      "scholar_name": "محمد ناصر الدين الألباني",
      "grade_normalized": "sahih",
      "source_book": "صحيح أبي داود",
      "source_book_id": 104,
      "page_index": 42
    },
    {
      "scholar_key": "ibn_hajar",
      "scholar_name": "ابن حجر العسقلاني",
      "grade_normalized": "sahih",
      "source_book": "فتح الباري",
      "source_book_id": 102,
      "page_index": 15
    }
  ]
}`,
    testUrl: '/v1/hadiths/abudawud:1/gradings',
  },
  {
    id: 'hadith-diff',
    category: 'hadith',
    method: 'POST',
    path: '/v1/hadiths/diff',
    title: 'Word-Level Matn Diff Between Narrations',
    titleAr: 'مقارنة الفروق اللفظية الدقيقة بين روايتين',
    desc: 'Performs word-level difference analysis between two narrations, highlighting verbatim agreements, subtle omissions, word substitutions, and additions.',
    descAr: 'مقارنة دقيقة كلمة بكلمة بين روايتين لاكتشاف الزيادات والألفاظ المترادفة.',
    requestBody: `{
  "textA": "إنما الأعمال بالنيات وإنما لكل امرئ ما نوى",
  "textB": "إنما الأعمال بالنية وإنما لامرئ ما نوى"
}`,
    curlExample: `curl -X POST "http://localhost:3000/v1/hadiths/diff" \\
  -H "Content-Type: application/json" \\
  -d '{"textA":"إنما الأعمال بالنيات","textB":"إنما الأعمال بالنية"}'`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/hadiths/diff', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    textA: 'إنما الأعمال بالنيات وإنما لكل امرئ ما نوى',
    textB: 'إنما الأعمال بالنية وإنما لامرئ ما نوى'
  })
});
const diff = await res.json();
console.log(diff);`,
    pythonExample: `import requests
res = requests.post('http://localhost:3000/v1/hadiths/diff', json={
  'textA': 'إنما الأعمال بالنيات',
  'textB': 'إنما الأعمال بالنية'
})
print(res.json())`,
    responseExample: `{
  "identical": false,
  "similarity_ratio": 0.89,
  "diff_tokens": [
    { "type": "equal", "value": "إنما الأعمال" },
    { "type": "modified", "original": "بالنيات", "variant": "بالنية" },
    { "type": "equal", "value": "وإنما" },
    { "type": "modified", "original": "لكل امرئ", "variant": "لامرئ" },
    { "type": "equal", "value": "ما نوى" }
  ]
}`,
    testUrl: '/v1/hadiths/diff',
  },
  {
    id: 'hadith-scholars',
    category: 'hadith',
    method: 'GET',
    path: '/v1/scholars',
    title: 'Hadith Critics & Grading Scholars',
    titleAr: 'أئمة ونقاد الحديث والجرح والتعديل',
    desc: 'Directory of historical scholars and Muhaddithin, their chronological era (century AH), strictness methodology, and documented works.',
    descAr: 'معجم النقاد وأئمة الجرح والتعديل وتواريخ وفياتهم ومناهجهم.',
    curlExample: `curl -X GET "http://localhost:3000/v1/scholars"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/scholars');
const scholars = await res.json();
console.log(scholars);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/scholars')
print(res.json())`,
    responseExample: `[
  {
    "key": "bukhari",
    "name_ar": "محمد بن إسماعيل البخاري",
    "death_ah": 256,
    "methodology": "strict / mutashaddid",
    "major_works": ["الجامع الصحيح", "التاريخ الكبير"]
  },
  {
    "key": "muslim",
    "name_ar": "مسلم بن الحجاج النيسابوري",
    "death_ah": 261,
    "methodology": "moderate / mutawassit",
    "major_works": ["صحيح مسلم", "التمييز"]
  }
]`,
    testUrl: '/v1/scholars',
  },

  // ================= NARRATORS =================
  {
    id: 'narrators-search',
    category: 'narrators',
    method: 'GET',
    path: '/v1/narrators',
    title: 'Biographical Narrator Registry',
    titleAr: 'معجم الرواة الموثق مع رتب التوثيق والطبقات',
    desc: 'Searchable index of Hadith transmitters. Returns biographical slug, full Arabic name, generation/tabaqah, city of residence, and reliability verdict.',
    descAr: 'البحث في طبقات الرواة ومعرفة درجات التوثيق والبلدان والوفيات.',
    params: [
      { name: 'q', in: 'query', type: 'string', description: 'Search term by narrator name or slug (e.g. عمر or umar).' },
      { name: 'page', in: 'query', type: 'integer', defaultVal: '1', description: 'Page number.' },
      { name: 'limit', in: 'query', type: 'integer', defaultVal: '20', description: 'Results limit.' },
    ],
    curlExample: `curl -X GET "http://localhost:3000/v1/narrators?limit=5"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/narrators?limit=5');
const narrators = await res.json();
console.log(narrators);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/narrators', params={'limit': 5})
print(res.json())`,
    responseExample: `{
  "data": [
    {
      "id": "umar_ibn_khattab",
      "name_ar": "عمر بن الخطاب بن نفيل القرشي",
      "tabaqah": 1,
      "grade": "صحابي جليل - أمير المؤمنين",
      "city": "المدينة المنورة",
      "death_ah": 23
    },
    {
      "id": "malik_ibn_anas",
      "name_ar": "مالك بن أنس بن مالك الأصبحي",
      "tabaqah": 7,
      "grade": "إمام دار الهجرة - رأس المتثبتين",
      "city": "المدينة المنورة",
      "death_ah": 179
    }
  ],
  "total": 35,
  "page": 1,
  "limit": 5
}`,
    testUrl: '/v1/narrators?limit=3',
  },
  {
    id: 'narrator-profile',
    category: 'narrators',
    method: 'GET',
    path: '/v1/narrators/{id}',
    title: 'Narrator Profile & Transmission Network',
    titleAr: 'السيرة الإسنادية لراوٍ محدد وشيوخه وتلاميذه',
    desc: 'In-depth profile for an individual transmitter, listing verified teachers, students, total marwiyyat (narrations), and critical appraisals.',
    descAr: 'الملف التراجمي التفصيلي للراوي وشيوخه وتلاميذه والمرويات المرتبطة.',
    params: [
      { name: 'id', in: 'path', type: 'string', required: true, example: 'umar_ibn_khattab', description: 'Narrator slug identifier.' },
    ],
    curlExample: `curl -X GET "http://localhost:3000/v1/narrators/umar_ibn_khattab"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/narrators/umar_ibn_khattab');
const profile = await res.json();
console.log(profile);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/narrators/umar_ibn_khattab')
print(res.json())`,
    responseExample: `{
  "id": "umar_ibn_khattab",
  "name_ar": "عمر بن الخطاب",
  "kunya": "أبو حفص",
  "tabaqah": 1,
  "teachers_count": 1,
  "students_count": 140,
  "marwiyyat_count": 539,
  "ibn_hajar_grade": "صحابي",
  "dhahabi_grade": "الإمام العادل أمير المؤمنين"
}`,
    testUrl: '/v1/narrators/umar_ibn_khattab',
  },
  {
    id: 'isnad-search',
    category: 'narrators',
    method: 'POST',
    path: '/v1/isnad/search',
    title: 'Search Transmission Path Between Narrators',
    titleAr: 'البحث عن مسالك الإسناد والعلاقات بين راويين',
    desc: 'Graph search discovering direct and indirect chains connecting a specific Shaykh to a student or successor.',
    descAr: 'البحث الطوبولوجي في الرسم البياني لاكتشاف طرق التلاقي بين أي راويين.',
    requestBody: `{
  "from_narrator": "malik_ibn_anas",
  "to_narrator": "nafi_mawla_ibn_umar"
}`,
    curlExample: `curl -X POST "http://localhost:3000/v1/isnad/search" \\
  -H "Content-Type: application/json" \\
  -d '{"from_narrator":"malik_ibn_anas","to_narrator":"nafi_mawla_ibn_umar"}'`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/isnad/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    from_narrator: 'malik_ibn_anas',
    to_narrator: 'nafi_mawla_ibn_umar'
  })
});
const path = await res.json();
console.log(path);`,
    pythonExample: `import requests
res = requests.post('http://localhost:3000/v1/isnad/search', json={
  'from_narrator': 'malik_ibn_anas',
  'to_narrator': 'nafi_mawla_ibn_umar'
})
print(res.json())`,
    responseExample: `{
  "connected": true,
  "shortest_path_hops": 1,
  "transmission_paths": [
    {
      "chain": ["malik_ibn_anas", "nafi_mawla_ibn_umar"],
      "designation": "سلسلة الذهب (The Golden Chain)",
      "authenticity": "highest_consensus"
    }
  ]
}`,
    testUrl: '/v1/isnad/search',
  },

  // ================= FAMILIES & MUSTALAH =================
  {
    id: 'families-list',
    category: 'mustalah',
    method: 'GET',
    path: '/v1/families',
    title: 'Hadith Semantic Families',
    titleAr: 'عوائل الأحاديث المتقاربة في المعنى والمخرج',
    desc: 'Clusters of narrations that share common textual cores, allowing cross-collection comparative studies.',
    descAr: 'عوائل الحديث النبوي المتحدة في المعنى والمتباينة في الألفاظ والمخارج.',
    curlExample: `curl -X GET "http://localhost:3000/v1/families"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/families');
const families = await res.json();
console.log(families);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/families')
print(res.json())`,
    responseExample: `[
  {
    "id": "fam-niyyah",
    "name_ar": "حديث الأعمال بالنيات",
    "primary_theme": "الإخلاص والنية",
    "member_hadiths_count": 6,
    "breadth_tier": "gharib_asl_mashhur_taraf"
  },
  {
    "id": "fam-hawd",
    "name_ar": "أحاديث الحوض المورود",
    "primary_theme": "أشراط الساعة واليوم الآخر",
    "member_hadiths_count": 48,
    "breadth_tier": "mutawatir"
  }
]`,
    testUrl: '/v1/families',
  },
  {
    id: 'family-detail',
    category: 'mustalah',
    method: 'GET',
    path: '/v1/families/{id}',
    title: 'Hadith Family Details & Variants',
    titleAr: 'تفاصيل عائلة الحديث والروايات المنتمية إليها',
    desc: 'Lists all member hadiths, core linguistic terms, and common thematic threads in a semantic family.',
    descAr: 'استعراض جميع أفراد العائلة من المتون والرواة وتطابق الألفاظ.',
    params: [
      { name: 'id', in: 'path', type: 'string', required: true, example: 'fam-niyyah', description: 'Family ID slug.' },
    ],
    curlExample: `curl -X GET "http://localhost:3000/v1/families/fam-niyyah"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/families/fam-niyyah');
const family = await res.json();
console.log(family);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/families/fam-niyyah')
print(res.json())`,
    responseExample: `{
  "id": "fam-niyyah",
  "title": "حديث إنما الأعمال بالنيات",
  "root_words": ["نوى", "عمل", "هجر"],
  "canonical_members": [
    "bukhari:1",
    "muslim:1907",
    "abudawud:2201",
    "tirmidhi:1647"
  ]
}`,
    testUrl: '/v1/families/fam-niyyah',
  },
  {
    id: 'family-mustalah',
    category: 'mustalah',
    method: 'GET',
    path: '/v1/families/{id}/mustalah',
    title: 'Mustalah Analysis for Hadith Family',
    titleAr: 'تحقيق مصطلح الحديث (المتابعات والشواهد والاتساع)',
    desc: 'Algorithmic analysis of transmission breadth across generations, computing whether the cluster achieves Mutawatir, Mashhur, or Aziz status.',
    descAr: 'تحليل دقيق لعدد الرواة في كل طبقة لاكتشاف المتابعة التامة والقاصرة والشواهد.',
    params: [
      { name: 'id', in: 'path', type: 'string', required: true, example: 'fam-niyyah', description: 'Family ID slug.' },
    ],
    curlExample: `curl -X GET "http://localhost:3000/v1/families/fam-niyyah/mustalah"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/families/fam-niyyah/mustalah');
const mustalah = await res.json();
console.log(mustalah);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/families/fam-niyyah/mustalah')
print(res.json())`,
    responseExample: `{
  "family_id": "fam-niyyah",
  "classification": "غريب أفرادي في أصله، مشهور مستفيض في منتهاه",
  "generation_counts": {
    "sahabah": 1,
    "kibar_tabiin": 1,
    "wusta_tabiin": 1,
    "atba_tabiin": 200
  },
  "mutabaat_count": 3,
  "shawahid_count": 2
}`,
    testUrl: '/v1/families/fam-niyyah/mustalah',
  },
  {
    id: 'mustalah-stats',
    category: 'mustalah',
    method: 'GET',
    path: '/v1/mustalah/stats',
    title: 'Global Mustalah Corpus Statistics',
    titleAr: 'إحصائيات درجات اتساع الأحاديث في القاعدة',
    desc: 'Aggregated distribution showing the total counts and proportions of Mutawatir, Mashhur, Aziz, and Gharib traditions.',
    descAr: 'إحصائية عامة لتوزيع الأحاديث حسب درجات الشهرة والغرابة والتواتر.',
    curlExample: `curl -X GET "http://localhost:3000/v1/mustalah/stats"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/mustalah/stats');
const stats = await res.json();
console.log(stats);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/mustalah/stats')
print(res.json())`,
    responseExample: `{
  "total_analyzed_families": 1420,
  "distribution": {
    "mutawatir": 112,
    "mashhur": 480,
    "aziz": 320,
    "gharib": 508
  },
  "mutawatir_percentage": "7.88%"
}`,
    testUrl: '/v1/mustalah/stats',
  },

  // ================= BOOKS =================
  {
    id: 'books-list',
    category: 'books',
    method: 'GET',
    path: '/v1/books',
    title: 'List Classical Islamic Reference Books',
    titleAr: 'كتب ودواوين التراث الإسلامي المرقمنة',
    desc: 'Searchable library of classical reference works (Fath al-Bari, Siyar A\'lam al-Nubala, Tahdhib al-Kamal) indexed with Shamela book IDs.',
    descAr: 'فهرس أمهات كتب التراث المرقمنة من شروح الحديث وكتب الجرح والتعديل.',
    params: [
      { name: 'category', in: 'query', type: 'string', example: 'hadith_grading', description: 'Filter category (e.g. hadith_grading, tafsir, sharh).' },
    ],
    curlExample: `curl -X GET "http://localhost:3000/v1/books?category=hadith_grading" | jq '.[].name_en'`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/books?category=hadith_grading');
const books = await res.json();
console.log(books);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/books', params={'category': 'hadith_grading'})
print(res.json())`,
    responseExample: `[
  {
    "id": 104,
    "name_ar": "فتح الباري شرح صحيح البخاري",
    "name_en": "Fath al-Bari",
    "author": "ابن حجر العسقلاني",
    "category": "hadith_grading",
    "volumes_count": 13
  },
  {
    "id": 105,
    "name_ar": "المنهاج شرح صحيح مسلم بن الحجاج",
    "name_en": "Sharh al-Nawawi 'ala Muslim",
    "author": "يحيى بن شرف النووي",
    "category": "hadith_grading",
    "volumes_count": 18
  }
]`,
    testUrl: '/v1/books?category=hadith_grading',
  },
  {
    id: 'book-detail',
    category: 'books',
    method: 'GET',
    path: '/v1/books/{id}',
    title: 'Classical Book Metadata',
    titleAr: 'تفاصيل الكتاب التراثي والمؤلف والطبعة',
    desc: 'Retrieves metadata, author information, volume counts, and total pages for a digitized reference work.',
    descAr: 'معلومات تفصيلية عن الكتاب المعتمد والمحقق والناشر.',
    params: [
      { name: 'id', in: 'path', type: 'integer', required: true, example: '104', description: 'Shamela/Turath Book ID.' },
    ],
    curlExample: `curl -X GET "http://localhost:3000/v1/books/104"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/books/104');
const book = await res.json();
console.log(book);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/books/104')
print(res.json())`,
    responseExample: `{
  "id": 104,
  "shamela_id": 1673,
  "name_ar": "فتح الباري شرح صحيح البخاري",
  "author_ar": "أحمد بن علي بن حجر العسقلاني",
  "edition": "دار المعرفة - بيروت",
  "total_pages": 7240
}`,
    testUrl: '/v1/books/104',
  },
  {
    id: 'book-pages',
    category: 'books',
    method: 'GET',
    path: '/v1/books/{id}/pages',
    title: 'Fetch Classical Book Pages by Index',
    titleAr: 'استرجاع نصوص الصفحات الأصلية من الكتاب',
    desc: 'Fetches verbatim page text from digitized manuscripts for deep scholarly citation and verification.',
    descAr: 'استرجاع النص الكامل للصفحة برقمها وتوثيقها التاريخي.',
    params: [
      { name: 'id', in: 'path', type: 'integer', required: true, example: '104', description: 'Book ID.' },
      { name: 'start', in: 'query', type: 'integer', defaultVal: '1', description: 'Page offset start index.' },
      { name: 'size', in: 'query', type: 'integer', defaultVal: '1', description: 'Number of consecutive pages.' },
    ],
    curlExample: `curl -X GET "http://localhost:3000/v1/books/104/pages?start=42&size=1"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/books/104/pages?start=42&size=1');
const page = await res.json();
console.log(page);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/books/104/pages', params={'start': 42, 'size': 1})
print(res.json())`,
    responseExample: `{
  "book_id": 104,
  "page_number": 42,
  "volume": 1,
  "text": "قوله: باب كيف كان بدء الوحي إلى رسول الله صلى الله عليه وسلم، وقول الله جل ذكره: إنا أوحينا إليك كما أوحينا إلى نوح والنبيين من بعده... وجه المناسبة بين الآية والترجمة ظاهر..."
}`,
    testUrl: '/v1/books/104/pages?start=42&size=1',
  },

  // ================= SEARCH =================
  {
    id: 'search-all',
    category: 'search',
    method: 'GET',
    path: '/v1/search/all',
    title: 'Unified Hybrid Search (Quran + Hadith)',
    titleAr: 'البحث الهجين المتزامن بين القرآن والحديث',
    desc: 'High-speed cross-corpus search combining exact keyword matching and semantic embeddings across verses and hadiths simultaneously.',
    descAr: 'محرك بحث موحد يبحث في آيات القرآن ومتون الحديث بدقة دلالية ولغوية في استعلام واحد.',
    params: [
      { name: 'q', in: 'query', type: 'string', required: true, example: 'patience', description: 'Query text in Arabic or English.' },
      { name: 'type', in: 'query', type: 'string', defaultVal: 'hybrid', description: 'Search algorithm mode: hybrid | exact | semantic.' },
      { name: 'limit', in: 'query', type: 'integer', defaultVal: '5', description: 'Max results per section.' },
    ],
    curlExample: `curl -X GET "http://localhost:3000/v1/search/all?q=patience&type=hybrid&limit=5" | jq '{quran_count, hadith_count}'`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/search/all?q=patience&type=hybrid&limit=5');
const results = await res.json();
console.log('Found in Quran:', results.quran_count, 'Found in Hadith:', results.hadith_count);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/search/all', params={'q': 'patience', 'limit': 5})
data = res.json()
print(f"Quran: {data['quran_count']}, Hadith: {data['hadith_count']}")`,
    responseExample: `{
  "query": "patience",
  "quran_count": 103,
  "hadith_count": 47,
  "quran_matches": [
    {
      "surah": 2,
      "ayah": 153,
      "text": "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
      "translation": "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient."
    }
  ],
  "hadith_matches": [
    {
      "id": "muslim:223",
      "matn": "والصبر ضياء...",
      "translation": "And patience is brightness..."
    }
  ]
}`,
    testUrl: '/v1/search/all?q=patience&type=hybrid&limit=3',
  },
  {
    id: 'search-quran',
    category: 'search',
    method: 'GET',
    path: '/v1/search/quran',
    title: 'Full-Text Quran Search',
    titleAr: 'البحث النصي الدقيق في آيات القرآن الكريم',
    desc: 'Lexical and root search across the entire Holy Quran, handling Arabic diacritics, normalization modes, and morphological variations.',
    descAr: 'بحث نصي صرفي متقدم في الآيات مع مراعاة التشكيل والرسم العثماني.',
    params: [
      { name: 'q', in: 'query', type: 'string', required: true, example: 'فلك', description: 'Word or root to match.' },
      { name: 'limit', in: 'query', type: 'integer', defaultVal: '10', description: 'Results limit.' },
    ],
    curlExample: `curl -X GET "http://localhost:3000/v1/search/quran?q=فلك&limit=10"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/search/quran?q=فلك&limit=10');
const matches = await res.json();
console.log(matches);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/search/quran', params={'q': 'فلك', 'limit': 10})
print(res.json())`,
    responseExample: `{
  "query": "فلك",
  "matches_count": 2,
  "results": [
    {
      "surah": 21,
      "ayah": 33,
      "text": "وَهُوَ الَّذِي خَلَقَ اللَّيْلَ وَالنَّهَارَ وَالشَّمْسَ وَالْقَمَرَ كُلٌّ فِي فَلَكٍ يَسْبَحُونَ"
    },
    {
      "surah": 36,
      "ayah": 40,
      "text": "لَا الشَّمْسُ يَنبَغِي لَهَا أَن تُدْرِكَ الْقَمَرَ وَلَا اللَّيْلُ سَابِقُ النَّهَارِ وَكُلٌّ فِي فَلَكٍ يَسْبَحُونَ"
    }
  ]
}`,
    testUrl: '/v1/search/quran?q=فلك&limit=5',
  },
  {
    id: 'search-hadith',
    category: 'search',
    method: 'GET',
    path: '/v1/search/hadith',
    title: 'Full-Text Hadith Matn & Narrator Search',
    titleAr: 'البحث في متون وأسانيد الأحاديث النبوية',
    desc: 'Queries prophetic sayings, narrator chains, and topical keywords across the Kutub al-Tis\'ah.',
    descAr: 'البحث بالكلمات المفتاحية في متون الأحاديث وأسماء الرواة.',
    params: [
      { name: 'q', in: 'query', type: 'string', required: true, example: 'نية', description: 'Search query.' },
      { name: 'limit', in: 'query', type: 'integer', defaultVal: '10', description: 'Limit of returned hadiths.' },
    ],
    curlExample: `curl -X GET "http://localhost:3000/v1/search/hadith?q=نية&limit=10"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/search/hadith?q=نية&limit=10');
const hadiths = await res.json();
console.log(hadiths);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/search/hadith', params={'q': 'نية', 'limit': 10})
print(res.json())`,
    responseExample: `{
  "query": "نية",
  "matches_count": 8,
  "results": [
    {
      "id": "bukhari:1",
      "collection": "Sahih al-Bukhari",
      "snippet": "إنما الأعمال بالنيات وإنما لكل امرئ ما نوى..."
    }
  ]
}`,
    testUrl: '/v1/search/hadith?q=نية&limit=5',
  },

  // ================= ASK / AI =================
  {
    id: 'ask-streaming',
    category: 'ask',
    method: 'POST',
    path: '/v1/ask/{target}',
    title: 'Streaming AI Research GraphRAG (SSE)',
    titleAr: 'الوكيل الذكي للبحث والاستدلال اللحظي المتدفق',
    desc: 'Server-Sent Events (SSE) streaming endpoint that passes a research prompt into QuranMind\'s GraphRAG engine, streaming back verified Quran and Hadith sources followed by answer tokens.',
    descAr: 'واجهة بث تدفقي بالذكاء الاصطناعي مدعومة بنظام GraphRAG للتحقق من الشواهد والمصادر.',
    isStreaming: true,
    params: [
      { name: 'target', in: 'path', type: 'string', required: true, defaultVal: 'quran', example: 'quran', description: 'Corpus target: quran | hadith | all | tafsir.' },
    ],
    requestBody: `{
  "question": "ما هي الآيات التي تذكر دوران الفلك والتناظر الكوني؟"
}`,
    curlExample: `curl -N -X POST "http://localhost:3000/v1/ask/quran" \\
  -H "Content-Type: application/json" \\
  -d '{"question":"What does the Quran say about cosmic orbits?"}'`,
    jsExample: `const response = await fetch('http://localhost:3000/v1/ask/quran', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question: 'What does the Quran say about cosmic orbits?' })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log(decoder.decode(value));
}`,
    pythonExample: `import requests

res = requests.post(
  'http://localhost:3000/v1/ask/quran',
  json={'question': 'What does the Quran say about cosmic orbits?'},
  stream=True
)

for chunk in res.iter_lines():
  if chunk:
    print(chunk.decode('utf-8'))`,
    responseExample: `event: sources
data: {"quran_sources": [{"surah": 21, "ayah": 33}, {"surah": 36, "ayah": 40}]}

event: token
data: {"delta": "يذكر القرآن الكريم"}

event: token
data: {"delta": " حركة الأجرام السماوية في سياق بديع..."}

event: done
data: {"status": "complete", "model": "quranmind-graphrag-v1"}`,
    testUrl: '/v1/ask/quran',
  },

  // ================= META =================
  {
    id: 'meta-config',
    category: 'meta',
    method: 'GET',
    path: '/v1/config',
    title: 'API Configuration & Rate Limits',
    titleAr: 'إعدادات المنظومة وقواعد معدل الطلبات',
    desc: 'Returns active API conventions, live rate limit policies, documentation links, and OpenAPI specifications.',
    descAr: 'بيان إعدادات الـ API وقواعد الاستهلاك وسقوف الطلبات لكل دقيقة.',
    curlExample: `curl -X GET "http://localhost:3000/v1/config"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/config');
const config = await res.json();
console.log(config);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/config')
print(res.json())`,
    responseExample: `{
  "version": "1.0",
  "base_url": "http://localhost:3000/v1",
  "auth_required": false,
  "rate_limits": {
    "read_endpoints": "60 req/min/IP",
    "ask_endpoints": "10 req/min/IP"
  },
  "id_conventions": {
    "hadith": "{collection_code}:{number} (e.g. bukhari:1)",
    "quran": "/v1/quran/ayahs/{surah}/{ayah}"
  },
  "interactive_docs": "/docs",
  "openapi_spec": "/v1/openapi.json"
}`,
    testUrl: '/v1/config',
  },
  {
    id: 'meta-stats',
    category: 'meta',
    method: 'GET',
    path: '/v1/stats',
    title: 'Overall Corpus Counts & Statistics',
    titleAr: 'الإحصائيات الشاملة لقاعدة البيانات المرقمنة',
    desc: 'Returns counts of indexed Quranic surahs, ayahs, hadiths, narrator biographical profiles, and classical books.',
    descAr: 'إجمالي السجلات المفهرسة في المنصة من آيات وأحاديث ورواة ومخطوطات.',
    curlExample: `curl -X GET "http://localhost:3000/v1/stats"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/stats');
const stats = await res.json();
console.log(stats);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/stats')
print(res.json())`,
    responseExample: `{
  "quran": {
    "surahs": 114,
    "ayahs": 6236
  },
  "hadith": {
    "collections_indexed": 9,
    "corpus_hadiths": 340,
    "narrators_indexed": 35
  },
  "library": {
    "classical_books": 2
  }
}`,
    testUrl: '/v1/stats',
  },
  {
    id: 'meta-openapi',
    category: 'meta',
    method: 'GET',
    path: '/v1/openapi.json',
    title: 'OpenAPI 3.1 Machine-Readable Spec',
    titleAr: 'مواصفة OpenAPI 3.1 الكاملة لتوليد الـ SDKs',
    desc: 'The complete, machine-readable OpenAPI 3.1.0 JSON document. Can be consumed by Postman, Insomnia, Swagger UI, or SDK generators.',
    descAr: 'المواصفة القياسية الرسمية الكاملة لتوليد مكتبات العميل في مختلف لغات البرمجة.',
    curlExample: `curl -X GET "http://localhost:3000/v1/openapi.json"`,
    jsExample: `const res = await fetch('http://localhost:3000/v1/openapi.json');
const spec = await res.json();
console.log(spec.info.title, spec.openapi);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/v1/openapi.json')
spec = res.json()
print(spec['info']['title'])`,
    responseExample: `{
  "openapi": "3.1.0",
  "info": {
    "title": "QuranMind & Ilm Public REST API",
    "version": "1.0.0",
    "description": "Public REST API for Quran, Hadith, Narrators, Isnad chains..."
  },
  "servers": [
    { "url": "http://localhost:3000/v1" }
  ],
  "paths": { ... }
}`,
    testUrl: '/v1/openapi.json',
  },

  // ================= BACKEND SERVICES =================
  {
    id: 'backend-health',
    category: 'backend',
    method: 'GET',
    path: '/api/health',
    title: 'Backend Gateway Health Check',
    titleAr: 'فحص صحة السيرفر وقاعدة البيانات المدارة',
    desc: 'Express gateway health endpoint verifying server uptime, active environment mode, and Supabase connectivity status.',
    descAr: 'فحص حالة السيرفر الخلفي واتصاله بقاعدة البيانات سوبابيس.',
    curlExample: `curl -X GET "http://localhost:3000/api/health"`,
    jsExample: `const res = await fetch('http://localhost:3000/api/health');
const health = await res.json();
console.log(health);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/api/health')
print(res.json())`,
    responseExample: `{
  "status": "ok",
  "service": "quranmind-backend",
  "version": "1.0.0",
  "mode": "saas",
  "supabase": {
    "configured": true,
    "status": "connected"
  },
  "stats": {
    "surahs": 114,
    "verses": 6236,
    "collections": 9,
    "managedUsers": 6
  }
}`,
    testUrl: '/api/health',
  },
  {
    id: 'backend-projects',
    category: 'backend',
    method: 'GET',
    path: '/api/projects',
    title: 'User Research Projects Directory',
    titleAr: 'قائمة المشاريع البحثية والفرضيات العلمية',
    desc: 'Retrieves saved research dossiers, hypotheses, tagged verses, and analytical logs created by the authenticated researcher.',
    descAr: 'استعراض مساحات العمل والمشاريع البحثية والفرضيات المسجلة للباحث.',
    curlExample: `curl -X GET "http://localhost:3000/api/projects"`,
    jsExample: `const res = await fetch('http://localhost:3000/api/projects');
const projects = await res.json();
console.log(projects);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/api/projects')
print(res.json())`,
    responseExample: `{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "p1",
      "title": "معجزة التناظر في القرآن",
      "hypothesis": "التناظر الدائري في آيات الفلك والسباحة الكونية",
      "taggedVerses": ["21:33", "36:40"],
      "updatedAt": "2026-09-29T08:00:00.000Z"
    }
  ]
}`,
    testUrl: '/api/projects',
  },
  {
    id: 'backend-user-profile',
    category: 'backend',
    method: 'GET',
    path: '/api/users/profile',
    title: 'Researcher Profile & Preferences',
    titleAr: 'ملف الباحث وتفضيلات بيئة العمل',
    desc: 'Account settings, display preferences, normalization mode defaults, and recent query history.',
    descAr: 'إعدادات حساب الباحث وطريقة تطبيع النص المفضلة.',
    curlExample: `curl -X GET "http://localhost:3000/api/users/profile"`,
    jsExample: `const res = await fetch('http://localhost:3000/api/users/profile');
const profile = await res.json();
console.log(profile);`,
    pythonExample: `import requests
res = requests.get('http://localhost:3000/api/users/profile')
print(res.json())`,
    responseExample: `{
  "user": {
    "id": "usr_academic_1",
    "name": "Academic Researcher",
    "email": "researcher@quranmind.ai",
    "role": "scholar",
    "preferences": {
      "normalization": "structural",
      "auto_abjad": true,
      "theme": "midnight"
    }
  }
}`,
    testUrl: '/api/users/profile',
  },
]

export function ApiDocsView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedLang, setSelectedLang] = useState<'curl' | 'js' | 'python'>('curl')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeNavId, setActiveNavId] = useState<string>('getting-started')

  // Live API Console Runner State
  const [liveTestResults, setLiveTestResults] = useState<
    Record<
      string,
      {
        loading: boolean
        status?: number
        statusText?: string
        durationMs?: number
        data?: any
        error?: string
      }
    >
  >({})

  const [activeEndpointParams, setActiveEndpointParams] = useState<Record<string, Record<string, string>>>({})

  // Handle Copy Snippets
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev))
    }, 2000)
  }

  // Handle Live API Test Request
  const handleRunLiveTest = async (endpoint: ApiEndpoint) => {
    const epId = endpoint.id
    setLiveTestResults((prev) => ({
      ...prev,
      [epId]: { loading: true },
    }))

    const startTime = performance.now()
    try {
      let finalUrl = endpoint.testUrl
      const customParams = activeEndpointParams[epId]
      if (customParams) {
        Object.entries(customParams).forEach(([k, v]) => {
          if (v) {
            finalUrl = finalUrl.replace(`{${k}}`, encodeURIComponent(v))
          }
        })
      }

      const options: RequestInit = {
        method: endpoint.method,
        headers: {
          Accept: 'application/json',
          ...(endpoint.requestBody ? { 'Content-Type': 'application/json' } : {}),
        },
        ...(endpoint.requestBody && endpoint.method !== 'GET'
          ? { body: endpoint.requestBody }
          : {}),
      }

      const res = await fetch(finalUrl, options)
      const durationMs = Math.round(performance.now() - startTime)
      let data: any
      const contentType = res.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        data = await res.json()
      } else {
        data = await res.text()
      }

      setLiveTestResults((prev) => ({
        ...prev,
        [epId]: {
          loading: false,
          status: res.status,
          statusText: res.statusText,
          durationMs,
          data,
        },
      }))
    } catch (err: any) {
      const durationMs = Math.round(performance.now() - startTime)
      setLiveTestResults((prev) => ({
        ...prev,
        [epId]: {
          loading: false,
          status: 0,
          statusText: 'Network Error',
          durationMs,
          error: err.message || 'Failed to fetch',
        },
      }))
    }
  }

  // Filtered Endpoints
  const filteredEndpoints = useMemo(() => {
    let list = ENDPOINTS
    if (activeCategory !== 'all') {
      list = list.filter((ep) => ep.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (ep) =>
          ep.path.toLowerCase().includes(q) ||
          ep.title.toLowerCase().includes(q) ||
          ep.titleAr.toLowerCase().includes(q) ||
          ep.desc.toLowerCase().includes(q) ||
          ep.method.toLowerCase().includes(q) ||
          ep.category.toLowerCase().includes(q)
      )
    }
    return list
  }, [activeCategory, searchQuery])

  // Count by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: ENDPOINTS.length }
    ENDPOINTS.forEach((ep) => {
      counts[ep.category] = (counts[ep.category] || 0) + 1
    })
    return counts
  }, [])

  return (
    <div className="min-h-screen bg-[#020b18] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* ================= STICKY TOPBAR ================= */}
      <header className="sticky top-0 z-40 h-16 bg-[#031427]/90 backdrop-blur-xl border-b border-cyan-900/40 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#072444] border border-cyan-800 text-cyan-300 hover:bg-[#0c3766] transition"
            aria-label="Toggle Navigation Sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">Quran<span className="text-cyan-400">Mind</span></span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 font-mono">
                  v1.0 API
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Global Quick Search in Header */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6 relative">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search API endpoints (e.g. surahs, diff, isnad, words)..."
            className="w-full bg-[#051c36] border border-cyan-900/60 rounded-xl pl-9 pr-9 py-1.5 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-2">
          <a
            href="/v1/openapi.json"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#072444] hover:bg-[#0c3766] border border-cyan-800 text-cyan-200 text-xs font-medium transition"
            title="Download OpenAPI Specification"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>OpenAPI 3.1</span>
          </a>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Dashboard Hub</span>
          </Link>
        </div>
      </header>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="flex-1 flex max-w-[1720px] w-full mx-auto relative">
        {/* ================= NAVIGATION SIDEBAR ================= */}
        <aside
          className={`
            fixed lg:sticky top-16 z-30 w-72 sm:w-80 h-[calc(100vh-4rem)] bg-[#031427] border-r border-cyan-900/40
            flex flex-col shrink-0 transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0 shadow-2xl shadow-black/80' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Sidebar Search */}
          <div className="p-3.5 border-b border-cyan-900/40 bg-[#020e1d]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter endpoints..."
                className="w-full bg-[#051c36] border border-cyan-900/60 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Quick jump to Core Principles */}
          <div className="p-2 border-b border-cyan-900/30">
            <a
              href="#getting-started"
              onClick={() => {
                setActiveCategory('getting-started')
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                activeCategory === 'getting-started'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-[#072444] hover:text-cyan-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Getting Started & Guide
              </span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </a>
          </div>

          {/* Endpoints Categories Tree */}
          <div className="flex-1 overflow-y-auto p-2 space-y-4 text-xs scrollbar-thin scrollbar-thumb-cyan-950 scrollbar-track-transparent">
            {/* Category Filter Pills */}
            <div className="space-y-1">
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Categories</span>
                <span className="text-slate-500 font-mono">{ENDPOINTS.length} APIs</span>
              </div>

              <button
                onClick={() => setActiveCategory('all')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition text-left ${
                  activeCategory === 'all'
                    ? 'bg-cyan-600/20 text-cyan-300 font-semibold border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-[#072444] hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  All Endpoints
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#051c36] text-slate-300 font-mono">
                  {ENDPOINTS.length}
                </span>
              </button>

              {CATEGORIES.filter((c) => c.id !== 'getting-started').map((cat) => {
                const Icon = cat.icon
                const count = categoryCounts[cat.id] || 0
                const isSelected = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition text-left ${
                      isSelected
                        ? 'bg-cyan-600/20 text-cyan-300 font-semibold border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-[#072444] hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{cat.label}</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#051c36] text-slate-300 font-mono shrink-0">
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Endpoints List */}
            <div className="pt-2 border-t border-cyan-900/30 space-y-1">
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Endpoints List</span>
                <span className="text-[10px] text-cyan-400">{filteredEndpoints.length} matches</span>
              </div>

              {filteredEndpoints.length === 0 ? (
                <div className="px-3 py-4 text-center text-slate-400">
                  <p>No endpoints match your query.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setActiveCategory('all')
                    }}
                    className="mt-2 text-cyan-400 hover:underline text-[11px]"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                filteredEndpoints.map((ep) => {
                  const methodColor =
                    ep.method === 'GET'
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                      : ep.method === 'POST'
                      ? 'bg-blue-950/80 text-blue-400 border-blue-800'
                      : ep.method === 'PUT'
                      ? 'bg-amber-950/80 text-amber-400 border-amber-800'
                      : 'bg-rose-950/80 text-rose-400 border-rose-800'

                  return (
                    <a
                      key={ep.id}
                      href={`#${ep.id}`}
                      onClick={() => setSidebarOpen(false)}
                      className="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:bg-[#072444] hover:text-white transition"
                    >
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border shrink-0 ${methodColor}`}
                      >
                        {ep.method}
                      </span>
                      <span className="truncate font-mono text-[11px] group-hover:text-cyan-300 transition-colors">
                        {ep.path}
                      </span>
                    </a>
                  )
                })
              )}
            </div>
          </div>

          {/* Sidebar Footer with quick links */}
          <div className="p-3 border-t border-cyan-900/40 bg-[#020e1d] flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Gateway: Online</span>
            </span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-300 transition flex items-center gap-1"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </aside>

        {/* Backdrop for mobile drawer */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* ================= MAIN CONTENT PANE ================= */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 space-y-12">
          {/* ================= HERO INTRO SECTION ================= */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#041933] via-[#021124] to-[#010813] border border-cyan-900/60 p-6 sm:p-8 lg:p-10 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-4 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-700 tracking-wider">
                  OFFICIAL API REFERENCE
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  REST + SSE Live
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-purple-950 text-purple-300 border border-purple-800">
                  OpenAPI 3.1.0
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Quran<span className="text-cyan-400">Mind</span> Developer & Academic API
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                A high-performance, open-access suite of RESTful endpoints and streaming AI GraphRAG interfaces.
                Designed for scholars, engineers, and researchers investigating Quranic linguistic morphology,
                numerical symmetry, Hadith isnad network topologies, multi-scholar gradings, and digitized classical manuscripts.
              </p>

              {/* Quick specs pill row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                <div className="p-3 rounded-xl bg-[#03172e] border border-cyan-900/50">
                  <div className="text-[11px] text-cyan-400 font-mono">BASE URL</div>
                  <div className="text-xs font-bold text-white truncate mt-0.5">http://localhost:3000/v1</div>
                </div>
                <div className="p-3 rounded-xl bg-[#03172e] border border-cyan-900/50">
                  <div className="text-[11px] text-cyan-400 font-mono">AUTH POLICY</div>
                  <div className="text-xs font-bold text-emerald-300 mt-0.5">Open Access (No Key)</div>
                </div>
                <div className="p-3 rounded-xl bg-[#03172e] border border-cyan-900/50">
                  <div className="text-[11px] text-cyan-400 font-mono">RATE LIMIT</div>
                  <div className="text-xs font-bold text-white mt-0.5">60 req/min (Read)</div>
                </div>
                <div className="p-3 rounded-xl bg-[#03172e] border border-cyan-900/50">
                  <div className="text-[11px] text-cyan-400 font-mono">OUTPUT FORMAT</div>
                  <div className="text-xs font-bold text-white mt-0.5">JSON &amp; SSE Stream</div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= GETTING STARTED & CORE ARCHITECTURE ================= */}
          <section id="getting-started" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-3 border-b border-cyan-900/40 pb-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Getting Started & Core Principles</h2>
                <p className="text-xs text-slate-400">Essential conventions, rate limits, addressing schemes, and SDK generation.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Base URL & Versioning */}
              <div className="p-5 rounded-2xl bg-[#03162b] border border-cyan-900/50 space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-bold text-white text-sm">Base URL &amp; Version Stability</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  All public REST endpoints are namespaced behind <code className="text-cyan-300 bg-[#052242] px-1.5 py-0.5 rounded font-mono">/v1/*</code>.
                  This guarantees long-term backwards compatibility. New fields may be added, but types and existing keys remain immutable.
                </p>
                <div className="p-3 rounded-xl bg-[#010b17] border border-slate-800 font-mono text-xs text-cyan-300 flex items-center justify-between" dir="ltr">
                  <span>http://localhost:3000/v1</span>
                  <button
                    onClick={() => handleCopy('http://localhost:3000/v1', 'base-url')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedId === 'base-url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Card 2: Auth & Rate Limiting */}
              <div className="p-5 rounded-2xl bg-[#03162b] border border-cyan-900/50 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-white text-sm">Authentication &amp; Rate Limits</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Open access for all developers and academic researchers without required API keys. Usage is fair-use metered per client IP address:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs" dir="ltr">
                  <div className="p-2.5 rounded-lg bg-[#010b17] border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">STANDARD READ</span>
                    <strong className="text-cyan-300 font-mono">~60 req / min</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#010b17] border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">AI / ASK STREAMING</span>
                    <strong className="text-purple-300 font-mono">~10 req / min</strong>
                  </div>
                </div>
              </div>

              {/* Card 3: ID Conventions */}
              <div className="p-5 rounded-2xl bg-[#03162b] border border-cyan-900/50 space-y-3">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-white text-sm">Canonical Addressing &amp; ID Conventions</h3>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li><strong className="text-white">Hadith IDs:</strong> Slugs in format <code className="text-cyan-300 font-mono" dir="ltr">bukhari:1</code>, <code className="text-cyan-300 font-mono" dir="ltr">muslim:42</code></li>
                  <li><strong className="text-white">Quran Addressing:</strong> Two segments <code className="text-cyan-300 font-mono" dir="ltr">/ayahs/&#123;surah&#125;/&#123;ayah&#125;</code> (e.g. <code className="text-cyan-300 font-mono" dir="ltr">/ayahs/2/255</code>)</li>
                  <li><strong className="text-white">Narrators &amp; Families:</strong> Normalized slug strings (<code className="text-cyan-300 font-mono" dir="ltr">umar_ibn_khattab</code>, <code className="text-cyan-300 font-mono" dir="ltr">fam-niyyah</code>)</li>
                  <li><strong className="text-white">Classical Books:</strong> Integer Shamela identifiers (<code className="text-cyan-300 font-mono" dir="ltr">104</code> for Fath al-Bari)</li>
                </ul>
              </div>

              {/* Card 4: SDK Generation */}
              <div className="p-5 rounded-2xl bg-[#03162b] border border-cyan-900/50 space-y-3">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-400" />
                  <h3 className="font-bold text-white text-sm">Automated Client SDK Generation</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Generate fully typed clients in TypeScript, Python, Dart/Flutter, or Go directly using the OpenAPI 3.1 specification:
                </p>
                <div className="p-3 rounded-xl bg-[#010b17] border border-slate-800 font-mono text-[11px] text-slate-200 relative" dir="ltr">
                  <pre className="overflow-x-auto">
                    <code>npx @openapitools/openapi-generator-cli generate \<br />  -i http://localhost:3000/v1/openapi.json \<br />  -g typescript-fetch \<br />  -o ./ilm-client</code>
                  </pre>
                  <button
                    onClick={() =>
                      handleCopy(
                        'npx @openapitools/openapi-generator-cli generate -i http://localhost:3000/v1/openapi.json -g typescript-fetch -o ./ilm-client',
                        'sdk-code'
                      )
                    }
                    className="absolute top-2 right-2 text-slate-400 hover:text-white"
                  >
                    {copiedId === 'sdk-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ================= CATEGORY-BY-CATEGORY API ENDPOINTS ================= */}
          {CATEGORIES.filter((c) => c.id !== 'getting-started').map((category) => {
            const categoryEndpoints = filteredEndpoints.filter((ep) => ep.category === category.id)
            if (categoryEndpoints.length === 0) return null

            const CategoryIcon = category.icon

            return (
              <section key={category.id} className="space-y-6 pt-4">
                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-cyan-900/40 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#051c36] border border-cyan-800/60 text-cyan-400 shadow-md">
                      <CategoryIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-white">{category.label}</h2>
                        <span className="text-xs text-slate-400 font-normal">({category.labelAr})</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{category.desc}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${category.badgeColor}`}>
                    {categoryEndpoints.length} Endpoints
                  </span>
                </div>

                {/* Endpoints Cards */}
                <div className="space-y-6">
                  {categoryEndpoints.map((endpoint) => {
                    const epId = endpoint.id
                    const testResult = liveTestResults[epId]
                    const isCopied = copiedId === epId

                    const methodBadge =
                      endpoint.method === 'GET'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : endpoint.method === 'POST'
                        ? 'bg-blue-950 text-blue-400 border-blue-800'
                        : endpoint.method === 'PUT'
                        ? 'bg-amber-950 text-amber-400 border-amber-800'
                        : 'bg-rose-950 text-rose-400 border-rose-800'

                    return (
                      <article
                        key={epId}
                        id={epId}
                        className="rounded-2xl bg-[#031528] border border-cyan-900/50 hover:border-cyan-700/70 transition-all duration-200 overflow-hidden shadow-xl scroll-mt-24"
                      >
                        {/* Endpoint Title Bar */}
                        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#031931] to-[#041d38] border-b border-cyan-900/40 flex flex-wrap items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold border ${methodBadge}`}>
                                {endpoint.method}
                              </span>
                              <span className="font-mono text-sm sm:text-base font-semibold text-cyan-200">
                                {endpoint.path}
                              </span>
                              {endpoint.isStreaming && (
                                <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                                  SSE Stream
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                              <h3 className="text-base font-bold text-white">{endpoint.title}</h3>
                              <span className="text-xs text-slate-400">• {endpoint.titleAr}</span>
                            </div>
                          </div>

                          {/* Quick Interactive Actions */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRunLiveTest(endpoint)}
                              disabled={testResult?.loading}
                              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md transition flex items-center gap-1.5 disabled:opacity-50"
                            >
                              {testResult?.loading ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Play className="w-3.5 h-3.5 fill-current" />
                              )}
                              <span>{testResult?.loading ? 'Sending...' : 'Test Endpoint'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Endpoint Body */}
                        <div className="p-4 sm:p-6 space-y-6">
                          {/* Description */}
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            {endpoint.desc}
                          </p>

                          {/* Parameters Table (if any) */}
                          {endpoint.params && endpoint.params.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                                Parameters
                              </h4>
                              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#020e1c]" dir="ltr">
                                <table className="w-full text-left text-xs">
                                  <thead className="bg-[#041a33] text-slate-300 border-b border-slate-800 text-[11px] font-mono">
                                    <tr>
                                      <th className="py-2.5 px-3">Name</th>
                                      <th className="py-2.5 px-3">In</th>
                                      <th className="py-2.5 px-3">Type</th>
                                      <th className="py-2.5 px-3">Required</th>
                                      <th className="py-2.5 px-3">Description</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-800/60 font-sans text-slate-300">
                                    {endpoint.params.map((p) => (
                                      <tr key={p.name} className="hover:bg-[#062446]/30 transition-colors">
                                        <td className="py-2.5 px-3 font-mono font-semibold text-cyan-300">
                                          {p.name}
                                        </td>
                                        <td className="py-2.5 px-3">
                                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                                            {p.in}
                                          </span>
                                        </td>
                                        <td className="py-2.5 px-3 font-mono text-purple-300 text-[11px]">
                                          {p.type}
                                        </td>
                                        <td className="py-2.5 px-3">
                                          {p.required ? (
                                            <span className="text-rose-400 font-semibold text-[11px]">Yes</span>
                                          ) : (
                                            <span className="text-slate-500 text-[11px]">Optional</span>
                                          )}
                                        </td>
                                        <td className="py-2.5 px-3 text-slate-300 leading-relaxed">
                                          {p.description}
                                          {p.defaultVal && (
                                            <span className="ml-1 text-slate-400 font-mono text-[10px]">
                                              (default: {p.defaultVal})
                                            </span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Request Body (if any) */}
                          {endpoint.requestBody && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                                Request Body (application/json)
                              </h4>
                              <div className="p-3 rounded-xl bg-[#010914] border border-slate-800 font-mono text-xs text-blue-300 text-left" dir="ltr">
                                <pre className="overflow-x-auto">
                                  <code>{endpoint.requestBody}</code>
                                </pre>
                              </div>
                            </div>
                          )}

                          {/* Code Snippets & Response Tabs */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
                            {/* Left: Code Snippets (cURL / JS / Python) */}
                            <div className="rounded-xl border border-slate-800 bg-[#020e1c] overflow-hidden flex flex-col" dir="ltr">
                              <div className="flex items-center justify-between px-3 py-2 bg-[#041a33] border-b border-slate-800">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => setSelectedLang('curl')}
                                    className={`px-2 py-1 rounded text-[11px] font-mono font-semibold transition ${
                                      selectedLang === 'curl'
                                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                        : 'text-slate-400 hover:text-white'
                                    }`}
                                  >
                                    cURL
                                  </button>
                                  <button
                                    onClick={() => setSelectedLang('js')}
                                    className={`px-2 py-1 rounded text-[11px] font-mono font-semibold transition ${
                                      selectedLang === 'js'
                                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                        : 'text-slate-400 hover:text-white'
                                    }`}
                                  >
                                    JavaScript (fetch)
                                  </button>
                                  <button
                                    onClick={() => setSelectedLang('python')}
                                    className={`px-2 py-1 rounded text-[11px] font-mono font-semibold transition ${
                                      selectedLang === 'python'
                                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                        : 'text-slate-400 hover:text-white'
                                    }`}
                                  >
                                    Python (requests)
                                  </button>
                                </div>

                                <button
                                  onClick={() => {
                                    const code =
                                      selectedLang === 'curl'
                                        ? endpoint.curlExample
                                        : selectedLang === 'js'
                                        ? endpoint.jsExample
                                        : endpoint.pythonExample
                                    handleCopy(code, `${epId}-${selectedLang}`)
                                  }}
                                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                                >
                                  {copiedId === `${epId}-${selectedLang}` ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                      <span className="text-[10px] text-emerald-400">Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span className="text-[10px]">Copy</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              <div className="p-3.5 font-mono text-xs text-slate-200 overflow-x-auto flex-1 bg-[#010914] text-left" dir="ltr">
                                <pre>
                                  <code>
                                    {selectedLang === 'curl'
                                      ? endpoint.curlExample
                                      : selectedLang === 'js'
                                      ? endpoint.jsExample
                                      : endpoint.pythonExample}
                                  </code>
                                </pre>
                              </div>
                            </div>

                            {/* Right: Example Response Schema */}
                            <div className="rounded-xl border border-slate-800 bg-[#020e1c] overflow-hidden flex flex-col" dir="ltr">
                              <div className="flex items-center justify-between px-3 py-2 bg-[#041a33] border-b border-slate-800">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                  <span className="text-xs font-mono font-bold text-emerald-300">
                                    200 OK — Expected Response
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleCopy(endpoint.responseExample, `${epId}-resp`)}
                                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                                >
                                  {copiedId === `${epId}-resp` ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                      <span className="text-[10px] text-emerald-400">Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span className="text-[10px]">Copy JSON</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              <div className="p-3.5 font-mono text-xs text-emerald-200/90 overflow-x-auto max-h-64 flex-1 bg-[#010914] scrollbar-thin scrollbar-thumb-cyan-950 text-left" dir="ltr">
                                <pre>
                                  <code>{endpoint.responseExample}</code>
                                </pre>
                              </div>
                            </div>
                          </div>

                          {/* Live Execution Output Pane (Shows when Test Endpoint is triggered) */}
                          {testResult && (
                            <div className="rounded-xl border border-cyan-800/80 bg-[#020f20] p-4 space-y-3 mt-3 shadow-lg" dir="ltr">
                              <div className="flex items-center justify-between border-b border-cyan-900/60 pb-2 flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                  <Activity className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                                    Live Test Console Output
                                  </span>
                                  {testResult.status !== undefined && (
                                    <span
                                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                        testResult.status >= 200 && testResult.status < 300
                                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                                      }`}
                                    >
                                      HTTP {testResult.status} {testResult.statusText}
                                    </span>
                                  )}
                                  {testResult.durationMs !== undefined && (
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      Latency: {testResult.durationMs}ms
                                    </span>
                                  )}
                                </div>

                                <button
                                  onClick={() => handleCopy(JSON.stringify(testResult.data, null, 2), `${epId}-live`)}
                                  className="text-xs text-cyan-300 hover:text-white flex items-center gap-1 font-mono"
                                >
                                  {copiedId === `${epId}-live` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>Copy Live Output</span>
                                </button>
                              </div>

                              {testResult.loading ? (
                                <div className="py-6 flex flex-col items-center justify-center gap-2 text-cyan-300">
                                  <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                                  <span className="text-xs font-mono">Fetching response from {endpoint.testUrl}...</span>
                                </div>
                              ) : testResult.error ? (
                                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-200 text-xs font-mono">
                                  Error: {testResult.error}
                                </div>
                              ) : (
                                <div className="p-3 rounded-lg bg-[#010914] border border-slate-800 font-mono text-xs text-cyan-100 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-900 text-left" dir="ltr">
                                  <pre>
                                    <code>{JSON.stringify(testResult.data, null, 2)}</code>
                                  </pre>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            )
          })}

          {/* ================= FOOTER ================= */}
          <footer className="pt-12 pb-8 border-t border-cyan-900/40 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              <p>© 2026 QuranMind Research Lab. All rights reserved.</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Designed for advanced Quranic textual analysis, mathematical symmetry, and scholarly Hadith verification.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard/api-docs" className="hover:text-cyan-300 transition">
                Interactive Console
              </Link>
              <a href="/v1/openapi.json" target="_blank" rel="noreferrer" className="hover:text-cyan-300 transition">
                OpenAPI Spec
              </a>
              <Link href="/dashboard" className="hover:text-cyan-300 transition">
                Dashboard & Research Hub
              </Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
