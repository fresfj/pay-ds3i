import { FuseRouteConfigsType } from '@fuse/utils/FuseUtils'
import maintenancePageConfig from './maintenance/maintenancePageConfig'
import activitiesPageConfig from './activities/activitiesPageConfig'
import authenticationPagesConfig from './authentication/authenticationPagesConfig'
import comingSoonPagesConfig from './coming-soon/comingSoonPagesConfig'
import invoicePagesConfig from './invoice/invoicePagesConfig'
import errorPagesConfig from './error/errorPagesConfig'
import pricingPagesConfig from './pricing/pricingPagesConfig'
import plansPagesConfig from './plans/plansPagesConfig'
import searchPagesConfig from './search/searchPagesConfig'
import checkoutPagesConfig from './checkout/CheckoutAppConfig'
import productPagesConfig from './product/productPagesConfig'
import whatsappConfig from './whatsapp/whatsappConfig'
import instagramAppConfig from './instagram/instagramAppConfig'
import instancesPagesConfig from './Instances/instancesConfig'

/**
 * The pages routes config.
 */
const pagesConfigs: FuseRouteConfigsType = [
  ...authenticationPagesConfig,
  checkoutPagesConfig,
  instancesPagesConfig,
  instagramAppConfig,
  plansPagesConfig,
  whatsappConfig,
  productPagesConfig,
  comingSoonPagesConfig,
  errorPagesConfig,
  maintenancePageConfig,
  invoicePagesConfig,
  activitiesPageConfig,
  pricingPagesConfig,
  searchPagesConfig
]

export default pagesConfigs
