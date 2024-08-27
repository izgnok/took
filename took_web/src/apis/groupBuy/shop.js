import { request } from '../request';
import { handleApiError } from '../errorHandling';

// {
//     "roomSeq": Long,
// "userSeq": Long,
// "title": String,
// "content": String,
// "item": String,
// "site": String,
// "place": String,
// "lat" : Double,
// "lon": Double,
// "maxCount": Int
// }
// 공동구매 게시글 생성
// 응답
// {
//     "shopSeq": Long,
//     "userSeq": Long,
//     "roomSeq": Long,
//     "title": String,
//     "content": String,
//     "hit": Int,
//     "site": String,
//     "item": String,
//     "place": String,
//     "status": String,
//     "lat" : Double,
//     "lon": Double,
//     "maxCount": Int,
//     "createAt": String,

// }
export const writeShopApi = async (params) => {
  try {
    const response = await request.post('/api/shops/create', params);
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
};

// [userSeq]
// 공동구매 게시글 전체 조회
// 응답
// [
//     {
//     "shopSeq": Long,
//     "userSeq": Long,
//     "roomSeq": Long,
//     "title": String,
//     "content": String,
//     "hit": Int,
//     "site": String,
//     "item": String,
//     "place": String,
//     "status": String,
//     "lat" : Double,
//     "lon": Double,
//     "maxCount": Int,
//     "createAt": String
// 		},
// ]
export const getAllShopApi = async (params) => {
  try {
    const response = await request.post(`/api/shops/selectAll`, params);
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
};

// 공동구매 게시글 상세 조회
// 응답
// {
//     "shopSeq": Long,
//     "userSeq": Long,
//     "roomSeq": Long,
//     "title": String,
//     "content": String,
//     "hit": Int,
//     "site": String,
//     "item": String,
//     "place": String,
//     "status": String,
//     "lat" : Double,
//     "lon": Double,
//     "maxCount": Int,
//     "createAt": String
// }
export const getShopApi = async (shopSeq) => {
  try {
    const response = await request.get(`/api/shops/select/${shopSeq}`);
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
};

// 응답 따로 없음
// 공동구매 게시글 삭제
export const deleteShopApi = async (shopSeq) => {
  try {
    const response = await request.delete(`/api/shops/delete/${shopSeq}`);
    console.log('삭제 요청 성공', response); // 삭제 요청 성공 여부 확인
    return response; // 삭제 요청 성공 시 응답 반환
  } catch (err) {
    console.error('삭제 요청 실패', err); // 오류 발생 시 로그 출력
    return handleApiError(err);
  }
};

// {
//     "title": String,
//     "content": String,
//     "item": String,
//     "site": String,
//     "place": String,
//     "lat" : Double,
//     "lon": Double,
//     "maxCount": Int
// }
// 공동구매 게시글 수정
// 응답
// {
//     "shopSeq": Long,
//     "userSeq": Long,
//     "roomSeq": Long,
//     "title": String,
//     "content": String,
//     "hit": Int,
//     "item": String,
//     "site": String,
//     "place": String,
//     "status": String,
//     "lat" : Double,
//     "lon": Double,
//     "maxCount": Int,
//     "createAt": String
// }

export const modifyShopApi = async (shopSeq, params) => {
  try {
    const response = await request.put(`/api/shops/update/${shopSeq}`, params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// {
//     "status": String
// }
// 공동구매 게시글 상태 수정
// {
//     "shopSeq": Long,
//     "userSeq": Long,
//     "roomSeq": Long,
//     "title": String,
//     "content": String,
//     "hit": Int,
//     "item": String,
//     "site": String,
//     "place": String,
//     "status": String,
//     "createAt": String
// }
export const modifyShopStatusApi = async (shopSeq, params) => {
  try {
    const response = await request.put(
      `/api/shops/update/status/${shopSeq}`,
      params
    );
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
};

// {
//   "shopSeq": Long,
//   "userSeq": Long
// }
//공동구매 채팅방 참여하기
export const joinGroupBuyApi = async (params) => {
  try {
    const response = await request.post('/api/shops/enter', params);
    console.log('API Response:', response);
    return response.data;
  } catch (error) {
    console.error(
      'API call error:',
      error.response ? error.response.data : error.message
    );
    return handleApiError(error);
  }
};

//공동구매 채팅방 나가기
export const exitGroupBuyApi = async (shopSeq, userSeq) => {
  try {
    await request.delete(`/api/shops/exit/${shopSeq}/${userSeq}`);
  } catch (error) {
    return handleApiError(error);
  }
};

// 공동 구매 수령 확인
export const pickUpCheckApi = async (shopSeq, userSeq) => {
  try {
    await request.put(`/api/shops/pickUp/${shopSeq}/${userSeq}`);
  } catch (error) {
    return handleApiError(error);
  }
};

// 모든 멤버가 수령 완료했는지 확인
// 응답: boolean
export const getAllPickUpApi = async (shopSeq) => {
  try {
    const response = await request.get(`/api/shops/pickUpCheck/${shopSeq}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 게스트 참여 중인지 확인
// 응답: boolean
export const isJoinApi = async (shopSeq, userSeq) => {
  try {
    const response = await request.get(
      `/api/shops/guestCheck/${shopSeq}/${userSeq}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const nearShopApi = async (userSeq) => {
  try {
    const response = await request.get(`/api/shops/selectAll/${userSeq}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const setPartyApi = async (params) => {
  try {
    const response = await request.put(`/api/shops/setParty`, params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
