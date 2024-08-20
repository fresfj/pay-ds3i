export type CardProps = {
  address?: string
  phone?: string
  cardId?: string
  realized?: string
  classDay?: string
  billingType?: string
  creditCardHolderInfo?: {
    addressNumber?: string
    cpfCnpj?: string
    email?: string
    name?: string
    phone?: string
    postalCode?: string
  }
  creditCard?: {
    number?: string
    holderName?: string
    expiry?: string
    cvv?: string
  }
  paymentDefault: boolean
}
export type NewAddressProps = {
  addressType: string
  name: string
  phoneNumber: string
  address: string
  city: string
  state: string
  zipCode: number
  addressComplement: string
  addressNumber: string
  neighborhood: string
  addressDefault: boolean
  country: string
  primary: boolean
}
export type AccountPhotosVideos = {
  id?: string
  name?: string
  info?: string
  media?: {
    type?: string
    title?: string
    preview?: string
  }[]
}

export type Activity = {
  id?: string
  user?: {
    name?: string
    avatar?: string
  }
  message?: string
  time?: string
}

export type Post = {
  id?: string
  user?: {
    name?: string
    avatar?: string
  }
  message?: string
  time?: string
  type?: string
  like?: number
  share?: number
  media?: {
    type?: string
    preview?: string
  }
  comments?: {
    id?: string
    user?: {
      name?: string
      avatar?: string
    }
    time?: string
    message?: string
  }[]
  article?: {
    title?: string
    subtitle?: string
    excerpt?: string
    media?: {
      type?: string
      preview?: string
    }
  }
}

export type AccountTimeline = {
  activities?: Activity[]
  posts?: Post[]
}

export type AccountAbout = {
  general?: {
    gender?: string
    birthday?: string
    locations?: string[]
    about?: string
  }
  work?: {
    occupation?: string
    skills?: string
    jobs?: {
      company?: string
      date?: string
    }[]
  }
  contact?: {
    address?: string
    tel?: string[]
    websites?: string[]
    emails?: string[]
  }
  groups?: {
    id?: string
    name?: string
    category?: string
    members?: string
  }[]
  friends?: {
    id?: string
    name?: string
    avatar?: string
  }[]
}
