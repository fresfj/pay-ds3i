import _ from '@lodash'
import FuseUtils from '@fuse/utils'
import NotificationModel, {
  NotificationModelType
} from 'src/app/main/apps/notifications/models/NotificationModel'
import mockApi from '../mock-api.json'
import ExtendedMockAdapter, { Params } from '../ExtendedMockAdapter'

let notificationsDB: NotificationModelType[] = [] //mockApi.components.examples.notifications.value;

export const notificationsApiMocks = (mock: ExtendedMockAdapter) => {
  mock.onGet('/notifications').reply(() => [200, notificationsDB])

  mock.onDelete('/notifications').reply(() => {
    notificationsDB = []
    return [200]
  })

  mock.onPost('/notifications').reply(config => {
    const newNotification = NotificationModel({
      id: FuseUtils.generateGUID(),
      ...JSON.parse(config.data as string)
    } as NotificationModelType)

    notificationsDB.push(newNotification)

    return [200, newNotification]
  })

  mock.onDelete('/notifications/:id').reply(config => {
    const { id } = config.params as Params

    _.remove(notificationsDB, { id })

    return [200, id]
  })
}
