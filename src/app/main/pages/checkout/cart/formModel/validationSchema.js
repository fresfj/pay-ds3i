import * as Yup from 'yup'
import moment from 'moment'
import { parse, isDate } from 'date-fns'
import checkoutFormModel from './checkoutFormModel'
import {
  validateCPF,
  validatePhone,
  validateEmail,
  validateCep
} from 'validations-br'

const {
  formField: {
    recaptcha,
    fullName,
    email,
    phone,
    cpfCnpj,
    birthday,
    address,
    addressNumber,
    neighborhood,
    city,
    zipcode,
    cardDocument,
    country,
    shipping,
    installments,
    nameOnCard,
    cardNumber,
    expiryDate,
    cvv
  }
} = checkoutFormModel

const visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/
function parseDateString(value, originalValue) {
  const parsedDate = isDate(originalValue)
    ? originalValue
    : parse(originalValue, 'dd/MM/yyyy', new Date())
  return parsedDate
}

export default [
  Yup.object().shape({
    [fullName.name]: Yup.string()
      .trim()
      .required(`${fullName.requiredErrorMsg}`)
      .test('is-fullName', `${fullName.validatedErrorMsg}`, value => {
        if (value !== undefined && value.length > 6) {
          const names = value?.split(' ')
          return names.length >= 2 && names.every(name => name.length > 0)
        } else {
          return false
        }
      }),
    [birthday.name]: Yup.date()
      .nullable()
      .transform(parseDateString)
      .min(
        new Date('1900-01-01'),
        'Por gentileza, informe uma data posterior a 01/01/1900'
      )
      .typeError('Por gentileza, informe uma data válida Ex: (DD/MM/YYYY)')
      .test('is-birthday', 'Por gentileza, insira uma data válida', value => {
        return value instanceof Date && !isNaN(value)
      })
      .required(`${birthday.requiredErrorMsg}`),
    [phone.name]: Yup.string().required(`${phone.requiredErrorMsg}`),
    [cpfCnpj.name]: Yup.string()
      .required(`${cpfCnpj.requiredErrorMsg}`)
      .test('is-cpfCnpj', `${cpfCnpj.validatedErrorMsg}`, value =>
        validateCPF(value)
      ),
    [email.name]: Yup.string()
      .email(`${email.validatedErrorMsg}`)
      .required(`${email.requiredErrorMsg}`)
      .test('is-email', `${email.validatedErrorMsg}`, value =>
        validateEmail(value)
      ),
    [zipcode.name]: Yup.string()
      .required(`${zipcode.requiredErrorMsg}`)
      .test('is-zipcode', `${zipcode.validatedErrorMsg}`, value =>
        validateCep(value)
      ),
    [address.name]: Yup.string().required(`${address.requiredErrorMsg}`),
    [addressNumber.name]: Yup.string().required(
      `${addressNumber.requiredErrorMsg}`
    ),
    [neighborhood.name]: Yup.string().required(
      `${neighborhood.requiredErrorMsg}`
    ),

    [city.name]: Yup.string().required(`${city.requiredErrorMsg}`)
  }),
  Yup.object().shape({
    [shipping.name]: Yup.mixed().required(`${shipping.requiredErrorMsg}`)
  }),
  Yup.object().shape({
    [installments.name]: Yup.mixed().required(
      `${installments.requiredErrorMsg}`
    ),
    [nameOnCard.name]: Yup.string().required(`${nameOnCard.requiredErrorMsg}`),
    [cardNumber.name]: Yup.string().required(`${cardNumber.requiredErrorMsg}`),
    [cardDocument.name]: Yup.string()
      .required(`${cardDocument.requiredErrorMsg}`)
      .test(
        'is-cpf-cnpj',
        `${cardDocument.validatedErrorMsg}`,
        function (value) {
          if (!value) return false
          const cleanedValue = value.replace(/\D/g, '')

          if (cleanedValue.length === 11) {
            return validateCPF(cleanedValue)
          } else if (cleanedValue.length === 14) {
            return validateCNPJ(cleanedValue)
          }
          return false
        }
      ),
    [expiryDate.name]: Yup.string()
      .nullable()
      .required(`${expiryDate.requiredErrorMsg}`)
      .test('expDate', expiryDate.invalidErrorMsg, val => {
        if (val) {
          const startDate = new Date()
          const endDate = new Date(2050, 12, 31)
          if (moment(val, ['MM/YY', moment.ISO_8601]).isValid()) {
            return moment(
              new Date('20' + val.slice(3, 5), val.slice(0, 2), 1)
            ).isBetween(startDate, endDate)
          }
          return false
        }
        return false
      }),
    [cvv.name]: Yup.string()
      .required(`${cvv.requiredErrorMsg}`)
      .test('len', `${cvv.invalidErrorMsg}`, val => val && val.length === 3)
  })
]
