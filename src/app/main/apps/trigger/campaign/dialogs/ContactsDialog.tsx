import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Iconify } from '@fuse/components/iconify';
import CloseIcon from '@mui/icons-material/Close';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import * as XLSX from 'xlsx'
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import clsx from 'clsx';

type Props = DialogProps & {
  contacts: any;
  open: boolean;
  onClose?: () => void;
  onChangeInvite?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const getStatusText = (status) => {
  switch (status) {
    case 1:
      return 'Enviando';
    case 2:
      return 'Entregue';
    case 3:
      return 'Falha ao enviar';
    default:
      return 'Status desconhecido';
  }
}

const convertFirebaseTimestampToIso = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
  return date.toISOString();
};

export default function ContactsDialog({
  contacts,
  open,
  onClose,
  onChangeInvite,
  ...other
}: Props) {

  const [participants, setParticipants] = React.useState(contacts)
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

  const handleClose = () => {
    onClose();
  };

  const downloadExcel = (data) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data.map(row => ({
      name: row?.name ? row?.name : '',
      phone: row?.number.toString(),
      status: getStatusText(row?.status),
      date: convertFirebaseTimestampToIso(row?.updatedAt)
    })));

    const dateTime = new Date().toISOString().replace(/[-T:\.Z]/g, '');
    const fileName = `log_leads_${dateTime}.xlsx`
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
    XLSX.writeFile(workbook, fileName);
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (contacts) {
      setParticipants(contacts);
    }
  }, [contacts]);

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
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="scroll-dialog-title">Detalhe de envio</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <Grid item xs={12}>
              <Typography
                sx={{ flex: '1 1 100%', mb: 2 }}
                variant="h6"
                id="tableTitle"
                component="div"
                gutterBottom
              >
                <Iconify icon="solar:users-group-rounded-bold-duotone" width={28} sx={{ mr: 1 }} />
                {participants?.length} Contatos
              </Typography>
              <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell width={20}>N˚</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Data</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {participants?.map((lead, index) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell>{(index + 1)}</TableCell>
                        <TableCell>
                          <ListItem>
                            <ListItemText primary={lead?.name} secondary={lead?.number} />
                          </ListItem>
                        </TableCell>
                        <TableCell align='center'>
                          <small>
                            {convertFirebaseTimestampToIso(lead.updatedAt)}
                          </small>
                        </TableCell>
                        <TableCell align='center'>
                          <Typography
                            className={clsx(
                              'inline-flex items-center font-bold text-10 px-10 py-2 rounded-full tracking-wide uppercase',
                              lead.status === 3 &&
                              'bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50',
                              (lead.status === 2) &&
                              'bg-green-50 text-green-800 dark:bg-green-600 dark:text-green-50',
                              lead.status === 1 &&
                              'bg-blue-50 text-blue-800 dark:bg-blue-600 dark:text-blue-50'
                            )}
                          >
                            {getStatusText(lead.status)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>

          <div className='flex gap gap-12'>
            <Button
              color='error'
              variant="outlined"
              startIcon={<Iconify icon="eva:close-outline" />}
              onClick={handleClose}>
              Cancel
            </Button>
            <Button
              color='secondary'
              variant="contained"
              onClick={() => downloadExcel(participants)}
              startIcon={<Iconify icon="solar:cloud-download-line-duotone" />}
            >
              Download
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
