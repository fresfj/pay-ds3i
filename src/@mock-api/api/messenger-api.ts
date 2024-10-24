import _ from '@lodash'
import FuseUtils from '@fuse/utils'
import {
  Chat,
  Contact,
  Message,
  Profile
} from '../../app/main/apps/messenger/MessengerApi'
import mockApi from '../mock-api.json'
import ExtendedMockAdapter, { Params } from '../ExtendedMockAdapter'
import axios from 'axios'

const API_URL = 'https://evolution.richeli.dev/{endpoint/instance}'
const API_KEY = '92008D8711AD-4DCE-9525-6BA7D006B937'

const contactsDB = mockApi.components.examples.chat_contacts.value
let userDB = mockApi.components.examples.chat_profile.value
const userChatListDB = mockApi.components.examples.chat_chats.value as Chat[]
const messages = mockApi.components.examples.chat_messages.value
const chatsDB = userChatListDB.map(chat => ({
  ...chat,
  messages: messages.map(message => ({
    ...message,
    contactId: message.contactId === '' ? chat.contactId : userDB.id
  }))
}))

function transformContactData(apiData) {
  return apiData.map(contact => ({
    id: contact.remoteJid,
    avatar: contact.profilePicUrl || 'assets/images/avatars/default-avatar.jpg', // Define um avatar padrão se o URL estiver vazio
    name: contact.pushName,
    about: '',
    status: 'online',
    details: {
      emails: [], // Adicione os emails conforme necessário
      phoneNumbers: [
        {
          country: 'bs', // Use a lógica necessária para determinar o país
          phoneNumber: contact.remoteJid.replace('@s.whatsapp.net', ''), // Extrai o número de telefone do JID
          label: 'Mobile'
        }
      ],
      title: '', // Adicione o título conforme necessário
      company: '', // Adicione a empresa conforme necessário
      birthday: '', // Adicione a data de nascimento conforme necessário
      address: '' // Adicione o endereço conforme necessário
    },
    attachments: {
      media: [], // Adicione os arquivos de mídia conforme necessário
      docs: [], // Adicione os documentos conforme necessário
      links: [] // Adicione os links conforme necessário
    }
  }))
}

function transformApiData(apiData) {
  const lastMessages = apiData.reduce((acc, message) => {
    if (!message.message.conversation) {
      return acc
    }

    const remoteJid = message.key.remoteJid
    if (
      !acc[remoteJid] ||
      acc[remoteJid].messageTimestamp < message.messageTimestamp
    ) {
      acc[remoteJid] = message
    }

    acc[remoteJid].unreadCount = (acc[remoteJid].unreadCount || 0) + 1
    return acc
  }, {})

  return Object.values(lastMessages).map((msg: any) => ({
    id: msg.key.remoteJid,
    contactId: msg.key.participant,
    unreadCount: msg.unreadCount || 0,
    muted: msg.muted || false,
    lastMessage: msg.message.conversation,
    lastMessageAt: new Date(msg.messageTimestamp * 1000).toISOString()
  }))
}

export const messengerApiMocks = (mock: ExtendedMockAdapter) => {
  mock.onGet('/messenger/contacts').reply(() => {
    const options = {
      method: 'POST',
      headers: { apikey: API_KEY, 'Content-Type': 'application/json' },
      data: {},
      url: API_URL.replace('{endpoint/instance}', 'chat/findContacts/Francisco')
    }
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios(options)
        const transformedData = transformContactData(response.data)
        resolve([200, transformedData])
      } catch (error) {
        reject(error)
      }
    })
  })

  mock.onGet('/messenger/contacts/:contactId').reply(config => {
    const { contactId } = config.params as Params

    const contact = _.find(contactsDB, { id: contactId }) as Contact

    if (!contact) {
      return [404, 'Requested data do not exist.']
    }

    return [200, contact]
  })

  mock.onGet('/messenger/chats').reply(() => {
    userChatListDB.sort(
      (d1, d2) =>
        new Date(d2.lastMessageAt).getTime() -
        new Date(d1.lastMessageAt).getTime()
    )

    const options = {
      method: 'POST',
      headers: { apikey: API_KEY, 'Content-Type': 'application/json' },
      data: {},
      url: API_URL.replace('{endpoint/instance}', 'chat/findMessages/Francisco')
    }

    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios(options)

        const transformedData = transformApiData(response.data.messages.records)
        console.log(`transformedData`, transformedData)
        console.log(`userChatListDB`, userChatListDB)
        resolve([200, transformedData])
      } catch (error) {
        reject(error)
      }
    })
  })

  mock.onGet('/messenger/chats/:contactId').reply(config => {
    const { contactId } = config.params as Params

    const contact = _.find(contactsDB, { id: contactId }) as Contact

    if (!contact) {
      return [404, 'Requested data do not exist.']
    }

    const chat = _.find(chatsDB, { contactId })?.messages

    if (chat) {
      return [200, chat]
    }

    return [200, []]
  })

  mock.onPost('/messenger/chats/:contactId').reply(config => {
    const { contactId } = config.params as Params

    const contact = _.find(contactsDB, { id: contactId })

    if (!contact) {
      return [404, 'Requested data do not exist.']
    }

    const contactChat = _.find(chatsDB, { contactId }) as Chat

    if (!contactChat) {
      createNewChat(contactId)
    }

    const newMessage = createNewMessage(config.data as string, contactId)

    return [200, newMessage]
  })

  mock.onGet('/messenger/profile').reply(() => {
    return [200, userDB as Profile]
  })

  mock.onPut('/messenger/profile').reply(({ data }) => {
    const userData = JSON.parse(data as string) as Profile

    userDB = _.merge({}, userDB, userData)

    return [200, userDB]
  })

  function createNewMessage(value: string, contactId: string) {
    const message = {
      id: FuseUtils.generateGUID(),
      contactId: userDB.id,
      value,
      createdAt: new Date().toISOString(),
      chatId: ''
    }

    const selectedChat = _.find(chatsDB, { contactId }) as Chat & {
      messages: Message[]
    }
    const userSelectedChat = _.find(userChatListDB, { contactId })

    selectedChat.messages.push(message)
    selectedChat.lastMessage = value
    selectedChat.lastMessageAt = message.createdAt
    userSelectedChat.lastMessage = value
    userSelectedChat.lastMessageAt = message.createdAt

    return message
  }

  function createNewChat(contactId: string) {
    const newChat = {
      id: FuseUtils.generateGUID(),
      contactId,
      unreadCount: 0,
      muted: false,
      lastMessage: '',
      lastMessageAt: ''
    } as Chat

    userChatListDB.push(newChat)

    const newMessageData = {
      ...newChat,
      messages: []
    }

    chatsDB.push(newMessageData)

    return newMessageData
  }
}
