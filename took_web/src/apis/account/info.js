import { request } from '../request';
import { handleApiError } from '../errorHandling';

// 계좌 연동
// 요청
/* 
{
  "userSeq": 2,
  "main": false,
  "accountName": "두번째 계좌",
  "accountNum": "1",
  "accountPwd": 1,
  "esayPwd": "111111"
} 
*/
// 응답
/*
{
  "code": "su",
  "message": "Success."
}
*/
export const linkAccountApi = async (params) => {
  try {
    const response = await request.post('/api/account/link-account', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 주거래 계좌 변경
// 요청
/* 
{
  "userSeq": 2,
  "accountSeq": 2
}
*/
// 응답
/*
{
  "code": "su",
  "message": "Success."
}
*/
export const changeMainAccountApi = async (params) => {
  try {
    const response = await request.post(
      '/api/account/change-main-account',
      params
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 계좌 list 가져오기
// 요청
/* 
{
  "userSeq": 2
}
*/
// 응답
// {
//   "code": "string",
//   "message": "string",
//   "list": [
//     {
//       "userSeq": 2,
//       "accountSeq": 3,
//       "accountName": "일반계좌",
//       "accountNum": "508134283342",
//       "bankNum": 21,
//       "balance": 150000
//     }
//   ]
// }
export const getAccountListApi = async (params) => {
  try {
    const response = await request.post('/api/account/account-list', params);
    return response.data;
  } catch (error) {
    console.error(
      'getAccountListApi 에러:',
      error.response ? error.response.data : error.message
    );
    return handleApiError(error);
  }
};

// 계좌 잔액 보기
// 요청
/* 
{
  "accountSeq": 2
}
*/
// 응답
/*
{
  "code": "su",
  "message": "Success.",
  "balance": 10000000
}
*/
export const getAccountBalanceApi = async (params) => {
  try {
    const response = await request.post('/api/account/account-balance', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 계좌 삭제
// 요청
/* 
{
  "accountSeq": 2
}
*/
// 응답
/*
{
  "Done!"
}
*/
export const deleteAccountApi = async ({ accountSeq }) => {
  try {
    const response = await request.delete(
      `/api/account/account-delete/${accountSeq}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 미송금 고객 재송금
// 요청
/* 
{
  "cost": 내야할 가격 (int),
  "accountSeq": 재송금 계좌 (int)
}
*/
// 응답
/*
{
  "code": "su",
  "message": "Success."
}
*/
export const rePayApi = async (params) => {
  try {
    const response = await request.post('/api/account/re-pay', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
