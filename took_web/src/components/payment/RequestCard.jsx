import React, { useState } from 'react';
import { sendReminderNotification } from '../../apis/alarm/sendAlarm';

function RequestCard({
  userName,
  onClose,
  member,
  sender,
  senderName,
  partySeq,
  category,
}) {
  const [requestSent, setRequestSent] = useState(false);

  const getCategoryTitle = (category) => {
    switch (category) {
      case 1:
        return '배달';
      case 2:
        return '택시';
      case 3:
        return '공구';
      case 4:
        return '정산';
      default:
        return '정산';
    }
  };

  const getBodyMessage = () => {
    if (category === 2) {
      return `${senderName}님에게 ${Math.abs(member.cost - member.real_cost)}원을 송금해주세요.`;
    } else if (category === 4) {
      return `${senderName}님에게 ${member.amount.toLocaleString()}원을 송금해주세요.`;
    }
    return '';
  };

  const getCost = () => {
    if (category === 2) {
      return member.real_cost - member.cost;
    } else if (category === 4) {
      return member.amount;
    }
    return 0;
  };

  const handleRequest = async () => {
    const params = {
      title: `${getCategoryTitle(category)} took 정산 요청이 왔어요!`,
      body: getBodyMessage(),
      sender: sender,
      userSeq: member.userSeq,
      partySeq: partySeq,
      category: category,
      url1: '/path/to/first/url', // 적절한 URL 경로 설정
      url2: '/path/to/second/url', // 적절한 URL 경로 설정
      preCost: member.cost,
      actualCost: member.real_cost,
      differenceCost: member.real_cost - member.cost,
      deliveryCost: 0, // 배달비가 있다면 설정
      orderCost: 0,
      cost: getCost(),
    };

    try {
      await sendReminderNotification(params);
      setRequestSent(true);
    } catch (error) {
      console.error('Error sending reminder notification:', error);
      alert('정산 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-xl max-w-[250px] w-full text-center">
        {!requestSent ? (
          <>
            <div className="mb-6 mt-4 text-sm">
              {userName}님께 <span className="font-dela">took</span> 정산 요청
              <br />
              알림 메세지를 전송할까요?
            </div>
            <div className="font-bold">
              <button
                onClick={onClose}
                className="bg-gray-200 text-gray-700 w-24 py-2 rounded-xl mr-4"
              >
                취소
              </button>
              <button
                onClick={handleRequest}
                className="bg-main text-white w-24 py-2 rounded-xl"
              >
                요청하기
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 mt-4 text-sm">요청이 완료되었습니다.</div>
            <div className="font-bold">
              <button
                onClick={onClose}
                className="bg-main text-white w-24 py-2 rounded-xl"
              >
                확인
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RequestCard;
