import { React, useEffect, useState } from 'react';
import BackButton from '../../components/common/BackButton';
import getProfileImagePath from '../../utils/getProfileImagePath';
import { useLocation, useNavigate } from 'react-router-dom';
import { makePartyApi } from '../../apis/payment/jungsan';
import { useUser } from '../../store/user';
import { insertAllMemberApi } from '../../apis/payment/jungsan';

function PaymentTotalPage() {
  const { seq: userSeq } = useUser();
  const [partySeq, setPartySeq] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const paymentsLocation = location.state?.payments || [];
  const [showModal, setShowModal] = useState(false); // 모달 창 상태 추가

  const temp_data = paymentsLocation;

  const calculateUserCosts = (temp_data) => {
    const userCostsMap = {};

    Object.values(temp_data).forEach((location) => {
      Object.values(location.users).forEach((user) => {
        const amount = parseFloat(user.amount.replace(/,/g, '')) || 0;
        if (userCostsMap[user.userSeq]) {
          userCostsMap[user.userSeq] += amount;
        } else {
          userCostsMap[user.userSeq] = amount;
        }
      });
    });

    const userCosts = Object.entries(userCostsMap).map(([userSeq, cost]) => ({
      userSeq: Number(userSeq),
      cost,
    }));

    return userCosts;
  };

  useEffect(() => {
    createParty();
  }, []);

  const createParty = async () => {
    try {
      const response = await makePartyApi({
        userSeq: userSeq,
        title: 'Took 정산',
        category: 4,
      });
      if (response && response.partySeq) {
        setPartySeq(response.partySeq);
      }
    } catch (error) {
      console.error('API 호출 에러:', error);
    }
  };

  const insertAllMemberApiRequest = async () => {
    const userCosts = calculateUserCosts(temp_data);
    const params = {
      partySeq: partySeq,
      userCosts,
    };

    try {
      const response = await insertAllMemberApi(params);
      if (response) {
        // 요청 완료 후 모달 창을 표시
        setShowModal(true);
      }
    } catch (error) {
      console.error('API 호출 에러:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/'); // 모달 닫힘과 동시에 홈으로 이동
  };

  const totalSum = Object.values(temp_data).reduce(
    (sum, phase) => sum + parseFloat(phase.totalAmount.replace(/,/g, '')),
    0
  );

  return (
    <div className="flex flex-col items-center px-14 py-10 bg-white max-w-[600px] mx-auto">
      <div className="self-start mb-4">
        <BackButton />
      </div>
      <div className="text-4xl text-main">
        <span className="text-3xl font-bold text-main">정산 </span>
        <span className="text-main font-dela">took !</span>
      </div>
      <div className="mt-4 text-sm text-main">정산 정보를 확인해주세요</div>
      <div className="flex gap-5 self-stretch justify-center mt-16 opacity-80">
        {Object.keys(temp_data).map((phaseKey) => {
          const { users, totalAmount } = temp_data[phaseKey];

          return (
            <div key={phaseKey} className="flex flex-col items-center">
              <div className="self-center text-xs font-bold text-main">
                [{phaseKey}차]
              </div>
              <div
                className="flex animate-semijump flex-wrap items-center justify-center gap-2 mt-3 relative"
                style={{ width: '60px', height: '60px' }}
              >
                {users.map((user, index) => (
                  <img
                    key={user.userSeq}
                    loading="lazy"
                    src={getProfileImagePath(user.img_no)}
                    className="w-6 h-6 absolute"
                    alt={`User ${user.userSeq}`}
                    style={{
                      transform: `translate(${Math.sin(((2 * Math.PI) / users.length) * index) * 15}px, ${Math.cos(((2 * Math.PI) / users.length) * index) * 15}px)`,
                      zIndex: users.length - index,
                    }}
                  />
                ))}
              </div>
              <div className="mt-2 text-sm font-extrabold text-main">
                {totalAmount.toLocaleString()}원
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-16 text-4xl font-extrabold text-main">
        {totalSum.toLocaleString()}원
      </div>

      <div
        className="px-16 py-2 mt-10 max-w-full text-base font-extrabold text-white whitespace-nowrap bg-main rounded-full shadow-sm w-[197px]"
        onClick={insertAllMemberApiRequest}
      >
        요청하기
      </div>

      {/* 모달 창 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 text-center">
            <h2 className="text-lg font-bold mb-4">요청이 완료되었습니다!</h2>
            <button
              onClick={handleCloseModal}
              className="bg-gray-300 text-white px-6 py-2 rounded-xl"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentTotalPage;
