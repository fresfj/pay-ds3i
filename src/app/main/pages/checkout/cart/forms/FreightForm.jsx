import { useEffect, useState } from 'react'
import { RadioGroup } from '../formFields'
import Grid from '@mui/material/Grid'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Skeleton from '@mui/material/Skeleton'
import FuseSvgIcon from '@fuse/core/FuseSvgIcon'

import { useFormikContext } from 'formik'
export default function FreightForm(props) {
  const {
    formField: { shipping },
    formField: { cart },
    formField: { subscriptionOption }
  } = props

  const [map, setMap] = useState('shipping')
  const [loading, setLoading] = useState(true)
  const [deliverys, setDeliverys] = useState([])
  const { values, setValues, setFieldValue } = useFormikContext()

  const deliverysArray = [
    {
      title: 'Convencional',
      about: 'Envio por Motoboy',
      price: cart?.products[0].taxRate ? Number(cart?.products[0].taxRate) : 0,
      type: 'Convencional - Motoboy',
      value: 0
    },
    {
      title: 'Retirar na Loja',
      about: 'R. Cap. Leônidas Marques, 1755 - Uberaba - Curitba',
      price: 0,
      type: 'Retirar na Loja',
      value: 0
    }
  ]
  const delivery = async () => {
    const data = {
      frete: [
        {
          cepori: '81460020',
          cepdes: values?.zipcode.replace('-', ''),
          peso: cart?.products[0].weight ? Number(cart.products[0].weight) : 8,
          modalidade: 3,
          vldeclarado: cart?.total ? cart.total : 99.9,
          vlcoleta: 0,
          frap: 'N',
          cnpj: '53007816000103',
          conta: '000000',
          tpentrega: 'D',
          tpseguro: 'N'
        }
      ]
    }
    await fetch(`https://creabox-pay.vercel.app/api/v1/delivery`, {
      method: 'POST',
      cache: 'no-cache',
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => {
        const jadlog = [
          {
            ...data[0],
            title: 'Expresso',
            about: 'Envio por Jadlog',
            discount: 10,
            price: data[0].vltotal - 10,
            type: 'Expresso - Jadlog',
            value: data[0].vltotal
          }
        ]
        setDeliverys(jadlog)
        setTimeout(() => {
          setLoading(false)
        }, 800)
      })
      .catch(err => {
        const jadlog = [
          {
            title: 'Expresso',
            about: 'Envio por Jadlog',
            discount: 10,
            price: 18.5,
            type: 'Expresso - Jadlog',
            value: 28.5
          }
        ]
        setDeliverys(jadlog)
        setTimeout(() => {
          setLoading(false)
        }, 800)
      })
  }

  useEffect(() => {
    const fetchData = async () => {
      if (values?.zipcode && values?.city !== 'Curitiba') {
        await delivery()
      } else {
        setDeliverys(deliverysArray)
        setTimeout(() => {
          setLoading(false)
        }, 1200)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <Grid
        container
        direction="column"
        wrap="nowrap"
        justifyContent={'center'}
        spacing={4}
      >
        <Grid item xs={12} mt={2}>
          <div className="space-y-12">
            <Accordion
              className="border-0 shadow-0 overflow-hidden"
              expanded={map === 'shipping'}
              onChange={() => setMap(map !== 'shipping' ? 'shipping' : '')}
              sx={{
                backgroundColor: 'background.default',
                borderRadius: '12px!important'
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className="font-semibold">
                  Endereço de Entrega
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="flex flex-col content-center md:flex-row">
                <FuseSvgIcon className="text-48" size={24} color="action">
                  heroicons-solid:home
                </FuseSvgIcon>
                <Typography className="w-full mb-16 md:mb-0 mx-8 text-16">
                  {loading ? (
                    <Skeleton sx={{ height: 28 }} animation="wave" />
                  ) : values?.shippingAddress?.address ? (
                    values?.shippingAddress?.address
                  ) : (
                    `${values?.address}, ${values?.addressNumber} - ${values?.neighborhood}, ${values?.city} - ${values?.state}`
                  )}
                </Typography>
              </AccordionDetails>
            </Accordion>

            {cart?.products[0]?.isSubscription &&
              subscriptionOption?.remittance && (
                <>
                  {loading ? (
                    <Skeleton
                      sx={{ height: 60, transform: 'none' }}
                      animation="wave"
                    />
                  ) : (
                    <Typography
                      sx={{
                        backgroundColor: '#7505FB',
                        color: '#ede1fa',
                        borderRadius: 2,
                        px: { md: 2, xs: 1 },
                        py: { md: 3, xs: 2 }
                      }}
                    >
                      <strong>Recebimento:</strong> A cada{' '}
                      {subscriptionOption.remittance} dias (garantindo que você
                      nunca fique sem creatina ou com excesso)
                    </Typography>
                  )}
                </>
              )}
          </div>
        </Grid>
        <Grid item xs={12} mt={2}>
          {loading ? (
            <>
              <Skeleton sx={{ height: 60 }} width="40%" animation="wave" />
              <Skeleton
                sx={{ height: 80, transform: 'none' }}
                animation="wave"
              />
            </>
          ) : (
            <RadioGroup
              name={shipping.name}
              label={shipping.label}
              options={deliverys}
              fullWidth
            />
          )}
        </Grid>
      </Grid>
    </>
  )
}
