import _ from '@lodash'
import { PartialDeep } from 'type-fest'
import { User } from 'src/app/auth/user'

/**
 * Creates a new user object with the specified data.
 */
function UserModel(data: PartialDeep<User>): User {
  data = data || {}

  return _.defaults(data, {
    uid: '',
    role: null, // guest
    data: {
      displayName: 'Guest User',
      photoURL: '',
      email: '',
      gender: '',
      identification: '',
      phoneNumber: '',
      size: '',
      updatedAt: '',
      customer: {},
      shortcuts: [],
      settings: {}
    }
  })
}

export default UserModel
