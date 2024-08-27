import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';
import searchIcon from '../../assets/taxi/search.png';
import { useUser } from '../../store/user.js';
import { usePosition } from '../../store/position.js';
import { createChatApi } from '../../apis/chat/chat.js';
import {
  createTaxiPartyApi,
  addTaxiPartyMemberApi,
  calculateIndividualExpectedCostApi,
  isUserJoinedTaxiPartyApi,
} from '../../apis/taxi.js';
import SearchDropDown from '../../components/map/SearchDropDown.jsx';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const CreateChattingPage = () => {
  const [stompClient, setStompClient] = useState(null);
  const [destination, setDestination] = useState('');
  const [userCount, setUserCount] = useState(1);
  const [genderPreference, setGenderPreference] = useState('무관');
  const { seq: userSeq } = useUser();
  const { latitude, longitude } = usePosition();
  const [connected, setConnected] = useState(false);
  const [destinationLat, setDestinationLat] = useState(null);
  const [destinationLon, setDestinationLon] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setDestination(e.target.value);
  };

  useEffect(() => {
    const socket = new SockJS('https://i11e205.p.ssafy.io/ws');
    const stompClientInstance = Stomp.over(socket);
    stompClientInstance.connect({}, () => {
      console.log('WebSocket 연결 성공');
      setConnected(true);
    });
    setStompClient(stompClientInstance);

    return () => {
      if (stompClientInstance && stompClientInstance.connected) {
        stompClientInstance.disconnect(() => {
          console.log('WebSocket 연결 해제');
        });
      }
    };
  }, []);

  const enterRoom = ({ roomSeq, userSeq }) => {
    if (stompClient && connected) {
      stompClient.send(
        '/pub/room/enter',
        {},
        JSON.stringify({
          roomSeq,
          userSeq,
        })
      );
    } else {
      console.error('WebSocket 연결이 아직 준비되지 않았습니다.');
    }
  };

  const handleCreateChatRoom = async () => {
    try {
      // 1. 파티 참가 여부 확인
      const isJoined = await isUserJoinedTaxiPartyApi(userSeq);
      if (isJoined) {
        alert('이미 참여중입니다');
        navigate('/taxi/main');
        return;
      }

      // 2. 채팅방 생성
      const chatParams = {
        roomTitle: destination,
        userSeq,
        category: 2, // 택시 카테고리 : 2
      };
      const chatResponse = await createChatApi(chatParams);
      const { roomSeq } = chatResponse;

      // 3. 택시 파티 생성
      const genderValue = genderPreference === '동성';

      const taxiParams = {
        gender: genderValue,
        max: parseInt(userCount, 10),
        roomSeq,
        userSeq,
        lat: parseFloat(latitude),
        lon: parseFloat(longitude),
      };
      const taxiResponse = await createTaxiPartyApi(taxiParams);
      const { taxiSeq } = taxiResponse;

      // 4. 비용 계산
      const costParams = {
        startLat: latitude,
        startLon: longitude,
        endLat: parseFloat(destinationLat), // todo : 검색해온 값 넣기
        endLon: parseFloat(destinationLon), // todo : 검색해온 값 넣기
      };

      const costResponse = await calculateIndividualExpectedCostApi(costParams);
      const { cost } = costResponse;

      // 5. 방장 정보 추가
      const memberParams = {
        taxiSeq,
        userSeq,
        destiName: destination,
        destiLat: parseFloat(destinationLat), // todo : 검색해온 값 넣기
        destiLon: parseFloat(destinationLon), // todo : 검색해온 값 넣기
        cost,
        routeRank: 1,
      };
      await enterRoom({ roomSeq: chatResponse.roomSeq, userSeq });
      await addTaxiPartyMemberApi(memberParams);

      alert('채팅방과 택시 파티가 성공적으로 생성되었습니다.');

      // 생성한 채팅방으로 이동
      navigate(`/chat/taxi/${roomSeq}`, { state: { taxiSeq, roomSeq } });
    } catch (error) {
      console.error('Error creating chat room or taxi party:', error);
      alert('채팅방 또는 택시 파티 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col bg-white max-w-[360px] mx-auto relative h-screen">
      <div className="flex items-center px-4 py-3">
        <BackButton />
        <div className="mt-2.5 flex-grow text-center text-lg font-bold text-black">
          채팅방 생성
        </div>
      </div>

      <div className="mt-2 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 border-neutral-400 border-opacity-40 min-h-[0.5px]" />

      <div className="flex flex-col px-6 py-4 space-y-8">
        <SearchDropDown
          label="목적지 검색"
          name="destination"
          value={destination}
          onChange={handleChange}
          placeholder="목적지를 입력하세요"
          setLatitude={setDestinationLat}
          setLongitude={setDestinationLon}
        />
        <div>
          <label className="block text-base font-bold text-gray-700">
            모집 인원 설정
          </label>
          <select
            value={userCount}
            onChange={(e) => setUserCount(parseInt(e.target.value, 10))}
            className="h-12 mt-2 bg-neutral-100 w-full rounded border-r-8 border-transparent px-4 text-base shadow-md"
          >
            {[1, 2, 3].map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-base font-bold text-gray-700">
            모집 성별 선택
          </label>
          <select
            value={genderPreference}
            onChange={(e) => setGenderPreference(e.target.value)}
            className="h-12 mt-2 bg-neutral-100 w-full rounded border-r-8 border-transparent px-4 text-base shadow-md"
          >
            <option value="무관">무관</option>
            <option value="동성">동성</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleCreateChatRoom}
        className="mt-10 mx-20 py-3 px-4 bg-main text-white font-bold rounded-2xl shadow-md"
      >
        채팅방 생성
      </button>
    </div>
  );
};

export default CreateChattingPage;
