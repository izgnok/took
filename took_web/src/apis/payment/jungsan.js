import { request } from '../request';
import { handleApiError } from '../errorHandling';

/*
요청
{
  "userSeq": 1,
  "title": "친구들과의 모임",
  "category": 1,
}
응답
{
  "code": "string",
  "message": "string",
  "partySeq": 12345,
  "memberSeq": 67890
}

*/
// 파티 생성
export const makePartyApi = async (params) => {
  try {
    const response = await request.post('/api/pay/make-party', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/*
요청
{
  "userSeq": 1,
  "partySeq": 100
}
응답
{
  "code": "string",
  "message": "string",
  "memberSeq": 12345
}
*/
// 멤버추가
export const insertMemberApi = async (params) => {
  try {
    const response = await request.post('/api/pay/insert-member', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/*
요청
{
  "userSeq": 1,
  "partySeq": 100
}
응답
{
  "code": "string",
  "message": "string",
  "memberSeq": 12345
}
*/
//멤버 삭제
export const deleteMemberApi = async (params) => {
  try {
    const response = await request.post('/api/pay/delete-member', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 정산시 맴버들이 돈을 보낼 때
export const onlyjungsanPayApi = async (params) => {
  try {
    const response = await request.post('/api/pay/only-jungsan-pay', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/*

정산시 호스트가 돈 받을 떄

요청
{
  "partySeq": 1,
  "userSeq": 0
}
응답
{
  "code": "string",
  "message": "string",
  "memberSeq": 12345
}
*/
// 오직 정산 후 정산자가 돈 받을 때
export const onlyjungsanhostRecievepi = async (params) => {
  try {
    const response = await request.post(
      '/api/pay/only-jungsan-host-recieve',
      params
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 요청
// {
//     "memberSeq": 0,
//     "partySeq": 0
//   }
// 응답
// {
//     "code": "string",
//     "message": "string",
//     "memberSeq": 12345
//   }
// 멤버들이 수령 확인, 모든 수령이 끝내면 done에서 true 반환
// [배달, 공구]가 수령했을 때
export const deliveryGroupDoneApi = async (params) => {
  try {
    const response = await request.post('/api/pay/deli-gongu-done', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 요청
// {
//     "partySeq": 1,
//     "userSeq": 0
//   }
// 응답
// {
//     "code": "string",
//     "message": "string",
//     "memberSeq": 12345
//   }
// [배달, 공구] 수령 후 입금
export const deliveryGroupHostRecieveApi = async (params) => {
  try {
    const response = await request.post(
      '/api/pay/deli-gongu-host-recieve',
      params
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 요청
// {
//     "userSeq": 0, 로그인한 user
//     "partySeq": 0
//   }
// 응답
// {
//     "code": "string",
//     "message": "string",
//     "memberSeq": 12345
//   }
// [배달, 공구] 유저가 돈 보낼 때
export const deliveryGroupPayApi = async (params) => {
  try {
    const response = await request.post('/api/pay/deli-gongu-pay', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 요청
// {
//     "partySeq": 0,
//     "userCosts": [
//       {
//         "userSeq": 0,
//         "cost": 0
//       }
//     ]
//   }
// 응답
// {
//     "code": "string",
//     "message": "string",
//     "memberSeq": 12345
//   }
export const insertAllMemberApi = async (params) => {
  try {
    const response = await request.post('/api/pay/insert-all-member', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 응답
// {
//     "code": "string",
//     "message": "string",
//     "partyDetailList": [
//       {
//         "memberSeq": 0,
//         "cost": 0,
//         "status": true,
//         "receive": true,
//         "party": {
//           "partySeq": 0,
//           "title": "string",
//           "category": 0,
//           "cost": 0,
//           "status": true,
//           "createdAt": "2024-08-08T02:41:34.368Z",
//           "count": 0,
//           "totalMember": 0,
//           "receiveCost": 0,
//           "deliveryTip": 0
//         },
//         "user": {
//           "userSeq": 0,
//           "userId": "string",
//           "password": "string",
//           "userName": "string",
//           "email": "string",
//           "phoneNumber": "string",
//           "birth": "string",
//           "createdAt": "2024-08-08T02:41:34.368Z",
//           "loginStatus": "KAKAO",
//           "alarm": true,
//           "addr": "string",
//           "lat": 0,
//           "lon": 0,
//           "imageNo": 0,
//           "gender": "M",
//           "simplePassword": 0,
//           "role": "string",
//           "nickname": "string"
//         },
//         "createdAt": "2024-08-08T02:41:34.368Z",
//         "leader": true
//       }
//     ]
//   }
// 파티 삭제
export const partyDeleteApi = async (params) => {
  try {
    const response = await request.delete(
      '/api/pay/party-delete/{partySeq}',
      params
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 요청
// {
//     "partySeq": 1,
//     "userSeq": 1
//   }
// 응답
// {
//     "code": "string",
//     "message": "string",
//     "partyDetailList": [
//       {
//         "memberSeq": 0,
//         "cost": 0,
//         "status": true,
//         "receive": true,
//         "party": {
//           "partySeq": 0,
//           "title": "string",
//           "category": 0,
//           "cost": 0,
//           "status": true,
//           "createdAt": "2024-08-08T02:42:53.084Z",
//           "count": 0,
//           "totalMember": 0,
//           "receiveCost": 0,
//           "deliveryTip": 0
//         },
//         "user": {
//           "userSeq": 0,
//           "userId": "string",
//           "password": "string",
//           "userName": "string",
//           "email": "string",
//           "phoneNumber": "string",
//           "birth": "string",
//           "createdAt": "2024-08-08T02:42:53.084Z",
//           "loginStatus": "KAKAO",
//           "alarm": true,
//           "addr": "string",
//           "lat": 0,
//           "lon": 0,
//           "imageNo": 0,
//           "gender": "M",
//           "simplePassword": 0,
//           "role": "string",
//           "nickname": "string"
//         },
//         "createdAt": "2024-08-08T02:42:53.084Z",
//         "leader": true
//       }
//     ]
//   }
// 파티 상세 조회
export const partyDetailApi = async (partySeq) => {
  try {
    const response = await request.get(`/api/pay/party-detail/${partySeq}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 내가 참가하고 있는 파티 목록
export const getMyPartyListApi = async (userSeq) => {
  try {
    const response = await request.get(`/api/pay/my-party-list/${userSeq}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 택시 정산 실결제
export const fianlTaxiParty = async (params) => {
  try {
    const response = await request.post('/api/pay/final-taxi-party', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 택시 정산 파티 생성(가결제시)
export const makeTaxiPartyApi = async (params) => {
  try {
    const response = await request.post('/api/pay/make-taxi-party', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 택시 잔돈 정산
export const restCostPayApi = async (params) => {
  try {
    const response = await request.post('/api/pay/rest-cost-pay', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 개인 거래 내역 리스트 조회
export const payHistoryApi = async (userSeq) => {
  try {
    const response = await request.get(`/api/pay/pay-history/${userSeq}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 미정산 내역 리스트 조회
export const noPayList = async (userSeq) => {
  try {
    const response = await request.get(`/api/pay/no-pay-list/${userSeq}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
