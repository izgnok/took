import { request } from '../request';
import { handleApiError } from '../errorHandling';

// 알람 리스트 가져오기
export const getAlarmListApi = async (userSeq) => {
  try {
    const response = await request.get(`/api/fcm/alarmList/${userSeq}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
