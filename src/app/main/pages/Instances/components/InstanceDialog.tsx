import type { DialogProps } from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

import { Iconify } from '@fuse/components/iconify';
import { Avatar, Badge, Card, CardMedia, DialogContent, Divider, FormControl, FormHelperText, Grid, IconButton, InputLabel, ListItemText, MenuItem, Select, Tooltip, tooltipClasses, TooltipProps, Typography } from '@mui/material';
import axios from 'axios';
import FuseUtils from '@fuse/utils';
import { useEffect, useRef, useState } from 'react';
import { useCreateInstanceMutation, useUpdateInstanceMutation } from '../InstanceApi';
import styled from '@mui/styles/styled';
import FuseLoading from '@fuse/core/FuseLoading';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'react-redux';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { User } from 'src/app/auth/user';
import LoadingButton from '@mui/lab/LoadingButton';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import _ from '@lodash';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

const token = '1628a15460aafe7b6f0510bedbf95988'
const config = { headers: { 'Content-Type': 'application/json', 'apikey': token } }

const StyledCard = styled(Card)(({ theme }) => ({
  '& ': {
    transitionProperty: 'box-shadow'
  }

}));

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 310,

  },
}));

type FormType = {
  instanceName: string
  canal: string
};

type Props = DialogProps & {
  open: boolean;
  inviteEmail?: string;
  onCopyLink?: () => void;
  onClose?: () => void;
  shared?: any[] | null;
  onChangeInvite?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function stringAvatar(name: string) {
  const nameParts = name?.split(' ');

  let initials;
  if (nameParts?.length !== undefined && nameParts?.length === 1) {
    initials = `${nameParts[0][0]}${nameParts[0][0]}`;
  } else {
    if (nameParts?.length !== undefined) {
      initials = `WB`;
    } else {
      initials = `${nameParts[0][0]}${nameParts[1][0]}`;
    }

  }

  return {
    sx: {
      mx: 'auto',
      width: { xs: 84, md: 132 },
      height: { xs: 84, md: 132 },
      bgcolor: stringToColor(name),
    },
    children: initials,
  };
}

interface StyledBadgeProps {
  theme: any
  statuscolor: any
}

const AlertDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#f44336', // Cor de fundo vermelho
    color: '#fff', // Texto branco para contraste
    borderRadius: '8px', // Borda arredondada (opcional)
  },
  '& .MuiDialogTitle-root': {
    color: '#fff', // Título em branco
  },
  '& .MuiDialogActions-root': {
    justifyContent: 'center', // Centralizar os botões (opcional)
  },
  '& .MuiButton-root': {
    color: '#fff', // Cor dos botões
    borderColor: '#fff', // Borda dos botões em branco
  },
}));

const StyledBadge = styled(Badge)(({ theme, statuscolor }: StyledBadgeProps) => ({
  fontSize: 10,
  '& .MuiAvatar-root': {
    fontSize: 'inherit',
    color: theme.palette.text.secondary,
    fontWeight: 600
  },
  '& .MuiBadge-badge': {
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: statuscolor,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      content: '""'
    }
  }
}));

const schema = z.object({
  instanceName: z.string({ required_error: 'Nome da instância é obrigatório' }).min(3, { message: 'Digite pelo menos 3 caracteres para o nome da instância' }),
  canal: z.string({ required_error: 'Selecione um canal' }).min(1, { message: 'Selecione um canal' })
});

export function InstanceDialog({
  open,
  shared,
  onClose,
  onCopyLink,
  inviteEmail,
  onChangeInvite,
  ...other
}: Props) {
  const { data: user } = useSelector(selectUser) as User;

  const [createNewInstance] = useCreateInstanceMutation();
  const [updateInstance] = useUpdateInstanceMutation()

  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const defaultValues = {
    instanceName: "",
    canal: ""
  } as any
  const { control, watch, setValue, reset, handleSubmit, formState, register } = useForm<FormType>({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(schema)
  });


  const { isValid, dirtyFields, errors } = formState;
  const form = watch();

  async function onSubmit() {
    const data = {
      ...form,
      integration: form.canal === "STARTER" ? "WHATSAPP-BAILEYS" : "WHATSAPP-BUSINESS",
      user: {
        name: user.displayName,
        uid: user.id,
        id: user.customer.id
      }
    }

    setLoading(true);
    await createNewInstance(data)
      .then((res: any) => {
        console.log(`res`, res)
        dispatch(
          showMessage({
            message: 'Nova instância criada com sucesso',
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            },
            variant: 'success'
          }))
        onClose()
      }).catch((error) => {
        console.error('Erro ao criar nova instância:', error);
      })

    setTimeout(() => {
      setLoading(false)
    }, 1800);
  }
  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
        <DialogTitle className='text-2xl font-bold'>Nova instância</DialogTitle>
        <Tooltip title="Fechar" slotProps={{ popper: { modifiers: [{ name: 'offset', options: { offset: [0, -10], }, },], }, }}>
          <IconButton
            size='large'
            color='inherit'
            aria-label="close"
            onClick={onClose}
            sx={(theme) => ({
              position: 'absolute',
              right: 8,
              top: 8,
              backgroundColor: theme.palette.grey[200],
              color: theme.palette.grey[600],
              transition: 'background-color 0.3s, color 0.3s',
              '&:hover': {
                backgroundColor: theme.palette.grey[300],
                color: theme.palette.grey[900],
              },
            })}
          >
            <Iconify icon="mingcute:close-line" sx={{ width: 26, height: 26 }} />
          </IconButton>
        </Tooltip>
        <DialogContent sx={{ py: 2 }}>
          <Grid container className='py-20' rowSpacing={.5} spacing={3}>
            <Grid item xs={12} md={12}>
              <Controller
                control={control}
                name="instanceName"
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="instanceName"
                    label='Nome da Instância'
                    placeholder="Instância do João"
                    variant="outlined"
                    error={!!errors?.instanceName}
                    helperText={errors?.instanceName?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Controller
                control={control}
                name="canal"
                render={({ field }) => (
                  <FormControl fullWidth className="mt-16" error={!!errors.canal}>
                    <InputLabel htmlFor="max-width">Canal</InputLabel>
                    <Select
                      {...field}
                      label="Canal"
                      fullWidth
                    >
                      <MenuItem value={'STARTER'}>WhatsApp Starter</MenuItem>
                      <MenuItem value={'WABA'}>WhatsApp Business API</MenuItem>
                    </Select>
                    <FormHelperText>{errors.canal?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Divider className="border-dashed" />
        <DialogActions className="p-24 flex justify-end space-x-16">
          <Button size="large" variant="outlined" color="error"
            onClick={onClose}
            startIcon={<Iconify icon="eva:close-outline" />}
          >
            Cancelar
          </Button>

          <Button
            size="large"
            type="submit"
            variant="contained"
            color='secondary'
            startIcon={<Iconify icon="eva:plus-outline" />}
            onClick={handleSubmit(onSubmit)}
            disabled={_.isEmpty(dirtyFields) || !isValid || loading}
          >
            Criar Instância
          </Button>

        </DialogActions>
      </Dialog>
    </>
  );
}
