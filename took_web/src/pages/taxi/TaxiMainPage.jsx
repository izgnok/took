import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import backIcon from '../../assets/delivery/whiteBack.svg';
import plusIcon from '../../assets/taxi/plus.png';
import enterIcon from '../../assets/taxi/enter.png';
import notEnterIcon from '../../assets/taxi/notEnter.png';
import locationIcon from '../../assets/taxi/location.png';
import getProfileImagePath from '../../utils/getProfileImagePath';
import { useUser } from '../../store/user.js';
import { usePosition } from '../../store/position.js';
import { getNearByUserPositionApi } from '../../apis/position/userPosition.js';
import {
  getTaxiPartyListApi,
  getTaxiPartyPathApi,
  addTaxiPartyMemberApi,
  isUserJoinedTaxiPartyApi,
  getAllTaxiPartyMembersApi,
} from '../../apis/taxi.js';
import { getUserInfoApi } from '../../apis/user.js';
import { getAddr } from '../../utils/map.js';
import Modal from '../../components/common/titleMessageCommonModal.jsx';

const BackButton = () => {
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate('/');
  };
  return (
    <img
      src={backIcon}
      alt="뒤로"
      className="w-6 h-6 mx-6 mt-1.5 absolute top-0 left-0"
      onClick={handleBackClick}
    />
  );
};

function TaxiMainPage() {
  const navigate = useNavigate();
  const user = useUser();
  const { seq: userSeq } = user;
  const { latitude, longitude } = usePosition();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [location, setLocation] = useState('');
  const [taxiParties, setTaxiParties] = useState([]);
  const [userGender, setUserGender] = useState('');

  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);

  const fetchLocation = async () => {
    if (latitude && longitude) {
      try {
        const addr = await getAddr(latitude, longitude);
        setLocation(addr);
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    }
  };

  const fetchUserGender = async () => {
    try {
      const userInfo = await getUserInfoApi({ userSeq });
      setUserGender(userInfo.gender);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchTaxiParties = async () => {
    try {
      const nearbyUsers = await getNearByUserPositionApi({
        userSeq,
        lat: latitude,
        lon: longitude,
      });
      const userSeqs = nearbyUsers.map((user) => user.userSeq);
      userSeqs.push(userSeq);

      const listParams = {
        lat: parseFloat(latitude),
        lon: parseFloat(longitude),
      };
      console.log('현재 lat:', parseFloat(latitude));
      console.log('현재 lon:', parseFloat(longitude));

      const taxiPartyList = await getTaxiPartyListApi(listParams);

      const taxiPartiesData = await Promise.all(
        taxiPartyList.map(async (party) => {
          const userInfo = await getUserInfoApi({ userSeq: party.userSeq });

          const taxiPathResponse = await getTaxiPartyPathApi(party.taxiSeq);

          const taxiPath = Array.isArray(taxiPathResponse)
            ? taxiPathResponse
            : [];

          const destinations = [
            ...new Set(taxiPath.map((path) => path.destiName)),
          ];

          return {
            ...party,
            imgNo: userInfo.imageNo,
            userGender: userInfo.gender,
            destinations,
            taxiPath,
          };
        })
      );

      setTaxiParties(taxiPartiesData);
    } catch (error) {
      console.error('Error fetching taxi parties:', error);
    }
  };

  useEffect(() => {
    console.log('useEffect 실행됨'); // UseEffect 시작 부분에 로그 추가
    if (userSeq) {
      fetchLocation();
      fetchUserGender();
      fetchTaxiParties();
    }
    const socket = new SockJS('https://i11e205.p.ssafy.io/ws');
    const stompClientInstance = Stomp.over(socket);
    stompClientInstance.connect(
      {},
      () => {
        console.log('WebSocket 연결 성공');
        setConnected(true);
      },
      (error) => {
        console.error('WebSocket 연결 실패:', error); // WebSocket 연결 실패 로그
      }
    );
    setStompClient(stompClientInstance); // stompClientInstance 설정

    return () => {
      if (stompClientInstance && stompClientInstance.connected) {
        stompClientInstance.disconnect(() => {
          console.log('WebSocket 연결 해제');
        });
      }
    };
  }, []);

  useEffect(() => {
    if (userSeq) {
      fetchLocation();
      fetchUserGender();
      fetchTaxiParties();
    }
  }, [userSeq]);

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
      console.log(`Entered room with roomSeq: ${roomSeq}, userSeq: ${userSeq}`);
    } else {
      console.error('WebSocket 연결이 아직 준비되지 않았습니다');
    }
  };

  const handleEnterChatRoom = (chatRoomId, taxiSeq, roomSeq) => {
    navigate(`/chat/taxi/${chatRoomId}`, {
      state: { taxiSeq, roomSeq },
    });
  };

  const handleAddMemberOrEnterChat = async (item) => {
    try {
      const allMembers = await getAllTaxiPartyMembersApi(item.taxiSeq);
      const isAlreadyMember = allMembers.some(
        (member) => member.userSeq === userSeq
      );

      if (isAlreadyMember) {
        handleEnterChatRoom(item.roomSeq, item.taxiSeq, item.roomSeq);
        return;
      }

      if (item.status === 'FILLED') {
        setModalMessage('해당 택시 took은 \n모집이 완료되었어요.');
        setIsModalOpen(true);
        return;
      }

      const userStatus = await isUserJoinedTaxiPartyApi(userSeq);

      if (userStatus) {
        setModalMessage('이미 참여중이에요!');
        setIsModalOpen(true);
        return;
      }

      const memberData = {
        taxiSeq: item.taxiSeq,
        userSeq: userSeq,
        destiName: item.taxiPath[0].destiName,
        destiLat: item.taxiPath[0].destiLat,
        destiLon: item.taxiPath[0].destiLon,
        cost: item.taxiPath[0].cost,
        routeRank: item.taxiPath[0].routeRank,
      };

      const response = await addTaxiPartyMemberApi(memberData);
      if (response) {
        console.log('Member added successfully:', response);

        // WebSocket이 연결되었는지 확인한 후 방에 입장
        if (stompClient && connected) {
          enterRoom({ roomSeq: item.roomSeq, userSeq });
          handleEnterChatRoom(item.roomSeq, item.taxiSeq, item.roomSeq);
        } else {
          console.error('WebSocket 연결이 아직 준비되지 않았습니다');
        }
      } else {
        console.error('택시 파티에 멤버 추가 실패');
      }
    } catch (error) {
      console.error('택시 파티 참여 처리 중 오류 발생:', error);
    }
  };

  const handleCreateTaxi = async () => {
    const userStatus = await isUserJoinedTaxiPartyApi(userSeq);
    console.log('현재 유저의 상태는 ', userStatus);

    if (userStatus) {
      setModalMessage('이미 참여중이에요!');
      setIsModalOpen(true); // 모달 열기
      return;
    }

    navigate('/taxi/create');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage('');
  };

  const filteredData = taxiParties.filter((item) => {
    if (item.gender === false) {
      return true;
    }
    return item.userGender === userGender;
  });

  return (
    <div className="flex flex-col max-w-[360px] mx-auto relative h-screen bg-main mb-16">
      <div className="bg-main py-4">
        <div className="flex items-center px-4 relative mb-4 mt-3">
          <BackButton />
          <div className="flex-grow text-center text-2xl font-bold text-white">
            택시{' '}
            <span className="font-dela">
              took <span className="font-noto">!</span>
            </span>
          </div>
        </div>
        <div className="flex items-center px-4 mt-2">
          <img
            src={locationIcon}
            alt="location"
            className="w-4 h-4 mr-2 ml-2"
          />
          <div className="text-sm font-semibold text-gray-700">{location}</div>
        </div>
      </div>
      <div className="px-2 py-4 bg-white h-screen rounded-t-3xl overflow-y-auto">
        {filteredData.map((item, index) => (
          <div key={index} className="px-4 py-2 rounded-lg">
            <div className="flex items-center">
              <img
                src={getProfileImagePath(item.imgNo)}
                alt="user profile"
                className="w-12 h-12 mr-3"
              />
              <div className="flex-grow">
                <div className="flex items-center mb-2">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.gender === false
                        ? 'bg-white border border-neutral-300 text-gray-700'
                        : userGender === 'F'
                          ? 'bg-pink-200 text-pink-600'
                          : 'bg-blue-200 text-blue-600'
                    }`}
                  >
                    {item.gender
                      ? userGender === 'M'
                        ? '남성'
                        : '여성'
                      : '무관'}
                  </div>
                </div>
                <div className="flex flex-wrap mb-2 overflow-x-auto space-x-1">
                  {(item.destinations.length > 0
                    ? item.destinations
                    : ['해운대역 부산 2호선']
                  ).map((destination, i) => (
                    <div
                      key={i}
                      className="bg-neutral-300 text-gray-700 text-xs font-bold mr-1 mb-1 px-2 py-1 rounded-lg"
                    >
                      {destination}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center w-9">
                <button
                  className="mb-2"
                  onClick={() => {
                    handleAddMemberOrEnterChat(item);
                  }}
                >
                  <img
                    src={item.status === 'OPEN' ? enterIcon : notEnterIcon}
                    alt="enter status"
                    className="w-8 h-8"
                  />
                </button>
                <span className="text-xs font-semibold text-gray-700">
                  {item.count} / {item.max}
                </span>
              </div>
            </div>
            <div className="mt-2 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 border-neutral-400 border-opacity-40 min-h-[0.5px]" />
          </div>
        ))}
      </div>
      <button
        className="fixed bottom-10 right-6 bg-main text-white p-2 rounded-full shadow-lg"
        onClick={handleCreateTaxi}
      >
        <img src={plusIcon} alt="+" className="w-8 h-8" />
      </button>

      {isModalOpen && (
        <Modal title="알림" message={modalMessage} onClose={closeModal} />
      )}
    </div>
  );
}

export default TaxiMainPage;
