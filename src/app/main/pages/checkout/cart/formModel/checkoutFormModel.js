export default {
  formId: 'checkoutForm',
  formField: {
    recaptcha: {
      name: 'recaptcha',
      label: 'reCaptcha*',
      requiredErrorMsg: 'reCaptcha é obrigatório.',
      validatedErrorMsg: 'reCaptcha é inválido'
    },
    coupon: {
      name: 'coupon',
      label: 'Coupon',
      requiredErrorMsg: 'Informe um coupon inválido',
      validatedErrorMsg: 'Por favor, insira um coupon inválido'
    },
    fullName: {
      name: 'fullName',
      label: 'Nome completo*',
      requiredErrorMsg: 'Nome completo é obrigatório.',
      validatedErrorMsg: 'Por favor, insira tanto o nome quanto o sobrenome'
    },
    birthday: {
      name: 'birthday',
      label: 'Data de nascimento*',
      requiredErrorMsg: 'Data de nascimento é obrigatório.',
      invalidErrorMsg: 'Por favor, informe sua data de nascimento inválido'
    },
    cpfCnpj: {
      name: 'cpfCnpj',
      label: 'CPF*',
      validatedErrorMsg: 'O CPF é inválido.',
      requiredErrorMsg: 'CPF é obrigatório.'
    },
    email: {
      name: 'email',
      label: 'E-mail*',
      validatedErrorMsg: 'O e-mail é inválido.',
      requiredErrorMsg: 'E-mail é obrigatório.'
    },
    phone: {
      name: 'phone',
      label: 'Telefone*',
      validatedErrorMsg: 'O Telefone é inválido.',
      requiredErrorMsg: 'Telefone é obrigatório.'
    },
    zipcode: {
      name: 'zipcode',
      label: 'CEP*',
      requiredErrorMsg: 'CEP é obrigatório.',
      validatedErrorMsg: 'CEP é inválido.'
    },
    neighborhood: {
      name: 'neighborhood',
      label: 'Bairro*',
      requiredErrorMsg: 'Bairro é obrigatório'
    },
    complement: {
      name: 'complement',
      label: 'Complemento*',
      requiredErrorMsg: 'complement é obrigatório'
    },
    addressNumber: {
      name: 'addressNumber',
      label: 'Número*',
      requiredErrorMsg: 'Número do endereço é obrigatório'
    },
    address: {
      name: 'address',
      label: 'Endereço*',
      requiredErrorMsg: 'Endereço é obrigatório'
    },
    city: {
      name: 'city',
      label: 'Cidade*',
      requiredErrorMsg: 'Cidade é obrigatório'
    },
    state: {
      name: 'state',
      label: 'State/Province/Region'
    },
    country: {
      name: 'country',
      label: 'Country*',
      requiredErrorMsg: 'Country é obrigatório'
    },
    useAddressForPaymentDetails: {
      name: 'useAddressForPaymentDetails',
      label: 'Use this address for payment details'
    },
    nameOnCard: {
      name: 'nameOnCard',
      label: 'Titular do cartão*',
      requiredErrorMsg: 'Titular do cartão é obrigatório'
    },
    installments: {
      name: 'installments',
      label: 'Parcelas*',
      requiredErrorMsg: 'Selecione uma opção de parcelamento'
    },
    cardNumber: {
      name: 'cardNumber',
      label: 'Número do cartão*',
      requiredErrorMsg: 'Número do cartão é obrigatório',
      invalidErrorMsg: 'Card number is not valid (e.g. 4111111111111)'
    },
    expiryDate: {
      name: 'expiryDate',
      label: 'Validade*',
      requiredErrorMsg: 'Validade é obrigatório',
      invalidErrorMsg: 'Expiry date is not valid'
    },
    cardDocument: {
      name: 'cardDocument',
      label: 'CPF/CNPJ titular do cartão*',
      requiredErrorMsg: 'CPF/CNPJ titular do cartão é obrigatório',
      validatedErrorMsg: 'O CPF/CNPJ digitado é inválido',
      invalidErrorMsg: 'CPF/CNPJ is not valid (e.g. 41111111111)'
    },
    cvv: {
      name: 'cvv',
      label: 'CVV*',
      requiredErrorMsg: 'CVV é obrigatório',
      invalidErrorMsg: 'CVV is invalid (e.g. 357)'
    },
    shipping: {
      name: 'shipping',
      label: 'Método de Entrega',
      requiredErrorMsg: 'É necessário selecionar uma método de entrega'
    },
    paymentMethod: {
      name: 'paymentMethod',
      label: 'Payment Method',
      requiredErrorMsg: 'Payment Method é obrigatório'
    }
  }
}
