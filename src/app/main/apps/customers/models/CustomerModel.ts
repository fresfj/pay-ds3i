import _ from '@lodash'
import { PartialDeep } from 'type-fest'
import { Customer, CustomerEmail, CustomerPhoneNumber } from '../CustomersApi'

/**
 * The Customer phone number model.
 */
export const CustomerPhoneModel = (
  data: PartialDeep<CustomerPhoneNumber> | null
): CustomerPhoneNumber =>
  _.defaults(data || {}, {
    country: '',
    phoneNumber: '',
    label: ''
  })

/**
 * The Customer email model.
 */
export const CustomerEmailModel = (
  data: Partial<CustomerEmail> | null
): CustomerEmail =>
  _.defaults(data || {}, {
    email: '',
    label: ''
  })

/**
 * The Customer model.
 */
const CustomerModel = (data: PartialDeep<Customer>): Customer =>
  _.defaults(data || {}, {
    id: _.uniqueId(),
    avatar: '',
    background: '',
    name: '',
    emails: [CustomerEmailModel(null)],
    phoneNumbers: [CustomerPhoneModel(null)],
    title: '',
    company: '',
    birthday: '',
    address: '',
    notes: '',
    tags: []
  })

export default CustomerModel
