import { request } from '../request';
import { handleApiError } from '../errorHandling';

// {
//   "shopSeq": Long,
//   "courier": String,
//   "invoiceNum": String
// }
// : 배송 정보 등록
// 응답
// {
// 	"shipSeq": Long,
//   "shopSeq": Long,
//   "courier": String,
//   "invoiceNum": String
// }

export const writeShipApi = async (params) => {
  try {
    const response = await request.post('/api/ship/create', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// : 배송 정보 조회
// 응답
// {
//     "shopSeq": Long,
//     "courier": String,
//     "invoiceNum": String
//   }
export const getShipApi = async (shopSeq) => {
  try {
    const response = await request.get(`/api/ship/select/${shopSeq}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      throw error; // 403 에러를 다시 던져서 호출한 곳에서 처리할 수 있도록
    }
    return handleApiError(error);
  }
};

// 배송 정보 삭제
export const deleteShipApi = async (shipSeq) => {
  try {
    const response = await request.delete(`/api/ship/delete/${shipSeq}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// {
//     "courier": String,
//     "invoiceNum": String
//   }
// 배송 정보 수정
export const modifyShipApi = async (shipSeq, params) => {
  try {
    const response = await request.put(`/api/ship/update/${shipSeq}`, params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
