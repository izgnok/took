import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';
import deliveryIcon from '../../assets/payment/deliveryTook.png'; // 배달 took 아이콘 경로
import isMeIcon from '../../assets/payment/isMe.png'; // 본인 아이콘 경로
import {
  getDeliveryMembersApi,
  changePickUpStatusApi,
} from '../../apis/delivery';
import { getUserInfoApi } from '../../apis/user';
import getProfileImagePath from '../../utils/getProfileImagePath';
import { useUser } from '../../store/user';

function DeliveryStatusPage() {
  const { id } = useParams(); // deliverySeq 값
  const { seq: currentUserSeq } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const membersResponse = await getDeliveryMembersApi(id);
        const userPromises = membersResponse.map(async (member) => {
          const userInfo = await getUserInfoApi({ userSeq: member.userSeq });
          return {
            name: userInfo.userName,
            icon: getProfileImagePath(userInfo.imageNo),
            status: member.pickUp ? '완료' : '미완료',
            isMe: member.userSeq === currentUserSeq,
            deliveryGuestSeq: member.deliveryGuestSeq,
          };
        });

        const usersData = await Promise.all(userPromises);
        setUsers(usersData);
      } catch (error) {
        console.error(
          '파티 참가자 정보를 가져오는 중 오류가 발생했습니다:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [id, currentUserSeq]);

  const handleConfirmClick = async (deliveryGuestSeq) => {
    try {
      await changePickUpStatusApi(deliveryGuestSeq);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.deliveryGuestSeq === deliveryGuestSeq
            ? { ...user, status: '완료' }
            : user
        )
      );
    } catch (error) {
      console.error('수령 확인 중 오류가 발생했습니다:', error);
      alert('수령 확인 중 오류가 발생했습니다.');
    }
  };

  const renderUserDetails = (user, index) => {
    const isCompleted = user.status === '완료';
    return (
      <div key={user.name} className="mb-4">
        <div className="flex items-center my-7">
          <img src={user.icon} alt={user.name} className="w-9 h-9 mr-4" />
          <div className="flex-grow flex justify-between items-center">
            <div className="flex items-center">
              <span>{user.name}</span>
              {user.isMe && (
                <img src={isMeIcon} alt="본인" className="ml-2 w-9.5 h-5" />
              )}
            </div>
            <div className="text-right">
              <button
                onClick={() =>
                  user.isMe &&
                  !isCompleted &&
                  handleConfirmClick(user.deliveryGuestSeq)
                }
                className={`py-2.5 w-24 rounded-full text-sm font-bold ${isCompleted ? 'bg-[#FF7F50] text-white' : 'bg-neutral-400 text-white'}`}
              >
                {isCompleted ? '확인 완료' : '미확인'}
              </button>
            </div>
          </div>
        </div>
        {index < users.length - 1 && (
          <div className="border-b border-dashed border-gray-300 my-2"></div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col bg-white max-w-[360px] mx-auto relative h-screen">
      <div className="flex items-center px-4 py-3">
        <BackButton />
        <div className="mt-2.5 flex-grow text-center text-lg font-bold text-black">
          배달 <span className="font-dela">took</span> 수령 현황
        </div>
      </div>

      <div className="mt-2 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 border-neutral-400 border-opacity-40 min-h-[0.5px]" />

      <div className="flex flex-col mt-4 px-4 font-bold">
        <div className="bg-[#FBFBFB] p-5 rounded-xl shadow-lg border border-inherit max-h-[550px] overflow-y-scroll">
          <div className="text-gray-500 mb-4 text-sm">
            {/* 날짜 정보 추가 필요 */}
          </div>
          <div className="flex items-center mb-4">
            <img src={deliveryIcon} alt="Took" className="w-14 h-14" />
            <div className="ml-4">
              <div className="text-base text-black">총 {users.length}명</div>
            </div>
          </div>

          {users.map((user, index) => renderUserDetails(user, index))}
        </div>
      </div>
    </div>
  );
}

export default DeliveryStatusPage;
