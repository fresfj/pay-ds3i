import { FuseRouteConfigsType } from '@fuse/utils/FuseUtils'
import AcademyAppConfig from './academy/AcademyAppConfig'
import CalendarAppConfig from './calendar/CalendarAppConfig'
import MessengerAppConfig from './messenger/MessengerAppConfig'
import ContactsAppConfig from './contacts/ContactsAppConfig'
import CustomerAppConfig from './customers/CustomersAppConfig'
import ECommerceAppConfig from './e-commerce/ECommerceAppConfig'
import AccountAppConfig from './account/AccountAppConfig2'

import InvoiceAppConfig from './invoice/InvoiceAppConfig'

import QuizAppConfig from './quiz/QuizAppConfig'

import FileManagerAppConfig from './file-manager/FileManagerAppConfig'
import HelpCenterAppConfig from './help-center/HelpCenterAppConfig'
import MailboxAppConfig from './mailbox/MailboxAppConfig'
import NotesAppConfig from './notes/NotesAppConfig'
import ProfileAppConfig from './profile/profileAppConfig'
import ScrumboardAppConfig from './scrumboard/ScrumboardAppConfig'
import TasksAppConfig from './tasks/TasksAppConfig'
import NotificationsAppConfig from './notifications/NotificationsAppConfig'
import ShopAppConfig from './shop/ShopAppConfig'
import TriggerConfig from './trigger/TriggerConfig'

/**
 * The list of application configurations.
 */
const appsConfigs: FuseRouteConfigsType = [
  AcademyAppConfig,
  TriggerConfig,
  CalendarAppConfig,
  MessengerAppConfig,
  ContactsAppConfig,
  CustomerAppConfig,
  ECommerceAppConfig,
  AccountAppConfig,
  ShopAppConfig,
  InvoiceAppConfig,
  QuizAppConfig,
  FileManagerAppConfig,
  HelpCenterAppConfig,
  MailboxAppConfig,
  NotesAppConfig,
  ProfileAppConfig,
  ScrumboardAppConfig,
  TasksAppConfig,
  NotificationsAppConfig
]

export default appsConfigs
