export type PlanTier = 'free' | 'pro' | 'patron'
export type CurrencyCode = 'DZD' | 'USD'

export interface PlanPricing {
  amount: number
  currency: CurrencyCode
  formatted: string
}

export interface PlanConfig {
  id: PlanTier
  title: string
  subtitle: string
  pricing: Record<CurrencyCode, PlanPricing>
  features: string[]
}

export const PLANS: Record<PlanTier, PlanConfig> = {
  free: {
    id: 'free',
    title: 'الباحث المستقل (Free)',
    subtitle: 'الوصول الأساسي لمصحف التناظر والبحث اللفظي',
    pricing: {
      DZD: { amount: 0, currency: 'DZD', formatted: '0 د.ج' },
      USD: { amount: 0, currency: 'USD', formatted: '$0' },
    },
    features: ['البحث القرآني الأساسي', 'تصفح المصحف الميسر', 'مشروع بحثي واحد'],
  },
  pro: {
    id: 'pro',
    title: 'المحقق الأكاديمي (Pro Scholar)',
    subtitle: 'محرك التحليل الصوتي والاشتقاق ومساعد الذكاء الاصطناعي',
    pricing: {
      DZD: { amount: 2500, currency: 'DZD', formatted: '2,500 د.ج' },
      USD: { amount: 19, currency: 'USD', formatted: '$19' },
    },
    features: [
      'الوكيل الذكي المتخصص (Gemini 2.5)',
      'مختبر التناظر القرآني والصوتي الكامل',
      'تصدير الدوسيهات العلمية الأكاديمية (PDF/Markdown)',
      'مشاريع بحثية غير محدودة',
    ],
  },
  patron: {
    id: 'patron',
    title: 'الوقف والراعي الرقمي (Patron)',
    subtitle: 'دعم استمرارية وتطوير منصة القرآن العظيم والوقف العلمي',
    pricing: {
      DZD: { amount: 5000, currency: 'DZD', formatted: '5,000 د.ج' },
      USD: { amount: 49, currency: 'USD', formatted: '$49' },
    },
    features: [
      'جميع مزايا باقة المحقق الأكاديمي',
      'شارة الراعي الرقمي في الملف الشخصي والدوسيهات',
      'وصول مبكر لنماذج التحليل اللغوي التجريبية',
      'سهم وقفي لدعم خوادم البحث المفتوح للمسلمين',
    ],
  },
}

export function getPlanAmount(plan: PlanTier, currency: CurrencyCode): number {
  return PLANS[plan]?.pricing[currency]?.amount ?? PLANS.pro.pricing[currency].amount
}

export function getPlanTitle(plan: PlanTier): string {
  return PLANS[plan]?.title ?? PLANS.pro.title
}
