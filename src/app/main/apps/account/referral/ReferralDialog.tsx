import type { DialogProps } from '@mui/material/Dialog';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';
import { useForm, FormProvider } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import axios from 'axios';

import { Scrollbar } from '@fuse/components/scrollbar';
import { Iconify } from '@fuse/components/iconify';

import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

const MODEL = [
  {
    "id": 1,
    "message": "Oi, [nome do amigo], tudo bem? 😊\n\nVocê já ouviu falar da Creabox? 📦\n\nÉ uma caixa mensal incrível com creatina e outros produtos essenciais para quem quer maximizar seus resultados na academia. Eu estou usando e estou amando! 😍\n\nSe você comprar pelo meu link de indicação, ainda ganha um desconto exclusivo na sua primeira caixa: [link de indicação]. 🎁\n\nBora treinar juntos e alcançar nossos objetivos! 💪"
  },
  {
    "id": 2,
    "message": "Olá, [nome do amigo], como vai? 🙋\n\nQuero te apresentar a Creabox! 🎉 É uma caixa mensal que entrega creatina e outros produtos top direto na sua casa. 🚀\n\nEu estou usando e não poderia estar mais satisfeita. Cada caixa vem com uma seleção incrível de produtos que tornam a experiência muito melhor e mais barata do que comprar tudo separado. 💸\n\nUse o meu link para ganhar um desconto exclusivo na sua primeira compra: [link de indicação]! 🛒"
  },
  {
    "id": 3,
    "message": "Desconto exclusivo na sua Creabox! 💸\n\n🎉 Você recebeu um cupom exclusivo para comprar a Creabox com desconto! 😱\n\nGaranta agora sua caixa e melhore sua experiência fitness com: 🤑 Creatina de alta qualidade e outros produtos essenciais 📦 Uma seleção personalizada de itens que fazem a diferença nos seus treinos ✨ E muito mais\n\nUse o link para aproveitar essa oferta: [link de indicação]. Não perca! 🚀"
  }
]

type Props = DialogProps & {
  open: boolean;
  onClose?: () => void;
  onChangeInvite?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function ReferralDialog({
  open,
  onClose,
  onChangeInvite,
  ...other
}: Props) {

  const methods = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [templateModel, setTemplateModel] = useState(null);

  const handleSendContacts = async () => {
    setIsLoading(true);

  }

  const sendMessages = async (data) => {
    try {
      await axios.post('https://webhook.parceriasdenegocios.com.br/webhook/testeenvioo', data)
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      console.error('Erro ao enviar mensagens:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleApply = (e) => {

  }

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} {...other}>
      <Stack sx={{ px: 3, mb: 4, mt: 6, textAlign: 'center' }} direction="column" className='mx-80' alignItems="center">
        <Typography component={'h3'} className='m-0 font-semibold' variant="h4">
          Indique a Creabox e ganhe
        </Typography>
        <Typography component={'h4'} variant="subtitle1" gutterBottom>
          A indicação só é válida após a realização da primeira venda do plano da Creabox
        </Typography>
      </Stack>
      <FormProvider {...methods}>
        <form>

        </form>
      </FormProvider>

      <DialogActions className="flex justify-between p-16 mx-12 mb-16" sx={{ justifyContent: 'space-between' }}>
        {onClose && (
          <Button size="large" variant="outlined" color="error" onClick={onClose}>
            Deixar de ganhar
          </Button>
        )}

        <Button
          size="large"
          color="secondary"
          variant="contained"
          onClick={handleApply}
          disabled={isLoading}
        >
          {isLoading ? 'Enviando...' : 'Começar e ganhar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
