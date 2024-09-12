import _ from '@lodash'
import { PartialDeep } from 'type-fest'
import { EcommerceProduct } from '../../ECommerceApi'

/**
 * The product model.
 */
const ProductModel = (data: PartialDeep<EcommerceProduct>) =>
  _.defaults(data || {}, {
    id: _.uniqueId('product-'),
    name: '',
    handle: '',
    description: '',
    categories: [],
    tags: [],
    colors: [],
    gender: [],
    sizes: [],
    flavors: [],
    label: {
      content: '',
      enabled: false
    },
    featuredImageId: '',
    images: [],
    priceTaxExcl: 0,
    priceTaxIncl: 0,
    taxRate: 0,
    comparedPrice: 0,
    quantity: 0,
    sku: '',
    width: '',
    height: '',
    depth: '',
    weight: '',
    recurrent: false,
    installments: 1,
    extraShippingFee: 0,
    price: '',
    active: true,
    coupon: true,
    publish: true,
    image: '',
    total: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    isSubscription: false,
    paymentMethods: ['pix', 'card'],
    subscriptionOptions: [],
    linkedProducts: [],
    upSellProducts: [],
    orderBumpProducts: []
  })

export default ProductModel
