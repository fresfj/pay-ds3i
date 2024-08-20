import { useState, useEffect } from 'react'
import {
  Box,
  Stack,
  Grid,
  Card,
  Divider,
  Checkbox,
  Skeleton,
  CardMedia,
  InputAdornment,
  Typography,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material'
import { useDeepCompareEffect } from '@fuse/hooks'
import { InputField, InputFieldNumber, SelectField } from '../formFields'
import {
  addCustomer,
  calculateTotalSelector,
  getTotals,
  removeFromCart,
  addToCart
} from '../../store/cartSlice'
import { useField, useFormikContext } from 'formik'
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from '@mui/material/styles'
import { motion } from 'framer-motion'
import FuseSvgIcon from '@fuse/core/FuseSvgIcon'
import { usePaymentInputs } from 'react-payment-inputs'
import images from 'react-payment-inputs/images'
import GooglePayButton from '@google-pay/button-react'
import FuseUtils from '@fuse/utils'
import { useCreateECommerceAbandonedMutation } from '../../CheckoutApi'
import { useCreateCustomersItemMutation } from 'src/app/main/apps/customers/CustomersApi'
import { Iconify } from '@fuse/components/iconify'

const toggleButtons = [
  { value: 'card', label: 'Cartão de Crédito', svg: 'credit-card' },
  { value: 'pix', label: 'Pix', svg: 'pay-pix' }
]

const FeatureData = [
  {
    id: 1,
    icon: 'heroicons-outline:lightning-bolt',
    title: 'Rápido',
    description: 'Faça seus pagamentos em poucos segundos.'
  },
  {
    id: 2,
    icon: 'heroicons-outline:device-mobile',
    title: 'Fácil',
    description:
      'Abriu o Pix no app do seu banco, escaneou o QR code, finalizou a compra.'
  },
  {
    id: 3,
    icon: 'heroicons-outline:lock-closed',
    title: 'Seguro',
    description:
      'O Pix foi criado pelo Banco Central para facilitar suas compras.'
  }
]
const Root = styled('div')(({ theme }) => ({
  '& .MuiCard-root': {
    borderRadius: '0.5rem',
    '& .offer-title': {
      width: '100%',
      fontSize: '2.2rem !important',
      fontWeight: 700,
      textTransform: 'uppercase',
      padding: '1.8rem 2.5rem',
      background: '#e73f5d',
      color: 'white'
    },
    '& .offer-detail': {
      padding: '2rem',
      width: '100%',
      border: '3px dashed #e73f5d',
      borderTop: 0,
      background: '#FFFBE4'
    },
    '& .offer-order': {
      display: 'grid',
      gridTemplateColumns: '1fr 160px',
      gridGap: '1rem',
      gap: '1rem',
      width: '100%',
      background: 'hsla(0, 0%, 100%, .671)',
      borderRadius: '0.5rem',
      alignItems: 'center',
      padding: '1rem',
      marginTop: '0.5rem',
      cursor: 'pointer',
      transition: 'all .2s ease-in-out',
      borderBottom: '4px #E0E0E0 solid',

      '&.success': {
        background: 'hsl(122.42deg 69% 80% / 40%)',
        borderBottom: '4px #4CAF50 solid'
      }
    },
    '& .offer-order:hover': {
      transform: 'scale(1.03)'
    },
    '& .offer-img': {
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      width: '8rem',
      aspectRatio: '1/1',

      '& img': {
        borderRadius: '0.5rem'
      }
    },
    '& .offer-info': {
      display: 'flex',
      gap: '1rem',
      width: '100%',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'all .2s ease-in-out',
      '& div': {
        fontSize: '1.6rem',
        lineHeight: '1.8rem'
      }
    },
    '@media (max-width: 768px)': {
      '& .offer-info': {
        textAlign: 'center',
        '& div': {
          fontSize: '1.4rem',
          lineHeight: '1.6rem'
        }
      },
      '& .offer-order': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
      },
      '& .offer-title': {
        fontSize: '1.8rem !important'
      }
    }
  }
}))
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  marginTop: 20,
  maxWidth: '112%',
  overflow: 'auto',
  gap: '1vw',
  WebkitBoxOrient: 'horizontal',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  padding: 0,
  paddingBottom: 10,
  '& .Mui-selected': {
    border: '2px solid rgb(148 163 184)',
    '&.MuiToggleButtonGroup-grouped:after': {
      content: '""',
      position: 'absolute',
      width: 9,
      height: 9,
      borderRadius: '50%',
      background: theme.palette.primary.main,
      top: 7,
      right: 7
    }
  },
  '& .MuiToggleButtonGroup-grouped': {
    display: 'flex!important',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '15px 25px!important',
    minWidth: '160px',
    border: '2px solid rgba(0,0,0,.12)',
    borderRadius: `6px !important`,
    '& p': {
      fontSize: 14,
      fontWeight: 600,
      lineHeight: 1
    }
  }
}))

export default function PaymentForm(props) {
  const {
    formField: {
      installments,
      nameOnCard,
      cardNumber,
      expiryDate,
      cvv,
      paymentMethod
    },
    cookies
  } = props

  const currentUrl = window.location.href
  const dispatch = useDispatch()
  const { values: formValues, setValues, setFieldValue } = useFormikContext()
  const [alignment, setAlignment] = useState('card')
  const [data, setData] = useState([])
  const [toggle, setToggle] = useState({})
  const [loading, setLoading] = useState(true)
  const [payments, setPayments] = useState([
    { value: 'card', label: 'Cartão de Crédito', svg: 'credit-card' }
  ])
  const [valueInstallments, setValueInstallments] = useState([])
  const total = useSelector(calculateTotalSelector)

  const [createAbandoned] = useCreateECommerceAbandonedMutation()
  const [createCustomer] = useCreateCustomersItemMutation()
  const {
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    getCardImageProps
  } = usePaymentInputs()

  const cart = useSelector(state => state.checkoutApp.cart)
  const { products } = cart

  const [field, meta, helpers] = useField(paymentMethod)
  const { setValue } = helpers

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment)
    setValue(newAlignment)
  }

  const ferchInstallments = () => {
    const installments = []
    const installmentValue = []
    const installmentCount = products[0]?.installments
      ? products[0]?.installments
      : 1
    for (let index = 1; index <= installmentCount; index++) {
      let value = null
      const fees = 0.0292 / (1 - 1 / Math.pow(1 + 0.0292, index))
      const add = fees * total * index
      const addition = add - total
      const totalFees = fees * total * index
      if (index === 1) {
        value = {
          value: index,
          label: `${index}x de ${FuseUtils.formatCurrency(total)} s/juros`
        }
      } else {
        value = {
          value: index,
          label: `${index}x de ${FuseUtils.formatCurrency(
            fees * total
          )}* c/juros`
        }
      }
      installments.push(value)
      installmentValue.push({
        id: index,
        total: index !== 1 ? totalFees.toFixed(2) : total.toFixed(2),
        value: index !== 1 ? (fees * total).toFixed(2) : total.toFixed(2)
      })
    }

    setValueInstallments(installments)
    setValues({
      ...formValues,
      price: total,
      installmentsOptions: installmentValue
    })

    setFieldValue('installments', installmentCount)
  }

  const handleUp = key => {
    setToggle({ ...toggle, [key]: !toggle[key] })

    if (toggle[key]) {
      dispatch(removeFromCart(data[key]))

      dispatch(
        showMessage({
          message: 'Oferta Removida',
          autoHideDuration: 2000,
          variant: 'error',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          }
        })
      )
    } else {
      dispatch(addToCart(data[key]))
      dispatch(
        showMessage({
          message: 'Oferta Adicionada',
          autoHideDuration: 2000,
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          }
        })
      )
    }
  }

  const container = {
    show: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  let shouldSucceed = true
  const hasSufficientFunds = () => {
    const promise = Promise.resolve(shouldSucceed)
    shouldSucceed = !shouldSucceed
    return promise
  }

  const createUser = async () => {
    const customer = {
      email: formValues?.email,
      cpfCnpj: formValues?.cpfCnpj,
      birthday: formValues?.birthday,
      address: formValues?.address,
      addressNumber: formValues?.addressNumber,
      complement: formValues?.complement,
      neighborhood: formValues?.neighborhood,
      city: formValues?.city,
      state: formValues?.state,
      postalCode: formValues?.zipcode,
      invoiceAddress: formValues?.invoiceAddress,
      shippingAddress: formValues?.shippingAddress,
      title: '',
      background: '',
      company: '',
      notes: '',
      tags: [],
      emails: [{ email: formValues?.email, label: 'default' }],
      phoneNumbers: [
        { country: 'br', phoneNumber: formValues?.phone, label: 'default' }
      ],
      name: formValues?.fullName,
      updatedAt: new Date(),
      createdAt: new Date()
    }

    await createCustomer({ customer })
      .unwrap()
      .then(async action => {
        dispatch(addCustomer(action))

        createAbandoned({
          pixel: { url: currentUrl, cookies },
          customer: action,
          cart
        }).then(({ data }) => {
          setFieldValue('abandonedId', data)
        })
      })
  }
  useDeepCompareEffect(() => {
    if (products) {
      const items = []
      products.map(async (item, index) => {
        const gooProc = {
          item_id: item?.id,
          item_name: item?.name ? item?.name : item?.title,
          item_category: 'produto',
          price: parseFloat(item?.value.toFixed(2))
        }
        items.push(gooProc)
      })
      const params = {
        currency: 'BRL',
        value: parseFloat(total.toFixed(2)),
        coupon: '',
        items
      }

      if (products[0]?.payments !== undefined) {
        const paymentsSelected = products[0]?.payments.map(pay => {
          const info = toggleButtons.find(button => button.value === pay)
          return { value: info.value, label: info.label, svg: info.svg }
        })
        setPayments(paymentsSelected)
      }
    }

    if (!cart?.customer) {
      createUser()
    } else if (cart?.customer && formValues?.abandonedId === undefined) {
      createAbandoned({
        pixel: {
          url: currentUrl,
          cookies
        },
        customer: cart?.customer,
        cart
      }).then(({ data }) => {
        setFieldValue('abandonedId', data)
      })
    }
  }, [total, products])

  useEffect(() => {
    ferchInstallments()
    ;(async () => {
      setTimeout(() => {
        setLoading(false)
      }, 1000)

      if (products[0].upProducts.length > 0) {
        setData(products[0].upProducts)
      }
    })()
  }, [total])
  return (
    <Root>
      <StyledToggleButtonGroup
        disabled={loading}
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
        mt={4}
        className="flex flex-nowrap gap-12 -mx-20 px-20"
      >
        {payments.map((button, index) => (
          <ToggleButton
            key={index}
            value={button.value}
            className={`tab-nav text-xs sm:text-sm ${
              alignment === button.value
                ? 'tab-active shadow-md shadow-gray-500/40'
                : ''
            }`}
          >
            <Stack direction="row" alignItems="center">
              <Box component="span" sx={{ flexGrow: 1, mr: 1 }}>
                {button.value === 'card' && (
                  <Iconify icon="solar:card-bold-duotone" width={32} />
                )}
                {button.value === 'pix' && (
                  <Iconify icon="solar:qr-code-bold-duotone" width={32} />
                )}
                {button.value === 'boleto' && (
                  <Iconify
                    icon="solar:password-minimalistic-input-bold-duotone"
                    width={32}
                  />
                )}
              </Box>
              <Box component="span" sx={{ typography: 'p' }}>
                {button.label}
              </Box>
            </Stack>
          </ToggleButton>
        ))}
      </StyledToggleButtonGroup>
      {payments.map(option => {
        return (
          alignment === option.value && (
            <Grid container spacing={2} my={2} key={option.value}>
              {alignment === 'card' && (
                <>
                  <Grid item xs={12} md={6}>
                    <InputField
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <svg
                              width="36px!important"
                              height="36px!important"
                              {...getCardImageProps({ images })}
                            />
                          </InputAdornment>
                        )
                      }}
                      name={cardNumber.name}
                      label={cardNumber.label}
                      inputProps={getCardNumberProps()}
                      type="tel"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <InputFieldNumber
                      name={expiryDate.name}
                      label={expiryDate.label}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <InputField name={cvv.name} label={cvv.label} fullWidth />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <InputField
                      name={nameOnCard.name}
                      label={nameOnCard.label}
                      fullWidth
                    />
                  </Grid>
                  {valueInstallments.length > 1 && (
                    <Grid item xs={12}>
                      <SelectField
                        value={12}
                        name={installments.name}
                        label={installments.label}
                        data={valueInstallments}
                      />

                      <p
                        className="py-2 pt-0 font-primary mb-0"
                        style={{ fontSize: 'xx-small' }}
                      >
                        *Parcelamento com tarifa de 2.92% a.m
                      </p>
                    </Grid>
                  )}
                </>
              )}
              {alignment === 'pix' && (
                <Grid item xs={12}>
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 "
                  >
                    {FeatureData?.map(feature => (
                      <motion.div
                        variants={item}
                        className="min-w-full sm:min-w-224 min-h-160"
                        key={feature.id}
                      >
                        <Card
                          key={feature.id}
                          role="button"
                          className="flex flex-col items-start w-full h-full p-24 shadow rounded-lg hover:shadow-xl transition-shadow duration-150 ease-in-out"
                        >
                          <div className="flex flex-col flex-auto justify-start items-start w-full">
                            <Box
                              sx={{
                                backgroundColor: 'secondary.light',
                                color: 'secondary.dark'
                              }}
                              className="flex items-center justify-center p-16 rounded-full"
                            >
                              <FuseSvgIcon>{feature.icon}</FuseSvgIcon>
                            </Box>

                            <Typography className="mt-20 text-lg font-medium leading-5">
                              {feature.title}
                            </Typography>

                            <Typography className="mt-2 line-clamp-3 text-secondary">
                              {feature.description}
                            </Typography>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </Grid>
              )}
              {alignment === 'gpay' && (
                <Grid item xs={12}>
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1"
                  >
                    <motion.div variants={item}>
                      <GooglePayButton
                        style={{ width: '100%', height: 55 }}
                        className="mt--20"
                        environment="TEST"
                        buttonType="buy"
                        buttonLocale="pt"
                        buttonSizeMode="fill"
                        paymentRequest={{
                          apiVersion: 2,
                          apiVersionMinor: 0,
                          allowedPaymentMethods: [
                            {
                              type: 'CARD',
                              parameters: {
                                allowedAuthMethods: [
                                  'PAN_ONLY',
                                  'CRYPTOGRAM_3DS'
                                ],
                                allowedCardNetworks: [
                                  'AMEX',
                                  'DISCOVER',
                                  'INTERAC',
                                  'JCB',
                                  'MASTERCARD',
                                  'VISA'
                                ]
                              },
                              tokenizationSpecification: {
                                type: 'PAYMENT_GATEWAY',
                                parameters: {
                                  gateway: 'cielo',
                                  gatewayMerchantId:
                                    '93f1086e-4725-4edd-9c4b-87f3c1ff56d1'
                                }
                              }
                            }
                          ],
                          merchantInfo: {
                            merchantId: '17613812255336763067',
                            merchantName:
                              'DPay - Desenvolvimento de Sistemas e Aplicativos'
                          },
                          transactionInfo: {
                            totalPriceStatus: 'FINAL',
                            totalPriceLabel: 'Total',
                            totalPrice: total.toFixed(2),
                            currencyCode: 'BRL',
                            countryCode: 'BR'
                          },
                          callbackIntents: ['PAYMENT_AUTHORIZATION'],
                          emailRequired: true
                        }}
                        onLoadPaymentData={paymentData => {
                          // dispatch(payment(paymentData.paymentMethodData))
                          // router.push({
                          //   pathname: '/thanks',
                          //   query: {
                          //     pid: paymentData.paymentMethodData.tokenizationData
                          //       .token
                          //   }
                          // })
                        }}
                        onPaymentAuthorized={async () => {
                          if (await hasSufficientFunds()) {
                            return { transactionState: 'SUCCESS' }
                          } else {
                            return {
                              transactionState: 'ERROR',
                              error: {
                                reason: 'PAYMENT_DATA_INVALID',
                                message:
                                  'Insufficient funds (shouldSucceed is false), click Pay again.',
                                intent: 'PAYMENT_AUTHORIZATION'
                              }
                            }
                          }
                        }}
                      />
                    </motion.div>
                  </motion.div>
                </Grid>
              )}
              {alignment === 'boleto' && (
                <Grid item xs={12}>
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1"
                  >
                    <motion.div variants={item}>
                      <Typography
                        variant="subtitle1"
                        component="p"
                        gutterBottom
                      >
                        Pagamentos com Boleto Bancário levam até 3 dias úteis
                        para serem compensados e então terem os produtos
                        liberados.
                      </Typography>
                    </motion.div>
                  </motion.div>
                </Grid>
              )}
            </Grid>
          )
        )
      })}
      {data.length > 0 && (
        <>
          <Divider sx={{ mb: 4, mt: 4 }} />
          <Typography
            align="center"
            component="p"
            variant="h6"
            sx={{ mb: 1, mt: 4, fontWeight: 600 }}
          >
            {!loading ? (
              `🎉 Você possui ${
                data.length > 1
                  ? data.length + ' ofertas'
                  : data.length + ' oferta'
              }!`
            ) : (
              <Skeleton animation="wave" />
            )}
          </Typography>
          <Typography
            align="center"
            component="div"
            variant="body1"
            sx={{ mb: 4, mt: 1 }}
          >
            {!loading ? (
              'Oportunidade única de adquirir produtos incríveis com um super desconto!'
            ) : (
              <Skeleton animation="wave" />
            )}
          </Typography>
          {data.map((items, index) => (
            <Card key={index} sx={{ mt: 3 }}>
              <Typography
                className="offer-title mb-0"
                component="div"
                variant="h4"
                fontSize="md"
                sx={{ mb: 0.5 }}
              >
                {!loading ? (
                  <>
                    {items?.titleOffer}{' '}
                    {items?.titleOfferValues ? (
                      <>
                        {' '}
                        de <del>
                          {FuseUtils.formatCurrency(items?.of)}
                        </del> por {FuseUtils.formatCurrency(items?.value)}
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <Skeleton animation="wave" />
                )}
              </Typography>
              <Box
                className="offer-detail"
                sx={{ display: 'block', p: 2 }}
                onClick={() => handleUp(index)}
              >
                <>
                  {!loading ? (
                    <Typography
                      className="flex mt-12 whitespace-pre-line leading-relaxed"
                      variant="body2"
                      dangerouslySetInnerHTML={{
                        __html: items?.description.replace(/\n/g, '<br>')
                      }}
                      // dangerouslySetInnerHTML={{ __html: items?.description }}
                    />
                  ) : (
                    <>
                      <Skeleton animation="wave" />
                      <Skeleton animation="wave" width="80%" />
                    </>
                  )}
                </>
                <Box
                  justifyContent={'space-around'}
                  className={`offer-order ${toggle[index] ? 'success' : ''}`}
                >
                  <Box
                    className={`offer-info`}
                    sx={{ display: 'flex' }}
                    alignItems="center"
                  >
                    {!loading ? (
                      <Checkbox
                        checked={toggle[index] ? true : false}
                        value={index}
                        color="success"
                      />
                    ) : (
                      <Skeleton
                        animation="wave"
                        sx={{ width: `20px`, height: `30px` }}
                      />
                    )}
                    <div className="flex offer-img">
                      {items?.image && !loading ? (
                        <CardMedia
                          component="img"
                          sx={{ width: 80 }}
                          image={items?.image}
                          alt={items?.name}
                        />
                      ) : (
                        <Skeleton animation="wave" variant="rounded" />
                      )}
                    </div>
                    <Typography component="div" variant="h6" width="100%">
                      <strong>
                        {items?.name && !loading ? (
                          `Sim, eu quero, ${items?.name}`
                        ) : (
                          <Skeleton animation="wave" />
                        )}
                      </strong>
                    </Typography>
                  </Box>
                  <Box textAlign={'end'}>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      component="p"
                      sx={{ width: `100%` }}
                    >
                      {items?.of && !loading ? (
                        <del style={{ textDecoration: 'line-through #dc3545' }}>
                          {FuseUtils.formatCurrency(items?.of)}
                        </del>
                      ) : (
                        <Skeleton
                          animation="wave"
                          width="80%"
                          sx={{ float: 'right' }}
                        />
                      )}
                    </Typography>
                    <Typography
                      variant="h5"
                      color="primary"
                      component="p"
                      sx={{ width: `100%` }}
                    >
                      {items?.value && !loading ? (
                        <strong>
                          {FuseUtils.formatCurrency(items?.value)}
                        </strong>
                      ) : (
                        <Skeleton
                          animation="wave"
                          width="80%"
                          sx={{ float: 'right' }}
                        />
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          ))}
        </>
      )}
    </Root>
  )
}
