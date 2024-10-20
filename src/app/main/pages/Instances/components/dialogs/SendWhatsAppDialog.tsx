import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Iconify } from '@fuse/components/iconify';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import { motion } from "framer-motion";
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { useCreateInstanceSendTextMutation } from '../../InstanceApi';
const token = '7fd370f4caddb0db67f1c3965830f963'
const config = { headers: { 'Content-Type': 'application/json', 'apikey': token } }
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import { useDispatch } from 'react-redux';
import { useAppDispatch } from 'app/store/store';

type Props = DialogProps & {
  contact: any;
  open: boolean;
  onClose?: () => void;
  onChangeInvite?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const messageSchema = z.object({
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
});

export function SendWhatsAppDialog({
  contact,
  open,
  onClose,
  onChangeInvite,
  ...other
}: Props) {

  const [instance, setInstance] = React.useState(() => {
    const savedInstance = localStorage.getItem('instance');
    return savedInstance ? JSON.parse(savedInstance) : null;
  });
  const [message, setMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [sendText] = useCreateInstanceSendTextMutation();
  const dispatch = useAppDispatch();

  const { control, formState: { isValid }, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues: {
      message: '',
    },
    resolver: zodResolver(messageSchema),
  });

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const sendMessage = async ({ message }) => {
    setIsLoading(true);
    try {
      await sendText({ ...contact, message: message });
    } finally {
      dispatch(
        showMessage({
          message: 'Mensagem enviada com sucesso',
          autoHideDuration: 6000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          },
          variant: 'success'
        }))
      setTimeout(() => {
        setIsLoading(false);
      }, 1800)
      onClose();
      reset();
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit(sendMessage)
        }}
        fullWidth maxWidth="xs"
        {...other}
      >
        <DialogTitle>Enviar para</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, gap: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar src={contact?.profilePicUrl ? contact?.profilePicUrl : contact?.pictureUrl} sx={{ width: 48, height: 48 }} />
            <ListItemText
              primary={contact?.pushName ? contact?.pushName : contact?.subject}
              secondary={contact?.remoteJid ? contact?.remoteJid?.replace('@s.whatsapp.net', '') : contact?.id?.replace('@g.us', '')}
              secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
            />
          </Box>
          <Controller
            name="message"
            control={control}
            render={({ field }) => (
              <TextField
                autoFocus
                required
                margin="dense"
                id="message"
                name="message"
                value={message}
                onChange={handleChange}
                fullWidth multiline rows={5}
                placeholder="Descrição a mensagem..."
                {...field}
              />
            )}
          />
        </DialogContent>
        <DialogActions sx={{ gap: 2 }}>
          <Button color='error' variant='outlined' onClick={onClose} disabled={isLoading}>Cancelar</Button>
          <Button color='secondary' variant='contained' type="submit"
            disabled={isLoading || !isValid}
          >
            {isLoading ? 'Enviando...' : 'Enviar'}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}