import { request } from '../request';
import { handleApiError } from '../errorHandling';

/* 요청 { “title” : “party_title” , “category”:”category”, “cost”:12121, “totalMember = 4} */
// 정산 파티 형성 api (정산하기 요청시)
export const createPayApi = async (params) => {
  try {
    const response = await request.post('/api/pay/request-pay', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 툭 히스토리 조회 (전체 리스트 조회)
/* 응답 {    "code": "su",    "message": "Success.",    "list": [        {            "partySeq": 1,            "title": "거북이조 회식",            "category": "일반 결제",            "cost": 170000,            "status": false,            "createdAt": "2024-07-23T11:56:14.908867",            "count": 0,            "totalMember": 6        }    ]} */
export const getTookHistory = async () => {
  try {
    const response = await request.get('/api/pay/party-list');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 저기 cost에 정산(배달,일반결제)등 불러와서 넘겨줘야함.
/* 요청{    "user_seq" : 2,    "party_seq" : 1,    "cost" : 28334,    "status" : false,    "receive" : null,    "isLeader" : false} */
// 멤버별 정산 금액
// TODO : 이해 못 함
export const writeMemberPayApi = async (params) => {
  try {
    const response = await request.post('/api/pay/member', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 결제 api
/* { 요청
    "userSeq" : 2,
    "partySeq" : 1
    } */
/*  {응답
"code": "su",
"message": "Success."
} */
export const payApi = async (params) => {
  try {
    const response = await request.post('/api/pay/pay-all', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 결제 완료 여부 api
//응답 { “status” : “true아니면false 옵니다.”}
export const checkPartyStatusApi = async () => {
  try {
    const response = await request.get('/api/pay/party-done');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 요청 {”userSeq” :2, “partySeq”:1}
// 미송금자 재송금(은행 변경) api
export const repayApi = async (params) => {
  try {
    const response = await request.post('/api/pay/re-pay', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 요청 {”partySeq”: 1 }
//결제 현황 상세보기
// list 안에 나를 제외한 파티의 구성원 리스트.
// 응답
/* {
    "code": "su",
    "message": "Success.",
    "partyDetailList": []
    } */
export const getPartyMembersApi = async (params) => {
  try {
    const response = await request.get('/api/pay/pay-detail', { params });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
