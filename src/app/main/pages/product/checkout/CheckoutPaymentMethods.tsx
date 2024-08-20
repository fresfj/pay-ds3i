import type { CardProps } from '@mui/material/Card';
import type { PaperProps } from '@mui/material/Paper';

import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';
import FormHelperText from '@mui/material/FormHelperText';
import { Iconify } from '@fuse/components/iconify';
import { Image } from '@fuse/components/image'
import FuseUtils from '@fuse/utils';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import FormNewCard from 'src/app/main/apps/account/components/dialogs/FormNewCard';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import { useCreateAccountPaymentMutation } from 'src/app/main/apps/account/AccountApi';
import { usePaymentInputs } from 'react-payment-inputs'
import images from 'react-payment-inputs/images'
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { CustomTextField } from './CheckoutCustomer';
// ----------------------------------------------------------------------

type Props = CardProps & {
  options: {
    payments: any[];
    cards: any[];
    user: any;
    updateUser: any;
  };
};

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


export function CheckoutPaymentMethods({ options, ...other }: Props) {
  const { control } = useFormContext();
  const { t } = useTranslation('shopApp');
  return (
    <>
      <Card {...other}>
        <CardHeader
          title={
            <Typography variant="h6">
              {t('PAYMENT')}
            </Typography>
          }
          sx={{ px: { md: 6, xs: 2 }, mt: 2 }}
        />

        <Controller
          name="payment"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Stack sx={{ px: { md: 6, xs: 2 }, pb: 4 }}>
              {options.payments.map((option) => (
                <OptionItem
                  control={control}
                  option={option}
                  key={option.label}
                  cardOptions={options.cards}
                  user={options.user}
                  updateUser={options.updateUser}
                  selected={field.value === option.value}
                  isCredit={option.value === 'credit' && field.value === 'credit'}
                  onClick={() => {
                    field.onChange(option.value);
                  }}
                />
              ))}

              {!!error && (
                <FormHelperText error sx={{ pt: 1, px: 2 }}>
                  {error.message}
                </FormHelperText>
              )}
            </Stack>
          )}
        />
      </Card>
    </>
  );
}

// ----------------------------------------------------------------------

type OptionItemProps = PaperProps & {
  selected: boolean;
  isCredit: boolean;
  user: any;
  updateUser?: () => void;
  onOpen?: () => void;
  option: any;
  control?: any;
  cardOptions: any[];
};

function OptionItem({
  option,
  control,
  user,
  updateUser,
  cardOptions,
  selected,
  isCredit,
  onOpen,
  ...other
}: OptionItemProps) {
  const { value, label, description } = option;
  const formNewCardRef = useRef();
  const { t } = useTranslation('accountApp');
  const [createAccountPayment] = useCreateAccountPaymentMutation()
  const {
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    getCardImageProps
  } = usePaymentInputs()

  return (
    <Paper
      variant="outlined"
      key={value}
      sx={{
        p: 2.5,
        mt: 2.5,
        cursor: 'pointer',
        ...(selected && { boxShadow: (theme) => `0 0 0 2px ${theme.palette.text.primary}` }),
      }}
      {...other}
    >
      <ListItemText
        primary={
          <Stack direction="row" alignItems="center">
            <Box component="span" sx={{ flexGrow: 1 }}>
              {label}
            </Box>
            <Stack spacing={1} direction="row" alignItems="center">
              {value === 'credit' && (
                <>
                  <Iconify icon="logos:mastercard" width={24} />
                  <Iconify icon="logos:visa" width={24} />
                </>
              )}
              {value === 'paypal' && <Iconify icon="logos:paypal" width={24} />}
              {value === 'pix' && <Image alt="icon" src={FuseUtils.cardFlag('pix')} sx={{ maxWidth: 32 }} />}
            </Stack>
          </Stack>
        }
        secondary={description}
        primaryTypographyProps={{ typography: 'subtitle1', mb: 0.5 }}
        secondaryTypographyProps={{ typography: 'body2' }}
      />

      {isCredit && (
        <Stack spacing={2.5} alignItems="flex-end" sx={{ pt: 2.5 }}>
          <Grid container className='py-20' rowSpacing={.5} spacing={3}>
            <Grid item xs={12} md={12}>
              <Controller
                control={control}
                name="creditCard.number"
                render={({ field, fieldState: { error } }) => (
                  <CustomTextField
                    {...field}
                    required
                    id="number"
                    label={t('CARD_NUMBER')}
                    type='number'
                    placeholder="**** **** **** ****"
                    error={!!error}
                    helperText={error?.message}
                    variant="filled"
                    fullWidth
                    inputProps={getCardNumberProps()}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <svg
                            style={{ width: '32px', height: '32px' }}
                            {...getCardImageProps({ images })}
                          />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <Controller
                control={control}
                name="creditCard.expiry"
                render={({ field, fieldState: { error } }) => (
                  <CustomTextField
                    fullWidth
                    className="mt-20"
                    {...field}
                    required
                    id="expirationDate"
                    label={t('EXPIRANTION_DATA')}
                    placeholder="MM/YY"
                    inputProps={getExpiryDateProps()}
                    error={!!error}
                    helperText={error?.message}
                    variant="filled"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <Controller
                control={control}
                name="creditCard.cvv"
                render={({ field, fieldState: { error } }) => (
                  <CustomTextField
                    fullWidth
                    className="mt-20"
                    {...field}
                    required
                    id="cvv"
                    label={t('CVV')}
                    placeholder="***"
                    variant="filled"
                    inputProps={getCVCProps()}
                    error={!!error}
                    helperText={error?.message}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">
                        <CustomWidthTooltip arrow title={`O código de três ou quatro digitos, localizado no verso ou na frente do cartão de crédito`} placement="top">
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
            <Grid item xs={12} md={12}>
              <Controller
                control={control}
                name="creditCard.holderName"
                render={({ field, fieldState: { error } }) => (
                  <CustomTextField
                    {...field}
                    required
                    className="mt-20"
                    id="cardHolder"
                    label={t('CARD_HOLDER')}
                    placeholder="Digite seu nome"
                    variant="filled"
                    error={!!error}
                    helperText={error?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Controller
                control={control}
                name="creditCard.document"
                render={({ field, fieldState: { error } }) => (
                  <CustomTextField
                    {...field}
                    required
                    className="mt-20"
                    id="cardDocument"
                    label={t('CARD_DOCUMENT')}
                    placeholder="Digite seu CPF/CNPJ"
                    variant="filled"
                    error={!!error}
                    helperText={error?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>

          {/*  <TextField select fullWidth label="Cards" SelectProps={{ native: true }}>
           {cardOptions?.map((card) => (
              <option key={card.creditCard.number} value={card.creditCard.number}>
                {`**** **** **** ${card.creditCard.number.slice(-4)} (${FuseUtils.identifyCardBrand(card.creditCard.number)?.brand}) - ${card.creditCard.holderName}`}
              </option>
            ))}
          </TextField> */}

          {/*<FormNewCard ref={formNewCardRef} user={user} updateUser={updateUser} />
           <Button
            size="small"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={onOpen}
          >
            Add New Card
          </Button> */}
        </Stack>
      )}
    </Paper>
  );
}
