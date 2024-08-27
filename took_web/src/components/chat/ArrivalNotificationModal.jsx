import React, { useEffect, useRef } from 'react';
import getProfileImagePath from '../../utils/getProfileImagePath';
import { MdAdd } from 'react-icons/md';
import { pickUpCheckApi, getAllPickUpApi } from '../../apis/groupBuy/shop.js';
import { useUser } from '../../store/user.js';
import { useNavigate } from 'react-router-dom';

const ArrivalNotificationModal = ({ members, onClose, shopSeq }) => {
  const modalRef = useRef(null);
  const { seq: currentUserSeq } = useUser();
  const navigate = useNavigate();

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  const handlePickUpCheck = async () => {
    try {
      await pickUpCheckApi(shopSeq, currentUserSeq);
      alert('수령 상태가 업데이트되었습니다.');
      
      const allPickedUp = await getAllPickUpApi(shopSeq);
      if (allPickedUp) {
        alert('모든 멤버가 수령을 완료했습니다.');
        navigate('/chat/list')
      } else {
        alert('아직 수령을 완료하지 않은 멤버가 있습니다.');
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating pick up status:', error);
      alert('수령 상태 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-50">
      <div
        ref={modalRef}
        className="bg-main w-full max-w-md h-1/2 rounded-t-3xl p-6 shadow-lg"
      >
        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="text-white focus:outline-none ml-auto"
          >
            <MdAdd className="rotate-45 w-6 h-6" />
          </button>
        </div>
        <h2 className="text-white text-lg font-bold text-center mt-4">물품을 수령하셨나요?</h2>
        <div className="flex justify-center mt-4 space-x-2">
          {members.map((member) => (
            <img
              key={member.user_seq}
              src={getProfileImagePath(member.imageNo)}
              alt={member.userName}
              className="w-12 h-12 animate-shake mt-4"
            />
          ))}
        </div>
        <p className="text-white text-center mt-6">
          수령을 완료하셨다면<br />아래의 버튼을 눌러주세요
        </p>
        <button
          className="w-full bg-white text-main font-semibold py-2 rounded-lg mt-6"
          onClick={handlePickUpCheck}
        >
          수령 완료
        </button>
      </div>
    </div>
  );
};

export default ArrivalNotificationModal;
