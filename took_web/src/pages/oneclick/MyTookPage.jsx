import React, { useEffect, useState } from 'react';
import BackButton from '../../components/common/BackButton';
import SendMoneyCard from '../../components/payment/SendMoneyCard';
import SlideCard from '../../components/payment/SlideCard';
import { useUser } from '../../store/user';
import { noPayList } from '../../apis/payment/jungsan';
import { useNavigate } from 'react-router-dom';
const groupByMonth = (items, dateKey) => {
  return items.reduce((acc, item) => {
    const month = new Date(item[dateKey]).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
    });
    if (!acc[month]) acc[month] = [];
    acc[month].push(item);
    return acc;
  }, {});
};

function MyTookPage() {
  const navigate = useNavigate();
  const [showSlide, setShowSlide] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [noPay, setNoPay] = useState([]);
  const { seq } = useUser();
  useEffect(() => {
    const fetchNoPay = async () => {
      try {
        const response = await noPayList(seq);
        if (response) {
          const noPayList = response.map((noPay) => ({
            partySeq: noPay.partySeq,
            userSeq: noPay.userSeq,
            userName: noPay.userName,
            imgNo: noPay.imageNo,
            cost: noPay.cost,
            category: noPay.category,
            createdAt: noPay.createdAt,
          }));
          setNoPay(noPayList);
        }
      } catch (error) {
        console.error('미정산 내역 정보를 불러오는데 실패했습니다:', error);
      }
    };
    fetchNoPay();
  }, []);
  const groupedMembers = groupByMonth(noPay, 'createdAt');

  const sendMoneyData = groupedMembers;
  const handleSendMoneyClick = (member) => {
    setSelectedMember(member);
    setShowSlide(true);
  };
  const handlePageChange = (path, state) => {
    navigate(path, { state });
  };
  return (
    <div className="flex flex-col bg-white max-w-[360px] mx-auto relative h-screen font-[Nanum Gothic]">
      <div className="flex items-center px-4 py-3">
        <BackButton />
        <div className="mt-2.5 flex-grow text-center text-lg font-bold text-black">
          나의 <span className="font-dela">took</span>
        </div>
      </div>
      <div className=" w-full border-0 border-solid bg-neutral-400 bg-opacity-40 border-neutral-400 border-opacity-40 min-h-[0.5px]" />
      <div className="mt-2 w-full min-h-[0.5px]" />

      <div className="flex flex-col mt-4 px-4">
        {Object.keys(sendMoneyData).map((month) => (
          <div key={month}>
            <div className="text-sm font-bold text-gray-700 mb-4">{month}</div>
            {sendMoneyData[month].map((member) => (
              <SendMoneyCard
                key={member.partySeq}
                {...member}
                onClick={() => handleSendMoneyClick(member)}
              />
            ))}
          </div>
        ))}
      </div>

      {showSlide && selectedMember && (
        <SlideCard
          member={selectedMember} onNavigate={handlePageChange}
          onClose={() => setShowSlide(false)}
        />
      )}
    </div>
  );
}

export default MyTookPage;
