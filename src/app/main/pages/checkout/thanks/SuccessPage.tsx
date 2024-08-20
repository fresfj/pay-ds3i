import React, { useRef, useState, useEffect, createRef } from 'react'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import _ from '@lodash'
import Paper from '@mui/material/Paper'
import { useDispatch, useSelector } from 'react-redux'
import './styles.css'
import CardContent from '@mui/material/CardContent'
import { motion } from 'framer-motion'
import Box from '@mui/material/Box'
import { alpha } from '@mui/material/styles'
import format from 'date-fns/format'
import FuseUtils from '@fuse/utils'
import { useAppDispatch } from 'app/store/store';

import ClipboardJS from 'clipboard'
import { useParams, useLocation } from 'react-router-dom'
import { useDeepCompareEffect } from '@fuse/hooks'
import { getOrder, selectOrder } from '../store/orderSlice'
import { Player, Controls } from '@lottiefiles/react-lottie-player'
import Confetti from 'react-confetti'
import history from '@history'
import Boleto from 'boleto.js'
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import firebase from 'firebase/compat/app'

const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Textarea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
    box-sizing: border-box;
    font-size: 1.4rem;
    font-weight: 400;
    line-height: 1.4;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#f0f0f0'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[50]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
);

function ClassicComingSoonPage(props) {
  const date = format(new Date(), 'MMM dd, h:mm a')
  const [counter, setCounter] = useState(1800)
  const [noOrder, setNoOrder] = useState(false)
  const [barcode, setBarcode] = useState('')

  const playerRef = createRef<Player>()
  const dispatch = useAppDispatch()

  const routeParams = useParams()
  const order = useSelector(selectOrder)

  const location = useLocation()
  const inputRef = useRef(null)
  const searchParams = new URLSearchParams(location.search)
  const uid = searchParams.get('uid') ? searchParams.get('uid') : routeParams.id
  const [open, setOpen] = useState(false)
  const [openPix, setOpenPix] = useState(false)

  const handleTooltipClose = () => {
    setOpen(false); setOpenPix(false)
  }

  const handleTooltipOpen = () => {
    setOpen(true)
  }

  const doSomething = () => {
    //playerRef.current.play()
  }

  const download = () => {
    history.push(`${order?.payment?.bankSlipUrl}?download=true`)
  }
  const gLogEvent = (event: any) => {
    const analytics = firebase.analytics()

    const items = order?.cart?.products.map(product => ({
      item_id: product.id,
      item_name: product.name,
      item_category: product?.categories ? product?.categories[0] : '',
      item_variant: product.handle,
      item_brand: 'Creabox',
      price: product.value
    }));

    const params = {
      currency: 'BRL',
      shipping: order?.cart?.shipping?.value,
      coupon: order?.cart?.discount?.code,
      value: Number(order?.cart?.total).toFixed(2),
      user_data: {
        email_address: order?.cart?.customer?.name,
        phone_number: order?.cart?.customer?.phoneNumbers[0]?.phoneNumber,
        address: {
          first_name: order?.cart?.customer?.name,
          city: order?.cart?.customer?.city,
          region: order?.cart?.customer?.state,
          postal_code: order?.cart?.customer?.postalCode,
          country: 'bra',
        },
      },
      items: items
    };

    analytics.logEvent(event, params);
  }

  useDeepCompareEffect(() => {
    if (order?.payment?.status !== 'PENDING') {
      document.title = `Pedido Realizado - Seu pedido:${uid}`;
    }

    const number = order?.payment.identificationField
    if (number) {
      const svg = new Boleto(number).toSVG()
      setBarcode(`data:image/svg+xml;base64,${window.btoa(svg)}`)
    }
    if (order) {
      gLogEvent('view_cart')
    }

    dispatch(getOrder(uid))
    return () => {
      setNoOrder(false)
    }
  }, [dispatch, order])

  const formatTime = timer => {
    const getSeconds = `0${timer % 60}`.slice(-2)
    const minutes = Math.floor(timer / 60)
    const getMinutes = `0${minutes % 60}`.slice(-2)
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2)

    return `${getMinutes}:${getSeconds}`
  }


  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000)

    return () => clearInterval(timer)
  }, [counter])

  const handleCopy = (buttonClass: string) => {
    const clipboard = new ClipboardJS('.copy-button' + buttonClass)
    clipboard.on('success', function (e) {
      clipboard.destroy()
    })

    clipboard.on('error', function (e) {
      console.error('Erro ao copiar texto:', e.action)
      clipboard.destroy()
    })
    const copy: any = document.querySelector('.copy-button' + buttonClass)

    copy.click()
    copy.style.backgroundColor = '#22c55e'
    copy.style.color = '#dcfce7'
    copy.style.transition = 'background-color 0.5s linear 0s'
    setTimeout(() => {
      copy.style.backgroundColor = ''
      copy.style.color = ''
      handleTooltipClose()
    }, 3000)
  }

  if (noOrder) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There is no such order!
        </Typography>
        <div>
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path d="M1.41 1.13L0 2.54l4.39 4.39 2.21 4.66-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h7.46l1.38 1.38A1.997 1.997 0 0017 22c.67 0 1.26-.33 1.62-.84L21.46 24l1.41-1.41L1.41 1.13zM7 15l1.1-2h2.36l2 2H7zM20 4H7.12l2 2h9.19l-2.76 5h-1.44l1.94 1.94c.54-.14.99-.49 1.25-.97l3.58-6.49C21.25 4.82 20.76 4 20 4zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2z"></path>
          </svg>
          <h1>Oferta Encerrada</h1>
          <p>
            Infelizmente as vendas para esta oferta não estão mais disponíveis.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col flex-auto items-center sm:justify-center min-w-0 md:p-32">
      <Paper className="flex w-full sm:w-auto min-h-full sm:min-h-auto md:w-full md:max-w-6xl rounded-0 sm:rounded-2xl sm:shadow overflow-hidden">
        <div className="w-full sm:w-auto py-32 px-16 sm:p-48 md:p-64">
          <motion.div
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ bounceDamping: 0 }}
          >
            {order ? (
              <>
                {order?.payment?.billingType === 'BOLETO' &&
                  order?.payment?.status === 'PENDING' && (
                    <Grid
                      container
                      spacing={4}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Grid item xs={12} md={12} order={1}>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, transition: { delay: 0.1 } }}
                        >
                          <Typography
                            component="h2"
                            variant="h2"
                            gutterBottom
                            style={{ fontWeight: 700 }}
                          >
                            Quase lá..
                          </Typography>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, transition: { delay: 0.25 } }}
                        >
                          <Typography
                            component="h5"
                            variant="h5"
                            gutterBottom
                            style={{ fontWeight: 700 }}
                          >
                            Você tem 2 dias úteis para pagar seu boleto
                          </Typography>
                        </motion.div>
                        {order?.payment?.payload &&
                          <div className='col-12'>
                            <Typography
                              component="p"
                              variant="subtitle1"
                              gutterBottom
                              style={{ fontWeight: 700 }}
                            >
                              Pagar o seu boleto com PIX
                            </Typography>
                            <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center mt-12 mb-12 gap-12 font-primary barcode">
                              <div className="grid gap-12">
                                <ul
                                  className="my-12 list-disc list-inside"
                                >
                                  <li>
                                    Abra seu aplicativo de pagamento onde você utiliza o Pix e escolha a opção <strong>Ler QR Code</strong>
                                  </li>
                                  <li>
                                    Você também pode pagar escolhendo a opção <strong>Pix Copia e Cola</strong> no seu aplicativo de pagamento ou Internet Banking (banco online).
                                  </li>
                                  <li>Neste caso, copie o código clicando no botão abaixo:</li>
                                </ul>
                                <Textarea
                                  minRows={3}
                                  value={order?.payment?.payload}
                                  aria-label="Código Pix"
                                  placeholder="Código Pix"
                                />
                                <Tooltip
                                  onClose={handleTooltipClose}
                                  open={openPix}
                                  arrow
                                  placement="top"
                                  disableHoverListener
                                  disableFocusListener
                                  title="Código copiado!"
                                >
                                  <Button
                                    className="copy-button cpix w-full rounded-md"
                                    variant="contained"
                                    data-clipboard-text={order?.payment?.payload}
                                    onClick={() => { handleCopy('.cpix'); setOpenPix(true); }}
                                  >
                                    Copiar o código Pix
                                  </Button>
                                </Tooltip>
                              </div>
                              <div className="text-center">
                                <div className='flex justify-center'>
                                  <img
                                    className="w-32 mr-8 grayscale"
                                    src={`assets/icons/pay-pix.svg`}
                                    alt="logo"
                                  />
                                  <div>Pague o boleto com Pix<br /> usando o QRcode abaixo</div>
                                </div>
                                <img
                                  style={{ display: 'inline-block', width: 250 }}
                                  className="w-100 rounded-8"
                                  src={`data:image/png;base64,${order?.payment?.encodedImage}`}
                                  alt="QR Code PIX"
                                />
                              </div>
                            </div>
                            <div
                              className="col-span-12 my-32 border-b-1"
                              style={{ borderStyle: 'dotted' }}
                            />
                          </div>
                        }
                        <Typography
                          component="p"
                          variant="subtitle1"
                          gutterBottom
                          style={{ fontWeight: 700 }}
                        >
                          Pagar com linha digitável
                        </Typography>

                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, transition: { delay: 0.25 } }}
                        >
                          <ul
                            className="my-12 list-disc list-inside"
                          >
                            <li>
                              Para pagar via Internet Banking, copie a linha digitável.
                            </li>
                            <li>
                              Para pagar em qualquer banco, caixas eletrônicos ou lotéricas, imprima o boleto.
                            </li>
                          </ul>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, transition: { delay: 0.3 } }}
                        >
                          <p>
                            Você também receberá o boleto por email. Pagamentos
                            com Boleto Bancário levam até{' '}
                            <strong>3 dias úteis</strong> para serem compensados
                          </p>
                        </motion.div>
                        <div className='p-12'>
                          {barcode &&
                            <img src={barcode} alt="barcode" />
                          }
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 justify-center items-center mt-12 mb-12 gap-12 font-primary barcode">
                          <TextField
                            label="Código de barras"
                            value={order?.payment?.barCode}
                            type="text"
                            variant="filled"
                            fullWidth
                          />
                          <Tooltip
                            onClose={handleTooltipClose}
                            open={open}
                            arrow
                            placement="top"
                            disableHoverListener
                            disableFocusListener
                            title="Código copiado!"
                          >
                            <Button
                              className="copy-button cbar w-full rounded-md"
                              variant="contained"
                              data-clipboard-text={order?.payment?.barCode}
                              onClick={() => { handleCopy('.cbar'); setOpen(true) }}
                            >
                              Copiar o código de barras
                            </Button>
                          </Tooltip>
                          <Button
                            component={Link}
                            onClick={download}
                            className="w-full rounded-md"
                            variant="outlined"
                          >
                            Download boleto
                          </Button>
                        </div>
                      </Grid>
                    </Grid>
                  )}
                {order?.payment?.billingType === 'PIX' &&
                  order?.payment?.status === 'PENDING' && (
                    <Grid
                      container
                      spacing={4}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <>
                        <Grid item xs={12} md={6} order={1}>
                          <Typography
                            component="h2"
                            variant="h2"
                            gutterBottom
                            style={{ fontWeight: 700 }}
                          >
                            Quase lá..
                          </Typography>
                          <h3>Seu PIX foi gerado</h3>
                          <p className="h4 mb-0">
                            Pague seu Pix dentro de{' '}
                            <strong className="font-primary h4">
                              {formatTime(counter)}
                            </strong>{' '}
                            para garentir sua compra.
                          </p>
                          <p className="font-primary">
                            <small>
                              Expirar em: {order?.payment?.expirationDate}
                            </small>
                          </p>
                          <Alert
                            variant="filled"
                            icon={false}
                            severity="warning"
                            className="rounded-8 bg-warning mt-4"
                          >
                            <div className="flex flex-colitems-start justify-between">
                              <span className="h4 mb-0 px-2">
                                Aguardando pagamento
                              </span>
                              <div className="lds-ellipsis px-2">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                              </div>
                            </div>
                          </Alert>
                        </Grid>
                        <Grid item xs={12} md={6} order={1}>
                          <div className="form-box shadow-box mb--30">
                            <p className="text-center">
                              <strong>
                                Abra seu aplicativo de pagamento onde você
                                utiliza o Pix e escolha a opção Ler QR Code
                              </strong>
                            </p>
                            <p className="text-center mb-10">
                              Aponte a câmera do seu celular
                            </p>
                            <div className="text-center">
                              <img
                                style={{ display: 'inline-block', width: 269 }}
                                className="w-100 rounded-8"
                                src={`data:image/png;base64,${order?.payment?.encodedImage}`}
                                alt="QR Code PIX"
                              />
                              <p className="body-font1 mt-8">Valor a pagar</p>
                              <Typography
                                className="font-primary"
                                variant="h5"
                                component="h2"
                              >
                                <strong>
                                  {FuseUtils.formatCurrency(
                                    order?.payment?.value
                                  )}
                                </strong>
                              </Typography>
                            </div>
                          </div>
                          <p className="text-center">
                            Você também pode pagar escolhendo a opção{' '}
                            <strong>Pix Copia e Cola</strong> no seu aplicativo
                            de pagamento ou Internet Banking (banco online).
                            Neste caso, copie o código clicando no botão abaixo:
                          </p>

                          <div className="flex mt-8 justify-center align-items-center font-primary barcode">
                            <Tooltip
                              onClose={handleTooltipClose}
                              open={open}
                              arrow
                              placement="top"
                              disableHoverListener
                              disableFocusListener
                              title="Código copiado!"
                            >
                              <Button
                                className="copy-button cpix w-full"
                                variant="outlined"
                                data-clipboard-text={order?.payment?.payload}
                                onClick={() => { handleCopy('.cpix'); setOpen(true) }}
                              >
                                Clique aqui para copiar o código pix
                              </Button>
                            </Tooltip>
                          </div>
                        </Grid>
                      </>
                    </Grid>
                  )}
                {(order?.payment?.status === 'CONFIRMED' || order?.payment?.status === 'ACTIVE' ||
                  order?.payment?.status === 'RECEIVED') && (
                    <div className="text-center content-center">
                      <Player
                        ref={playerRef}
                        autoplay={true}
                        keepLastFrame={true}
                        loop={false}
                        src="https://lottie.host/b2c0d72c-307f-455f-93a3-696b13e02842/HpLYdFkkYj.json"
                        style={{
                          height: '150px',
                          width: '150px',
                          marginTop: '-28px'
                        }}
                      ></Player>
                      <Typography
                        className="text-4xl tracking-tight"
                        color="text.secondary"
                      >
                        Obrigado!
                      </Typography>
                      {order?.payment?.object === 'subscription' ?
                        <Typography className="text-2xl">
                          Sua assinatura foi realizada com sucesso! Obrigado por escolher a CREABOX.
                        </Typography>
                        :
                        <Typography className="text-2xl">
                          Seu pagamento foi realizado com sucesso.
                        </Typography>
                      }

                      <Confetti
                        numberOfPieces={500}
                        recycle={false}
                        width={window.innerWidth}
                        height={window.innerHeight}
                      />
                    </div>
                  )}
                {order?.payment?.status !== 'CONFIRMED' ||
                  order?.payment?.status !== 'RECEIVED' &&
                  <div
                    className="col-span-12 my-16 border-b-1"
                    style={{ borderStyle: 'dotted' }}
                  />
                }
                <>
                  <CardContent className="">
                    <div className="flex sm:flex-row flex-col items-center justify-between">
                      <div className="grid grid-cols-2 gap-x-8 sm:gap-x-16 gap-y-1">
                        <Typography
                          className="text-4xl tracking-tight"
                          color="text.secondary"
                        >
                          PEDIDO
                        </Typography>
                        <Typography className="text-4xl">
                          #{order?.payment?.invoiceNumber ? order?.payment?.invoiceNumber : order?.payment?.externalReference}
                        </Typography>
                        <Typography
                          className="font-medium tracking-tight"
                          color="text.secondary"
                        >
                          DATA DO PEDIDO
                        </Typography>
                        <Typography className="font-medium">
                          {order?.payment?.dateCreated}
                        </Typography>
                        <Typography
                          className="font-medium tracking-tight"
                          color="text.secondary"
                        >
                          TOTAL PEDIDO
                        </Typography>
                        <Typography className="font-medium">
                          {order?.installments !== undefined
                            ? `${FuseUtils.formatCurrency(
                              order?.installments?.value
                            )} (${order?.installments?.installmentCount
                            }x de ${FuseUtils.formatCurrency(
                              order?.installments?.paymentValue
                            )})`
                            : FuseUtils.formatCurrency(order?.cart?.total)}
                        </Typography>
                      </div>

                      <Box className="grid grid-cols-3 grid-flow-col gap-x-16 sm:gap-x-32 py-24 rounded-l-2xl">
                        <div className="place-self-center w-96">
                          <img
                            className="w-96 rounded-8"
                            src="assets/images/logo/logo-box.svg"
                            alt="logo"
                          />
                        </div>
                        <Box
                          className="pl-10 sm:pl-20 col-span-2 border-l text-md"
                          sx={{
                            borderColor: theme =>
                              alpha(
                                theme.palette.getContrastText(
                                  theme.palette.primary.dark
                                ),
                                0.25
                              )
                          }}
                        >
                          <Typography className="font-medium">
                            CREABOX COMERCIO LTDA
                          </Typography>
                          <Typography>Curitiba - Paraná - Brasil</Typography>
                          <Typography>suporte@creabox.com.br</Typography>
                          <Typography>(41) 9 9149 6623</Typography>
                          <Typography>CNPJ: 53.007.816/0001-03</Typography>
                        </Box>
                      </Box>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-md">
                        <Typography className="text-xl font-medium">
                          Informações do Cliente
                        </Typography>
                        <Typography>{order?.customer?.name}</Typography>
                        <Typography>{order?.customer?.email}</Typography>
                        <Typography>+55{order?.customer?.phone}</Typography>
                      </div>
                      {order?.cart?.shipping?.delivery &&
                        <div className="text-md">
                          <Typography className="text-xl font-medium">
                            Informação de Entrega
                          </Typography>
                          <Typography>{order?.cart?.shipping?.title} - {order?.cart?.shipping?.value > 0 ? FuseUtils.formatCurrency(order?.cart?.shipping.value) : `Grátis`}</Typography>
                          <Typography>{order?.customer?.invoiceAddress?.address}</Typography>
                        </div>
                      }
                      <div className="text-md">
                        <Typography className="text-xl font-medium">
                          Informação de Pagamento
                        </Typography>
                        {order?.payment?.billingType === 'PIX' && (
                          <>
                            <Typography>
                              Pagamento em: {order?.payment?.billingType}
                            </Typography>
                            <Typography>
                              ID Transferência: {order?.payment?.pixTransaction}
                            </Typography>
                          </>
                        )}
                        {order?.payment?.billingType === 'BOLETO' && (
                          <>
                            <Typography>
                              Pagamento em: {order?.payment?.billingType}
                            </Typography>
                            <Typography>
                              Data de pagamento: {order?.payment?.paymentDate}
                            </Typography>
                          </>
                        )}
                        {order?.payment?.billingType === 'CREDIT_CARD' && (
                          <>
                            <div className="flex flex-warp items-center justify-between">
                              {order?.payment?.description &&
                                <Typography>{order?.payment?.description}</Typography>
                              }
                              <Typography>{order?.client?.cardName}</Typography>
                              <img
                                className="img-fluid w-32"
                                alt="Flag Card"
                                src={FuseUtils.cardFlag(order?.payment?.creditCard?.creditCardBrand)}
                              />

                            </div>

                            <span className="flex flex-warp grid-cols-4 items-center content-center justify-between mt-2 mb-5">
                              <span className="col-auto text-center">
                                <h5 className="mb-0">****</h5>
                              </span>
                              <span className="col-auto text-center">
                                <h5 className="mb-0">****</h5>
                              </span>
                              <span className="col-auto text-center">
                                <h5 className="mb-0">****</h5>
                              </span>
                              <span className="col-auto text-center">
                                <h5 className="mb-0">
                                  {order?.payment?.creditCard?.creditCardNumber}
                                </h5>
                              </span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-x-4 mt-48">
                      <div
                        className="col-span-8 font-medium text-md"
                        color="text.secondary"
                      >
                        DESCRIÇÃO
                      </div>
                      <div
                        className="invisible sm:visible font-medium text-md text-right "
                        color="text.secondary"
                      >
                        VALOR
                      </div>
                      <div
                        className="invisible sm:visible font-medium text-md text-right "
                        color="text.secondary"
                      >
                        QTI
                      </div>
                      <div
                        className="col-span-2 font-medium text-md text-right"
                        color="text.secondary"
                      >
                        TOTAL
                      </div>

                      <div className="col-span-12 my-16 border-b" />
                      {order?.cart?.products.map((item, key) => (
                        <div className="col-span-12" key={key + 1}>
                          <div className="grid grid-cols-12 gap-x-4">
                            <Typography className="col-start-1 col-end-8 sm:col-span-8 text-lg font-medium">
                              {item.name}
                            </Typography>
                            <Typography className="invisible sm:visible self-center text-right">
                              {FuseUtils.formatCurrency(item.value)}
                            </Typography>
                            <Typography className="invisible sm:visible self-center text-right">
                              {item.quantity}
                            </Typography>
                            <Typography className="col-end-13 col-span-3 sm:col-span-2 self-center text-right">
                              {FuseUtils.formatCurrency(
                                item.value * item.quantity
                              )}
                            </Typography>
                          </div>
                          <div className="col-span-12 my-16 border-b" />
                        </div>
                      ))}
                      <Typography
                        className="col-span-8 self-center font-medium tracking-tight"
                        color="text.secondary"
                      >
                        SUBTOTAL
                      </Typography>
                      <Typography className="col-span-4 text-right text-lg">
                        {FuseUtils.formatCurrency(order?.cart?.subTotal)}
                      </Typography>
                      {order?.cart?.shipping?.delivery &&
                        <>
                          <div className="col-span-12 my-12 border-b" />
                          <Typography
                            className="col-span-8 self-center font-medium tracking-tight"
                            color="text.secondary"
                          >
                            ENTREGA
                          </Typography>
                          <Typography className="col-span-4 text-right text-lg">
                            {order?.cart?.shipping.value > 0 ?
                              FuseUtils.formatCurrency(order?.cart?.shipping.value)
                              : 'Grátis'
                            }
                          </Typography>
                        </>
                      }

                      <div className="col-span-12 my-12 border-b" />
                      <Typography
                        className="col-span-8 self-center font-medium tracking-tight"
                        color="text.secondary"
                      >
                        DESCONTO
                      </Typography>
                      <Typography className="col-span-4 text-right text-lg">
                        {FuseUtils.formatCurrency(order?.cart?.discount.value)}
                      </Typography>

                      <div className="col-span-12 my-12 border-b" />

                      <Typography
                        className="col-span-8 self-center text-2xl font-medium tracking-tight"
                        color="text.secondary"
                      >
                        TOTAL
                      </Typography>
                      <div className="col-span-4 text-right text-2xl font-medium">
                        {FuseUtils.formatCurrency(order?.cart?.total)}
                      </div>
                    </div>
                    <div className="mt-64">
                      <Typography className="font-medium">
                        Agradecemos o seu pagamento a equipe DPay enviará um
                        email com os datalhes do seu pedido.
                      </Typography>
                      <div className="flex items-start mt-16">
                        <img
                          className="flex-0 w-40 mt-8"
                          src="assets/images/logo/logo.svg"
                          alt="logo"
                        />
                        <Typography
                          className="ml-24 text-sm"
                          color="text.secondary"
                        >
                          Você está efetuando um pagamento para DPay no valor
                          total de{' '}
                          {FuseUtils.formatCurrency(order?.cart?.total)}. o
                          seu pedido já foi processado e em breve você receberá
                          um email com as informações de seu pedido. Pode
                          acontecer do seu serviço de e-mail enviar por engano
                          uma de nossas mensagens na caixa de spam. Por isso
                          pedimos que verifique também a sua caixa de spam.
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                </>
              </>
            ) : (
              <>
                <div className="center">
                  <Typography color="text.primary" variant="h3">
                    Pedido não localizado
                  </Typography>
                  <Typography color="text.secondary" variant="h5">
                    Infelizmente não há um pedido com a ref: {uid}.
                  </Typography>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </Paper>
    </div>
  )
}

export default ClassicComingSoonPage
