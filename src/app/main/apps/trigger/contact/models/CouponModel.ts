import _ from '@lodash'
import { PartialDeep } from 'type-fest'
import { EcommerceCoupon } from '../../TriggerApi'

/**
 *
 * The coupon model.
 */
const CouponModel = (data: PartialDeep<EcommerceCoupon>) =>
  _.defaults(data || {}, {
    id: _.uniqueId('contacts-'),
    name: '',
    description: '',
    status: true,
    createdAt: new Date(),
    updatedAt: new Date()
  })

export default CouponModel
