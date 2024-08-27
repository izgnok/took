import { request } from '../request';
import { handleApiError } from '../errorHandling';

// 요청
// {
//   "roomTitle": "string",  // 채팅방 제목
//   "userSeq": "long",     // 채팅방 작성자 번호
//   "category": "int"       // 채팅방 카테고리
// }
// 응답
// {
//   "roomSeq": "long",      // 채팅방 고유 번호
//   "roomTitle": "string",  // 채팅방 제목
//   "userSeq": "long",     // 채팅방 작성자 번호
//   "createdAt": "string",  // 채팅방 생성 시간
//   "category": "int"       // 채팅방 카테고리
// }
// 새로운 채팅방 생성
export const createChatApi = async (params) => {
  try {
    const response = await request.post('/api/chat/room', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 모든 채팅방 조회
export const getChatListApi = async (userSeq) => {
  try {
    const response = await request.get(`/api/chat/rooms/${userSeq}`);
   
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 채팅방 카테고리/사용자 위치 기반 채팅방 조회
export const getChatFilterApi = async (params) => {
  try {
    const response = await request.get('/api/chat/rooms/filter', { params });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

//채팅방의 모든 메시지 조회
// 요청 Body
// {
//   "roomSeq": "long",  // 채팅방 번호
//   "userSeq": "long"  // 사용자 번호
// }
// 응답 Body
// [
//   {
//     "type": "string",    // 메시지 타입 (ENTER, TALK, EXIT, MATCH, MATCH_REQUEST)
//     "userSeq": "long",  // 메시지 송신자 번호
//     "message": "string", // 메시지 내용
//     "createdAt": "string"// 메시지 생성 시간
//   },
//   ...
// ]
export const getChatRoomMessageApi = async (params) => {
  try {
    const response = await request.post('/api/chat/message/list', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteRoomApi = async (roomSeq) => {
  try {
    const response = await request.delete(`/api/chat/room/${roomSeq}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 채팅방에 속한 유저 조회
// 응답 Body
// [
//   {
//     "userSeq": "long" // 사용자 번호
//     "userName": "string",
//     "imageNo": "int"
//   },
// 	...
// ]
export const getUsersApi = async (roomSeq) => {
  try {
    const response = await request.get(`/api/chat/users/${roomSeq}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
