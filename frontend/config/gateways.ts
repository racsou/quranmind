export type PaymentGatewayId = 'slickpay' | 'stripe'

export interface GatewayConfig {
  id: PaymentGatewayId
  title: string
  subtitle: string
  defaultCurrency: 'DZD' | 'USD'
  supportedCurrencies: ('DZD' | 'USD')[]
  badgeText: string
}

export const PAYMENT_GATEWAYS: Record<PaymentGatewayId, GatewayConfig> = {
  slickpay: {
    id: 'slickpay',
    title: 'SlickPay (SATIM / الذهبية)',
    subtitle: 'الدفع بالدينار الجزائري عبر البطاقة الذهبية أو بطاقة CIB البنكية',
    defaultCurrency: 'DZD',
    supportedCurrencies: ['DZD'],
    badgeText: '🇩🇿 الدفع المحلي بالدينار',
  },
  stripe: {
    id: 'stripe',
    title: 'Stripe Checkout',
    subtitle: 'الدفع الدولي بالبطاقات البنكية العالمية (Visa / MasterCard / Amex)',
    defaultCurrency: 'USD',
    supportedCurrencies: ['USD'],
    badgeText: '🌐 الدفع الدولي بالدولار',
  },
}
