import type { DialogProps } from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useForm, FormProvider } from 'react-hook-form';
import Stack from '@mui/material/Stack';

import { Iconify } from '@fuse/components/iconify';
import { Avatar, Badge, Card, CardMedia, DialogContent, Grid, IconButton, ListItemText, Tooltip, tooltipClasses, TooltipProps, Typography } from '@mui/material';
import axios from 'axios';
import FuseUtils from '@fuse/utils';
import { useEffect, useRef, useState } from 'react';
import { useCreateInstanceMutation } from '../InstanceApi';
import styled from '@mui/styles/styled';
import FuseLoading from '@fuse/core/FuseLoading';
import { useAppDispatch } from 'app/store/store';
import { clearDataApp, contactsSelector, setContactsApp, setInstanceApp, setProfileApp } from '../store/InstanceSlice';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

const token = '7fd370f4caddb0db67f1c3965830f963'
const config = {
  headers: {
    'Content-Type': 'application/json',
    'apikey': token
  }
}

const StyledCard = styled(Card)(({ theme }) => ({
  '& ': {
    transitionProperty: 'box-shadow'
  }

}));

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 310,

  },
}));

type Props = DialogProps & {
  open: boolean;
  inviteEmail?: string;
  onCopyLink?: () => void;
  onClose?: () => void;
  shared?: any[] | null;
  onChangeInvite?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function stringAvatar(name: string) {
  const nameParts = name.split(' ');
  let initials;
  if (nameParts.length === 1) {
    initials = `${nameParts[0][0]}${nameParts[0][0]}`;
  } else {
    initials = `${nameParts[0][0]}${nameParts[1][0]}`;
  }

  return {
    sx: {
      mx: 'auto',
      width: { xs: 84, md: 132 },
      height: { xs: 84, md: 132 },
      bgcolor: stringToColor(name),
    },
    children: initials,
  };
}

interface StyledBadgeProps {
  theme: any
  statuscolor: any
}

const AlertDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#f44336', // Cor de fundo vermelho
    color: '#fff', // Texto branco para contraste
    borderRadius: '8px', // Borda arredondada (opcional)
  },
  '& .MuiDialogTitle-root': {
    color: '#fff', // Título em branco
  },
  '& .MuiDialogActions-root': {
    justifyContent: 'center', // Centralizar os botões (opcional)
  },
  '& .MuiButton-root': {
    color: '#fff', // Cor dos botões
    borderColor: '#fff', // Borda dos botões em branco
  },
}));

const StyledBadge = styled(Badge)(({ theme, statuscolor }: StyledBadgeProps) => ({
  fontSize: 10,
  '& .MuiAvatar-root': {
    fontSize: 'inherit',
    color: theme.palette.text.secondary,
    fontWeight: 600
  },
  '& .MuiBadge-badge': {
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: statuscolor,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      content: '""'
    }
  }
}));
export function InstanceDialog({
  open,
  shared,
  onClose,
  onCopyLink,
  inviteEmail,
  onChangeInvite,
  ...other
}: Props) {
  const hasShared = shared && !!shared.length;
  const [qrcode, setQrcode] = useState('')
  const [timeLeft, setTimeLeft] = useState(40);
  const [instance, setInstance] = useState(() => {
    const savedInstance = localStorage.getItem('instance');
    return savedInstance ? JSON.parse(savedInstance) : null;
  });
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('profile');
    return savedProfile ? JSON.parse(savedProfile) : null;
  });
  const [instanceContacts, setInstanceContacts] = useState([])
  const [createNewInstance] = useCreateInstanceMutation();
  const instanceCreated = useRef(false);
  const intervalRef = useRef(null);

  const contacts = useSelector(contactsSelector);

  const [isOpenConfirm, setIsOpenConfirm] = useState(false);

  const dispatch = useAppDispatch();
  const methods = useForm();
  const { register, handleSubmit, reset } = methods;
  const handleDisconnectInstance = async () => {
    if (instance) {
      const { instanceName } = instance;
      try {
        const logoutResponse = await axios.delete(`https://api.parceriasdenegocios.com.br/instance/logout/${instanceName}`, config);

        if (logoutResponse.status === 200) {
          await axios.delete(`https://api.parceriasdenegocios.com.br/instance/delete/${instanceName}`, config);
          localStorage.removeItem('instance');
          localStorage.removeItem('profile');
          dispatch(clearDataApp())
          setInstance(null);
          setProfile(null);
          setTimeLeft(40);

          handleCreateInstance();
        } else {
          console.error('Erro ao realizar o logout da instância:', logoutResponse.statusText);
        }

      } catch (error) {
        console.error('Erro ao desconectar a instância:', error);
      }
    }


  };

  const handleGetSettings = async () => {
    if (!instance && !profile) return;
    const { instanceName } = instance;
    try {
      const { data: response } = await axios.get(
        `https://api.parceriasdenegocios.com.br/instance/fetchInstances?instanceName=${instanceName}`,
        config
      );

      if (response.instance.status !== "connecting") {
        setProfile(response.instance);
        dispatch(setProfileApp(response.instance))
        localStorage.setItem('profile', JSON.stringify(response.instance));
      } else {
        setProfile(null);
        localStorage.removeItem('profile');
      }

    } catch (error) {
      console.error('Error getting settings:', error.response);
    }
  };


  const handleGetContacts = async () => {
    const { instanceName } = instance
    try {
      const { data: response } = await axios.post(`https://api.parceriasdenegocios.com.br/chat/findContacts/${instanceName}`,
        {},
        config
      );

      createNewInstance(response)
        .then((res) => {
          setInstanceContacts(response)
          dispatch(setContactsApp(response))
          console.log(`createNewInstance`, res)
        }).catch((error) => {
          console.error('Erro ao criar nova instância:', error);
        })

    } catch (error) {
      console.error('Error getting QR code:', error.response?.data, error.response?.status, error.response?.headers);
    }
  }

  const handleGetQrcode = async () => {
    const { instanceName } = instance
    try {
      const { data: response } = await axios.get(
        `https://api.parceriasdenegocios.com.br/instance/connect/${instanceName}`,
        config
      );

      if (response?.instance) {
        handleGetSettings();
        setQrcode('');
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        setQrcode(response.base64);
        setTimeLeft(40);
      }
    } catch (error) {
      console.error('Error getting QR code:', error.response?.data, error.response?.status, error.response?.headers);
    }
  }


  const handleCreateInstance = async () => {

    const uid = FuseUtils.generateGUID()
    const data = {
      "instanceName": `IND_${uid}`,
      "qrcode": true,
      "integration": "WHATSAPP-BAILEYS",
      "reject_call": true,
      "groupsIgnore": true,
      "alwaysOnline": false,
      "readMessages": false,
      "readStatus": false,
      "syncFullHistory": false,
      "webhookByEvents": true,
      "webhookBase64": true,
      "webhookEvents": [
        "APPLICATION_STARTUP"
      ],
      "rabbitmqEnabled": true,
      "rabbitmqEvents": [
        "APPLICATION_STARTUP"
      ],
      "sqsEnabled": true,
      "sqsEvents": [
        "APPLICATION_STARTUP"
      ],
      "chatwootSignMsg": true,
      "chatwootReopenConversation": false,
      "chatwootConversationPending": false,
      "chatwootImportContacts": true,
      "chatwootMergeBrazilContacts": true,
      "typebotListeningFromMe": true
    }

    try {
      if (instance) {
        console.log('Instância já existe:', instance);
      } else {
        const { data: response } = await axios.post(`https://api.parceriasdenegocios.com.br/instance/create`, data, config)
        setInstance(response.instance)
        dispatch(setInstanceApp(response.instance))
        setQrcode(response.qrcode.base64)

        localStorage.setItem('instance', JSON.stringify(response.instance));
        console.log('Nova instância criada:', response);
      }


    } catch (error) {
      const { response } = error;
      console.error(response.data);
      console.error(response.status);
      console.error(response.headers);
    }

  }

  useEffect(() => {
    if (!instance) {
      handleCreateInstance();
    } else if (instance && !profile) {
      handleGetSettings();
    }

    if (!intervalRef.current && instance && !profile) {
      intervalRef.current = window.setInterval(() => {
        handleGetQrcode();
      }, 40000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [instance, profile]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleManualUpdate = () => {
    handleGetQrcode();
  };

  const handleOpenConfirm = () => {
    setIsOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setIsOpenConfirm(false);
  };

  const handleConfirmDelete = () => {
    handleDisconnectInstance();
    handleCloseConfirm();
  };


  return (
    <>
      <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} {...other}>
        <DialogTitle className='text-center text-4xl font-bold'>Sincronize com o seu WhatsApp</DialogTitle>
        <Tooltip title="Fechar" slotProps={{ popper: { modifiers: [{ name: 'offset', options: { offset: [0, -10], }, },], }, }}>
          <IconButton
            size='large'
            color='inherit'
            aria-label="close"
            onClick={onClose}
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
        <DialogContent>
          <Grid container spacing={2}
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Grid item xs={6} md={7}>
              <StyledCard className={'shadow-lg p-24 w-full rounded-lg'}>

                {profile ?
                  <>
                    <ol className="list-inside list-decimal text-xl leading-8 mb-32">
                      <li>Após conectar seu aparelho, é necessário sincronizar seus contatos na plataforma.</li>
                      <ul className="list-inside list-disc ml-24 text-lg leading-6">
                        <li>Clique em <b>Sincronizar seus contatos</b> para iniciar o processo de sincronização de contatos.</li>
                        <li>Após a sincronização, você poderá começar a divulgar e indicar para seus contatos e amigos.</li>
                      </ul>

                    </ol>
                    <div className="flex flex-col flex-auto w-full text-center">
                      <Stack spacing={2} sx={{ flexWrap: 'wrap', justifyContent: "center", alignItems: 'center' }}>
                        {contacts && contacts?.length === 0 ?
                          <Button variant="contained" color="secondary" onClick={handleGetContacts} startIcon={<Iconify icon="solar:refresh-bold-duotone" />}>
                            Sincronizar seus contatos
                          </Button>
                          :
                          <>
                            Você tem {contacts.length} contatos sincronizados.
                          </>
                        }
                      </Stack>
                    </div>
                  </>
                  :
                  <>
                    <ol className="list-inside list-decimal text-xl leading-8 mb-32">
                      <li>Abra o WhatsApp em seu celular</li>
                      <ul className="list-inside list-disc ml-24 text-lg leading-6">
                        <li><b>Android:</b> toque em <b>{`Mais opções > Aparelhos conectados.`}</b></li>
                        <li><b>iPhone:</b> toque em <b>{`Configurações > Aparelhos conectados.`}</b></li>
                      </ul>
                      <li>Toque em <b>Conectar um aparelho.</b></li>
                      <li><b>Aponte o seu celular</b> para esta tela para capturar o código gerado.</li>
                    </ol>
                    <HtmlTooltip title={<>
                      <Typography color="inherit" className='text-center'><b>Não se preocupe!</b></Typography>
                      <Typography color="inherit" className='text-justify'>
                        {`Procuramos manter este processo o mais seguro possível, por isso você não vai perder nenhum dado, incluindo contatos, mensagens, documentos, etc...`}
                      </Typography>
                    </>}
                      arrow
                      placement="top-start"
                      slotProps={{
                        popper: {
                          modifiers: [
                            {
                              name: 'offset',
                              options: {
                                offset: [0, -14],
                              },
                            },
                          ],
                        },
                      }}
                    >
                      <Typography component={'span'} variant='body1' sx={{ color: 'success.main' }}>
                        <span className="flex flex-row items-start">
                          <Iconify icon="mage:security-shield-fill" sx={{ mr: 0.5, height: 22 }} />
                          Este processo é seguro?
                        </span>
                      </Typography>
                    </HtmlTooltip>
                  </>
                }

              </StyledCard>
            </Grid>
            <Grid item xs={6} md={5}>
              <Box p={2.5}>
                {qrcode ?
                  <>
                    <CardMedia
                      component="img"
                      sx={{ width: 330 }}
                      image={qrcode}
                      alt="novo QR Code"
                    />
                    <Typography variant="body2" color="textSecondary" align="center">
                      Próxima atualização em: <b>{timeLeft}</b> segundos
                    </Typography>
                  </>
                  :
                  profile ?
                    <div className="flex flex-col flex-auto w-full text-center">
                      <Stack spacing={2} sx={{ flexWrap: 'wrap', justifyContent: "center", alignItems: 'center' }}>
                        <StyledBadge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          variant="dot"
                          statuscolor='rgb(76, 175, 80)'
                        >
                          <Avatar
                            alt={profile.profileName}
                            src={profile.profilePictureUrl}
                            className="object-cover"
                            {...stringAvatar(profile.profileName)}
                          />
                        </StyledBadge>
                        <ListItemText primary={profile.profileName} secondary={profile.owner.replace('@s.whatsapp.net', '')} />
                        <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                          <Button onClick={handleOpenConfirm} variant="outlined" color="error" startIcon={<Iconify icon="eva:close-outline" />}>
                            Desconectar
                          </Button>
                        </Stack>
                      </Stack>
                    </div>
                    :
                    <FuseLoading />
                }
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions className="flex justify-center p-16 mx-12 mb-16">
          {/* {onClose && (
          <Button size="large" variant="outlined" color="error" onClick={onClose}>
            Não quero ganhar dinheiro
          </Button>
        )} */}
          {!profile &&
            <Button
              size="large"
              variant="contained"
              startIcon={<Iconify icon="solar:refresh-bold-duotone" />}
              onClick={handleManualUpdate}
            >
              Gerar novo QR Code
            </Button>
          }
        </DialogActions>
      </Dialog>

      <Dialog open={isOpenConfirm} maxWidth="xs" onClose={handleCloseConfirm}>
        <DialogTitle>Confirmar Desconexão</DialogTitle>
        <DialogContent>
          Tem certeza de que deseja desconectar e deletar a instância criada?
        </DialogContent>
        <DialogActions sx={{ mb: 1 }}>
          <Button variant='contained' onClick={handleConfirmDelete} color="error">
            Confirmar
          </Button>
          <Button variant='contained' onClick={handleCloseConfirm} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
