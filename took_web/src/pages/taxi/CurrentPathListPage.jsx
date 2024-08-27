import React, { useState, useEffect } from 'react';
import BackButton from '../../components/common/BackButton';
import CheckExpectedCost from '../../components/taxi/CheckExpectedCost';
import getProfileImagePath from '../../utils/getProfileImagePath';
import { getUserInfoApi } from '../../apis/user.js';
import {
  calculateTotalExpectedCostApi,
  getAllTaxiPartyMembersApi,
} from '../../apis/taxi';
import { useLocation } from 'react-router-dom';
import { usePosition } from '../../store/position';
import { useUser } from '../../store/user';

function CurrentPathListPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [totalExpectedCost, setTotalExpectedCost] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const { latitude, longitude } = usePosition();
  const location = useLocation();
  const { taxiParty } = location.state || {};
  const { seq: currentUserSeq } = useUser();
  const [currentUser, setCurrentUser] = useState(null);
  const [userInfos, setUserInfos] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 모든 택시 파티 멤버 조회
        const members = await getAllTaxiPartyMembersApi(taxiParty.taxiSeq);

        // routeRank로 정렬
        const sortedMembers = members.sort((a, b) => a.routeRank - b.routeRank);
        setDestinations(sortedMembers);

        // 현재 사용자 정보 가져오기
        const userInfo = await getUserInfoApi({ userSeq: currentUserSeq });
        setCurrentUser(userInfo);

        // 각 멤버의 정보 가져오기 (프로필 이미지 및 이름)
        const userInfoMap = {};
        for (const member of members) {
          const info = await getUserInfoApi({ userSeq: member.userSeq });
          userInfoMap[member.userSeq] = info;
        }
        setUserInfos(userInfoMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [taxiParty.taxiSeq, currentUserSeq]);

  const handleCheckExpectedCost = async () => {
    try {
      const locations = [
        { lat: latitude, lon: longitude }, // 현재 위치를 첫번째로 추가
        ...destinations.map((dest) => ({
          lat: dest.destiLat,
          lon: dest.destiLon,
        })),
      ];

      const users = destinations.map((dest) => ({
        userSeq: dest.userSeq,
        cost: dest.cost,
      }));

      const params = {
        locations,
        users,
      };

      const result = await calculateTotalExpectedCostApi(params);
      setTotalExpectedCost(result);
      setIsPopupOpen(true);
    } catch (error) {
      console.error('Error calculating expected cost:', error);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="flex flex-col bg-white max-w-[360px] mx-auto relative h-screen">
      <div className="flex items-center px-4 py-3">
        <BackButton />
        <div className="mt-2.5 flex-grow text-center text-lg font-bold text-black">
          현재 경로 목록
        </div>
      </div>

      <div className="mt-2 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 border-neutral-400 border-opacity-40 min-h-[0.5px]" />

      <div className="flex flex-col px-8 py-4 space-y-6">
        {destinations.map((item, index) => (
          <div key={item.userSeq}>
            <div className="flex items-center mb-2">
              <div className="text-2xl font-bold mr-4">{index + 1}</div>
              <div className="flex flex-col items-center w-16 mr-2">
                <img
                  src={getProfileImagePath(userInfos[item.userSeq]?.imageNo || 1)}
                  alt={`${userInfos[item.userSeq]?.userName || 'Unknown'} 프로필 사진`}
                  className="w-10 h-10 mb-1"
                />
                <span className="text-sm font-bold">{userInfos[item.userSeq]?.userName || 'Unknown'}</span>
              </div>
              <span className="text-sm text-black ml-2">{item.destiName}</span>
            </div>
            {index < destinations.length - 1 && (
              <div className="border-b border-dashed border-neutral-300 mt-4"></div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleCheckExpectedCost}
        className="py-3 px-4 mt-4 mx-auto bg-main text-white font-bold text-sm rounded-xl shadow-md"
      >
        예상비용 확인하기
      </button>

      <CheckExpectedCost
        isOpen={isPopupOpen}
        onClose={closePopup}
        destinations={destinations}
        currentUser={currentUser}
        totalExpectedCost={totalExpectedCost}
      />
    </div>
  );
}

export default CurrentPathListPage;
