import type { CardProps } from '@mui/material/Card';
import type { PaperProps } from '@mui/material/Paper';
import InputMask from 'react-input-mask';

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
import { forwardRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import FormNewCard from 'src/app/main/apps/account/components/dialogs/FormNewCard';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import MaskedInput from '../components/MaskedInput';



// ----------------------------------------------------------------------

type Props = CardProps & {
  options?: {
    payments: any[];
    cards: any[];
    user: any;
    updateUser: any;
  };
};

export const CustomTextField = styled(TextField)({
  '& .MuiFilledInput-root': {
    background: 'rgb(245 245 245/1)',
    color: 'rgb(50 50 50/1)',
    outlineColor: '#323232',
    '&:hover': {
      backgroundColor: 'rgb(238 238 238/1)'
    },
    '&:focus-visible': {
      borderWidth: 2
    },
  },
  '& .MuiFilledInput-root.Mui-error': {
    background: '#ff000012',
  },
});



export function CheckoutCustomer({ options, ...other }: Props) {
  const { control } = useFormContext();
  const { t } = useTranslation('shopApp');
  return (
    <>
      <Card {...other} sx={{ mb: 3, borderRadius: 4 }}>
        <CardHeader
          title={
            <Typography variant="h6">
              {t('CONTACT')}
            </Typography>
          }
          sx={{ px: { md: 6, xs: 2 }, mt: 2 }}
        />

        <Grid container sx={{ px: { md: 6, xs: 2 } }} mb={8} rowSpacing={2.5} spacing={2}>
          <Grid item xs={12} md={6}>
            <Controller
              name="phone"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <MaskedInput
                  {...field}
                  inputRef={field.ref}
                  mask="(99) 99999-9999"
                  maskChar={null}
                  label="Telefone de contato"
                  error={!!error}
                  helperText={error?.message}
                  variant="filled"
                  required
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CustomTextField
                  {...field}
                  id="email"
                  type='email'
                  label={'E-mail'}
                  placeholder="seunome@email.com"
                  error={!!error}
                  helperText={error?.message}
                  variant="filled"
                  required
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CustomTextField
                  {...field}
                  id="name"
                  type='text'
                  label={'Nome'}
                  placeholder="Digite seu nome completo"
                  error={!!error}
                  helperText={error?.message}
                  variant="filled"
                  required
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="cpfCnpj"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <InputMask
                  {...field}
                  mask={field.value?.length > 14 ? '99.999.999/9999-99' : '999.999.999-99'}
                  maskChar={null}
                >
                  {() => (
                    <CustomTextField
                      id="cpfCnpj"
                      type='tel'
                      label={'CPF/CNPJ'}
                      placeholder="Digite seu CPF/CNPJ"
                      error={!!error}
                      helperText={error?.message}
                      variant="filled"
                      required
                      fullWidth
                    />
                  )}
                </InputMask>
              )}
            />
          </Grid>
        </Grid>
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
  cardOptions: any[];
};

function OptionItem({
  option,
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
          <TextField select fullWidth label="Cards" SelectProps={{ native: true }}>
            {cardOptions.map((card) => (
              <option key={card.creditCard.number} value={card.creditCard.number}>
                {`**** **** **** ${card.creditCard.number.slice(-4)} (${FuseUtils.identifyCardBrand(card.creditCard.number)?.brand}) - ${card.creditCard.holderName}`}
              </option>
            ))}
          </TextField>

          <FormNewCard ref={formNewCardRef} user={user} updateUser={updateUser} />

        </Stack>
      )}
    </Paper>
  );
}
