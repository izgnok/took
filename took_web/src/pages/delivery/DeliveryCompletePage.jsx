import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import deliveryIcon from '../../assets/delivery/delivery.png';
import {
  getDeliveryMembersApi,
  changePickUpStatusApi,
} from '../../apis/delivery';
import { useUser } from '../../store/user';
import BackButton from '../../components/common/BackButton';

function DeliveryCompletePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // id는 deliverySeq 값
  const { seq: currentUserSeq } = useUser();
  const [loading, setLoading] = useState(true);
  const [memberInfo, setMemberInfo] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const membersResponse = await getDeliveryMembersApi(id);
        console.log(membersResponse);
        const currentUserMemberInfo = membersResponse.find(
          (member) => member.userSeq === currentUserSeq
        );
        setMemberInfo(currentUserMemberInfo);
      } catch (error) {
        console.error('참가자 정보를 가져오는 중 오류가 발생했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberInfo();
  }, [id, currentUserSeq]);

  const handleConfirmClick = async () => {
    try {
      if (!memberInfo) {
        throw new Error('현재 사용자의 멤버 정보를 찾을 수 없습니다.');
      }
      console.log(
        'Changing pick-up status for deliveryGuestSeq:',
        memberInfo.deliveryGuestSeq
      );
      await changePickUpStatusApi(memberInfo.deliveryGuestSeq);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate(`/chat/list`); // roomSeq를 이용하여 채팅방으로 이동
      }, 1500);
    } catch (error) {
      console.error('수령 확인 중 오류가 발생했습니다:', error);
      alert('수령 확인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col items-center bg-white max-w-[360px] mx-auto relative h-screen">
      <BackButton />
      <div className="flex items-center px-4 mt-20 mb-14">
        <div className="mt-2.5 mb-1 flex-grow text-center text-4xl font-bold text-main">
          배달{' '}
          <span className="font-dela">
            took<span className="font-noto">!</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center flex-grow">
        <div className="text-2xl font-bold text-black mt-20">
          배달 물건(음식) <span className="font-normal text-2xl">을</span>
        </div>
        <div className="text-2xl font-bold text-black">
          수령<span className="font-normal text-2xl">하셨나요?</span>
        </div>
        <img src={deliveryIcon} alt="배달 아이콘" className="my-8 w-14 h-11" />
      </div>

      <button
        onClick={handleConfirmClick}
        className="py-3 px-10 bg-main text-white text-[1.1rem] font-bold rounded-xl mb-8 w-60"
      >
        수령 확인
      </button>

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white px-4 py-2 rounded-lg shadow-lg text-center">
            <div className="text-lg font-bold">수령 확인 완료</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeliveryCompletePage;
