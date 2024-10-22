import _ from '@lodash'
import FuseUtils from '@fuse/utils'
import mockApi from '../mock-api.json'
import ExtendedMockAdapter, { Params } from '../ExtendedMockAdapter'
import { Event, Label } from '../../app/main/apps/calendar/CalendarApi'

const eventsDB = mockApi.components.examples.calendar_events.value as Event[]
const labelsDB = mockApi.components.examples.calendar_labels.value as Label[]
import firebase from 'firebase/compat/app'
import axios from 'axios'

export const calendarApiMocks = (mock: ExtendedMockAdapter) => {
  mock.onGet('/calendar/labels').reply(() => {
    return [200, labelsDB]
  })

  mock.onPost('/calendar/labels').reply(({ data }) => {
    const newLabel = {
      id: FuseUtils.generateGUID(),
      ...JSON.parse(data as string)
    } as Label
    labelsDB.push(newLabel)

    return [200, newLabel]
  })

  mock.onPut('/calendar/labels/:id').reply(config => {
    const { id } = config.params as Params

    _.assign(_.find(labelsDB, { id }), JSON.parse(config.data as string))

    return [200, _.find(labelsDB, { id })]
  })

  mock.onGet('/calendar/labels/:id').reply(config => {
    const { id } = config.params as Params

    const response = _.find(labelsDB, { label: id })

    if (response) {
      return [200, response]
    }

    return [404, 'Requested label do not exist.']
  })

  mock.onGet('/calendar/labels/:id').reply(config => {
    const { id } = config.params as Params

    const response = _.find(labelsDB, { label: id })

    if (response) {
      return [200, response]
    }

    return [404, 'Requested label do not exist.']
  })

  mock.onDelete('/calendar/labels/:id').reply(config => {
    const { id } = config.params as Params
    _.remove(labelsDB, { id })
    _.remove(eventsDB, { extendedProps: { label: id } })

    return [200, id]
  })

  mock.onGet('/calendar/events').reply(() => {
    const eventsRef = firebase.firestore().collection('events')
    return new Promise(async (resolve, reject) => {
      await eventsRef
        .get()
        .then(async querySnapshot => {
          const eventsDB = querySnapshot.docs.map((doc, index) => {
            return doc.data()
          })
          resolve([200, eventsDB])
        })
        .catch(error => {
          resolve([404, 'Requested product do not exist.'])
        })
    })
  })

  mock.onPost('/calendar/events').reply(({ data }) => {
    const uid = FuseUtils.generateGUID()
    const newEvent = {
      id: uid,
      ...JSON.parse(data as string),
      updatedAt: new Date()
    } as Event

    console.log(`events`, newEvent)

    const eventsRef = firebase.firestore().collection('events').doc(uid)
    return new Promise(async (resolve, reject) => {
      try {
        await eventsRef.set(newEvent)
        // await axios.post(
        //   'https://n8n2.richeli.dev/webhook-test/36b14b00-fb8e-42fd-977d-61ee111d6a10',
        //   newEvent
        // )
        eventsDB.push(newEvent)
        resolve([200, newEvent])
      } catch (error) {
        reject(error)
      }
    })
  })

  mock.onPut('/calendar/events/:id').reply(config => {
    const { id } = config.params as Params

    _.assign(
      _.find(eventsDB, { id }),
      JSON.parse(config.data as string)
    ) as Event

    return [200, _.find(eventsDB, { id })]
  })

  mock.onGet('/calendar/events/:id').reply(config => {
    const { id } = config.params as Params

    const response = _.find(eventsDB, { event: id })

    if (response) {
      return [200, response]
    }

    return [404, 'Requested event do not exist.']
  })

  mock.onDelete('/calendar/events/:id').reply(config => {
    const { id } = config.params as Params

    _.remove(eventsDB, { id })

    return [200, id]
  })
}
