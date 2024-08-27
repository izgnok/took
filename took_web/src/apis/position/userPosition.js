import { request } from '../request';
import { handleApiError } from '../errorHandling';

// 사용자 현재 위치 정보 저장
// - 요청
// {
// 	"userSeq": "Long", // 사용자번호
//   "lat": "double",  // 위도
//   "lon": "double"   // 경도
// }
// - 응답
// 1
export const saveUserPositionApi = async (params) => {
  if (params.userSeq == null) {
    return null;
  }
  try {
    const response = await request.post('/api/position/save', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 현재 저장된 사용자 위치 정보 가져오기
// - 요청 (없음)
// - 응답
// {
//   "userSeq": "long", // 사용자번호
//   "lat": "double", // 위도
//   "lon": "double" // 경도
// }
export const getSavedUserPositionApi = async (userSeq) => {
  try {
    const response = await request.get(`api/position/${userSeq}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 요청 사용자의 근처 위치의 사용자 반환
// - 요청
// {
//   "userSeq": "long", // 사용자번호
//   "lat": "double", // 위도
//   "lon": "double" // 경도
// }
// - 응답
// [
//   {
//       "userSeq": "long", // 근처에 있는 사용자번호
//       "distance": "int"  // 요청한 사용자와 근처 사용자 사이의 거리 (미터 단위)
//   },
//   ...
// ]
export const getNearByUserPositionApi = async (params) => {
  try {
    const response = await request.post('/api/position/nearby', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
