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

import { Scrollbar } from '@fuse/components/scrollbar';
import { Iconify } from '@fuse/components/iconify';
import { MessageTemplate } from './MessageTemplate';
import { Typography } from '@mui/material';

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
  inviteEmail?: string;
  onCopyLink?: () => void;
  shared?: any[] | null;
  onChangeInvite?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function ShareDialog({
  open,
  shared,
  onClose,
  onCopyLink,
  inviteEmail,
  onChangeInvite,
  ...other
}: Props) {
  const hasShared = shared && !!shared.length;
  const methods = useForm();

  const handleApplyShipping = (e) => {
    console.log(e.id)
  }

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose} {...other}>
      <Stack sx={{ px: 3, mb: 4, mt: 6, textAlign: 'center' }} direction="column" className='mx-80' alignItems="center">
        <Typography component={'h3'} className='m-0 font-semibold' variant="h4">
          Escolha o modelo de mensagem
        </Typography>
        <Typography component={'h4'} variant="subtitle1" gutterBottom>
          Selecione um dos modelos disponíveis para compartilhar com seus amigos. Certifique-se de escolher a mensagem que melhor se encaixa na sua recomendação para garantir uma comunicação clara e eficaz.
        </Typography>
      </Stack>
      <FormProvider {...methods}>
        <form>
          <MessageTemplate onApplyShipping={handleApplyShipping} templates={MODEL} />
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
          color="success"
          variant="contained"
        >
          Enviar e ganhar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
