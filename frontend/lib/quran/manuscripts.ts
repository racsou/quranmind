export interface QuranManuscript {
  id: string
  title: string
  arabicTitle: string
  location: string
  carbonDating: string
  centuryCE: string
  scriptType: string // 'حجازي مبكر' | 'كوفي عتيق'
  surahsCovered: string
  description: string
  imageUrl: string
  scholarlySignificance: string
}

export const EARLY_MANUSCRIPTS: QuranManuscript[] = [
  {
    id: 'birmingham-folio',
    title: 'Birmingham Quran Manuscript',
    arabicTitle: 'مخطوطة برمنغهام القرآنية',
    location: 'مكتبة كادبوري البحثية، جامعة برمنغهام (المملكة المتحدة)',
    carbonDating: '568 - 645 ميلادية (دقة 95.4%)',
    centuryCE: 'القرن السابع الميلادي (عصر النبوة والخلفاء الراشدين)',
    scriptType: 'خط حجازي مبكر (مائل خفيف)',
    surahsCovered: 'الكهف (18:17-31)، مريم (19:91-98)، طه (20:1-40)',
    description: 'تعد من أقدم الرقائق القرآنية المؤرخة علمياً بنظائر الكربون-14 المشع، مكتوبة على جلد حيواني بحبر عربي داكن دون تنقيط أو تشكيل وفق الرسم العثماني المبكر.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    scholarlySignificance: 'دليل مادي وتاريخي قاطع على ثبات النص القرآني وتطابقه التام حرفاً بحرف مع المصحف المعتمد اليوم منذ القرن الأول الهجري.',
  },
  {
    id: 'sanaa-palimpsest',
    title: 'Sana\'a Palimpsest',
    arabicTitle: 'رقائق صنعاء القرآنية',
    location: 'دار المخطوطات، الجامع الكبير بصنعاء (اليمن)',
    carbonDating: 'ما قبل 671 ميلادية',
    centuryCE: 'القرن الأول الهجري / السابع الميلادي',
    scriptType: 'خط حجازي عتيق',
    surahsCovered: 'أجزاء من سورة التوبة، يونس، هود، الأنعام',
    description: 'مجموعة رقوق فريدة خضعت للتصوير بالأشعة فوق البنفسجية المتعددة الأطياف (Multispectral imaging) وتؤكد استقرار النص الرسمي.',
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
    scholarlySignificance: 'شاهد استثنائي على تاريخ التدوين المبكر في عهد عثمان بن عفان رضي الله عنه وتطور علامات فواصل الآيات.',
  },
  {
    id: 'topkapi-codex',
    title: 'Topkapi Manuscript',
    arabicTitle: 'مصحف طوب قابي سراي',
    location: 'متحف قصر طوب قابي، إسطنبول (تركيا)',
    carbonDating: 'أواخر القرن الأول / أوائل القرن الثاني الهجري',
    centuryCE: 'القرن الثامن الميلادي',
    scriptType: 'خط كوفي عتيق مصحفي',
    surahsCovered: 'المصحف الشريف شبه كامل (99% من النص)',
    description: 'مصحف ضخم من الحجم الكبير يضم أكثر من 400 صفحة من الرق، مكتوب بكوفية مبكرة متناسقة الأبعاد، وتظهر فيه نقاط الإعراب الدائرية الحمراء.',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
    scholarlySignificance: 'مرجع رئيسي لدراسة الرسم القرآني وتطور الخط العربي وضبط الآيات في العصور الإسلامية الأولى.',
  },
  {
    id: 'samarkand-kufic',
    title: 'Samarkand Kufic Codex',
    arabicTitle: 'مصحف سمرقند (مصحف طشقند)',
    location: 'مكتبة جامع تيا الشيخ (حضرة إمام)، طشقند (أوزبكستان)',
    carbonDating: 'القرن الثاني الهجري / الثامن الميلادي',
    centuryCE: 'القرن الثاني الهجري',
    scriptType: 'خط كوفي ضخم جليل',
    surahsCovered: 'من سورة البقرة إلى سورة الإسراء',
    description: 'مصحف حجري ضخم يزن عشرات الكيلوجرامات مكتوب على رق الغزال بأحرف كوفية جليلة، محفوظ في خزانة زجاجية خاصة في آسيا الوسطى.',
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    scholarlySignificance: 'من أشهر المصاحف التاريخية في الشرق الإسلامي التي تثبت تناسق قراءات الأمصار ووحدة النص القرآني.',
  },
]
