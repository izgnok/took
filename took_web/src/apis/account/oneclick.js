import { request } from '../request';
import { handleApiError } from '../errorHandling';

// 임시 비밀번호 설정
// 요청
/* 
{
  "accountSeq": 1,
  "easyPwd": "123456"
}
*/
// 응답
/*
{
  "code": "su",
  "message": "Success."
}
*/
export const setEasyPasswordApi = async (params) => {
  try {
    const response = await request.post('/api/account/make-easypwd', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 확인 여부
// 요청
/* 
{
  "accountSeq": 1,
  "easyPwd": "123456"
}
*/
// 응답
/*
{
  "code": "su",
  "message": "Success.",
  "checked": true
}
*/
export const checkEasyPasswordApi = async (params) => {
  try {
    const response = await request.post('/api/account/check-easypwd', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getMainAccount = async (userSeq) => {
  try {
    const response = await request.get(`/api/account/main-account/${userSeq}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
