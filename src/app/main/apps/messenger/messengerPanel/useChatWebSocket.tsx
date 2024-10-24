import { addMessage, setConnected } from './store/chatSlice';
import { io } from 'socket.io-client';

export const initSocket = (dispatch, instance) => {
  const socket = io(`wss://evolution.richeli.dev/${instance}`, {
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('Conectado ao WebSocket da Evolution API');
    dispatch(setConnected(true));
  });

  const events = [
    'APPLICATION_STARTUP', 'CALL', 'CHATS_DELETE', 'CHATS_SET', 'CHATS_UPDATE', 'CHATS_UPSERT',
    'CONNECTION_UPDATE', 'CONTACTS_SET', 'CONTACTS_UPDATE', 'CONTACTS_UPSERT', 'GROUP_PARTICIPANTS_UPDATE',
    'GROUP_UPDATE', 'GROUPS_UPSERT', 'LABELS_ASSOCIATION', 'LABELS_EDIT', 'LOGOUT_INSTANCE',
    'MESSAGES_DELETE', 'MESSAGES_SET', 'MESSAGES_UPDATE', 'MESSAGES_UPSERT', 'PRESENCE_UPDATE',
    'QRCODE_UPDATED', 'REMOVE_INSTANCE', 'SEND_MESSAGE', 'TYPEBOT_CHANGE_STATUS', 'TYPEBOT_START',
  ];

  events.forEach(event => {
    socket.on(event, (data) => {
      console.log(`Evento ${event} recebido:`, data);
      if (event === 'MESSAGES_UPSERT') {
        dispatch(addMessage(data));
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('Desconectado do WebSocket da Evolution API');
    dispatch(setConnected(false));
  });

  return socket;
};