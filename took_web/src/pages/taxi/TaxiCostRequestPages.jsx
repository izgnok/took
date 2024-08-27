import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import BackButton from '../../components/common/BackButton';
import taxiIcon from '../../assets/payment/taxiTook.png';
import complete from '../../assets/payment/complete.png';
import incomplete from '../../assets/payment/incomplete.png';
import getProfileImagePath from '../../utils/getProfileImagePath';
import { formatNumber } from '../../utils/format';
import { formatDate } from '../../utils/formatDate';
import RequestCard from '../../components/payment/RequestCard';
import { useUser } from '../../store/user';
import { getUserInfoApi } from '../../apis/user';

// 임시 데이터
const tempTaxi = {
  taxi_seq: 1,
  room_seq: 1,
  user_seq: 1,
  party_seq: 1,
  start_lat: null,
  start_lng: null,
  gender: true,
  count: 3,
  max: 4,
  status: true,
  created_at: '2024-07-06T00:23:00',
  finish_time: '2024-07-06T01:23:00',
  cost: 34000,
  master: '방장',
};

const tempMember = [
  {
    member_seq: 1,
    party_seq: 1,
    user_seq: 1,
    userName: '조현정',
    imgNo: 19,
    cost: 11500,
    real_cost: 12000,
    status: true,
    receive: false,
    is_leader: true,
    created_at: '2024-07-06T00:23:00',
  },
  {
    member_seq: 2,
    party_seq: 1,
    user_seq: 2,
    userName: '정희수',
    imgNo: 23,
    cost: 7300,
    real_cost: 7500,
    status: false,
    receive: false,
    is_leader: false,
    created_at: '2024-07-06T00:23:00',
  },
  {
    member_seq: 3,
    party_seq: 1,
    user_seq: 3,
    userName: '차민주',
    imgNo: 18,
    cost: 13800,
    real_cost: 14500,
    status: true,
    receive: false,
    is_leader: false,
    created_at: '2024-07-06T00:23:00',
  },
];

const tempParty = {
  party_seq: 1,
  title: '택시',
  category: 'taxi',
  cost: 34000,
  created_at: '2024-07-06T00:23:00',
  count: 3,
  total_member: 3,
};

const tempTaxiGuest = [
  {
    guest_seq: 1,
    taxi_seq: 1,
    user_seq: 1,
    cost: 12000,
    dsti_name: '목적지1',
    dsti_lat: null,
    dsti_lng: null,
    route_rank: 1,
  },
  {
    guest_seq: 2,
    taxi_seq: 1,
    user_seq: 2,
    cost: 7500,
    dsti_name: '목적지2',
    dsti_lat: null,
    dsti_lng: null,
    route_rank: 2,
  },
  {
    guest_seq: 3,
    taxi_seq: 1,
    user_seq: 3,
    cost: 14500,
    dsti_name: '목적지3',
    dsti_lat: null,
    dsti_lng: null,
    route_rank: 3,
  },
];

function TaxiCostRequestPages() {
  const navigate = useNavigate();
  const [popupUserName, setPopupUserName] = useState(null);
  const [popupMember, setPopupMember] = useState(null);
  const { seq: sender } = useUser();
  const [senderName, setSenderName] = useState('');

  useEffect(() => {
    const fetchSenderName = async () => {
      try {
        const response = await getUserInfoApi({ userSeq: sender });
        setSenderName(response.userName);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchSenderName();
  }, [sender]);

  const allMembersCompleted = tempMember.every((member) => member.status);

  return (
    <div className="flex flex-col bg-white max-w-[360px] mx-auto relative h-screen font-[Nanum_Gothic]">
      <div className="flex items-center px-4 py-3">
        <BackButton />
        <div className="mt-2.5 flex-grow text-center text-lg font-bold text-black">
          <span className="font-dela">took</span> 상세내역
        </div>
      </div>

      <div className="mt-2 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 min-h-[0.5px]" />

      <div className="flex flex-col mt-4 px-4 font-[Nanum_Gothic] max-h-[calc(100%-160px)] relative">
        <div className="p-5 rounded-xl shadow-lg border border-inherit h-full overflow-y-scroll pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-500 text-sm">
              {formatDate(tempTaxi.created_at)}
            </div>
          </div>
          <div className="flex items-center mb-6">
            <img src={taxiIcon} alt="Took" className="w-14 h-14" />
            <div className="ml-4 font-bold relative flex-grow">
              <div className="text-sm text-black mb-1">
                총 {tempTaxi.count}명
              </div>
              <div className="text-lg flex items-center">
                {formatNumber(tempTaxi.cost)} 원
              </div>
            </div>
            <img
              src={allMembersCompleted ? complete : incomplete}
              alt="status"
              className="w-18 h-16"
            />
          </div>

          {tempMember.map((member, index) => {
            const balance = member.cost - member.real_cost;
            const formattedBalance = balance > 0 ? `+${formatNumber(balance)}` : formatNumber(balance);
            const status = balance >= 0 ? true : member.status;

            return (
              <div
                key={member.member_seq}
                className={`mb-4 ${index === tempMember.length - 1 ? '' : 'border-b border-gray-300'}`}
              >
                <div className="flex items-center mb-3 justify-between">
                  <div className="flex items-center">
                    <img
                      src={getProfileImagePath(member.imgNo)}
                      alt={member.userName}
                      className="w-9 h-9 mr-4"
                    />
                    <div className="font-bold flex items-center">
                      <span>{member.userName}</span>
                      {member.is_leader && (
                        <span className="ml-2 bg-gray-300 text-white text-xs rounded-full px-2 py-0.5">
                          본인
                        </span>
                      )}
                      {!member.is_leader && !status && (
                        <FaBell
                          className="ml-2 text-yellow-400 cursor-pointer"
                          onClick={() => {
                            setPopupUserName(member.userName);
                            setPopupMember(member);
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="text-right font-bold">
                    <div className={`text-sm ${balance > 0 ? 'text-green-500' : 'text-red-600'}`}>{formattedBalance}</div>
                    <div className={`text-sm ${status ? 'text-black' : 'text-red-600'}`}>
                      {status ? '완료' : '미완료'}
                    </div>
                  </div>
                </div>
                <div className="flex text-sm justify-between mt-2 ml-1">
                  선결제금액 <span className="ml-2 text-black">{formatNumber(member.cost)} 원</span>
                </div>
                <div className="flex text-sm justify-between mt-2 ml-1 mb-4">
                  실결제금액 <span className="ml-2 text-black">{formatNumber(member.real_cost)} 원</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {popupUserName && popupMember && (
        <RequestCard
          userName={popupUserName}
          onClose={() => setPopupUserName(null)}
          member={popupMember}
          sender={sender}
          senderName={senderName}
          partySeq={tempParty.party_seq}
          category={2} // 카테고리 값 설정 (1(배달), 2(택시), 3(공구), 4(정산))
        />
      )}
    </div>
  );
}

export default TaxiCostRequestPages;
