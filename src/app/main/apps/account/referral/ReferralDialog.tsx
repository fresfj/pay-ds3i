import type { DialogProps } from '@mui/material/Dialog';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import { Scrollbar } from '@fuse/components/scrollbar';
import { Iconify } from '@fuse/components/iconify';

import { Alert, AlertTitle, Checkbox, DialogContent, Divider, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { useSelector } from 'react-redux';
import { useAuth } from 'src/app/auth/AuthRouteProvider';
import { useUpdateAccountsItemMutation } from '../AccountApi';
import { useAppDispatch } from 'app/store/store';

// ----------------------------------------------------------------------


type Props = DialogProps & {
  open: boolean;
  onClose?: () => void;
  onChangeInvite?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const schema = z.object({
  pixAddressKeyType: z.string().min(1, { message: 'Selecione um tipo de chave Pix' }),
  pixAddressKey: z.string().min(1, { message: 'Informe a chave Pix' }),
  acceptTerms: z.boolean().refine((value) => value === true, { message: 'Você deve aceitar os Termos e Condições' }),
});

export function ReferralDialog({
  open,
  onClose,
  onChangeInvite,
  ...other
}: Props) {

  const methods = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const { updateUser } = useAuth();
  const [updateAccount] = useUpdateAccountsItemMutation();
  const referral = user?.data?.customer?.referral

  const defaultValues = {
    pixAddressKeyType: referral.pix.pixAddressKeyType ? referral.pix.pixAddressKeyType : '',
    pixAddressKey: referral.pix.pixAddressKey ? referral.pix.pixAddressKey : '',
    acceptTerms: referral?.acceptTerms === true,
  }

  const { control, watch, setValue, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(schema)
  });

  const { isValid, dirtyFields, errors } = formState;
  const form = watch();

  const handleSendRegister = async (data) => {
    setIsLoading(true);
    const dataReferral = {
      referral: {
        pix: {
          pixAddressKeyType: data.pixAddressKeyType,
          pixAddressKey: data.pixAddressKey
        },
        acceptTerms: data.acceptTerms,
        discount: 5,
        labels: ['Fã'], //"Embaixador | Apaixonado"
        status: false
      }
    }
    const userData: any = {
      ...user?.data.customer,
      ...dataReferral,
      uid: user.uid
    }

    try {
      updateAccount(userData);
      updateUser({ data: { customer: userData } });
      await new Promise((resolve) => setTimeout(resolve, 5000));
      dispatch(
        showMessage({
          message: 'Cadastro realizado com sucesso',
          autoHideDuration: 6000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          },
          variant: 'success'
        }))
    } catch (error) {
      console.error('Erro ao enviar:', error);
      dispatch(
        showMessage({
          message: 'Error ao se cadastrar',
          autoHideDuration: 6000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          },
          variant: 'error'
        }))
    } finally {
      setIsLoading(false);
      onClose()
    }
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} {...other}>
      <Stack sx={{ px: 3, mb: 1, mt: 6, textAlign: 'center' }} direction="column" className='mx-80' alignItems="center">
        <Typography component={'h3'} className='m-0 font-semibold' variant="h4">
          Indique a Creabox e ganhe
        </Typography>
        <Typography component={'h4'} variant="subtitle1" className='m-0'>
          A indicação só é válida após a realização da primeira venda do plano da Creabox
        </Typography>
      </Stack>
      <Stack sx={{ mx: 5, mt: 2 }} direction="column" alignItems="center">
        <Alert severity="warning">
          <AlertTitle>Atenção</AlertTitle>
          <Typography className='text-md' variant="body1">
            Para receber suas indicações via transferência <strong>PIX</strong>, é necessário informar a sua chave Pix corretamente.<br />Por favor, insira dados <strong>verdadeiros e válidos</strong> para garantir o recebimento do seu bônus.
          </Typography>
        </Alert>
      </Stack>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSendRegister)}>
          <DialogContent sx={{ mx: 3, mt: 2 }}>
            <Grid container rowSpacing={.5} spacing={3}>
              <Grid item xs={12} md={3}>
                <Controller
                  name="pixAddressKeyType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Tipo de Chave Pix</InputLabel>
                      <Select {...field} label="Tipo de Chave Pix" error={!!errors.pixAddressKeyType}>
                        <MenuItem value="CPF">CPF</MenuItem>
                        <MenuItem value="CNPJ">CNPJ</MenuItem>
                        <MenuItem value="EMAIL">E-mail</MenuItem>
                        <MenuItem value="PHONE">Telefone</MenuItem>
                        <MenuItem value="EVP">EVP</MenuItem>
                      </Select>
                      <Typography color="error">{errors?.pixAddressKeyType?.message}</Typography>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={9}>
                <Controller
                  name="pixAddressKey"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Chave Pix"
                      fullWidth
                      variant="outlined"
                      error={!!errors.pixAddressKey}
                      helperText={errors?.pixAddressKey?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="acceptTerms"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label="Ao concordar, você está aceitando os termos e condições do programa de indicação."
                    />
                  )}
                />
                <Typography color="error">{errors?.acceptTerms?.message}</Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <Divider className="border-dashed" />
          <DialogActions className="flex justify-between space-x-16 p-24" sx={{ justifyContent: 'space-between' }}>
            {onClose && (
              <Button size="large" variant="outlined" color="error" onClick={onClose}>
                Não quero dinheiro
              </Button>
            )}

            <Button
              size="large"
              color="secondary"
              variant="contained"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? 'Enviando...' : 'Começar ganhar dinheiro'}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
