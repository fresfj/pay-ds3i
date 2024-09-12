import { ReactNode } from 'react'

/**
 * The type of the ModernPricingItemType.
 */
export type ModernPricingItemType = {
  period?: 'month' | 'year' | 'trimestral' | 'semestral' | 'anual'
  title?: string
  subtitle?: string
  yearlyPrice?: string
  monthlyPrice?: string
  buttonTitle?: string
  isPopular?: boolean
  details?: ReactNode
  icon?: string
}

export default ModernPricingItemType
