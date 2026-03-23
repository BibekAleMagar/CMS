import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initiateSocketConnection = () => {
  if (socket) return socket;
  
  // You might want to get this from env instead in a real app,
  // matching the NestJS backend port.
  const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';
  
  socket = io(backendUrl, {
    transports: ['websocket'],
    autoConnect: true,
  });
  
  console.log('Connecting socket...');
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const subscribeToCaseMessages = (
  caseId: number,
  userId: number,
  callback: (message: any) => void
) => {
  if (!socket) return;
  socket.emit('joinCaseRoom', { caseId, userId });
  socket.on('newMessage', (message) => {
    callback(message);
  });
};

export const unsubscribeFromCaseMessages = (caseId: number, userId: number) => {
  if (!socket) return;
  socket.off('newMessage');
  socket.emit('leaveCaseRoom', { caseId, userId });
};

export const sendMessageToCaseSocket = (
  caseId: number,
  receiverId: number,
  content: string,
  currentUser: any
) => {
  if (!socket) return;
  socket.emit('sendMessageToCase', {
    createMessageDto: {
      caseId,
      receiverId,
      content,
    },
    currentUser,
  });
};
