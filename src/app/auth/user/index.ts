import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings'

export type CustomerType = {
  displayName: string
  id?: string
}
/**
 * The type definition for a user object.
 */
export type User = {
  uid: string
  updatedAt?: string
  role: string[] | string | null
  data: {
    id?: string
    customer?: Partial<CustomerType>
    displayName: string
    photoURL?: string
    email?: string
    birthday?: string
    updatedAt: string
    shortcuts?: string[]
    settings?: Partial<FuseSettingsConfigType>
    loginRedirectUrl?: string // The URL to redirect to after login.
  }
}
