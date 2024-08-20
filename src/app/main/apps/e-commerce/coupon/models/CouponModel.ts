import _ from '@lodash'
import { PartialDeep } from 'type-fest'
import { EcommerceCoupon } from '../../ECommerceApi'

/**
 * The coupon model.
 */
const CouponModel = (data: PartialDeep<EcommerceCoupon>) =>
  _.defaults(data || {}, {
    id: _.uniqueId('coupon-'),
    description: '',
    code: '',
    value: 0,
    quantity: 0,
    amount: {
      applied: '%',
      type: true,
      value: ''
    },
    createdAt: new Date(),
    updatedAt: new Date()
  })

export default CouponModel
