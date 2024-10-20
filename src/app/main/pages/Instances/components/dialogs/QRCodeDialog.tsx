import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import CardMedia from '@mui/material/CardMedia';
import { useGetInstanceConnectByIdQuery } from '../../InstanceApi';
import { Iconify } from '@fuse/components/iconify';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function QRCodeDialog({ ...props }) {
  const { instance } = props
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [open, setOpen] = React.useState(false);
  const [intervalId, setIntervalId] = React.useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { data, isLoading, refetch } = useGetInstanceConnectByIdQuery(
    instance?.name,
    { skip: !open }
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  React.useEffect(() => {
    if (open) {
      refetch();

      const id = setInterval(() => {
        refetch();
      }, 20000);

      setIntervalId(id);
      console.log(isLoading, `Gerar QR Code data`, id)
      return () => {
        clearInterval(id);
      };
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [open, refetch]);

  React.useEffect(() => {
    if (open && !isLoading && !data) {
      refetch();
    }
  }, [open, isLoading, data, refetch]);
  return (
    <React.Fragment>
      <Button
        onClick={handleClickOpen}
        className='rounded-lg' color="warning" size="large" variant="contained"
      >
        {isMobile ? 'Gerar' : 'Gerar QR Code'}
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullScreen={fullScreen}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className='text-xl text-center'>Sincronize o seu WhatsApp</DialogTitle>
        <Tooltip title="Fechar" slotProps={{ popper: { modifiers: [{ name: 'offset', options: { offset: [0, -10], }, },], }, }}>
          <IconButton
            size='large'
            color='inherit'
            aria-label="close"
            onClick={handleClose}
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
        <DialogContent className="flex flex-col items-center justify-center p-16 mx-12">
          <CardMedia
            className="flex justify-center rounded-lg"
            component="img"
            sx={{ width: 320 }}
            image={data?.base64}
            alt="novo QR Code"
          />

        </DialogContent>
        <DialogContentText>
          <Typography variant="body2" color="text.secondary" className="text-center">
            Problema com a conexão? Estamos online
          </Typography>
        </DialogContentText>
        <DialogActions className="flex justify-center p-16 mx-12 mb-16">
          <Button
            size="large"
            variant="contained"
            startIcon={<Iconify icon="solar:refresh-bold-duotone" />}
            onClick={handleClose}
          >
            Gerar novo QR Code
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
