import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';
import tookIcon from '../../assets/chat/tookIcon.png';
import { FaArrowDown } from 'react-icons/fa';
import { formatDate, formatDateOnly, formatTime } from '../../utils/formatDate';
import { getAlarmListApi } from '../../apis/alarm/alarm';
import { useUser } from '../../store/user';

// todo: 송금 완료 (참여자)
// 📌{정산/택시/배달/공구} took 송금이 완료되었어요.

// - 받는 사람 : 조현정
// - 일시 : 2024. 7.24 (수) 18:50

//  송금 내역을 확인해보세요.
// <button>송금내역 보기</button>

// todo: 정산 완료 (최종 정산!!) ⇒ 이건 양식 다 통일하면 될 듯(택시 차액 플러스인 경우 제외하고)
// 📌{정산/택시/배달/공구} took 정산이 완료되었어요.  (결제자)

// - 요청 일자 : 2024. 6. 24 (월) 18:50
// - 정산금액 : 42,200원
// - 요청인원 : 4명
// - 완료인원 : 4명

// 정산현황에서 송금 내역을 확인해보세요.
// <button>정산현황 보기</button>

/* 📌 {택시} took 정산이 완료되었어요.  (참여자/차액이 플러스인 경우)

- 요청 일자 : 2024. 6. 24 (월) 18:50
- 요청인원 : 3명
- 완료인원 : 3명
---
- 선결제 금액 : 13,800원
- 실결제 금액 : 14,500원
- **차액 : + 700원**

<button>상세보기</button> */

// todo: 수령 확인 완료 (배달/공구)
// 📌 {배달/공동구매} 수령 확인이 완료되었어요. (결제자)

// 총 주문 금액
// 42,200원
// ---
// - 요청 일자 : 2024. 6. 24 (월) 18:50
// - 요청인원 : 4명
// - 완료인원 : 4명

// 정산현황에서 송금 내역을 확인해보세요.
// <button>정산현황 보기</button>
// <button>수령현황 보기</button>

// todo: 주문 금액 다 모였을 때 (배달/공구)
// 📌 {배달/공구} 주문 금액이 다 모였어요.

// - 요청 일자 : 2024. 6. 24 (월) 18:50
// - 정산금액 : 42,200원
// - 요청인원 : 4명
// - 완료인원 : 4명

// 정산현황에서 송금 내역을 확인해보세요.
// ~~아니면.. 배달 주문을 시작하세요 머 이런 식으로~~
// <button>정산현황 보기</button>

const renderMessage = (item, handlePayment) => (
  <div key={item.chatTime} className="flex flex-row max-w-[340px] w-[340px]">
    <div className="flex space-x-2 mb-3 w-full">
      <img src={tookIcon} alt="took" className="w-9 h-9 mt-1" />
      <div className="w-full">
        <div className="font-dela text-sm mb-1 ml-1">took</div>
        <div className="flex flex-col bg-main rounded-xl shadow pt-2">
          <div className="flex items-center px-4 space-x-2">
            <div className="text-sm text-white font-bold rounded-b-lg">
              툭알림
            </div>
          </div>
          <div className="bg-white p-4 mt-2 pt-2 rounded-b-xl">
            <div className="text-black text-sm font-bold mb-2">
              {item.category === 'dutchpay'}
              {item.category === 'taxi'}
              {item.category === 'delivery'}
              {item.category === 'groupby'}
            </div>
            <div className="text-gray-800 text-sm space-y-1">
              <div>- 요청일자: {formatDate(item.requestDate)}</div>
              <div className="space-y-1">
                {item.category === 'dutchpay' && (
                  <>
                    <hr className="my-2 border-neutral-300 border-dashed" />
                    <strong>
                      - 요청 금액:{' '}
                      {item.amount ? item.amount.toLocaleString() : '0'}원
                    </strong>
                  </>
                )}
                {item.category === 'taxi' && (
                  <>
                    <hr className="my-2 border-neutral-300 border-dashed" />
                    <div>
                      - 선결제 금액:{' '}
                      {item.prePaymentAmount
                        ? item.prePaymentAmount.toLocaleString()
                        : '0'}
                      원
                    </div>
                    <div>
                      - 실결제 금액:{' '}
                      {item.actualPaymentAmount
                        ? item.actualPaymentAmount.toLocaleString()
                        : '0'}
                      원
                    </div>
                    <div className="font-bold">
                      - 차액:{' '}
                      {item.difference ? item.difference.toLocaleString() : '0'}
                      원
                    </div>
                  </>
                )}
                {(item.category === 'delivery' ||
                  item.category === 'groupby') && (
                  <>
                    <hr className="my-2 border-neutral-300 border-dashed" />
                    <div>
                      - 주문금액:{' '}
                      {item.orderAmount
                        ? item.orderAmount.toLocaleString()
                        : '0'}
                      원
                    </div>
                    <div>
                      - 배달팁:{' '}
                      {item.deliveryTip
                        ? item.deliveryTip.toLocaleString()
                        : '0'}
                      원
                    </div>
                    <div className="font-bold">
                      - 합계: {item.amount ? item.amount.toLocaleString() : '0'}
                      원
                    </div>
                  </>
                )}
              </div>
            </div>
            {item.status === false && (
              <button
                onClick={() => handlePayment(item.amount, item.sender, item.numCategory, item.partySeq)}
                className="mt-3 py-1.5 px-10 w-full bg-neutral-100 bg-opacity-80 text-neutral-800 text-sm font-bold rounded-xl mx-auto"
              >
                송금하기
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="text-[10px] text-gray-500 mt-auto whitespace-nowrap">
        {formatTime(item.chatTime)}
      </div>
    </div>
  </div>
);

function TookChattingPage() {
  const navigate = useNavigate();
  const lastDate = useRef(null);
  const chatEndRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const { seq } = useUser();
  const [tempData, setTempData] = useState([]);

  const handlePayment = (amount, userSeq, numCategory, partySeq) => {
    navigate('/payment', { state: { amount, userSeq, numCategory, partySeq } });
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 200
    ) {
      setShowScrollButton(false);
    } else {
      setShowScrollButton(true);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'auto' });
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [tempData]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAlarmListApi(seq);

        console.log('리스트 출력 ', response);
        const formattedData = response.map((alarm) => ({
          category:
            alarm.category === 4
              ? 'dutchpay'
              : alarm.category === 2
                ? 'taxi'
                : alarm.category === 1
                  ? 'delivery'
                  : 'groupby',
          requestDate: alarm.createAt,
          amount: alarm.cost,
          prePaymentAmount: alarm.preCost,
          actualPaymentAmount: alarm.actualCost,
          difference: alarm.differenceCost,
          deliveryTip: alarm.deliveryCost,
          orderAmount: alarm.cost - alarm.deliveryCost,
          chatTime: alarm.createAt,
          sender: alarm.sender,
          numCategory: alarm.category,
          partySeq: alarm.partySeq,
          status: alarm.status,
        }));
        console.log(formattedData);
        setTempData(formattedData);
      } catch (error) {
        console.error('데이터를 가져오는 중 에러 발생', error);
      }
    };

    fetchData();
  }, []);
  const sortedTempData = [...tempData]
    .sort((a, b) => new Date(b.chatTime) - new Date(a.chatTime))
    .reverse();
  return (
    <div className="flex flex-col bg-[#FFF7ED]  w-full h-full mx-auto relative">
      <div className="fixed w-full bg-[#FFF7ED] ">
        <div className="flex items-center px-4 py-3">
          <BackButton />
          <div className="mt-2 flex-grow text-center text-xl font-bold font-dela text-black">
            took
          </div>
        </div>
        <div className="mt-2 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 border-neutral-400 border-opacity-40 min-h-[0.5px]" />
      </div>
      <div className="h-12 mt-3"></div>
      <div className="flex flex-col items-start space-y-4 px-2 py-2 overflow-y-auto">
        {sortedTempData.length > 0 ? (
        sortedTempData.map((item, index) => {
          const showDate = lastDate.current !== formatDateOnly(item.chatTime);
          lastDate.current = formatDateOnly(item.chatTime);

          return (
            <div key={index}>
              {showDate && (
                <div className="w-1/2 text-center text-xs mx-auto py-1 bg-neutral-200 bg-opacity-70 rounded-full text-black mt-2 mb-5">
                  {formatDateOnly(item.chatTime)}
                </div>
              )}
              {renderMessage(item, handlePayment)}
            </div>
          );
        })
      ) : (
        <div className="flex justify-center items-center w-full h-full min-h-screen">
        </div>
      )}
        <div ref={chatEndRef} />
      </div>

      {showScrollButton && (
        <button
          className="fixed bottom-10 right-5 bg-main text-white rounded-full p-2 shadow-md transition-opacity duration-300"
          onClick={scrollToBottom}
        >
          <FaArrowDown />
        </button>
      )}
    </div>
  );
}

export default TookChattingPage;
