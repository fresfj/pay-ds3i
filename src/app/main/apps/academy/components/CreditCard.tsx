import React, { useState } from 'react';
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
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import { Controller, useForm } from 'react-hook-form';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import * as yup from 'yup';
import clsx from 'clsx';
import { border, borderColor } from '@mui/system';
import { BorderStyle } from '@mui/icons-material';
import { Iconify } from '@fuse/components/iconify';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { usePaymentInputs } from 'react-payment-inputs'
import images from 'react-payment-inputs/images'
import { useAppDispatch } from 'app/store/store';
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { CardProps } from '../../account/components/dialogs/FormTypes';

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


const CreditCard = ({ onAddNewCard }) => {
  const { t } = useTranslation('accountApp');
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
    }
  } as any

  const { control, watch, setValue, reset, handleSubmit, formState, register } = useForm<FormType>({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(schema)
  });


  const { isValid, dirtyFields, errors } = formState;
  const form = watch();

  return (
    <>
      <div className='flex justify-end'>
        <Button className='px-20' color="primary" onClick={onAddNewCard}>
          <Iconify className='mr-4 inline' width={20} icon={'solar:card-search-bold-duotone'} />
          <Typography variant="body2" color="primary" onClick={onAddNewCard} style={{ cursor: 'pointer' }}>
            Usar cartão cadastro
          </Typography>
        </Button>
      </div>


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
                placeholder="John Doe"
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
    </>
  );
};

export default CreditCard;
