import React, { forwardRef, Ref, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Skeleton,
  IconButton,
  Alert,
  AlertTitle,
  styled,
  Radio,
  Paper,
  RadioGroup,
  FormControlLabel,
  Grid,
  Box,
  InputAdornment,
  FormControlLabelProps,
  Link,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import { Controller, useForm } from 'react-hook-form';
import _ from '@lodash';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import clsx from 'clsx';
import { BorderStyle } from '@mui/icons-material';
import { Iconify } from '@fuse/components/iconify';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { usePaymentInputs } from 'react-payment-inputs'
import images from 'react-payment-inputs/images'
import { useAppDispatch } from 'app/store/store';
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import CreditCardSelect from './CreditCardSelect';
import { CardProps } from '../../account/components/dialogs/FormTypes';
import CreditCard from './CreditCard';
import FirstStepForm from './FirstStepForm';
import OrderCompleteIllustration from '@fuse/utils/illustration/orderComplete';

type FormType = CardProps;

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    padding: 10,
    maxWidth: 200,
    textAlign: 'center'
  },
  [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
  {
    marginTop: '0px',
  },
  [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
  {
    marginBottom: '0px',
  },
  [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
  {
    marginLeft: '0px',
  },
  [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]:
  {
    marginRight: '0px',
  },
});

const OptionPaper = styled(Paper)(({ theme }) => ({
  marginTop: 10,
  padding: 20,
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  border: '1px solid #e0e0e0',
  // backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,.04)' ,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.background.default,
  },
  '&.Mui-checked': {
    borderColor: theme.palette.primary.main,
    borderStyle: 'solid',
    borderWidth: '2px'
  },
}));

const Title = styled(Typography)({
  fontSize: '1.2rem',
  fontWeight: 'bold',
});

const Description = styled(Typography)({
  fontSize: '1rem',
});

type CustomFormControlLabelProps = Omit<FormControlLabelProps, 'ref'> & {
  inputRef?: React.ForwardedRef<unknown>;
};

const CustomFormControlLabel = styled(
  forwardRef<unknown, CustomFormControlLabelProps>(
    ({ inputRef, ...props }, ref) => (
      <FormControlLabel {...props} ref={ref} />
    )
  )
)(({ theme }) => ({
  margin: '0',
  width: '100%',
  display: 'flex',
  '& .MuiFormControlLabel-label': {
    width: '100%',
  },
}));

const schemaStepInfo = z.object({
  address: z.string().min(1, { message: 'Address is required' }),
  phone: z.string().min(1, { message: 'Phone is required' }),
  realized: z.string().optional(),
  classDay: z.string().optional(),
});

const schemaStepCard = z.object({
  // creditCard: z.object({
  //   number: z.string().min(1, { message: 'Number Card is required' }),
  //   holderName: z.string().min(1, { message: 'Holder is required' }),
  //   expiry: z.string().min(1, { message: 'Expiration Date is required' }),
  //   cvv: z.string().min(1, { message: 'CVV is required' })
  // })
});
// Efeitos de slide
const slideIn = 'flex flex-col transform transition-transform duration-500 ease-in-out';
const slideInNext = 'translate-x-0';
const slideInPrev = 'translate-x-0';
const slideOutNext = '-translate-x-full';
const slideOutPrev = 'translate-x-full';

interface CheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  teacher?: {
    name: string
    type?: number
  };
  checkoutType: 'creditCard' | 'paypal';
}
const CheckoutDialog: React.FC<CheckoutDialogProps> = ({ open, onClose, teacher, checkoutType }) => {

  const { data } = useSelector(selectUser) as any;
  const [newCard, setNewCard] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [slide, setSlide] = useState('');
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    address: '',
    phone: '',
    cardId: '',
    realized: 'online',
    classDay: 'O mais rápido possível',
    billingType: "CARD",
    paymentDefault: true,
    creditCard: {
      number: '',
      holderName: '',
      expiry: '',
      cvv: '',
    }
  } as any


  const { control, watch, setValue, reset, handleSubmit, formState, register } = useForm<FormType>({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(activeStep === 0 ? schemaStepInfo : schemaStepCard)
  });


  const { isValid, dirtyFields, errors } = formState;
  const form = watch();

  const cards: any = data?.customer?.paymentMethods
  const steps = ['Informações Pessoais', 'Dados do Cartão', 'Confirmação'];

  const [selectedCard, setSelectedCard] = useState(cards.find((card) => card.paymentDefault === true)?.id || '');

  const [formData, setFormData] = useState(defaultValues);

  const selectedValue = watch('classDay');
  const selectedRealized = watch('realized');

  const handleCardChange = (event) => {
    const card = cards.find((card) => card.id === event.target.value);
    setValue('cardId', event.target.value)
    setSelectedCard(event.target.value);
  };

  const handleAddNewCard = () => {
    setNewCard(!newCard)
  };

  const handleNext = () => {
    setLoading(true);
    setTimeout(() => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSlide(slideInNext);
      setLoading(false);
    }, 500);
  };

  const handleBack = () => {
    setLoading(true);
    setTimeout(() => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
      setSlide(slideInPrev);
      setLoading(false);
    }, 500);
  };

  const onSubmit = (data) => {
    handleNext();
  };

  const handleReset = () => {
    onClose();
    reset(defaultValues);
    setActiveStep(0);
  };

  const handleDataChange = (data: any) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
  };

  const getStepContent = (step) => {
    if (loading) {
      return (
        <div className="space-y-4">
          <Skeleton variant="text" height={40} />
          <Skeleton variant="text" height={40} />
          <Skeleton variant="text" height={40} />
        </div>
      );
    }

    switch (step) {
      case 0:
        return (
          <>
            <Typography variant="h6" gutterBottom className="mb-0 font-bold">
              Como deseja ter suas aulas?
            </Typography>
            <RadioGroup
              name='realized'
              value={selectedRealized}
              className='grid gap-14 grid-cols-2'>
              {[
                { option: 'online', price: '$0', description: '5-7 Days delivery' },
                { option: 'presenciais', price: '$10', description: '3-5 Days delivery' }
              ].map(({ option, price, description }) => (
                <CustomFormControlLabel
                  key={option}
                  value={option}
                  control={<span />}
                  label={
                    <OptionPaper className={clsx('rounded-lg', { 'Mui-checked': selectedRealized === option })}>
                      <div className="flex items-center justify-between w-full">
                        <Title>{option.charAt(0).toUpperCase() + option.slice(1)}</Title>
                      </div>
                    </OptionPaper>
                  }
                  onClick={() => setValue('realized', option)}
                />
              ))}
            </RadioGroup>
            <Typography variant="h6" gutterBottom className="mb-0 font-bold mt-28">
              Data da primeira aula
            </Typography>
            <RadioGroup name='classDay' value={selectedValue} className='grid gap-14 grid-cols-2'>
              {['O mais rápido possível', 'Propor uma data'].map((option) => (
                <CustomFormControlLabel
                  key={option}
                  value={option}
                  control={<span />}
                  label={
                    <OptionPaper className={clsx('rounded-lg', { 'Mui-checked': selectedValue === option })}>
                      <div className="flex items-center justify-between w-full">
                        <Title>{option.charAt(0).toUpperCase() + option.slice(1)}</Title>
                      </div>
                    </OptionPaper>
                  }

                  onClick={() => setValue('classDay', option)}
                />
              ))}
            </RadioGroup>
            <Typography variant="h6" gutterBottom className="mt-28 font-bold">
              Seus dados de contato
            </Typography>
            <div className='grid gap-14 grid-cols-2'>
              <Controller
                control={control}
                name="address"
                {...register('address')}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Endereço"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={!!errors.address}
                    helperText={errors?.address?.message}
                    className="mt-4"
                  />
                )}
              />
              <Controller
                name="phone"
                control={control}
                {...register('phone')}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Número de telefone"
                    fullWidth
                    margin="normal"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    className="mt-4"
                  />
                )}
              />
            </div>
          </>
        );
      case 1:
        return (
          <>
            <Alert severity="info">
              <ul className="pl-20 text-slate-900 dark:text-slate-200 list-image-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxNCAxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSIjMzhiZGY4Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMy42ODUuMTUzYS43NTIuNzUyIDAgMCAxIC4xNDMgMS4wNTJsLTggMTAuNWEuNzUuNzUgMCAwIDEtMS4xMjcuMDc1bC00LjUtNC41YS43NS43NSAwIDAgMSAxLjA2LTEuMDZsMy44OTQgMy44OTMgNy40OC05LjgxN2EuNzUuNzUgMCAwIDEgMS4wNS0uMTQzWiIgLz48L3N2Zz4=')]">
                <li className="pl-2">
                  <AlertTitle>Debitado somente quando {teacher.name} aceitar o seu pedido.</AlertTitle>
                </li>
                <li className="pl-2">
                  <AlertTitle>Acesso ilimitado a todos os profissionais.</AlertTitle>
                </li>
              </ul>
            </Alert>

            <div className="flex items-center justify-between my-14">
              <Typography className="font-bold text-16">Modo de pagamento</Typography>
              <Typography className="font-bold text-16 flex items-center">
                100% seguro <Iconify className='ml-2 inline' width={20} icon={'solar:lock-password-bold-duotone'} />
              </Typography>
            </div>

            <CreditCardSelect
              cards={cards}
              newCard={newCard}
              selectedCard={selectedCard}
              onChange={handleCardChange}
              onAddNewCard={handleAddNewCard}
              formData={formData}
              onDataChange={handleDataChange}
            />

          </>
        );
      case 2:
        return (
          <Box sx={{ p: 4, margin: 'auto' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom className="mb-0 font-semibold text-center">
                Compra realizada com sucesso!
              </Typography>
              <OrderCompleteIllustration sx={{ height: 260, my: 6 }} />
              <Typography align="left" paragraph>
                Agradecemos por realiza o seu pedido &nbsp;
                <Link href="#">01dc1370-3df6-11eb-b378-0242ac130002</Link>
              </Typography>
              <Typography align="left" sx={{ color: 'text.secondary' }}>
                Enviaremos uma notificação dentro de 5 dias após o envio.
                <br /> Se você tiver alguma dúvida ou dúvida, não hesite em nos contatar.
              </Typography>
            </Box>
          </Box>
        );
      default:
        return 'Etapa desconhecida';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleReset}
      fullWidth
      maxWidth="md"
      keepMounted

    >
      <div className="flex items-center justify-between mx-4">
        {activeStep !== 0 && activeStep !== 2 && (
          <IconButton
            aria-label="back"
            onClick={handleBack}
            sx={{
              position: 'absolute',
              left: 12,
              top: 12,
              color: (theme) => theme.palette.grey[500], width: 48, height: 48
            }}
          >
            <ArrowBackIosNew />
          </IconButton>

        )}
        <DialogTitle className='flex-1'>
          {activeStep === 0 ?
            <div>
              <Typography variant="h6" gutterBottom className="mb-0">
                Solicite sua {teacher.type === 2 ? 'assessoria' : 'consulta'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom className="-mt-6">
                e comece seu aprendizado com {teacher.name}
              </Typography>
            </div>
            :
            activeStep === 1 ? (
              <div className='flex w-full md:w-10/12 items-center justify-between ml-44'>
                <div>
                  <Typography variant="h6" gutterBottom className="mb-0">
                    Passe Aluno
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom className="-mt-6 hidden md:inline-block">
                    Assinatura sem fidelização
                  </Typography>
                </div>
                <Typography variant="h6" className='hidden md:inline-block'>
                  <span className="inline-flex items-center font-bold text-20 px-14 py-2 rounded-full tracking-wide uppercase bg-indigo-50 text-indigo-800 dark:bg-indigo-600 dark:text-indigo-50">
                    R$ 19,90
                  </span>
                </Typography>
              </div>
            ) :
              <div>
                <Typography variant="h6" gutterBottom className="mb-0">
                  Agradecemos o seu pagamento
                </Typography>
                <Typography variant="subtitle1" gutterBottom className="-mt-6">
                  Em breve seu prossifional entrará em contato
                </Typography>
              </div>
          }
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleReset}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            color: (theme) => theme.palette.grey[500], width: 48, height: 48
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent dividers>
        <form onSubmit={handleSubmit(onSubmit)} className={clsx(slideIn, slide)}>
          {getStepContent(activeStep)}
        </form>
      </DialogContent>
      <DialogActions>
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            color="success"
            type="submit"
            onClick={handleReset}
            className="whitespace-nowrap bg-green-500 text-white"
            endIcon={
              <>
                <Iconify className='ml-2 inline' width={20} icon={'solar:close-circle-line-duotone'} />
              </>
            }
          >
            Fechar
          </Button>
        ) : (
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            type="submit"
            disabled={_.isEmpty(dirtyFields) || !isValid}
            onClick={activeStep === steps.length - 2 ? handleSubmit(onSubmit) : handleNext}
            endIcon={
              <>
                <Iconify className='ml-2 inline' width={20} icon={'solar:arrow-right-outline'} />
              </>
            }

          >
            {activeStep === steps.length - 2 ? 'Enviar o pedido' : 'Seguinte'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CheckoutDialog;
