import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom'; // useNavigate 추가
import BackButton from '../../components/common/BackButton';
import CheckExpectedCost from '../../components/taxi/CheckExpectedCost';
import getProfileImagePath from '../../utils/getProfileImagePath';
import { usePosition } from '../../store/position';
import changeOrderIcon from '../../assets/taxi/changeOrder.png';
import { useUser } from '../../store/user.js';
import { getUserInfoApi } from '../../apis/user.js';
import {
  calculateTotalExpectedCostApi,
  updateTaxiPartyApi,
  setDestinationRankApi,
  getAllTaxiPartyMembersApi,
} from '../../apis/taxi';

function TaxiChattingSettingPage() {
  useParams();
  const {
    state: { taxiSeq, taxiParty },
  } = useLocation();
  const navigate = useNavigate(); // navigate 추가
  const [destinations, setDestinations] = useState([]);
  const [uniqueDestination, setUniqueDestination] = useState([]);
  const [paymentUser, setPaymentUser] = useState('');
  const [userCount, setUserCount] = useState(taxiParty.max - 1);
  const [genderPreference, setGenderPreference] = useState(
    taxiParty.gender === true ? '동성' : '무관'
  );
  const [currentUser, setCurrentUser] = useState(null);
  const [userInfos, setUserInfos] = useState({});
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [totalExpectedCost, setTotalExpectedCost] = useState(null);
  const { latitude, longitude } = usePosition();
  const { seq: currentUserSeq } = useUser();

  useEffect(() => {
    fetchData();
  }, [taxiSeq, currentUserSeq]);

  const fetchData = async () => {
    try {
      // 1. 모든 택시 파티 멤버 조회
      const members = await getAllTaxiPartyMembersApi(taxiSeq);
      console.log(members);
      // 1-1. routeRank로 정렬
      const sortedMembers = members.sort((a, b) => a.routeRank - b.routeRank);
      console.log(sortedMembers);
      // 위도와 경도가 같은 사용자를 필터링하여 한 명만 남김
      const uniqueDestinations = sortedMembers.filter((item, index, self) =>
        index === self.findIndex((t) => (
          t.destiLat === item.destiLat && t.destiLon === item.destiLon
        ))
      );
      setDestinations(sortedMembers);
      setUniqueDestination(uniqueDestinations);

      // 2. 현재 사용자 정보 가져오기
      const userInfo = await getUserInfoApi({ userSeq: currentUserSeq });
      setCurrentUser(userInfo);

      // 3. 각 멤버의 정보 가져오기 (프로필 이미지 및 이름)
      const userInfoMap = {};
      for (const member of members) {
        const info = await getUserInfoApi({ userSeq: member.userSeq });
        userInfoMap[member.userSeq] = info;
      }
      setUserInfos(userInfoMap);

      // 초기 결제자 설정
      if (members.length > 0) {
        setPaymentUser(taxiParty.master);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.parentNode);
    setDraggingIndex(index);
  };

  const onDragOver = (index) => {
    if (draggingIndex === index) return;

    const tempDestinations = [...destinations];
    const [draggedItem] = tempDestinations.splice(draggingIndex, 1);
    tempDestinations.splice(index, 0, draggedItem);

    setDraggingIndex(index);
    setDestinations(tempDestinations);
  };

  const onDragEnd = () => {
    // 드래그가 끝난 후 순서를 기준으로 routeRank 재설정
    const updatedDestinations = destinations.map((dest, index) => ({
      ...dest,
      routeRank: index + 1, // 1부터 시작하는 순서로 설정
    }));
    setDestinations(updatedDestinations);
    setDraggingIndex(null);
  };

  // 경로바꾸기
  const [firstTouch, setFirstTouch] = useState(null);
  const [secondTouch, setSecondTouch] = useState(null);
  const [firstCheck, setFirstCheck] = useState(false);
  const [secondCheck, setSecondCheck] = useState(false);

  useEffect(() => {
    if (firstTouch !== null && secondTouch !== null) {
      swapPositions(firstTouch, secondTouch);
      // 초기화
      setFirstCheck(false);
      setSecondCheck(false);
      setFirstTouch(null);
      setSecondTouch(null);
    }
  }, [firstTouch, secondTouch]); // firstTouch와 secondTouch가 모두 설정되면 위치를 교환

  const onTouchStart = (e, index) => {
    if (!firstCheck) {
      setFirstTouch(index); // 첫 번째 터치 저장
      setFirstCheck(true);
    } else if (!secondCheck) {
      setSecondTouch(index); // 두 번째 터치 저장
      setSecondCheck(true);
    }
  };
  
  // 두 요소의 위치를 교환하는 함수
const swapPositions = (index1, index2) => {
  const tempDestinations = [...uniqueDestination];
  const temp = tempDestinations[index1];
  tempDestinations[index1] = tempDestinations[index2];
  tempDestinations[index2] = temp;

  // setUniqueDestination으로 uniqueDestination 상태 업데이트
  setUniqueDestination(tempDestinations);

  // 원래 배열인 destinations에서 순서를 반영
  const updatedDestinations = [...destinations];
  // 변경된 uniqueDestination의 각 항목에 대해 원래 destinations 배열에서 순서 변경
  const userSeq1 = tempDestinations[index1].userSeq;
  const userSeq2 = tempDestinations[index2].userSeq;
  // userSeq1과 userSeq2에 해당하는 원래 배열의 인덱스를 찾음
  const originalIndex1 = updatedDestinations.findIndex((item) => item.userSeq === userSeq1);
  const originalIndex2 = updatedDestinations.findIndex((item) => item.userSeq === userSeq2);
  // 위치가 변경된 두 사용자의 routeRank를 서로 교환
  const tempRank = updatedDestinations[originalIndex1].routeRank;
  updatedDestinations[originalIndex1].routeRank = updatedDestinations[originalIndex2].routeRank;
  updatedDestinations[originalIndex2].routeRank = tempRank;

  // 같은 위도와 경도를 가진 다른 사용자들의 routeRank도 일치하도록 설정
  const { destiLat: lat1, destiLon: lon1, routeRank: rank1 } = updatedDestinations[originalIndex1];
  const { destiLat: lat2, destiLon: lon2, routeRank: rank2 } = updatedDestinations[originalIndex2];

  for (let i = 0; i < updatedDestinations.length; i++) {
    if (updatedDestinations[i].destiLat === lat1 && updatedDestinations[i].destiLon === lon1) {
      updatedDestinations[i].routeRank = rank1;
    } else if (updatedDestinations[i].destiLat === lat2 && updatedDestinations[i].destiLon === lon2) {
      updatedDestinations[i].routeRank = rank2;
    }
  }
  console.log(updatedDestinations)

  // setDestinations로 destinations 상태 업데이트
  setDestinations(updatedDestinations);
};

  const handleCheckExpectedCost = async () => {
    try {
      // destinations 배열을 routeRank 기준으로 정렬
    const sortedDestinations = [...destinations].sort((a, b) => a.routeRank - b.routeRank);

    const locations = [
      { lat: latitude, lon: longitude }, // 현재 위치를 첫 번째로 추가
      ...sortedDestinations.map((dest) => ({
        lat: dest.destiLat,
        lon: dest.destiLon,
      })),
    ];

    const users = sortedDestinations.map((dest) => ({
      userSeq: dest.userSeq,
      cost: dest.cost,
    }));

      const params = {
        locations,
        users,
      };
      console.log(params)
      const result = await calculateTotalExpectedCostApi(params);
      console.log('result: ', result);
      setTotalExpectedCost(result);
      setIsPopupOpen(true);
    } catch (error) {
      console.error('Error calculating expected cost:', error);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSaveSettings = async () => {
    const genderValue = genderPreference === '동성';

    const params = {
      taxiSeq,
      master: paymentUser,
      max: userCount,
      gender: genderValue,
    };

    try {
      // 1. 택시 파티 업데이트 API 호출
      console.log('Updating taxi party with params:', params); // API 호출 전 파라미터 확인
      const updateResponse = await updateTaxiPartyApi(params);
      console.log('Update response:', updateResponse); // API 응답 확인

      console.log('destinations :', destinations);
      const sortedDestinations = [...destinations].sort((a, b) => a.routeRank - b.routeRank);
      // 2. 목적지 순서 설정 API 호출
      for (let i = 0; i < sortedDestinations.length; i++) {
        const rankParams = {
          taxiSeq,
          destiName: sortedDestinations[i].destiName,
          routeRank: sortedDestinations[i].routeRank,
        };
        console.log('Rank params: ', rankParams); // API 호출 전 파라미터 확인
        const rankResponse = await setDestinationRankApi(rankParams);
      }
      console.log('All API calls successful, navigating...');
      // API 호출이 성공하면 채팅 페이지로 이동
      navigate(`/chat/taxi/${taxiParty.roomSeq}`, {
        state: {
          roomSeq: taxiParty.roomSeq,
          taxiSeq,
        },
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      // alert('설정 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {}
  };

  return (
    <div className="flex flex-col bg-white max-w-[360px] mx-auto relative h-screen">
      <div className="flex items-center px-4 py-3 relative">
        <BackButton />
        <div className="mt-2.5 flex-grow text-center text-lg font-bold text-black">
          채팅방 설정
        </div>
        <button
          onClick={handleSaveSettings}
          className="absolute right-4 mt-2.5 bg-main text-white py-1 px-3 rounded-lg text-sm font-bold"
        >
          저장
        </button>
      </div>

      <div className="mt-2 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 border-neutral-400 border-opacity-40 min-h-[0.5px]" />

      <div className="flex flex-col px-6 py-4 space-y-6">
        <div>
          <label className="block text-base font-bold text-gray-700 mb-2">
            경로 목록
          </label>
          <div className="mt-1 border border-neutral-100 rounded-xl bg-neutral-100 p-2 shadow-md">
            {uniqueDestination.map((item, index) => (
              <div key={index}>
                <div
                className={`flex items-center p-2 rounded-md cursor-pointer transition duration-200 relative ${
                  firstTouch === index || secondTouch === index
                    ? 'bg-neutral-300 opacity-50'
                    : 'bg-neutral-100'
                }`}
                onTouchStart={(e) => onTouchStart(e, index)}
              >
                  <div className="flex flex-col items-center w-16">
                    <img
                      src={getProfileImagePath(
                        userInfos[item.userSeq]?.imageNo || 1
                      )}
                      alt={`${userInfos[item.userSeq]?.userName || 'Unknown'} 프로필 사진`}
                      className="w-9 h-9 mb-1"
                    />
                    <span className="text-xs font-bold">
                      {userInfos[item.userSeq]?.userName || 'Unknown'}
                    </span>
                  </div>
                  <span className="text-sm text-black ml-2">
                    {item.destiName}
                  </span>
                  <img
                    src={changeOrderIcon}
                    alt="경로 순서 변경"
                    className="w-4 h-3.5 ml-auto"
                  />
                </div>
                {index < destinations.length - 1 && (
                  <div className="border-b border-dashed border-neutral-300 my-2"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleCheckExpectedCost}
          className="py-3 px-4 mx-auto bg-main text-white font-bold text-sm rounded-xl shadow-md"
        >
          예상비용 확인하기
        </button>

        <div className="mt-2 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 border-neutral-400 border-opacity-40 min-h-[0.5px]" />

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            결제자 설정
          </label>
          <select
            value={paymentUser}
            onChange={(e) => setPaymentUser(parseInt(e.target.value, 10))}
            className="h-12 mt-2 bg-neutral-100 w-full rounded border-r-8 border-transparent px-4 text-sm shadow-md"
          >
            {destinations.map((item) => (
              <option key={item.userSeq} value={item.userSeq}>
                {userInfos[item.userSeq]?.userName || 'Unknown'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">
            모집 인원 설정
          </label>
          <select
            value={userCount}
            onChange={(e) => setUserCount(parseInt(e.target.value, 10))}
            className="h-12 mt-2 bg-neutral-100 w-full rounded border-r-8 border-transparent px-4 text-sm shadow-md"
          >
            {[1, 2, 3].map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">
            모집 성별 선택
          </label>
          <select
            value={genderPreference}
            onChange={(e) => setGenderPreference(e.target.value)}
            className="h-12 mt-2 bg-neutral-100 w-full rounded border-r-8 border-transparent px-4 text-sm shadow-md"
          >
            <option value="무관">무관</option>
            <option value="동성">동성</option>
          </select>
        </div>
      </div>

      <CheckExpectedCost
        isOpen={isPopupOpen}
        onClose={closePopup}
        destinations={destinations}
        currentUser={currentUser}
        totalExpectedCost={totalExpectedCost} // 총 예상 비용 전달
      />
    </div>
  );
}

export default TaxiChattingSettingPage;
