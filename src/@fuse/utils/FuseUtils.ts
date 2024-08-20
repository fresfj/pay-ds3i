import _ from '@lodash'
import * as colors from '@mui/material/colors'
import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings'
import { RouteObject } from 'react-router-dom'
import { User } from 'src/app/auth/user'
import EventEmitter from './EventEmitter'
const mapKey = import.meta.env.VITE_MAP_KEY

type TreeNode = {
  id: string
  children?: TreeNode[]
}
/**
 * The FuseRouteItemType type is a custom type that extends the RouteObject type from react-router-dom.
 * It adds an optional auth property and an optional settings property.
 */
export type FuseRouteItemType = RouteObject & {
  auth?: string[] | []
  settings?: unknown
}

/**
 * The FuseRoutesType type is a custom type that is an array of FuseRouteItemType objects.
 */
export type FuseRoutesType = FuseRouteItemType[]

/**
 * The FuseRouteConfigType type is a custom type that defines the configuration for a set of routes.
 * It includes an optional routes property, an optional settings property, and an optional auth property.
 */
export type FuseRouteConfigType = {
  routes: FuseRoutesType
  settings?: unknown
  auth?: string[] | []
}

/**
 * The FuseRouteConfigsType type is a custom type that is an array of FuseRouteConfigType objects.
 */
export type FuseRouteConfigsType = FuseRouteConfigType[] | []

/**
 * The hueTypes type is a custom type that defines the possible values for a hue.
 */
type hueTypes =
  | '50'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | 'A100'
  | 'A200'
  | 'A400'
  | 'A700'

type Color = {
  50?: string
  100?: string
  200?: string
  300?: string
  400?: string
  500?: string
  600?: string
  700?: string
  800?: string
  900?: string
  A100?: string
  A200?: string
  A400?: string
  A700?: string
  [key: string]: string | undefined
}

/**
 * The FuseUtils class provides utility functions for the Fuse project.
 */
class FuseUtils {
  /**
   * The filterArrayByString function filters an array of objects by a search string.
   * It takes in an array of objects and a search string as parameters and returns a filtered array of objects.
   *
   */

  static filterArrayByString<T>(mainArr: T[], searchText: string): T[] {
    if (searchText?.length === 0 || !searchText) {
      return mainArr // Return the original array
    }

    searchText = searchText.toLowerCase()
    const filtered = mainArr.filter(itemObj =>
      this.searchInObj(itemObj, searchText)
    )

    if (filtered.length === mainArr.length) {
      return mainArr // If the filtered array is identical, return the original
    }

    return filtered
  }

  static filterArrayByString2<T>(mainArr: T[], searchText: string): T[] {
    if (typeof searchText !== 'string' || searchText === '') {
      return mainArr
    }

    searchText = searchText?.toLowerCase()

    return mainArr.filter((itemObj: unknown) =>
      this.searchInObj(itemObj, searchText)
    )
  }

  /**
   * The searchInObj function searches an object for a given search string.
   * It takes in an object and a search string as parameters and returns a boolean indicating whether the search string was found in the object.
   *
   */
  static searchInObj(itemObj: unknown, searchText: string) {
    if (!isRecord(itemObj)) {
      return false
    }

    const propArray = Object.keys(itemObj)

    function isRecord(value: unknown): value is Record<string, unknown> {
      return Boolean(
        value &&
          typeof value === 'object' &&
          !Array.isArray(value) &&
          typeof value !== 'function'
      )
    }

    for (let i = 0; i < propArray.length; i += 1) {
      const prop = propArray[i]

      const value = itemObj[prop]

      if (typeof value === 'string') {
        if (this.searchInString(value, searchText)) {
          return true
        }
      } else if (Array.isArray(value)) {
        if (this.searchInArray(value, searchText)) {
          return true
        }
      }

      if (typeof value === 'object') {
        if (this.searchInObj(value, searchText)) {
          return true
        }
      }
    }
    return false
  }

  /**
   * The searchInArray function searches an array for a given search string.
   * It takes in an array and a search string as parameters and returns a boolean indicating whether the search string was found in the array.
   *
   */
  static searchInArray(arr: unknown[], searchText: string) {
    arr.forEach(value => {
      if (typeof value === 'string') {
        if (this.searchInString(value, searchText)) {
          return true
        }
      }

      if (value && typeof value === 'object') {
        if (this.searchInObj(value, searchText)) {
          return true
        }
      }

      return false
    })
    return false
  }

  /**
   * The searchInString function searches a string for a given search string.
   * It takes in a string and a search string as parameters and returns a boolean indicating whether the search string was found in the string.
   *
   */
  static searchInString(value: string, searchText: string) {
    return value.toLowerCase().includes(searchText)
  }

  /**
   * The generateGUID function generates a globally unique identifier.
   * It returns a string representing the GUID.
   *
   */
  static generateGUID(): string {
    function S4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }

    return S4() + S4()
  }
  static getFirstNameLastName(fullName: string): string {
    const nameParts = fullName.split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.pop()
    return `${firstName} ${lastName}`
  }
  /**
   * The toggleInArray function toggles an item in an array.
   */
  static toggleInArray(item: unknown, array: unknown[]) {
    if (array.indexOf(item) === -1) {
      array.push(item)
    } else {
      array.splice(array.indexOf(item), 1)
    }
  }

  /**
   * The handleize function converts a string to a handle.
   */
  static handleize(text: string) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/\W+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
  }

  /**
   * The setRoutes function sets the routes for the Fuse project.
   */
  static setRoutes(
    config: FuseRouteConfigType,
    defaultAuth: FuseSettingsConfigType['defaultAuth'] = undefined
  ): FuseRouteItemType[] {
    let routes = [...config.routes]

    routes = routes.map(route => {
      let auth =
        config.auth || config.auth === null ? config.auth : defaultAuth || null

      auth = route.auth || route.auth === null ? route.auth : auth

      const settings = _.merge({}, config.settings, route.settings)

      return {
        ...route,
        settings,
        auth
      }
    }) as FuseRouteItemType[]

    return [...routes]
  }

  /**
   * The generateRoutesFromConfigs function generates routes from a set of route configurations.
   * It takes in an array of route configurations as a parameter and returns an array of routes.
   *
   */
  static generateRoutesFromConfigs(
    configs: FuseRouteConfigsType,
    defaultAuth: FuseSettingsConfigType['defaultAuth']
  ) {
    let allRoutes: FuseRouteItemType[] = []
    configs.forEach((config: FuseRouteConfigType) => {
      allRoutes = [...allRoutes, ...this.setRoutes(config, defaultAuth)]
    })
    return allRoutes
  }

  /**
   * The findById function finds an object by its id.
   */
  static findById(tree: TreeNode[], idToFind: string): TreeNode | undefined {
    // Try to find the node at the current level
    const node = _.find(tree, { id: idToFind })

    if (node) {
      return node
    }

    let foundNode: TreeNode | undefined

    // If not found, search in the children using lodash's some for iteration
    _.some(tree, item => {
      if (item.children) {
        foundNode = this.findById(item.children, idToFind)
        return foundNode // If foundNode is truthy, _.some will stop iterating
      }

      return false // Continue iterating
    })

    return foundNode
  }

  /**
   * The randomMatColor function generates a random material color.
   */
  static randomMatColor(hue: hueTypes = '400') {
    const mainColors = [
      'red',
      'pink',
      'purple',
      'deepPurple',
      'indigo',
      'blue',
      'lightBlue',
      'cyan',
      'teal',
      'green',
      'lightGreen',
      'lime',
      'yellow',
      'amber',
      'orange',
      'deepOrange'
    ]

    const randomColor =
      mainColors[Math.floor(Math.random() * mainColors.length)]

    return (colors as { [key: string]: Color })[randomColor][hue]
  }

  /**
   * The findNavItemById function finds a navigation item by its id.
   */
  static difference(
    object: Record<string, unknown>,
    base: Record<string, unknown>
  ): Record<string, unknown> {
    function changes(
      _object: Record<string, unknown>,
      _base: Record<string, unknown>
    ): Record<string, unknown> {
      return _.transform(
        _object,
        (result: Record<string, unknown>, value: unknown, key: string) => {
          if (!_.isEqual(value, _base[key])) {
            result[key] =
              _.isObject(value) && _.isObject(_base[key])
                ? changes(
                    value as Record<string, unknown>,
                    _base[key] as Record<string, unknown>
                  )
                : value
          }
        },
        {}
      )
    }

    return changes(object, base)
  }

  /**
   * The EventEmitter class is a custom implementation of an event emitter.
   * It provides methods for registering and emitting events.
   */
  static EventEmitter = EventEmitter

  /**
   * The hasPermission function checks if a user has permission to access a resource.
   */
  static hasPermission(
    authArr: string[] | string | undefined,
    userRole: User['role']
  ): boolean {
    /**
     * If auth array is not defined
     * Pass and allow
     */
    if (authArr === null || authArr === undefined) {
      return true
    }

    if (authArr.length === 0) {
      /**
       * if auth array is empty means,
       * allow only user role is guest (null or empty[])
       */
      return !userRole || userRole.length === 0
    }

    /**
     * Check if user has grants
     */
    /*
            Check if user role is array,
            */
    if (userRole && Array.isArray(authArr) && Array.isArray(userRole)) {
      return authArr.some((r: string) => userRole.indexOf(r) >= 0)
    }

    /*
            Check if user role is string,
            */
    return authArr.includes(userRole as string)
  }

  /**
   * The filterArrayByString function filters an array of objects by a search string.
   */
  static filterRecursive(
    data: [] | null,
    predicate: (arg0: unknown) => boolean
  ) {
    // if no data is sent in, return null, otherwise transform the data
    return !data
      ? null
      : data.reduce((list: unknown[], entry: { children?: [] }) => {
          let clone: unknown = null

          if (predicate(entry)) {
            // if the object matches the filter, clone it as it is
            clone = { ...entry }
          }

          if (entry.children != null) {
            // if the object has childrens, filter the list of children
            const children = this.filterRecursive(entry.children, predicate)

            if (children && children?.length > 0) {
              // if any of the children matches, clone the parent object, overwrite
              // the children list with the filtered list
              clone = { ...entry, children }
            }
          }

          // if there's a cloned object, push it to the output list
          if (clone) {
            list.push(clone)
          }

          return list
        }, [])
  }

  static isExternalLink(url: string): boolean {
    return url.startsWith('http')
  }

  static formatCurrency(number) {
    const CURRENCY_FORMATTER = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })

    const numberString = CURRENCY_FORMATTER.formatToParts(number)
      .map(({ type, value }) => {
        switch (type) {
          case 'currency':
            return `${value}`
          default:
            return value
        }
      })
      .reduce((string, part) => string + part)

    return numberString
  }

  static async getLocation(address) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${mapKey}`

    return new Promise(async (resolve, reject) => {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const coordenadas = data.results[0].geometry.location
          resolve({
            address: data.results[0].formatted_address,
            lat: coordenadas.lat,
            lng: coordenadas.lng
          })
        })
        .catch(error => {
          reject('Erro ao acessar a API Geocoding:')
        })
    })
  }
  static identifyCardBrand = (cardNumber: string) => {
    const cleanedNumber = cardNumber.replace(/\D/g, '')
    const brands = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/,
      jcb: /^35(?:2[89]|[3-8][0-9])/,
      dinersclub: /^3(?:0[0-5]|[68][0-9])/,
      maestro: /^(5018|5020|5038|6304|6759|676[1-3])/,
      hipercard: /^(606282\d{10}(\d{3})?)|(3841\d{15})/
    }

    for (const [brand, pattern] of Object.entries(brands)) {
      if (pattern.test(cleanedNumber)) {
        return {
          brand: brand,
          logoUrl: `${this.cardFlag(brand)}`
        }
      }
    }
    return null
  }
  static cardFlag = (cardBrand: string) => {
    const flagCard = cardBrand?.toLowerCase()
    switch (flagCard) {
      case 'visa':
        return 'assets/images/flags/visa.svg'
      case 'mastercard':
        return 'assets/images/flags/mastercard.svg'
      case 'elo':
        return 'assets/images/flags/elo.svg'
      case 'hipercard':
        return 'assets/images/flags/hipercard.svg'
      case 'pix':
        return 'assets/images/flags/pix.svg'
      case 'dinersclub':
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACpElEQVR4nO2YX2vTUBjG8yXGxPrnRocDJwj1K6jfw3VNFWTI6jqv+xXUzCsv5oYUYfoJWjHt2NJmk3U5bbKyMRQUq7ZV14vBK89pU0R31sSRNhvngReakvY8v/P+OSGKIiUlJSUldZq0Ua2eM5mTKTGnaTKHwhAl5jRLzH5VKjuX+5ovMbs+bMOmEMSum5VKRAiAnR+2SbMfhOW8FAKEqWxMUVj296MyQCchFAnATkkGlnWL4lqRoimdzt/N0Ugs6ylwL36jagYt62zwAKtlhyYfGzQa925aFKPxHMWeGLS2NSAAmL+ZXuGLRxJvaW7JpmKtQT/bBzyM7QalFm2KJPzB3UqveIY4FgB2HgteSxZoc69FIr3fbdFEMu8LYuqpESwAah4px8675mufftEdrdwznlyo0sdvbf55Y7flKxNnprL02kNP/DcAdggLPVqye+bHH+j8O1f4fH22QB++diBmF6u+spCYN4IDiKbe8UWKtSY3Nzlf7i38JwDi/nPGr9ETfgBuzOnBAVzojsof7QNu7kp39w8DQI9AuNcPwMV7ueAA8OdYpLXfARg/AmBsWufXuDc0ANFUxzDGJhR7Ji4ht7HXwlRCqtZpYsx5aOfzPl2dyf8DgMygwaGHL/w2cTHIMcq6YzTH5zy0V2/TzEK1B4DGBhi0vtOks6q/MfombwUHgMCxj8VwSLkQhwnm3ex4DVUL+CBD4LjHsY8FkQnMedQ5pg1i1WnwsvGz8yOxLN1OFwbzKOFC4FBDyv2YFJWNqg3wYe7vnsDJicnhnhFeAvfiNwnN8PToEBjAsEKRACysGbCcxrDNmcd5rYLXd0M3yPpGRgiwvrU9ZjLnSwhMkujVYnHTviQE4GVUqUTw+i5U5WRxL5m+5qWkpKSkpJQTpt8h5uknoEp0TgAAAABJRU5ErkJggg=='
      case 'amex':
        return 'assets/images/flags/american_express.svg'
      case 'discover':
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADoElEQVR4nO2YeUgUYRjGRylBWgncjo00U+iQqP4IOywxLPunAyIpOgkKsktDs1KiIhETLxTULrvWzEyLpDDJkg6SrJS2Q1MqZ2abbbcNDwojdZ94P3Jxy931KJqNeeBlZ+eb+b7n937vOwzDcYoUKVKkSNH/JFE0+/AG0xVeMrbzBhNkERLzUiqaTJOcmm82GD//c8OGvoO8CYJ5vF0AlnkZGOUdQUjGy/YB5FQ2Brvl1OpoB+AKwSkABmUHoJRQX/rXpcErTWwYWmaaJSMa3vHy2AGO4+Du7g6/iRNxJDGJnZs+Yybyz2tRUHQFYzUaqEeNQnbucTZG13h7e8PNzQ0xcfsgiCLaL2xDV/wYdMWPRbs2EvUNDVB5eaGsvILd86rxLUaoVDhXUMjW6wlag36HDR+OoNlzUPuyfnAAj57UoqjkKjOac+KUFWDe/AXYvGUrqp/V4X51DRub4OeH8sq7eF7/BsXXrjPz2M3ZRLt2O7tv9dp1bI3E5BTMCgpCTZ2Ordez9o2K2yxBtS9eY9LkKTh0NHFwADQxHVNGI1avsQLE7tsPDw8PrF2/Ec90r7AofAmOpaXbLEKZ/xWg68Bo3Ln/EJ6entA1NGJqYCCycnKtAOs2bGJBAGq1GoXFpdBoxiHvVP7QAMgwZa0HgM5dLbvJsjdn7jyELQ5HSlqGc4AEDRsLXhCCpctXsJ1t4vVWgOTUNBYEQJBUXpE7d9nMa7p3YXAlRGVBACfPnsfOqGg8rnuOuAMJCJw2Ddk5efAPCMCtyiq8eNOE0rIbrFx+BWgr2MHmPn76DJt/V/Qe9t9eCREMlSb1Cp0XBB6dB30H3sSpmVk2TUwAlB0fX19cvFzCxo4mJbNrKXMExppYu501MAWZF/R6du1bUcJ4Hx9UP621AejdxARAT7WQ0FCsXBVBb6H4ciKCJaJfAHKL1uI46066FoBktDHvUgCCwFvLxuUAJN0DfE8M/M287AEE/j3aLkXBEu3Rp3n5AnyQYL6Vha74cXaNyxJAEEWYK7LRedjfqXFZAXx4XYO2wt3o3q/ut3HnAJKx7e9mW8CnqjPoyFgIRLkP2Dh7HdnrZXG0A6V/2rTY3ARzZS6+5iyDJcZzUKbRK76lBot2AfR60+Rmg8k81Gb8+LQcLSUJ6EgPcfg0wYCzP9LSot2xiHMk+vZIn+/6W076Rh17Q2wtikFHZhi6Y1V/zDB+RnesykKZd2pekSJFihQp4lxMPwBeLU95P3/a3QAAAABJRU5ErkJggg=='
      case 'jcb':
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADHElEQVR4nO2Y7UtTURzH94fU6/4CcTofsgcMKnoYzsQZYVCBvqkXQm+EQiRJZkEPpiyEFFTGlEKnzvmEtAm5u7npvfNebcvNOd3M6Za3vfnFvdVc3Xu3e3Nrs84XvjB2zi7fz+/87s7hyGRISEhISEj/khwkeRwjSJ2VoHYxgoJcsJWgdq04NWDHV0+kDG8lyFC2A2OCIOQ2k1EQgKl8tkNiqd0vCJBLbYMJGafCSVaA+4MunQ2q601wRmWA0itDvE6cv9TdA+4qFXhLFeAryON14nztVC+otGoofnoK5JoiXv+eSTTAy+55wdB8AHhnp2BoPoDn468FQ6cFQHXbKAnAo7wkCeByR0VmAcqUQ5IAvIp8SQCFbSWZBRATPhFATPhEALmI8AigFK1AXm61kPLmOHi8YdYz5nXedyDU3ARfHA6gPW6IzExDZHIC9kkS9qanOADvV8wQ2g0BGaBgbMkIE65JCOwEwLvtg4eGpvQDqG6ZIBaLsV50BTkAoQeN8fHt1paDyivywX/hHAfAtmZn5xoWR+IVb5/tYL9b2Vz9+wCROQs7Rvt8ov6FbD8AFrwL0Dz6CJrHWsC1sQz0VxpezXYeDqD82gjcbbTA2YRjhLpuKg5gX9ziAETnP3wH8Lj/CKDF+BgIvwui+1EYtL+FAk3xITayq8PgJILQ1ediPzPuHSTjAM+0Tg4A0zY/x4P3G0QDGBJaqNWkiT+j/MX5w7XQxetGME6vgT+wx5p56PrGHmjaF/g3MkU+fO5oB9rvhxhNQ8Rihsi4EaJ2G7s6Qi/x0joOOkwPetsgfAqtwWZ4C97M9aTvHWBA7jTMQnXdJJQph9FOjKGjBI/+y8NcmVIaAHPklgJQ2FaSWQB1vUkSgLuqUhJApbYmcwBM9fWjDtEATPWd7w5WTC6i+jqzIf0ApyuGofbeBAyMHYRPClBcCB9v1IBz6NcwcoHgRU9OgrqrFvSWEU74pABH41qF3BEGwKmBrAckktuKU32CAMzdI3N9l+2QmLCD9uXlY7LUl7tUP3MDljttQ4WZyqcMj4SEhISEJDti+gZFbmdKn/+nqAAAAABJRU5ErkJggg=='
      default:
        return
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC/0lEQVR4nO2YyVIaURSGXccnyCaKIDFGEXyHDI44K+CMOM+a4RVSqSxjKktnRDRmRE18kKSyU2wV1L0u/tRt6AFuNzZyiSZ1T9W3//6/7zmLzsnhw4cPHz58/oex7Qi55Xvn7xx7Z9HyvXNkjR/ncMicwfFdwS6xq1BG2CGcwrYdjZbtROeIKxWAyGdL2qEjbdcQtquEE9gmASSib6kATJtPV3j3KuFT2EIKJaFIROsLsBO+TsvbScIq6dJQNMY3hcwDZLnl0iRhQgnhawwqwKOKGjyurMWTKieeVtehoqYelbUNqHI2orquCTX1zahtaIGzsRXOpjbUNbtQ3+JGQ6sHjW3taHJ1oNndiRZPF1rbu9HW0QNXZy9cXV64u/vg6fGhvbcfHd4BdPYNoss3hO7+YfQMjKB3cBTeoTF4h8fRNzIB3+gk+semMDA+jcGJGQxNzmJ46hlGpp9jdOYFxmZf8gDgX8DH+AnZUy7fWXrLF9JfPpkvETxU81mhWOKTxInIg48KdACGJ65UU1hfutiAsMzWCYq2NAKohd/8voRfwK3i1a8LUbzow7EIHUDV7k3L+nUg4vcJmxoB1M/ipkX9OhBxCSqA+i2/vo1P6OcFrBvHsG4cidAB9JbPyMVIY/lk4m+5SPUsEhBlFWGR4BEK41ABWJ44Q8Ia0tZk6WCidOG6Ah2A4Ykz2rL1ipaTpS2EgCBCBdB/Fhm0vJlZyxaRmLAa85pGAKPPIuOWg8ZbtkisxaRl/FoBiHAWW05LOJAkHJc2+w9REIcKYKTlay8fJW1UWJCFRVYVqAAsTxyrlgtUwibCigIdgOGJu3bLq6mlTSthmJbDyF8O0wFYnjjd5VtL/SxMlPChLJzAkk4AVicu05bzNYQJeRKLGgFYnjhWLecnSectHojcWzygA1iCR5G/sXzptJwXFxalF1TM79M/tgrXhTlWJy7V8ukKL9EtJ0gnsE//WrQtCLnmgDBnDgiRW9Hyggbz+xEif/d9+A4VgA8fPnz48Mn5B+cPu7QusquOZksAAAAASUVORK5CYII='
    }
  }
}

export default FuseUtils
