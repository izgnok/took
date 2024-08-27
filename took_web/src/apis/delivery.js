import { request } from './request';
import { handleApiError } from './errorHandling';

/*{
    "userSeq": "long", // 사용자 번호
    "roomSeq": "long", // 방 번호
    "storeName": "string", // 가게 이름
    "pickupPlace": "string", // 픽업 장소
    "pickupLat": "double", // 픽업 장소 위도
    "pickupLon": "double", // 픽업 장소 경도
    "deliveryTip": "string", // 배달 팁
    "deliveryTime": "localdatetime" // 배달 주문 시간 (ex: "2021-01-01T00:00") 
    "content": "string" // 내용
}*/
// 배달 글 작성
// 응답
/*{
    "deliverySeq": "long", // 배달 번호
    "userSeq": "long", // 사용자 번호
    "roomSeq": "long", // 방 번호
    "storeName": "string", // 가게 이름
    "pickupPlace": "string", // 픽업 장소
    "pickupLat": "double", // 픽업 장소 위도
    "pickupLon": "double", // 픽업 장소 경도
    "deliveryTip": "string", // 배달 팁
    "deliveryTime": "string", // 배달 주문 시간
    "content": "string", // 내용
    "count": "int", // 참가 인원 수
    "status": "string", // 상태 (OPEN, DELIVERY, DONE)
    "createdAt": "string", // 생성 시간
    "finishTime": "string" // 완료 시간
} */

export const writeDeliveryApi = async (params) => {
  try {
    const response = await request.post('/api/delivery/create', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// {
// 	"deliverySeq": "long" // 배달 파티 번호
// 	"partySeq": "long" // 정산 번호
// }
// 배달 - 정산 연결
export const connectDeliveryToPay = async (params) => {
  try {
    const response = await request.put('/api/delivery/setParty', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/* {
    "deliverySeq": "long", // 배달 번호
    "storeName": "string", // 가게 이름
    "pickupPlace": "string", // 픽업 장소
    "pickupLat": "double", // 픽업 장소 위도
    "pickupLon": "double", // 픽업 장소 경도
    "deliveryTip": "string", // 배달 팁
    "content": "string", // 내용
    "deliveryTime": "localdatetime" // 배달 시간
} */
// 배달 글 수정
export const modifyDeliveryApi = async (params) => {
  try {
    const response = await request.put('/api/delivery/modify', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 배달 글 삭제
// 요청, 응답 바디 없음
export const deleteDeliveryApi = async (deliverySeq) => {
  try {
    const response = await request.delete(
      `/api/delivery/delete/${deliverySeq}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/* {
	"deliverySeq": "long", // 배달 글 번호
	"notice": "string" // 공지사항
} */
// 배달 채팅방에 공지사항 등록
export const writeNoticeApi = async (params) => {
  try {
    const response = await request.put(`/api/delivery/notice/create`, params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
/* {
	"deliverySeq": "long", // 배달 글 번호
	"notice": "string" // 공지사항
} */
// 배달 채팅방 공지사항 수정
export const modifyNoticeApi = async (params) => {
  try {
    const response = await request.put(`/api/delivery/notice/modify`, params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 공지사항 삭제
export const deleteNoticeApi = async (deliverySeq) => {
  try {
    const response = await request.delete(
      `/api/delivery/notice/delete/${deliverySeq}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 배달 글 상세 조회
// 응답
/* {
    "deliverySeq": "long", // 배달 번호
    "userSeq": "long", // 사용자 번호
    "roomSeq": "long", // 방 번호
    "partySeq": "long", // 파티 번호
    "storeName": "string", // 가게 이름
    "pickupPlace": "string", // 픽업 장소
    "pickupLat": "double", // 픽업 장소 위도
    "pickupLon": "double", // 픽업 장소 경도
    "deliveryTip": "string", // 배달 팁
    "content": "string", // 내용
    "notice": "string", // 공지사항
    "deliveryTime": "string", // 배달 시간
    "status": "string", // 상태  (OPEN, DELIVERY, DONE)
    "count": "int", // 참가 인원 수
    "createdAt": "LocalDateTime", // 생성 시간
    "finishTime": "LocalDateTime" // 완료 시간
} */
export const getDeliveryDetailApi = async (deliverySeq) => {
  try {
    const response = await request.get(`/api/delivery/${deliverySeq}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/* {
	"lat": "double" // 위도
	"lon": "dobule" // 경도
} */
// 배달 글 목록 조회 (배달 위치 / 현재 위치 근처의 수령지)
/* [
	{
	    "deliverySeq": "long", // 배달 번호
	    "userSeq": "long", // 사용자 번호
	    "roomSeq": "long", // 방 번호
	    "partySeq": "long", // 파티 번호
	    "storeName": "string", // 가게 이름
	    "pickupPlace": "string", // 픽업 장소
	    "pickupLat": "double", // 픽업 장소 위도
	    "pickupLon": "double", // 픽업 장소 경도
	    "deliveryTip": "string", // 배달 팁
	    "content": "string", // 내용
	    "notice": "string", // 공지사항
	    "deliveryTime": "string", // 배달 시간
	    "status": "string", // 상태  (OPEN, DELIVERY, DONE)
	    "count": "int", // 참가 인원 수
	    "createdAt": "LocalDateTime", // 생성 시간
	    "finishTime": "LocalDateTime" // 완료 시간
	}
	...
] */
export const getDeliveryListApi = async (params) => {
  try {
    const response = await request.post('/api/delivery/list', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/* {
	"deliverySeq": "long" // 배달 글 번호 
	"status": "string" // 상태 (OPEN, DELIVERY, DONE)
} */
// 배달 상태 변경
export const changeDeliveryStatusApi = async (params) => {
  try {
    const response = await request.put('/api/delivery/setStatus', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/* {
	"deliverySeq": "long", // 배달 글 번호
	"userSeq": "long" // 사용자 번호
} */
// 배달 파티 참가
export const joinDeliveryApi = async (params) => {
  try {
    const response = await request.post('/api/delivery/join', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/* {
	"deliverySeq": "long" // 배달 글 번호
	"deliveryGuestSeq": "long" // 배달 게스트 참가 번호
} */
// 배달 파티 퇴장
export const leaveDeliveryApi = async (params) => {
  try {
    const response = await request.post('/api/delivery/leave', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 배달 파티 참가자 리스트
// 응답
/* [
	{
	    "deliveryGuestSeq": "long", // 배달 게스트 번호
	    "deliverySeq": "long", // 배달 번호
	    "userSeq": "long", // 사용자 번호
	    "pickUp": "boolean" // 픽업 여부
	}
	...
] */
export const getDeliveryMembersApi = async (deliverySeq) => {
  try {
    const response = await request.get(
      `/api/delivery/guest/list/${deliverySeq}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 배달 파티 참가자 조회
// 응답
/* {
    "deliveryGuestSeq": "long", // 배달 게스트 번호
    "deliverySeq": "long", // 배달 번호
    "userSeq": "long", // 사용자 번호
    "pickUp": "boolean" // 픽업 여부
} */
export const getDeliveryMemberApi = async (deliveryGuestSeq) => {
  try {
    const response = await request.get(
      `/api/delivery/guest/${deliveryGuestSeq}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 배달 픽업 여부 변경
export const changePickUpStatusApi = async (deliveryGuestSeq) => {
  try {
    const response = await request.get(
      `/api/delivery/guest/setPickUp/${deliveryGuestSeq}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 참가 중인 배달 글 목록
// 응답
/* [
	{
	    "deliverySeq": "long", // 배달 번호
	    "userSeq": "long", // 사용자 번호
	    "roomSeq": "long", // 방 번호
	    "partySeq": "long", // 파티 번호
	    "storeName": "string", // 가게 이름
	    "pickupPlace": "string", // 픽업 장소
	    "deliveryTip": "string", // 배달 팁
	    "content": "string", // 내용
	    "notice": "string", // 공지사항
	    "deliveryTime": "string", // 배달 시간
	    "status": "string", // 상태 (OPEN, DELIVERY, DONE)
	    "count": "int", // 참가 인원 수
	    "createdAt": "LocalDateTime", // 생성 시간
	    "finishTime": "LocalDateTime" // 완료 시간
	}
	...
] */

export const getMyDeliveries = async (userSeq) => {
  try {
    const response = await request.get(`/api/delivery/list/${userSeq}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 해당 파티 참가 여부 확인
// 요청
/* {
	"deliverySeq": "long", // 배달 글 번호
	"userSeq": "long" // 사용자 번호
} */
// 응답 - 참가 중이라면 true else false
export const isJoiningParty = async (params) => {
  try {
    const response = await request.post(`/api/delivery/guest/isJoin`, params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
