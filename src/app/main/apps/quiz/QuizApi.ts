import { apiService as api } from 'app/store/apiService'

export const addTagTypes = ['file_manager_folder'] as const

const QuizApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: build => ({
      getFileManagerFolder: build.query<
        GetFileManagerFolderApiResponse,
        GetFileManagerFolderApiArg
      >({
        query: folderId => ({ url: `/mock-api/file-manager/${folderId}` }),
        providesTags: ['file_manager_folder']
      }),
      updateFileManagerFolder: build.mutation<
        UpdateFileManagerFolderApiResponse,
        UpdateFileManagerFolderApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/file-manager/${queryArg.folderId}`,
          method: 'PUT',
          body: queryArg.fileManagerItem
        }),
        invalidatesTags: ['file_manager_folder']
      }),
      deleteFileManagerFolder: build.mutation<
        DeleteFileManagerFolderApiResponse,
        DeleteFileManagerFolderApiArg
      >({
        query: folderId => ({
          url: `/mock-api/file-manager/${folderId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['file_manager_folder']
      })
    }),
    overrideExisting: false
  })
export default QuizApi

export type GetFileManagerFolderApiResponse = {
  items: FileManagerItem[]
  path: FileManagerPath[]
}
export type GetFileManagerFolderApiArg = string // folderId

export type UpdateFileManagerFolderApiResponse = unknown
export type UpdateFileManagerFolderApiArg = {
  /** folder id */
  folderId: string
  fileManagerItem: FileManagerItem
}

export type DeleteFileManagerFolderApiResponse = unknown
export type DeleteFileManagerFolderApiArg = string // folderId;

export type FileManagerPath = {
  name: string
  id: string
}

export type QuizeManagerItem = {
  id: string
  title?: string
  folderId?: string
  name: string
  createdBy: string
  createdAt: string
  modifiedAt: string
  size: string
  type: string
  contents: string
  description: string
}

export type FileManagerItem = {
  id: string
  folderId?: string
  name: string
  createdBy: string
  createdAt: string
  modifiedAt: string
  size: string
  type: string
  contents: string
  description: string
}

export const {
  useGetFileManagerFolderQuery,
  useUpdateFileManagerFolderMutation,
  useDeleteFileManagerFolderMutation
} = QuizApi

export type QuizApiType = {
  [QuizApi.reducerPath]: ReturnType<typeof QuizApi.reducer>
}
