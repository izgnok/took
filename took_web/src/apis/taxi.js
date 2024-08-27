import { request } from './request';
import { handleApiError } from './errorHandling';

// 택시 파티 생성
// 요청
/* 
{
    "gender": "boolean", // 성별 여부
    "max": "int", // 최대 인원 수
    "roomSeq": "long", // 채팅방 참조 번호
    "userSeq": "long" // 사용자 번호
}
*/
// 응답
/*
{
    "taxiSeq": "long", // 택시 번호
    "roomSeq": "long", // 채팅방 참조 번호
    "userSeq": "long", // 사용자 번호
    "partySeq": "long", // 정산 번호
    "startLat": "double", // 출발지 위도
    "startLon": "double", // 출발지 경도
    "gender": "boolean", // 성별 여부
    "count": "int", // 현재 인원 수
    "max": "int", // 최대 인원 수
    "status": "string", // 택시 상태 (OPEN, FILLED, BOARD, DONE)
    "createdAt": "string", // 생성 일시
    "finishTime": "string", // 종료 일시
    "cost": "int", // 비용
    "master": "long" // 결제자
}
*/
export const createTaxiPartyApi = async (params) => {
  try {
    const response = await request.post('/api/taxi/create', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 택시 파티 리스트 조회
// 요청
/* 
{
  "lat": 37.123456,
  "lon": 127.123456
}
*/
// 응답
/*
[
    {
        "taxiSeq": "long", // 택시 번호
        "roomSeq": "long", // 채팅방 참조 번호
        "userSeq": "long", // 사용자 번호
        "partySeq": "long", // 정산 번호
        "startLat": "double", // 출발지 위도
        "startLon": "double", // 출발지 경도
        "gender": "boolean", // 성별 여부
        "count": "int", // 현재 인원 수
        "max": "int", // 최대 인원 수
        "status": "string", // 택시 상태 (OPEN, FILLED, BOARD, DONE)
        "createdAt": "string", // 생성 일시
        "finishTime": "string", // 종료 일시
        "cost": "int", // 비용
        "master": "long" // 결제자
    }
]
*/
export const getTaxiPartyListApi = async (params) => {
  try {
    const response = await request.post('/api/taxi/list', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 특정 택시 파티 조회
// 요청: 없음
// 응답
/*
{
    "taxiSeq": "long", // 택시 번호
    "roomSeq": "long", // 채팅방 참조 번호
    "userSeq": "long", // 사용자 번호
    "partySeq": "long", // 정산 번호
    "startLat": "double", // 출발지 위도
    "startLon": "double", // 출발지 경도
    "gender": "boolean", // 성별 여부
    "count": "int", // 현재 인원 수
    "max": "int", // 최대 인원 수
    "status": "string", // 택시 상태 (OPEN, FILLED, BOARD, DONE)
    "createdAt": "string", // 생성 일시
    "finishTime": "string", // 종료 일시
    "cost": "int", // 비용
    "master": "long" // 결제자
}
*/
export const getTaxiPartyApi = async (taxiSeq) => {
  try {
    const response = await request.get(`/api/taxi/${taxiSeq}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 참가 중인 택시 파티 조회
// 요청: 없음
// 응답
/*
{
    "taxiSeq": "long", // 택시 번호
    "roomSeq": "long", // 채팅방 참조 번호
    "userSeq": "long", // 사용자 번호
    "partySeq": "long", // 정산 번호
    "startLat": "double", // 출발지 위도
    "startLon": "double", // 출발지 경도
    "gender": "boolean", // 성별 여부
    "count": "int", // 현재 인원 수
    "max": "int", // 최대 인원 수
    "status": "string", // 택시 상태 (OPEN, FILLED, BOARD, DONE)
    "createdAt": "string", // 생성 일시
    "finishTime": "string", // 종료 일시
    "cost": "int", // 비용
    "master": "long" // 결제자
}
*/
export const getJoinedTaxiPartyApi = async (userSeq) => {
  try {
    const response = await request.get(`/api/taxi/joined/${userSeq}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 택시 파티 정보 업데이트
// 요청
/* 
{
    "taxiSeq": "long", // 택시 번호
    "master": "long", // 결제자 번호
    "max": "int", // 최대 인원 수
    "gender": "boolean" // 성별 여부
}
*/
// 응답: 없음
export const updateTaxiPartyApi = async (params) => {
  try {
    const response = await request.put('/api/taxi/set', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 택시 파티 상태 변경
// 요청
/* 
{
    "taxiSeq": "long" // 택시 번호
    "status": "string" // 상태 (OPEN, FILLED, BOARD, DONE)
}
*/
// 응답: 없음
export const updateTaxiPartyStatusApi = async (params) => {
  try {
    const response = await request.put('/api/taxi/status', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 택시 출발지 설정
// 요청
/* 
{
    "taxiSeq": "long", // 택시 번호
    "cost": "int", // 비용
    "startLat": "double", // 출발지 위도
    "startLon": "double" // 출발지 경도
}
*/
// 응답: 없음
export const setTaxiStartLocationApi = async (params) => {
  try {
    const response = await request.put('/api/taxi/start', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 택시 파티 삭제
// 요청: 없음
// 응답: 없음
export const deleteTaxiPartyApi = async (taxiSeq) => {
  try {
    const response = await request.delete(`/api/taxi/delete/${taxiSeq}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 택시 파티 멤버 추가
// 요청
/* 
{
    "taxiSeq": "long", // 택시 번호
    "userSeq": "long", // 사용자 번호
    "destiName": "string", // 목적지 이름
    "destiLat": "double", // 목적지 위도
    "destiLon": "double", // 목적지 경도
    "cost": "int", // 비용
    "routeRank": "int" // 경로 순위
}
*/
// 응답: 없음
export const addTaxiPartyMemberApi = async (params) => {
  try {
    const response = await request.post('/api/taxi/guest/create', params);
    return response;
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    return false; // 오류 발생 시 false 반환
  }
};

// 택시 파티 멤버 삭제
// 요청
/* 
{
    "taxiSeq": "long", // 택시 번호
    "userSeq": "long" // 사용자 번호
}
*/
// 응답: 없음
export const deleteTaxiGuestApi = async (params) => {
  try {
    const response = await request.post('/api/taxi/guest/delete', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 택시 파티 특정 멤버 조회
// 요청: 없음
// 응답
/*
{
    "guestSeq": "long", // 게스트 번호
    "taxiSeq": "long", // 택시 번호
    "userSeq": "long", // 사용자 번호
    "destiName": "string", // 목적지 이름
    "destiLat": "double", // 목적지 위도
    "destiLon": "double", // 목적지 경도
    "cost": "int", // 비용
    "routeRank": "int" // 경로 순위
}
*/
export const getTaxiPartyMemberApi = async (userSeq) => {
  try {
    const response = await request.get(`/api/taxi/guest/${userSeq}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 택시 파티 모든 멤버 조회
// 요청: 없음
// 응답
/*
[
    {
        "guestSeq": "long", // 게스트 번호
        "taxiSeq": "long", // 택시 번호
        "userSeq": "long", // 사용자 번호
        "destiName": "string", // 목적지 이름
        "destiLat": "double", // 목적지 위도
        "destiLon": "double", // 목적지 경도
        "cost": "int", // 비용
        "routeRank": "int" // 경로 순위
    }
]
*/
export const getAllTaxiPartyMembersApi = async (taxiSeq) => {
  try {
    const response = await request.get(`/api/taxi/guests/${taxiSeq}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 택시 파티 경로 조회
// 요청: 없음
// 응답
/*
[
    {
        "userSeq": "long", // 사용자 번호
        "destiName": "string", // 목적지 이름
        "destiLat": "double", // 목적지 위도
        "destiLon": "double", // 목적지 경도
        "routeRank": "int", // 경로 순위
        "cost": "int" // 비용
    }
]
*/
export const getTaxiPartyPathApi = async (taxiSeq) => {
  try {
    const response = await request.get(`/api/taxi/path/${taxiSeq}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 택시 파티 목적지 등록 시 순위 조회
// 요청: 없음
// 응답
/*
{
    "rank": "int" // 다음 목적지 순위
}
*/
export const getNextDestinationRankApi = async (taxiSeq) => {
  try {
    const response = await request.get(`/api/taxi/rank/${taxiSeq}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 택시 파티 참가 여부
// 요청: 없음
// 응답
/*
{
    "isJoined": "boolean" // 탑승 여부
}
*/
export const isUserJoinedTaxiPartyApi = async (userSeq) => {
  try {
    const response = await request.get(`/api/taxi/isJoined/${userSeq}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 택시 파티 목적지 및 비용 설정
// 요청
/* 
{
    "guestSeq": "long", // 게스트 번호
    "destiName": "string", // 목적지 이름
    "destiLat": "double", // 목적지 위도
    "destiLon": "double", // 목적지 경도
    "cost": "int", // 비용
    "routeRank": "int" // 경로 순위
}
*/
// 응답: 없음
export const setDestinationAndCostApi = async (params) => {
  try {
    const response = await request.put(
      '/api/taxi/guest/set/destinationAndCost',
      params
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 택시 파티 목적지 순서 설정
// 요청
/* 
{
    "taxiSeq": "long", // 택시 번호
    "destiName": "string", // 목적지 이름
    "routeRank": "int" // 경로 순위
}
*/
// 응답: 없음
export const setDestinationRankApi = async (params) => {
  try {
    const response = await request.put('/api/taxi/guest/set/rank', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 택시 파티 총 비용 저장
// 요청
/* 
{
    "taxiSeq": "long", // 택시 파티 번호
    "cost": "int" // 총 결제 금액 
}
*/
// 응답: 없음
export const setTotalCostApi = async (params) => {
  try {
    const response = await request.put('/api/taxi/setCost', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 최종 비용 계산 ( 결제 금액 입력 시 )
// 요청
/* 
{
    "users": [
        {
            "userSeq": "long",   // 사용자번호
            "cost": "int"    // 예상 비용 ( 현재위치 -> 목적지 )
        },
        ...
    ],
    "allCost": "int", // 결제자가 결제 한 금액
    "taxiSeq": "long" // 택시 파티 번호
}
*/
// 응답
/*
{
    "users": [
        {
            "userSeq": "long", // 사용자 번호
            "cost": "int" // 사용자별 결제 금액
        },
        ...
    ]
}
*/
export const calculateFinalCostApi = async (params) => {
  try {
    const response = await request.post('/api/taxi/finalCost', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 정산 연결
// 요청
/* 
{
    "taxiSeq": "long",  // 택시파티 번호
    "partySeq": "long" // 정산 번호
}
*/
// 응답: 없음
export const linkSettlementApi = async (params) => {
  try {
    const response = await request.put('/api/taxi/setParty', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 개인 예상 비용 계산
// 요청
/* 
{
    "startLat": "double", // 출발지 위도 ( 현재 위치 )
    "startLon": "double", // 출발지 경도 ( 현재 위치 )
    "endLat": "double", // 목적지 위도
    "endLon": "double" // 목적지 경도 
}
*/
// 응답
/*
{
    "cost": "int" // 예상 비용
}
*/
export const calculateIndividualExpectedCostApi = async (params) => {
  try {
    const response = await request.post('/api/navi/expect', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 전체 경로 예상 결제 금액 계산
// 요청
/* 
{
    "locations": [
        {
            "lat": "double", // 출발지 위도
            "lon": "double" // 출발지 경도
        },
        {
            "lat": "double", // 경유지1 위도
            "lon": "double" // 경유지2 경도
        },
        ... ( 경유지들 )
        {
            "lat": "double", // 목적지 위도
            "lon": "double" // 목적지 경도
        }
    ],
    "users": [
        {
            "userSeq": "long",   // 사용자번호
            "cost": "int"    // 예상 비용 ( 현재위치 -> 목적지 )
        },
        ...
    ]
}
*/
// 응답
/*
{
    "allCost": "int", // 총 예상 결제 금액 
    "distance": "double", // 총 거리 (km)
    "duration": "int", // 총 시간 (분)
    "users": [
        {
            "userSeq": "long", // 사용자 번호
            "cost": "int" // 예상 결제 금액
        },
        ...
    ]
}
*/
export const calculateTotalExpectedCostApi = async (params) => {
  try {
    const response = await request.post('/api/navi/expect/all', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// roomSeq로 참가 중인 택시 조회
//응답
// {
//   "taxiSeq": 1,
//   "roomSeq": 1,
//   "userSeq": 1,
//   "partySeq": 1,
//   "startLat": 37.5665,
//   "startLon": 126.978,
//   "gender": true,
//   "count": 3,
//   "max": 4,
//   "status": "OPEN",
//   "createdAt": "2024-08-12T14:17:48.073Z",
//   "finishTime": "2024-08-12T14:17:48.073Z",
//   "cost": 5000,
//   "master": 1
// }
export const getSeletByRoomApi = async (roomSeq) => {
  try {
    const response = await request.get(`/api/taxi/selectByRoom/${roomSeq}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 택시 정산 실결제
// 요청 Body
// {
//   "partySeq": 123,
//   "cost": 20000, // 입력한 총 금액
//   "users": [
//     {
//       "userSeq": 456,
//       "cost": 5000 // 실결제 금액
//     }
//   ]
// }
// 응답 Body
// {
//   "code": "string",
//   "message": "string"
// }
export const finalizeTaxiSettlementApi = async (params) => {
  try {
    const response = await request.post('/api/pay/final-taxi-party', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
