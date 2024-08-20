import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Iconify } from '@fuse/components/iconify';
import { Controller, useForm } from 'react-hook-form';
import history from '@history';
import _ from '@lodash';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import { useDispatch } from 'react-redux';
import { CardProps } from './FormTypes';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { padding, textAlign } from '@mui/system';
import Divider from '@mui/material/Divider';
import { useCreateAccountPaymentMutation } from '../../AccountApi';
import { usePaymentInputs } from 'react-payment-inputs'
import images from 'react-payment-inputs/images'
import FuseUtils from '@fuse/utils/FuseUtils';
import { useAppDispatch } from 'app/store/store';
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Grid';
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

const schema = z.object({
  creditCard: z.object({
    number: z.string().min(1, { message: 'Number Card is required' }),
    holderName: z.string().min(1, { message: 'Holder is required' }),
    expiry: z.string().min(1, { message: 'Expiration Date is required' }),
    cvv: z.string().min(1, { message: 'CVV is required' })
  })
});

interface FormNewCardProps {
  user: any;
  updateUser: any;
}

const FormNewCard = forwardRef<HTMLDivElement, FormNewCardProps>((props, ref) => {
  const { user, updateUser } = props
  const inputRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation('accountApp');
  const dispatch = useAppDispatch();
  const [createAccountPayment] = useCreateAccountPaymentMutation()

  const {
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    getCardImageProps
  } = usePaymentInputs()

  const defaultValues = {
    billingType: "CARD",
    paymentDefault: true,
    creditCard: {
      number: '',
      holderName: '',
      expiry: '',
      cvv: '',
    },
    creditCardHolderInfo: {
      addressNumber: user.data.customer?.addressNumber,
      cpfCnpj: user.data.customer?.cpfCnpj,
      email: user.data.customer?.email,
      name: user.data.customer?.name,
      phone: user.data.customer?.phoneNumber ? user.data.customer?.phoneNumber : user.data.customer?.phoneNumbers[0].phoneNumber,
      postalCode: user.data.customer?.postalCode
    }
  } as any
  const { control, watch, setValue, reset, handleSubmit, formState, register } = useForm<FormType>({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(schema)
  });


  const { isValid, dirtyFields, errors } = formState;
  const form = watch();

  /**
   * Form Submit
   */
  function onSubmit(payment: any) {
    const id: string = FuseUtils.generateGUID()
    const paymentNew = {
      ...form,
      id,
      creditCard: {
        ...form.creditCard,
        expiry: form.creditCard.expiry.replace(/\s/g, ''),
      },
    }

    createAccountPayment({ data: paymentNew, uid: user.uid, customerId: user.data.customer.id })
      .then(() => {
        dispatch(
          showMessage({
            message: 'Novo cartão de crédito adicionado',
            autoHideDuration: 6000,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center'
            },
            variant: 'success'
          }))
      }).catch((_error) => {
        dispatch(
          showMessage({
            message: 'Error ao  adicionado cartão de crédito',
            autoHideDuration: 6000,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center'
            },
            variant: 'error'
          }))
      })

    const paymentMethodsOld = user.data?.customer?.paymentMethods || []
    if (Array.isArray(paymentMethodsOld)) {
      const updatedAddresses = paymentMethodsOld.map((payment) => {
        if (payment.paymentDefault && paymentNew.paymentDefault) {
          return {
            ...payment,
            paymentDefault: false
          };
        } else {
          return payment;
        }
      })
      updateUser({ data: { customer: { paymentMethods: [...updatedAddresses, { ...paymentNew }] } } });
      reset();
      handleClose();
    } else {
      updateUser({ data: { customer: { paymentMethods: [{ ...paymentNew }] } } })
      reset();
      handleClose();
    }

  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    if (form) {
      reset(form)
    } else {
      reset()
    }
  }, [reset]);

  return (
    <React.Fragment>
      <Button
        color="inherit"
        size="small"
        className='px-12'
        onClick={handleClickOpen}
      >
        <Iconify icon={'eva:plus-fill'} sx={{ width: 22, height: 22, marginRight: 1 }} />
        {t('NEW_CARD')}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            handleClose();
          },
        }}
        fullWidth
      >
        <DialogTitle>{t('NEW_CARD')}</DialogTitle>
        <DialogContent>
          <Grid container className='py-20' rowSpacing={.5} spacing={3}>
            <Grid item xs={12} md={12}>
              <Controller
                control={control}
                name="creditCard.number"
                {...register('creditCard.number')}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="number"
                    label={t('CARD_NUMBER')}
                    placeholder="XXXX XXXX XXXX XXXX"
                    error={!!errors.creditCard?.number}
                    helperText={errors?.creditCard?.number?.message}
                    variant="outlined"
                    fullWidth
                    inputProps={getCardNumberProps()}
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
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Controller
                control={control}
                name="creditCard.holderName"
                {...register('creditCard.holderName')}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-20"
                    id="cardHolder"
                    label={t('CARD_HOLDER')}
                    placeholder="JOHN DOE"
                    variant="outlined"
                    error={!!errors.creditCard?.holderName}
                    helperText={errors?.creditCard?.holderName?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                control={control}
                name="creditCard.expiry"
                {...register('creditCard.expiry')}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    className="mt-20"
                    {...field}
                    id="expirationDate"
                    label={t('EXPIRANTION_DATA')}
                    placeholder="MM/YY"
                    inputProps={getExpiryDateProps()}
                    error={!!errors.creditCard?.expiry}
                    helperText={errors?.creditCard?.expiry?.message}
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                control={control}
                name="creditCard.cvv"
                {...register('creditCard.cvv')}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    className="mt-20"
                    {...field}
                    id="cvv"
                    label={t('CVV')}
                    placeholder="***"
                    variant="outlined"
                    inputProps={getCVCProps()}
                    error={!!errors.creditCard?.cvv}
                    helperText={errors?.creditCard?.cvv?.message}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">
                        <CustomWidthTooltip arrow title={`Three-digit number on the back of your VISA card`} placement="top">
                          <IconButton
                            aria-label="toggle password visibility"
                            edge="end"
                          >
                            <Iconify icon={'solar:info-circle-linear'} sx={{ width: 24, height: 24 }} />
                          </IconButton>
                        </CustomWidthTooltip>
                      </InputAdornment>
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <DialogContentText className='flex flex-row items-center content-center mt-16'>
            <Iconify icon={'solar:lock-keyhole-bold'} sx={{ width: 22, height: 22, marginRight: 1 }} />
            {t('YOUR_TRNSACTION')}
          </DialogContentText>
        </DialogContent>
        <Divider className="border-dashed" />
        <DialogActions className="p-24 flex justify-end space-x-16">
          <Button
            className="whitespace-nowrap"
            variant="outlined"
            onClick={handleClose}>{t('CANCEL')}</Button>
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            type="submit"
            disabled={_.isEmpty(dirtyFields) || !isValid}
            onClick={handleSubmit(onSubmit)}
          >{t('ADD')}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
})
export default FormNewCard;
