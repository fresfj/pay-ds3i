import FuseUtils from '@fuse/utils'
import _ from '@lodash'
import ExtendedMockAdapter, { Params } from '../ExtendedMockAdapter'
import firebase from 'firebase/compat/app'
import axios from 'axios'

export const instanceApiMocks = (mock: ExtendedMockAdapter) => {
  /**
   * GET BOARDS
   * GET api/instance/boards
   */
  mock.onGet('/instance/boards').reply(() => {
    return [200, []]
  })

  /**
   * CREATE NEW BOARD
   * POST api/instance/boards
   */
  mock.onPost('/instance/boards').reply(({ data }) => {
    const uid = FuseUtils.generateGUID()
    const batch = firebase.firestore().batch()
    const contacts = JSON.parse(data as string)
    const instanceRef = firebase.firestore().collection('instances').doc(uid)

    return new Promise(async (resolve, reject) => {
      try {
        contacts.forEach(contact => {
          const contactRef = instanceRef.collection('contacts').doc(contact._id)
          batch.set(contactRef, contact)
        })

        await batch.commit()
        resolve([200, contacts])
      } catch (error) {
        reject(error)
      }
    })
  })

  /**
   * GET BOARD LABELS
   * GET api/instance/boards/:boardId/labels
   */
  mock.onGet('/instance/boards/:boardId/labels').reply(config => {
    const { boardId } = config.params as Params

    return [200, '']
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
   * UPDATE BOARD
   * PUT api/instance/boards/:boardId
   */
  mock.onPut('/instance/boards/:boardId').reply(config => {
    const { boardId } = config.params as Params

    return [200, '']
  })

  /**
   * DELETE BOARD
   * DELETE api/instance/boards/:boardId
   */
  mock.onDelete('/instance/boards/:boardId').reply(config => {
    const { boardId } = config.params as Params
    return [200, '']
  })

  /**
   * GET ALL MEMBERS
   * GET api/instance/members
   */
  mock.onGet('/instance/members').reply(() => {
    return [200, '']
  })
}
