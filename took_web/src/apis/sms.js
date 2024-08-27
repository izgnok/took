import { request } from './request';
import { handleApiError } from './errorHandling';

// 문자전송
// 요청
/* 
{
  "phoneNumber": "string" // 사용자의 전화번호
}
*/
// 응답
// 성공: HTTP 상태 코드 200, 반환 값: 1 (정수)
// 실패: 없음
export const sendSmsApi = async (params) => {
  try {
    const response = await request.post('/api/sms/send', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 휴대폰 인증
// 요청
/* 
{
  "phoneNumber": "string", // 사용자의 전화번호
  "code": "int" // 인증 번호
}
*/
// 응답
// 성공: HTTP 상태 코드 200, 반환 값: True (boolean)
// 실패: HTTP 상태 코드 200, 반환 값: False (boolean)
export const verifySmsApi = async (params) => {
  try {
    const response = await request.post('/api/sms/verify', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
