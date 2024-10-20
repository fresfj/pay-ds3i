import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog(props) {
  const { alert, setAlert } = props;

  const handleClickOpen = () => {
    setAlert(true);
  };

  const handleClose = () => {
    setAlert(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={alert}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Tem certeza de que deseja cancelar seu plano?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" dangerouslySetInnerHTML={{
            __html: `
              <p>Sabemos o quanto você tem aproveitado os benefícios exclusivos do nosso plano. Ao cancelar, você perderá acesso a:</p>
              <p>Estamos aqui para ajudar! Se houver algum problema ou se precisar de assistência, entre em contato conosco. Estamos comprometidos em oferecer a melhor experiência possível.</p></br>
              <p>Se ainda assim deseja prosseguir com o cancelamento, clique em 'Confirmar Cancelamento'. Se preferir manter seu plano, basta clicar em 'Cancelar'.</p></br>
              <p>Agradecemos por confiar em nós e esperamos continuar atendendo às suas expectativas</p>`
          }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color='error'>Confirmar Cancelamento</Button>
          <Button onClick={handleClose} variant="contained" color='primary' autoFocus>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
