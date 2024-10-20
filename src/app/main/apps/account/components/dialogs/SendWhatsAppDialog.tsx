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
const token = '7fd370f4caddb0db67f1c3965830f963'
const config = { headers: { 'Content-Type': 'application/json', 'apikey': token } }
type Props = DialogProps & {
  clientInfo: any;
  open: boolean;
  onClose?: () => void;
  onChangeInvite?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function SendWhatsAppDialog({
  clientInfo,
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

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const sendMessage = async (message: string) => {
    try {
      const { data: response } = await axios.post(`https://api.parceriasdenegocios.com.br/message/sendText/IND_4802f384`,
        {
          textMessage: { text: message },
          number: '5541999601055',
          options: { presence: 'composing' }
        },
        config
      );

      console.log('Mensagem enviada com sucesso:', response);
    } catch (error) {
      console.error('Error getting QR code:', error.response?.data, error.response?.status, error.response?.headers);
    }
  };

  React.useEffect(() => {
    if (clientInfo) {
      setMessage(`Olá, *${clientInfo.firstName}*! 
😊 Percebi que você iniciou a assinatura do plano CREABOX mas não finalizou a compra. 
Posso te ajudar com alguma dúvida?
Para continuar de onde parou, é só clicar aqui: ${clientInfo.url}`)
    }
  }, [clientInfo])

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const message = formJson.message;
            sendMessage(message)
          },
        }}
        fullWidth maxWidth="xs"
        {...other}
      >
        <DialogTitle>Enviar para</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, gap: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar src={clientInfo?.avatarUrl} sx={{ width: 48, height: 48 }} />
            <ListItemText
              primary={clientInfo?.firstName}
              secondary={clientInfo?.phone}
              secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
            />
          </Box>
          <TextField
            fullWidth multiline rows={5}
            autoFocus
            required
            margin="dense"
            id="message"
            name="message"
            value={message}

            onChange={handleChange}
            placeholder="Descrição a mensagem..."
          />
        </DialogContent>
        <DialogActions sx={{ gap: 2 }}>
          <Button color='error' variant='outlined' onClick={onClose}>Cancelar</Button>
          <Button color='secondary' variant='contained' type="submit">Enviar</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
