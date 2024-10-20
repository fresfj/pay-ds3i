import FuseUtils from '@fuse/utils'
import _ from '@lodash'
import ExtendedMockAdapter, { Params } from '../ExtendedMockAdapter'
import firebase from 'firebase/compat/app'
import axios from 'axios'
const token = '1628a15460aafe7b6f0510bedbf95988'
const header = {
  headers: { 'Content-Type': 'application/json', apikey: token }
}
export const instanceApiMocks = (mock: ExtendedMockAdapter) => {
  /**
   * GET BOARDS
   * GET api/instance/boards
   */
  mock.onGet('/instance/boards').reply(() => {
    console.log(`boardsboards`)
    return [200, []]
  })

  mock.onGet('/instance/referral/:instanceId').reply(config => {
    const { instanceId } = config.params as Params
    const instanceRef = firebase
      .firestore()
      .collection('instances')
      .doc(instanceId)

    return new Promise(async (resolve, reject) => {
      try {
        const doc = await instanceRef.get()
        if (!doc.exists) {
          return [404, { message: 'Instance not found' }]
        }

        const instance = doc.data()
        resolve([200, instance])
      } catch (error) {
        reject(error)
      }
    })
  })
  mock.onPost('/instance/sendText/:instanceId').reply(({ data }) => {
    const instance = JSON.parse(data as string)
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(
          `https://evolution.richeli.dev/message/sendText/${instance.instanceName}`,
          {
            number: instance?.remoteJid ? instance?.remoteJid : instance?.id,
            text: instance.message,
            linkPreview: true,
            mentionsEveryOne: true
          },
          header
        )
        resolve([200, response.data])
      } catch (error) {
        reject(error)
      }
    })
  })
  mock.onGet('/instance/groups/:instanceId').reply(config => {
    const { instanceId } = config.params as Params
    const instanceRef = firebase
      .firestore()
      .collection('instances')
      .doc(instanceId)

    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(
          `https://evolution.richeli.dev/group/fetchAllGroups/${instanceId}?getParticipants=true`,
          header
        )

        console.log(`groups`, response)
        resolve([200, response.data])
      } catch (error) {
        reject(error)
      }
    })
  })
  mock.onGet('/instance/contacts/:instanceId').reply(config => {
    const { instanceId } = config.params as Params
    const instanceRef = firebase
      .firestore()
      .collection('instances')
      .doc(instanceId)

    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(
          `https://evolution.richeli.dev/chat/findContacts/${instanceId}`,
          {},
          header
        )

        console.log(`connect`, response)
        resolve([200, response.data])
      } catch (error) {
        reject(error)
      }
    })
  })
  mock.onGet('/instance/connect/:instanceId').reply(config => {
    console.log(`connect`, config.params)
    const { instanceId } = config.params as Params
    const instanceRef = firebase
      .firestore()
      .collection('instances')
      .doc(instanceId)

    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(
          `https://evolution.richeli.dev/instance/connect/${instanceId}`,
          header
        )

        console.log(`connect`, response)
        resolve([200, response.data])
      } catch (error) {
        reject(error)
      }
    })
  })
  mock.onGet('/instance/:instanceId').reply(config => {
    const { instanceId } = config.params as Params
    const instanceRef = firebase
      .firestore()
      .collection('instances')
      .doc(instanceId)

    return new Promise(async (resolve, reject) => {
      try {
        // const doc = await instanceRef.get()
        // if (!doc.exists) {
        //   return [404, { message: 'Instance not found' }]
        // }

        // const instance = doc.data()
        // resolve([200, instance])

        const response = await axios.get(
          'https://evolution.richeli.dev/instance/fetchInstances',
          header
        )

        console.log(`instance/:instanceId`, response)
        resolve([200, response.data])
      } catch (error) {
        reject(error)
      }
    })
  })

  mock.onGet('/instance/:id/:instanceId').reply(config => {
    const { instanceId, id } = config.params as Params
    const instanceRef = firebase
      .firestore()
      .collection('instances')
      .doc(instanceId)

    return new Promise(async (resolve, reject) => {
      try {
        // const doc = await instanceRef.get()
        // if (!doc.exists) {
        //   return [404, { message: 'Instance not found' }]
        // }

        // const instance = doc.data()
        // resolve([200, instance])

        const response = await axios.get(
          `https://evolution.richeli.dev/instance/fetchInstances?instanceId=${instanceId}`,
          header
        )

        console.log(`instanceId=`, response)
        resolve([200, response.data[0]])
      } catch (error) {
        reject(error)
      }
    })
  })

  mock.onPost('/instance/group/participants/:instanceId').reply(({ data }) => {
    const participant = JSON.parse(data as string)
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(
          `https://evolution.richeli.dev/chat/fetchProfile/${participant.instanceName}`,
          { number: participant.id },
          header
        )
        resolve([200, response.data])
      } catch (error) {
        reject(error)
      }
    })
  })
  /**
   * CREATE NEW BOARD
   * POST api/instance/create
   */
  mock.onPost('/instance/create').reply(({ data }) => {
    const instance = JSON.parse(data as string)

    console.log(`instance`, instance)
    const batch = firebase.firestore().batch()
    // const instanceRef = firebase
    //   .firestore()
    //   .collection('instances')
    //   .doc(user.id)
    //'apikey: 1628a15460aafe7b6f0510bedbf95988'
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(
          'https://evolution.richeli.dev/instance/create',
          instance,
          header
        )

        console.log(`create`, response)
        // instanceRef.set({
        //   ...user,
        //   created_at: new Date(),
        //   updated_at: new Date()
        // })

        // contacts.forEach(contact => {
        //   const contactRef = instanceRef.collection('contacts').doc(contact._id)
        //   batch.set(contactRef, contact)
        // })

        //await batch.commit()
        resolve([200, response.data])
      } catch (error) {
        reject(error)
      }
    })
  })

  /**
   * DELETE BOARD
   * DELETE api/instance/boards/:boardId
   */
  mock.onDelete('/instance/:instanceId').reply(config => {
    const { instanceId } = config.params as Params
    console.log(`instanceId`, instanceId)

    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.delete(
          `https://evolution.richeli.dev/instance/delete/${instanceId}`,
          header
        )

        console.log(`onDelete`, response.data)
        resolve([200, response.data])
      } catch (error) {
        reject(error)
      }
    })
  })
  /**
   * UPDATE BOARD
   * PUT api/instance/boards/:boardId
   */
  mock.onPut('/instance/boards/:boardId').reply(({ data }) => {
    const { groups, user } = JSON.parse(data as string)
    const batch = firebase.firestore().batch()
    const instanceRef = firebase
      .firestore()
      .collection('instances')
      .doc(user.id)
    return new Promise(async (resolve, reject) => {
      try {
        instanceRef.update({
          ...user,
          updated_at: new Date()
        })

        groups.forEach(group => {
          const contactRef = instanceRef.collection('groups').doc(group.id)
          batch.set(contactRef, group)
        })

        await batch.commit()
        resolve([200, groups])
      } catch (error) {
        reject(error)
      }
    })
  })

  /**
   * CREATE CARD
   * PUT api/instance/boards/:boardId/lists/:listId/cards
   */
  mock.onPost('/instance/boards/:boardId/lists/:listId/cards').reply(config => {
    const { boardId, listId } = config.params as Params

    return [200, '']
  })

  /**
   * UPDATE CARD
   * PUT api/instance/boards/:boardId/cards/:cardId
   */
  mock.onPut('/instance/boards/:boardId/cards/:cardId').reply(config => {
    const { cardId } = config.params as Params

    return [200, '']
  })

  /**
   * DELETE CARD
   * api/instance/boards/:boardId/cards/:cardId
   */
  mock.onDelete('/instance/boards/:boardId/cards/:cardId').reply(config => {
    const { boardId, cardId } = config.params as Params

    return [200, '']
  })

  /** GET LISTS BY BOARD ID
   * GET /instance/boards/:boardId/lists
   */
  mock.onGet('/instance/boards/:boardId/lists').reply(config => {
    const { boardId } = config.params as Params

    return [200, '']
  })

  /**
   * UPDATE LIST
   * PUT api/instance/boards/:boardId/lists/:listId
   */
  mock.onPut('/instance/boards/:boardId/lists/:listId').reply(config => {
    const { listId } = config.params as Params

    return [200, '']
  })

  /**
   * CREATE LIST
   * POST api/instance/boards/:boardId/lists
   */
  mock.onPost('/instance/boards/:boardId/lists').reply(config => {
    const { boardId } = config.params as Params

    return [200, '']
  })

  /**
   * DELETE LIST
   * DELETE api/instance/boards/:boardId/lists/:listId
   */
  mock.onDelete('/instance/boards/:boardId/lists/:listId').reply(config => {
    const { boardId, listId } = config.params as Params

    return [200, '']
  })

  /**
   * GET BOARD CARDS
   * GET api/instance/boards/:boardId/cards
   */
  mock.onGet('/instance/boards/:boardId/cards').reply(config => {
    const { boardId } = config.params as Params

    return [200, '']
  })

  /**
   * GET BOARD
   * GET api/instance/boards/:boardId
   */
  mock.onGet('/instance/boards/:boardId').reply(config => {
    const { boardId } = config.params as Params

    return [404, 'Requested board do not exist.']
  })

  /**
   * GET ALL MEMBERS
   * GET api/instance/members
   */
  mock.onGet('/instance/members').reply(() => {
    return [200, '']
  })
}
