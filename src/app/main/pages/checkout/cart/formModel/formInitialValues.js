import checkoutFormModel from './checkoutFormModel'
const {
  formField: {
    recaptcha,
    coupon,
    fullName,
    birthday,
    cpfCnpj,
    email,
    phone,
    neighborhood,
    complement,
    addressNumber,
    address,
    city,
    zipcode,
    country,
    useAddressForPaymentDetails,
    installments,
    nameOnCard,
    cardNumber,
    cardDocument,
    expiryDate,
    cvv,
    shipping,
    paymentMethod
  }
} = checkoutFormModel

export default data => {
  return {
    [coupon.name]: data.coupon || '',
    [fullName.name]: data.fullName || '',
    [birthday.name]: data.birthday || '',
    [cpfCnpj.name]: data.cpfCnpj || '',
    [email.name]: data.email || '',
    [phone.name]: data.phone || '',
    [zipcode.name]: data.zipcode || '',
    [neighborhood.name]: '',
    [complement.name]: data.complement || '',
    [addressNumber.name]: data.addressNumber || '',
    [address.name]: '',
    [city.name]: '',
    [country.name]: '',
    [useAddressForPaymentDetails.name]: false,
    [installments.name]: '',
    [nameOnCard.name]: '',
    [cardNumber.name]: '',
    [cardDocument.name]: '',
    [expiryDate.name]: '',
    [cvv.name]: '',
    [shipping.name]: '',
    [paymentMethod.name]: 'card'
  }
}
