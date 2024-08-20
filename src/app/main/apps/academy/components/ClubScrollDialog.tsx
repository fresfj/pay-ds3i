import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

export default function ClubScrollDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

  const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <React.Fragment>
      <Button
        className="mt-32 px-48 text-lg rounded-lg"
        size="large"
        color="secondary"
        variant="contained"
        onClick={handleClickOpen('paper')}
      >
        Aproveite agora
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Como acessar</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <div className="flex flex-col items-center px-24 pb-32 pt-12">
              <div className="w-full max-w-7xl">
                <div>
                  <Typography
                    className="max-w-xl text-xl"
                    color="text.secondary"
                  >
                    Ao se associar ao Clubde CREABOX, você tem acesso a uma variedade de descontos especiais que podem ser usados tanto em lojas físicas quanto virtuais.
                  </Typography>
                </div>
                <div className="mt-48 grid w-full grid-cols-1 gap-x-24 gap-y-48 lg:gap-x-64">
                  <div>
                    <Typography className="text-xl font-semibold">
                      Confira Seu E-mail:
                    </Typography>
                    <Typography
                      className="mt-8 leading-6"
                      color="text.secondary"
                    >
                      Verifique seu e-mail para encontrar as credenciais enviadas pelo provedor oficial. Você encontrará um e-mail com a chamada <b>[CARTÃO ACESSO SAÚDE]</b> – Senha de Acesso, contendo seu usuário e senha temporários, além de instruções detalhadas sobre como ativar sua conta.
                    </Typography>
                  </div>
                  <div>
                    <Typography className="text-xl font-semibold">
                      Ative Sua Conta:
                    </Typography>
                    <Typography
                      className="mt-2 leading-6"
                      color="text.secondary"
                    >
                      Acesse o site, use as credenciais fornecidas para fazer login e será solicitado que crie uma nova senha.
                    </Typography>
                  </div>
                  <div>
                    <Typography className="text-xl font-semibold">Explore Seus Benefícios Exclusivos:</Typography>
                    <Typography
                      className="mt-8 leading-6"
                      color="text.secondary"
                    >
                      Uma vez logado, você tem acesso a uma rede com mais de 300 parceiros pelo Brasil, desfrutando de descontos especiais que incluem:
                    </Typography>
                    <Typography
                      className="mt-8 leading-6"
                      color="text.secondary"
                    >
                      Descontos de até <b>75%</b> em medicamentos.
                      Ofertas exclusivas em cinemas, viagens e locação de veículos.
                      Condições diferenciadas em cursos preparatórios, idiomas e graduação.
                      Descontos em grandes lojas de departamentos, academias, procedimentos estéticos e cirurgias plásticas (ver disponibilidade local).
                      Acesso a uma rede de clínicas e laboratórios com preços acessíveis (ver disponibilidade local).
                    </Typography>
                  </div>
                  <div>
                    <Typography className="text-xl font-semibold">
                      Mecânicas dos Benefícios:
                    </Typography>
                    <Typography
                      className="mt-8 leading-6"
                      color="text.secondary"
                    >
                      Lojas Físicas: Apresente um voucher ou uma identificação, como seu CPF, no momento da compra conforme as instruções específicas para cada parceiro.
                    </Typography>
                    <Typography
                      className="mt-8 leading-6"
                      color="text.secondary"
                    >
                      Lojas Virtuais: Aplique os códigos de desconto disponíveis na descrição das ofertas ou utilize os links exclusivos para garantir o desconto.
                    </Typography>
                    <Typography
                      className="mt-8 leading-6"
                      color="text.secondary"
                    >
                      Lembre-se, cada parceiro tem uma mecânica própria para beneficiar você. Certifique-se de ler os detalhes de cada oferta para entender completamente como aproveitar cada desconto.
                    </Typography>
                    <Typography
                      className="mt-8 leading-6"
                      color="text.secondary"
                    >
                      Não Perca Essa Chance! Aproveite ao máximo cada momento e cada benefício disponível através. Sua jornada de vantagens começa aqui.
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            className="whitespace-nowrap"
            variant="outlined"
            color='error'
            onClick={handleClose}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
