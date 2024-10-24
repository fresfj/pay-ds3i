import i18next from 'i18next'
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType'
import pt from './navigation-i18n/pt'
import ar from './navigation-i18n/ar'
import en from './navigation-i18n/en'
import tr from './navigation-i18n/tr'
import { authRoles } from '../auth'

i18next.addResourceBundle('pt', 'navigation', pt)
i18next.addResourceBundle('en', 'navigation', en)
i18next.addResourceBundle('tr', 'navigation', tr)
i18next.addResourceBundle('ar', 'navigation', ar)

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavItemType[] = [
  {
    id: 'dashboards',
    title: 'Dashboards',
    subtitle: 'Unique dashboard designs',
    type: 'group',
    icon: 'heroicons-outline:home',
    translate: 'DASHBOARDS',
    auth: authRoles.admin, //['admin']
    children: [
      {
        id: 'dashboards.project',
        title: 'Project',
        type: 'item',
        icon: 'solar:clipboard-check-bold-duotone',
        url: '/dashboards/project'
      },
      {
        id: 'dashboards.analytics',
        title: 'Analytics',
        type: 'item',
        icon: 'solar:chart-2-bold-duotone',
        url: '/dashboards/analytics'
      },
      {
        id: 'dashboards.e-commerce',
        title: 'E-Commerce',
        type: 'item',
        icon: 'solar:cart-3-bold-duotone',
        url: '/dashboards/e-commerce'
      },
      {
        id: 'dashboards.finance',
        title: 'Finance',
        type: 'item',
        icon: 'solar:dollar-line-duotone',
        url: '/dashboards/finance'
      }
    ]
  },
  {
    id: 'apps',
    title: 'Applications',
    subtitle: 'Custom made application designs',
    type: 'group',
    icon: 'solar:users-group-two-rounded-bold-duotone',
    translate: 'APPLICATIONS',
    children: [
      {
        id: 'apps.academy',
        title: 'Creabox Club',
        type: 'item',
        icon: 'solar:users-group-two-rounded-bold-duotone',
        url: '/apps/academy',
        translate: 'ACADEMY'
      },
      {
        id: 'apps.shop',
        title: 'Shop',
        type: 'item',
        icon: 'solar:cart-3-bold-duotone',
        url: '/apps/shop',
        translate: 'SHOP'
      },
      {
        id: 'apps.calendar',
        title: 'Calendar',
        subtitle: '3 upcoming events',
        type: 'item',
        icon: 'solar:calendar-line-duotone',
        url: '/apps/calendar',
        translate: 'CALENDAR'
      },
      {
        id: 'apps.messenger',
        title: 'Messenger',
        type: 'item',
        icon: 'solar:chat-line-line-duotone',
        url: '/apps/messenger',
        translate: 'MESSENGER'
      },
      {
        id: 'apps.quiz',
        title: 'Quiz',
        type: 'item',
        icon: 'solar:star-bold-duotone',
        url: '/apps/quiz',
        translate: 'QUIZ'
      },
      {
        id: 'apps.customers',
        title: 'customers',
        type: 'item',
        icon: 'solar:users-group-rounded-bold-duotone',
        url: '/apps/customers',
        translate: 'CUSTOMERS'
      },
      {
        id: 'apps.ecommerce',
        title: 'ECommerce',
        type: 'collapse',
        icon: 'solar:shop-bold-duotone',
        translate: 'ECOMMERCE',
        children: [
          {
            id: 'e-commerce-products',
            title: 'Products',
            translate: 'PRODUCTS',
            type: 'item',
            url: 'apps/e-commerce/products',
            end: true
          },
          {
            id: 'e-commerce-orders',
            title: 'Orders',
            translate: 'ORDERS',
            type: 'item',
            url: 'apps/e-commerce/orders',
            end: true
          },
          {
            id: 'e-commerce-coupons',
            title: 'Coupons',
            translate: 'COUPONS',
            type: 'item',
            url: 'apps/e-commerce/coupons'
          }
        ]
      },
      {
        id: 'apps.invoice',
        title: 'Invoice',
        type: 'collapse',
        icon: 'solar:bill-list-bold-duotone',
        translate: 'INVOICE',
        children: [
          {
            id: 'subscriptions',
            title: 'Subscriptions',
            translate: 'SUBSCRIPTIONS',
            type: 'item',
            url: 'apps/invoice/subscriptions',
            end: true
          }
        ]
      },
      {
        id: 'apps.help-center',
        title: 'Help Center',
        type: 'collapse',
        icon: 'solar:help-line-duotone',
        url: '/apps/help-center',
        translate: 'HELP_CENTER',
        children: [
          {
            id: 'apps.help-center.home',
            translate: 'HELP_CENTER',
            title: 'Home',
            type: 'item',
            url: '/apps/help-center',
            end: true
          },
          {
            id: 'apps.help-center.faqs',
            translate: 'FAQs',
            title: 'FAQs',
            type: 'item',
            url: '/apps/help-center/faqs'
          },
          {
            id: 'apps.help-center.guides',
            translate: 'GUIDES',
            title: 'Guides',
            type: 'item',
            url: '/apps/help-center/guides'
          },
          {
            id: 'apps.help-center.support',
            translate: 'SUPPORT',
            title: 'Support',
            type: 'item',
            url: '/apps/help-center/support'
          }
        ]
      },
      {
        id: 'apps.user',
        title: 'User',
        translate: 'ACCOUNT',
        type: 'collapse',
        icon: 'solar:user-circle-bold-duotone',
        url: '/apps/account',
        children: [
          {
            id: 'apps.user.account',
            title: 'Minha Conta',
            translate: 'MY_ACCOUNT',
            type: 'item',
            url: '/apps/account/settings',
            end: true
          },
          {
            id: 'apps.user.orders',
            title: 'Meus Pedidos',
            translate: 'MY_ORDERS',
            type: 'item',
            url: 'apps/account/orders'
          },
          {
            id: 'apps.user.referral',
            title: 'Minhas Indicações',
            translate: 'MY_RECOMMENDATIONS',
            type: 'item',
            url: 'apps/account/referral'
          }
        ]
      },
      {
        id: 'apps.settings',
        title: 'Settings',
        type: 'collapse',
        icon: 'solar:settings-bold-duotone',
        translate: 'SETTINGS',
        children: [
          {
            id: 'instagram',
            title: 'Instagram',
            type: 'item',
            url: 'apps/settings/instagram',
            end: true
          },
          {
            id: 'trigger',
            title: 'Disparo',
            type: 'item',
            url: 'apps/settings/trigger',
            end: true
          },
          {
            id: 'contact-group',
            title: 'Grupo de Contato',
            type: 'item',
            url: 'apps/settings/contacts',
            end: true
          },
          {
            id: 'instances',
            title: 'Instâncias',
            type: 'item',
            url: 'apps/settings/instances',
            end: true
          }
        ]
      }
    ]
  }
]

const navigationUserConfig: FuseNavItemType[] = [
  {
    id: 'apps',
    title: 'Applications',
    subtitle: 'Custom made application designs',
    type: 'group',
    icon: 'heroicons-outline:cube',
    translate: 'APPLICATIONS',
    children: [
      {
        id: 'apps.academy',
        title: 'Creabox Club',
        type: 'item',
        icon: 'heroicons-outline:users',
        url: '/apps/academy',
        translate: 'ACADEMY'
      },
      {
        id: 'apps.help-center',
        title: 'Help Center',
        type: 'collapse',
        icon: 'heroicons-outline:support',
        url: '/apps/help-center',
        translate: 'HELP_CENTER',
        children: [
          {
            id: 'apps.help-center.home',
            translate: 'HELP_CENTER',
            title: 'Home',
            type: 'item',
            url: '/apps/help-center',
            end: true
          },
          {
            id: 'apps.help-center.faqs',
            translate: 'FAQs',
            title: 'FAQs',
            type: 'item',
            url: '/apps/help-center/faqs'
          },
          {
            id: 'apps.help-center.guides',
            translate: 'GUIDES',
            title: 'Guides',
            type: 'item',
            url: '/apps/help-center/guides'
          },
          {
            id: 'apps.help-center.support',
            translate: 'SUPPORT',
            title: 'Support',
            type: 'item',
            url: '/apps/help-center/support'
          }
        ]
      }
    ]
  },
  {
    id: 'apps.user',
    title: 'User',
    translate: 'ACCOUNT',
    type: 'collapse',
    icon: 'solar:user-circle-bold-duotone',
    url: '/apps/account',
    children: [
      {
        id: 'apps.user.account',
        title: 'Minha Conta',
        translate: 'MY_ACCOUNT',
        type: 'item',
        url: '/apps/account/settings',
        end: true
      },
      {
        id: 'apps.user.orders',
        title: 'Meus Pedidos',
        translate: 'MY_ORDERS',
        type: 'item',
        url: 'apps/account/orders'
      },
      {
        id: 'apps.user.recommendations',
        title: 'Minhas Indicações',
        translate: 'MY_RECOMMENDATIONS',
        type: 'item',
        url: 'apps/account/referral'
      }
    ]
  },
  {
    id: 'auth',
    title: 'Auth',
    translate: 'AUTH',
    type: 'group',
    icon: 'verified_user',
    children: [
      {
        id: 'sign-out',
        title: 'Sign out',
        translate: 'SIGN_OUT',
        type: 'item',
        url: 'sign-out',
        icon: 'exit_to_app'
      }
    ]
  }
]
export { navigationConfig, navigationUserConfig }
