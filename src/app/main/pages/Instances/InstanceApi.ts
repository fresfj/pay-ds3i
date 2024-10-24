import { apiService as api } from 'app/store/apiService'
import { DropResult } from 'react-beautiful-dnd'
import { PartialDeep } from 'type-fest'
import _ from '@lodash'
import { AppRootStateType } from './store'
import { createSelector } from '@reduxjs/toolkit'
import FuseUtils from '@fuse/utils'
import { selectSearchText } from './store/searchTextSlice'

export const addTagTypes = [
  'instance_members',
  'instance_board_lists',
  'instance_member',
  'instance_send_text',
  'instance_board_list',
  'instance_board_labels',
  'instance_board_label',
  'instance_board_cards',
  'instance_board_card',
  'instance_boards',
  'instance_board'
] as const

const InstanceApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: build => ({
      getInstanceMembers: build.query<
        GetInstanceMembersApiResponse,
        GetInstanceMembersApiArg
      >({
        query: () => ({ url: `/mock-api/instance/members` }),
        providesTags: ['instance_members']
      }),
      createInstanceMember: build.mutation<
        CreateInstanceMemberApiResponse,
        CreateInstanceMemberApiArg
      >({
        query: member => ({
          url: `/mock-api/instance/members`,
          method: 'POST',
          data: member
        }),
        invalidatesTags: ['instance_members']
      }),
      getInstanceMember: build.query<
        GetInstanceMemberApiResponse,
        GetInstanceMemberApiArg
      >({
        query: memberId => ({
          url: `/mock-api/instance/members/${memberId}`
        }),
        providesTags: ['instance_member']
      }),
      updateInstanceMember: build.mutation<
        UpdateInstanceMemberApiResponse,
        UpdateInstanceMemberApiArg
      >({
        query: member => ({
          url: `/mock-api/instance/members/${member.id}`,
          method: 'PUT',
          data: member
        }),
        invalidatesTags: ['instance_member']
      }),
      deleteInstanceMember: build.mutation<
        DeleteInstanceMemberApiResponse,
        DeleteInstanceMemberApiArg
      >({
        query: memberId => ({
          url: `/mock-api/instance/members/${memberId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['instance_members']
      }),
      getInstanceLists: build.query<
        GetInstanceListsApiResponse,
        GetInstanceListsApiArg
      >({
        query: boardId => ({
          url: `/mock-api/instance/boards/${boardId}/lists`
        }),
        providesTags: ['instance_board_lists']
      }),
      createInstanceList: build.mutation<
        CreateInstanceListApiResponse,
        CreateInstanceListApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/instance/boards/${queryArg.boardId}/lists`,
          method: 'POST',
          data: queryArg.list
        }),
        invalidatesTags: ['instance_board_lists', 'instance_board']
      }),
      getInstanceList: build.query<
        GetInstanceListApiResponse,
        GetInstanceListApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/instance/boards/${queryArg.boardId}/lists/${queryArg.listId}`
        }),
        providesTags: ['instance_board_lists', 'instance_board_list']
      }),
      updateInstanceList: build.mutation<
        UpdateInstanceListApiResponse,
        UpdateInstanceListApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/instance/boards/${queryArg.boardId}/lists/${queryArg.list.id}`,
          method: 'PUT',
          data: queryArg.list
        }),
        invalidatesTags: ['instance_board_lists', 'instance_board_list']
      }),
      deleteInstanceList: build.mutation<
        DeleteInstanceListApiResponse,
        DeleteInstanceListApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/instance/boards/${queryArg.boardId}/lists/${queryArg.listId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['instance_board_lists', 'instance_board']
      }),
      getInstanceLabels: build.query<
        GetInstanceLabelsApiResponse,
        GetInstanceLabelsApiArg
      >({
        query: boardId => ({
          url: `/mock-api/instance/boards/${boardId}/labels`
        }),
        providesTags: ['instance_board_labels']
      }),
      createInstanceLabel: build.mutation<
        CreateInstanceLabelApiResponse,
        CreateInstanceLabelApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/instance/boards/${queryArg.boardId}/labels`,
          method: 'POST',
          data: queryArg.label
        }),
        invalidatesTags: ['instance_board_labels']
      }),
      getInstanceLabel: build.query<
        GetInstanceLabelApiResponse,
        GetInstanceLabelApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/instance/boards/${queryArg.boardId}/labels/${queryArg.labelId}`
        }),
        providesTags: ['instance_board_label']
      }),
      updateInstanceLabel: build.mutation<
        UpdateInstanceLabelApiResponse,
        UpdateInstanceLabelApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/instance/boards/${queryArg.boardId}/labels/${queryArg.label.id}`,
          method: 'PUT',
          data: queryArg.label
        }),
        invalidatesTags: ['instance_board_label']
      }),
      deleteInstanceLabel: build.mutation<
        DeleteInstanceLabelApiResponse,
        DeleteInstanceLabelApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/instance/boards/${queryArg.boardId}/labels/${queryArg.labelId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['instance_board_labels']
      }),
      getInstanceCards: build.query<
        GetInstanceCardListApiResponse,
        GetInstanceCardListApiArg
      >({
        query: boardId => ({
          url: `/mock-api/instance/boards/${boardId}/cards`
        }),
        providesTags: ['instance_board_cards']
      }),
      createInstanceCard: build.mutation<
        CreateInstanceCardApiResponse,
        CreateInstanceCardApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/instance/boards/${queryArg.boardId}/lists/${queryArg.listId}/cards`,
          method: 'POST',
          data: queryArg.card
        }),
        invalidatesTags: ['instance_board_cards', 'instance_board']
      }),
      updateInstanceCard: build.mutation<
        UpdateInstanceCardApiResponse,
        UpdateInstanceCardApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/instance/boards/${queryArg.boardId}/cards/${queryArg.card.id}`,
          method: 'PUT',
          data: queryArg.card
        }),
        invalidatesTags: ['instance_board_cards']
      }),
      deleteInstanceCard: build.mutation<
        DeleteInstanceCardApiResponse,
        DeleteInstanceCardApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/instance/boards/${queryArg.boardId}/cards/${queryArg.cardId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['instance_board_cards']
      }),
      createInstanceSendText: build.mutation<
        CreateInstanceSendTextApiResponse,
        CreateInstanceSendTextApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/instance/sendText/${queryArg.instanceName}`,
          method: 'POST',
          data: queryArg
        }),
        invalidatesTags: ['instance_send_text']
      }),
      createInstance: build.mutation<
        CreateInstanceApiResponse,
        CreateInstanceApiArg
      >({
        query: board => ({
          url: `/mock-api/instance/create`,
          method: 'POST',
          data: board
        }),
        invalidatesTags: ['instance_boards', 'instance_board']
      }),
      getInstanceGroups: build.query<
        GetInstancesApiResponse,
        GetInstancesApiArg
      >({
        query: instance => ({
          url: `/mock-api/instance/groups/${instance}`
        }),
        providesTags: ['instance_boards', 'instance_board']
      }),
      getInstanceContacts: build.query<
        GetInstancesApiResponse,
        GetInstancesApiArg
      >({
        query: instance => ({
          url: `/mock-api/instance/contacts/${instance}`
        }),
        providesTags: ['instance_boards', 'instance_board']
      }),
      getInstanceConnectById: build.query<
        GetInstancesApiResponse,
        GetInstancesApiArg
      >({
        query: instance => ({
          url: `/mock-api/instance/connect/${instance}`
        }),
        providesTags: ['instance_boards', 'instance_board']
      }),
      getInstanceById: build.query<GetInstanceApiResponse, GetInstanceApiArg>({
        query: instanceId => ({
          url: `/mock-api/instance/${instanceId}/${instanceId}`
        }),
        providesTags: ['instance_board']
      }),
      getInstancesAll: build.query<GetInstancesApiResponse, GetInstancesApiArg>(
        {
          query: queryArg => ({
            url: `/mock-api/instance/${queryArg?.instanceId}`
          }),
          providesTags: ['instance_boards', 'instance_board']
        }
      ),
      deleteInstance: build.mutation<
        DeleteInstanceApiResponse,
        DeleteInstanceApiArg
      >({
        query: board => ({
          url: `/mock-api/instance/${board.name}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['instance_board', 'instance_boards']
      }),
      updateInstance: build.mutation<
        UpdateInstanceApiResponse,
        UpdateInstanceApiArg
      >({
        query: instance => ({
          url: `/mock-api/instance/boards/${instance.id}`,
          method: 'PUT',
          data: instance
        }),
        invalidatesTags: ['instance_board', 'instance_boards']
      }),
      createInstanceGroupProfile: build.mutation<
        CreateInstanceGroupProfileApiResponse,
        CreateInstanceGroupProfileApiArg
      >({
        query: participantArg => ({
          url: `/mock-api/instance/group/participants/${participantArg.instanceId}`,
          method: 'POST',
          data: participantArg
        }),
        invalidatesTags: ['instance_board_labels']
      })
    }),
    overrideExisting: false
  })

export default InstanceApi

export type InstanceApiType = {
  [InstanceApi.reducerPath]: ReturnType<typeof InstanceApi.reducer>
}

export type CreateInstanceGroupProfileApiResponse = unknown
export type CreateInstanceGroupProfileApiArg = { instanceId: string }

export type GetInstanceMembersApiResponse =
  /** status 200 OK */ InstanceMember[]
export type GetInstanceMembersApiArg = void

export type CreateInstanceMemberApiResponse = unknown
export type CreateInstanceMemberApiArg = InstanceMember

export type GetInstanceListsApiResponse = /** status 200 OK */ InstanceList[]
export type GetInstanceListsApiArg = string /** board id */

export type CreateInstanceListApiResponse = unknown
export type CreateInstanceListApiArg = {
  boardId: string
  list: PartialDeep<InstanceList>
}

export type GetInstanceMemberApiResponse = /** status 200 OK */ InstanceMember
export type GetInstanceMemberApiArg = string /** member id */

export type UpdateInstanceMemberApiResponse = unknown
export type UpdateInstanceMemberApiArg = PartialDeep<InstanceMember>

export type DeleteInstanceMemberApiResponse = unknown
export type DeleteInstanceMemberApiArg = string /** member id */

export type GetInstanceListApiResponse = /** status 200 OK */ InstanceList
export type GetInstanceListApiArg = {
  listId: string
  boardId: string
}

export type UpdateInstanceListApiResponse = unknown
export type UpdateInstanceListApiArg = {
  boardId: string
  list: PartialDeep<InstanceList>
}

export type DeleteInstanceListApiResponse = unknown
export type DeleteInstanceListApiArg = {
  listId: string
  boardId: string
}

export type GetInstanceLabelsApiResponse = /** status 200 OK */ InstanceLabel[]
export type GetInstanceLabelsApiArg = string /** board id */

export type CreateInstanceLabelApiResponse = unknown
export type CreateInstanceLabelApiArg = {
  boardId: string
  label: PartialDeep<InstanceLabel>
}

export type GetInstanceLabelApiResponse = /** status 200 OK */ InstanceLabel
export type GetInstanceLabelApiArg = {
  labelId: string
  boardId: string
}

export type UpdateInstanceLabelApiResponse = unknown
export type UpdateInstanceLabelApiArg = {
  boardId: string
  label: PartialDeep<InstanceLabel>
}

export type DeleteInstanceLabelApiResponse = unknown
export type DeleteInstanceLabelApiArg = {
  labelId: string
  boardId: string
}

export type GetInstanceCardListApiResponse = /** status 200 OK */ InstanceCard[]
export type GetInstanceCardListApiArg = string /** board id */

export type CreateInstanceCardApiResponse = unknown
export type CreateInstanceCardApiArg = {
  boardId: string
  listId: string
  card: PartialDeep<InstanceCard>
}

export type CreateInstanceSendTextApiResponse = unknown
export type CreateInstanceSendTextApiArg = any

export type UpdateInstanceCardApiResponse = unknown
export type UpdateInstanceCardApiArg = {
  boardId: string
  card: PartialDeep<InstanceCard>
}

export type DeleteInstanceCardApiResponse = unknown
export type DeleteInstanceCardApiArg = {
  cardId: string
  boardId: string
}

export type GetInstancesApiResponse = any
export type GetInstancesApiArg = any

export type CreateInstanceApiResponse = any[]
export type CreateInstanceApiArg = any

export type GetInstanceApiResponse = any
export type GetInstanceApiArg = any

export type UpdateInstanceApiResponse = any[]
export type UpdateInstanceApiArg = any

export type DeleteInstanceApiResponse = any[]
export type DeleteInstanceApiArg = any /** board id */

export type UpdateInstanceListOrderApiResponse = unknown
export type UpdateInstanceListOrderApiArg = {
  orderResult: {
    source: DropResult['source']
    destination: DropResult['destination']
  }
  board: Instance
}
export type UpdateInstanceCardOrderApiResponse = unknown
export type UpdateInstanceCardOrderApiArg = {
  orderResult: {
    source: DropResult['source']
    destination: DropResult['destination']
  }
  board: Instance
}

export type InstanceMember = {
  id: string
  name: string
  avatar: string
  class: string
}

export type InstanceList = {
  id: string
  boardId: string
  title: string
}
export type InstanceLists = {
  id: string
  cards: InstanceCard['id'][]
}

export type InstanceLabel = {
  id: string
  boardId: string
  title: string
}

export type InstanceAttachment = {
  id: string
  name: string
  src: string
  url: string
  time: number
  type: string
}
export type InstanceCheckListItem = {
  id: number
  name: string
  checked: boolean
}

export type InstanceChecklist = {
  id?: string
  name: string
  checkItems: InstanceCheckListItem[]
}

export type InstanceCard = {
  id: string
  boardId: string
  listId: string
  title: string
  description: string
  labels: string[]
  dueDate?: number | null
  attachmentCoverId: string
  memberIds: string[]
  attachments: InstanceAttachment[]
  subscribed: boolean
  checklists: InstanceChecklist[]
  activities: {
    id: string
    type: string
    idMember: string
    message: string
    time: number
  }[]
}

export type Instance = {
  id: string
  title: string
  description: string
  icon: string
  lastActivity: string
  members: string[]
  settings: {
    subscribed: boolean
    cardCoverImages: boolean
  }
  lists: {
    id: string
    cards?: string[]
  }[]
}

export type InstanceComment = {
  id: string
  type: string
  idMember: string
  message: string
  time: number
}

export const {
  useGetInstanceMembersQuery,
  useCreateInstanceGroupProfileMutation,
  useCreateInstanceMemberMutation,
  useGetInstanceListsQuery,
  useCreateInstanceListMutation,
  useGetInstanceMemberQuery,
  useUpdateInstanceMemberMutation,
  useDeleteInstanceMemberMutation,
  useGetInstanceListQuery,
  useUpdateInstanceListMutation,
  useDeleteInstanceListMutation,
  useGetInstanceLabelsQuery,
  useCreateInstanceLabelMutation,
  useGetInstanceLabelQuery,
  useUpdateInstanceLabelMutation,
  useDeleteInstanceLabelMutation,
  useGetInstanceCardsQuery,
  useCreateInstanceCardMutation,
  useCreateInstanceSendTextMutation,
  useUpdateInstanceCardMutation,
  useDeleteInstanceCardMutation,
  useCreateInstanceMutation,
  useGetInstancesAllQuery,
  useGetInstanceByIdQuery,
  useGetInstanceContactsQuery,
  useGetInstanceGroupsQuery,
  useGetInstanceConnectByIdQuery,
  useUpdateInstanceMutation,
  useDeleteInstanceMutation
} = InstanceApi

export const selectListById =
  (boardId: string, listId: string) => (state: AppRootStateType) => {
    const lists =
      InstanceApi.endpoints.getInstanceLists.select(boardId)(state)?.data ?? []

    return _.find(lists, { id: listId })
  }

export const selectMemberById = (id: string) => (state: AppRootStateType) => {
  const members =
    InstanceApi.endpoints.getInstanceMembers.select()(state)?.data ?? []

  return _.find(members, { id })
}

export const selectLabelById =
  (boardId: string, id: string) => (state: AppRootStateType) => {
    const labels =
      InstanceApi.endpoints.getInstanceLabels.select(boardId)(state)?.data ?? []

    return _.find(labels, { id })
  }

export const selectFilteredInstanceList = (instance: any[]) =>
  createSelector([selectSearchText], searchText => {
    if (!instance || instance === undefined) {
      return []
    }

    if (searchText?.length === 0) {
      return instance
    }

    return FuseUtils.filterArrayByString<any>(instance, searchText)
  })
