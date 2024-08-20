import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import Grid from '@mui/material/Grid';
import InputMask from 'react-input-mask';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
import Card, { CardProps } from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { CustomTextField } from './CheckoutCustomer';
import Button from '@mui/material/Button';
import { Iconify } from '@fuse/components/iconify';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { Divider } from '@mui/material';


type Props = CardProps & {
  onBackStep: () => void;
  onNextStep: () => void;
  customer: any;
};

export function CheckoutBillingAddress({ onBackStep, onNextStep, customer, ...other }: Props) {
  const { t } = useTranslation(['accountApp']);
  const { control, setValue, getValues } = useFormContext();

  const [loading, setLoading] = useState(false);
  const [showFields, setShowFields] = useState(false);

  const handleInputChange = async (event: any) => {
    const cep = event.target.value.replace(/[^0-9]/g, '')
    if (cep.length === 8) {
      setLoading(true);
      setValue('zipCode', cep);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json`);
        const data = await response.json();

        if (!data.erro) {
          fillAddressFields(data);
          setLoading(false);
          setShowFields(true);
        } else {
          console.error('CEP não encontrado.');
          setLoading(false);
        }

      } catch (error) {
        setLoading(false);
      }

    } else {
      setShowFields(false);
      setValue('zipCode', cep);
    }
  }

  const fillAddressFields = (data: any) => {
    setValue('address', data.logradouro);
    setValue('neighborhood', data.bairro);
    setValue('city', data.localidade);
    setValue('state', data.uf);
  }

  return (
    <>
      <Card {...other} sx={{ mb: 3, borderRadius: 4 }}>
        <CardHeader
          title={
            <Typography variant="h6">
              Contato
            </Typography>
          }
          sx={{ px: { md: 6, xs: 2 }, mt: 2 }}
        />
        <Stack sx={{ px: { md: 6, xs: 2 } }} direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Stack spacing={0.2}>
            <Box sx={{ typography: 'subtitle2' }}>{customer?.name}</Box>
            <Box sx={{ color: 'text.secondary', typography: 'body2' }}>{customer?.cpfCnpj}</Box>
            <Box sx={{ color: 'text.secondary', typography: 'body2' }}>{customer?.email}</Box>
            <Box sx={{ color: 'text.secondary', typography: 'body2' }}>{customer?.phone}</Box>
          </Stack>
          <Button size="small" className='px-12' startIcon={<Iconify icon="solar:pen-bold" onClick={() => onBackStep()} />}>
            {t('EDIT')}
          </Button>
        </Stack>
        <Divider className="border-dashed border-b border-gray-300 mx-36 mt-28" />

        <CardHeader
          title={
            <Typography variant="h6">
              {t('ADDRESS_BOOK')}
            </Typography>
          }
          sx={{ px: { md: 6, xs: 2 }, mt: 1 }}
        />
        <Grid container sx={{ px: { md: 6, xs: 2 } }} mb={8} rowSpacing={2.5} spacing={2}>
          <Grid item xs={12} md={4}>
            <Controller
              name="zipCode"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <InputMask
                  {...field}
                  mask="99999-999"
                  maskChar=""
                  onChange={handleInputChange}
                >
                  {() => (
                    <CustomTextField
                      label={t('ZIP_CODE')}
                      fullWidth
                      variant="filled"
                      required
                      error={!!error}
                      helperText={error?.message}
                      InputProps={{
                        endAdornment: (
                          <>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          </>
                        )
                      }}
                    />
                  )}
                </InputMask>
              )}
            />
          </Grid>
          {(showFields || !!getValues('address')) && (
            <>
              <Grid item xs={12} md={8}>
                <Controller
                  control={control}
                  name="address"
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextField
                      {...field}
                      id="address"
                      label={t('M_ADDRESS')}
                      variant="filled"
                      required
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <Controller
                  control={control}
                  name="addressNumber"
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextField
                      {...field}
                      id="addressNumber"
                      label={t('ADDRESS_NUMBER')}
                      variant="filled"
                      required
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <Controller
                  control={control}
                  name="addressComplement"
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextField
                      fullWidth
                      {...field}
                      id="addressComplement"
                      label={t('ADDRESS_COMPLEMENT')}
                      variant="filled"
                      required
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  control={control}
                  name="neighborhood"
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextField
                      {...field}
                      id="neighborhood"
                      label={t('NEIGHBORHOOD')}
                      variant="filled"
                      required
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  control={control}
                  name="city"
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextField
                      {...field}
                      id="city"
                      label={t('CITY')}
                      variant="filled"
                      required
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  control={control}
                  name="state"
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextField
                      fullWidth
                      {...field}
                      id="state"
                      label={t('STATE')}
                      variant="filled"
                      required
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Card >
    </>
  );
}
