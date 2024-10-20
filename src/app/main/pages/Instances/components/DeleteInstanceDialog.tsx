import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


type Props = DialogProps & {
  open: boolean;
  onClose: () => void;
  confirmDelete: () => void;
};

export function DeleteInstanceDialog({
  open,
  onClose,
  confirmDelete,
  ...other }: Props) {

  return (
    <>
      <Dialog open={open} maxWidth="xs" onClose={onClose} {...other}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          Tem certeza de que deseja desconectar e deletar a instância criada?
        </DialogContent>
        <DialogActions sx={{ mb: 1 }}>
          <Button variant='contained' onClick={confirmDelete} color="error">
            Confirmar
          </Button>
          <Button variant='contained' onClick={onClose} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}