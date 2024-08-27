import { request } from '../request';
import { handleApiError } from '../errorHandling';

// 독촉 알림 보내기
// 요청
// {
// 	"title": String, // 제목
// 	"body": String,  // 내용
// 	"sender": Long, // 보내는 사람
// 	"userSeq": Long, // 받는 사람
// 	"partySeq": Long, // 파티Seq
// 	"category": int, // 카테고리
// 	"url1": String, // 이동 경로1
// 	"url2": String, // 이동 경로 2
// 	"preCost": long, // 선결제 금액
// 	"actualCost": long, // 실결제 금액
// 	"differenceCost": long, // 차액
// 	"deliveryCost": long, // 배달비
// 	"orderCost": long, // 주문 금액
// 	"cost": long // 요청 금액
// }

export const sendReminderNotification = async (params) => {
  try {
    const response = await request.post('/api/fcm/remindSend', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
