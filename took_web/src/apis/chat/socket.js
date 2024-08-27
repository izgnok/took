import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useUser } from '../../store/user';
import { handleApiError } from '../errorHandling';
import { createChatApi } from '../../apis/chat/chat';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// const { userSeq } = useUser();

export const connect = ({ stompClient, loadChatRooms }) => {
  const socket = new SockJS(`${SERVER_URL}/ws`);
  stompClient = Stomp.over(socket);
  stompClient.connect({}, (frame) => {
    console.log('WebSocket connected');
    stompClient.subscribe('/sub/chat/rooms', (body) => {
      loadChatRooms();
    });
  });
};

export const createRoom = async ({ roomTitle, category }) => {
  const { userSeq } = useUser();
  try {
    const response = await createChatApi({
      roomTitle,
      category,
      userSeq,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
