import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';
import HistoryCard from '../../components/mypage/tookHistory/historyCard'; // historyCard 컴포넌트를 임포트
import { useUser } from '../../store/user';
import { getMyPartyListApi } from '../../apis/payment/jungsan';

const categoryMap = {
  1: '배달',
  2: '택시',
  3: '공구',
  4: '정산',
};
function TookHistoryPage() {
  const [party, setParty] = useState([]);
  const { seq } = useUser();
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString('ko-KR', {
      month: 'numeric',
      day: 'numeric',
      weekday: 'short',
    });

    const formattedTime = date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    return `${formattedDate} ${formattedTime}`;
  };
  useEffect(() => {
    const fetchPartys = async () => {
      try {
        const response = await getMyPartyListApi(seq);
        if (response) {
          const partyList = response.map((party) => ({
            party_idx: party.partySeq,
            title: party.title,
            category: categoryMap[party.category] || '기타', // category 매핑
            totalCost: party.cost,
            status: party.status ? '정산완료' : '정산 진행 중', // status 매핑
            createdAt: formatDateTime(party.createdAt),
            count: party.cost,
            totalMembers: party.totalMember,
            receiveCost: party.receiveCost,
            deliveryTip: party.deliveryTip,
          }));
          setParty(partyList);
        }
      } catch (error) {
        console.error('계좌 정보를 불러오는데 실패했습니다:', error);
      }
    };
    fetchPartys();
  }, []);
  return (
    <div className="flex flex-col bg-white max-w-[360px] mx-auto relative h-screen">
      <div className="flex items-center px-4 py-3">
        <BackButton />
        <div className="mt-2.5 flex-grow text-center text-lg font-bold text-black">
          <span className="font-dela">took</span> 히스토리
        </div>
      </div>

      <div className="mt-2 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 border-neutral-400 border-opacity-40 min-h-[0.5px]" />

      <div className="flex flex-col mt-4 px-4">
        {party
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 날짜를 기준으로 최근 순 정렬
          .map((party) => (
            <Link to={`/tookDetails/${party.party_idx}`}>
              <HistoryCard key={party.party_idx} {...party} />
            </Link>
          ))}
      </div>
    </div>
  );
}

export default TookHistoryPage;
