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
import Stack from '@mui/material/Stack';
import { useCreateInstanceGroupProfileMutation } from '../../InstanceApi';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';

type Props = DialogProps & {
  group: any;
  open: boolean;
  onClose?: () => void;
  onChangeInvite?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function GroupParticipantsDialog({
  group,
  open,
  onClose,
  onChangeInvite,
  ...other
}: Props) {
  const [participants, setParticipants] = React.useState(group?.participants)
  const [groupProfile] = useCreateInstanceGroupProfileMutation()
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  const [loading, setLoading] = React.useState(false);

  const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
    setScroll(scrollType);
  };

  const handleClose = () => {
    onClose();
  };

  const downloadExcel = (data) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data.map(row => ({
      name: row?.name ? row?.name : '',
      phone: row.id.replace(/@s\.whatsapp\.net/g, ''),
    })));

    const dateTime = new Date().toISOString().replace(/[-T:\.Z]/g, '');
    const fileName = `leads_${dateTime}.xlsx`
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
    XLSX.writeFile(workbook, fileName);
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);

  const handleParticipants = async () => {
    setLoading(true);
    try {
      const updatedParticipants = await Promise.all(
        participants.map(async (lead) => {
          await new Promise(resolve => setTimeout(resolve, 1800));
          const profile: any = await groupProfile({ ...lead, instanceName: group.instanceName });
          return { ...lead, ...profile.data };
        })
      );
      setParticipants(updatedParticipants);
    } catch (error) {
      console.error("Erro ao atualizar participantes:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (group?.participants) {
      setParticipants(group.participants);
    }
  }, [group?.participants]);

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
        <DialogTitle id="scroll-dialog-title">{group.subject}</DialogTitle>
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
                      <TableCell>Phone</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {participants?.map((lead, index) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell>{(index + 1)}</TableCell>
                        <TableCell>
                          <ListItem>
                            {lead?.picture &&
                              <ListItemAvatar>
                                <Avatar src={lead?.picture} sx={{ width: 42, height: 42 }} />
                              </ListItemAvatar>
                            }
                            <ListItemText primary={lead?.name} secondary={lead?.email} />
                          </ListItem>
                        </TableCell>
                        <TableCell>{lead.id.replace(/@s\.whatsapp\.net/g, '')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              width: '100%',
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              color='warning'
              variant="outlined"
              onClick={handleParticipants}
              disabled={loading}
              startIcon={<Iconify icon="solar:cloud-download-line-duotone" />}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Obter informações'}
            </Button>
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
          </Stack>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
