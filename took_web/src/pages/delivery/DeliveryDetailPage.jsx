import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import backIcon from '../../assets/delivery/whiteBack.svg';
import {
  getDeliveryDetailApi,
  deleteDeliveryApi,
  joinDeliveryApi,
  changeDeliveryStatusApi,
  isJoiningParty,
} from '../../apis/delivery';
import { getUserInfoApi } from '../../apis/user';
import { useUser } from '../../store/user';
import getProfileImagePath from '../../utils/getProfileImagePath';
import { TbPencil } from 'react-icons/tb';
import { FaRegTrashAlt } from 'react-icons/fa';
import { formatBeforeTime } from '../../utils/formatDate';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const BackButton = () => {
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1);
  };
  return (
    <img
      src={backIcon}
      alt="뒤로"
      className="w-6 h-6 mx-6 mt-6 absolute top-0 left-0 opacity-80"
      onClick={handleBackClick}
    />
  );
};

function formatDeliveryTime(timeString) {
  const date = new Date(timeString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${month}.${day} ${hours >= 12 ? '오후' : '오전'} ${
    hours > 12 ? hours - 12 : hours
  }:${minutes < 10 ? `0${minutes}` : minutes}`;
}

function DeliveryDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { seq: currentUserSeq } = useUser();
  const [data, setData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [chatRoom, setChatRoom] = useState({});
  const [showEndModal, setShowEndModal] = useState(false); // 모집 종료 모달 상태 추가

  useEffect(() => {
    const socket = new SockJS('https://i11e205.p.ssafy.io/ws');
    const stompClientInstance = Stomp.over(socket);
    stompClientInstance.connect({}, () => {
      console.log('WebSocket 연결 성공');
      setConnected(true);
    });
    setStompClient(stompClientInstance);
    if (id) {
      fetchDeliveryInfo();
    }

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
      console.error('WebSocket 연결이 아직 준비되지 않았습니다');
    }
  };

  const fetchDeliveryInfo = async () => {
    try {
      const deliveryResponse = await getDeliveryDetailApi(id);
      setData(deliveryResponse);
      console.log(deliveryResponse.userSeq);
      const deliveryUserSeq = deliveryResponse.userSeq;
      if (deliveryUserSeq) {
        const userResponse = await getUserInfoApi({
          userSeq: deliveryUserSeq,
        });
        setChatRoom((prevState) => ({
          ...prevState,
          userSeq: deliveryUserSeq,
          roomTitle: deliveryResponse.storeName,
        }));
        console.log(userResponse);
        setUserInfo(userResponse); // 방장 사용자 정보 조회 및 저장
        setIsLeader(deliveryUserSeq === currentUserSeq);
      }

      const isJoin = await isJoiningParty({
        deliverySeq: id,
        userSeq: currentUserSeq,
      });
      setIsParticipant(isJoin);

      const deliveryTime = new Date(deliveryResponse.deliveryTime);
      if (new Date() > deliveryTime) {
        await changeDeliveryStatusApi({ deliverySeq: id, status: 'DONE' });
        setShowEndModal(true); // 모집 종료 모달 표시
        setTimeout(() => {
          setShowEndModal(false);
          navigate('/');
        }, 3000); // 2초 후에 경로 이동
      }
    } catch (e) {
      console.error('배달 상세 조회 중 오류 발생:', e);
    }
  };

  const handleParticipate = async () => {
    try {
      await joinDeliveryApi({ deliverySeq: id, userSeq: currentUserSeq });
      await enterRoom({ userSeq: currentUserSeq, roomSeq: data.roomSeq });
      alert('배달 파티에 참여하였습니다!');
      setIsParticipant(true);
    } catch (error) {
      console.error(
        '참여 중 오류 발생:',
        error.response?.data || error.message
      );
      alert('참여 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async () => {
    try {
      console.log('Deleting delivery with id:', id);
      const response = await deleteDeliveryApi(id);
      console.log('Delete response:', response);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error(
        '삭제 중 오류 발생:',
        error.response?.data || error.message
      );
    }
  };

  const handleModify = () => {
    navigate(`/delivery/modify/${id}`);
  };

  const handleChatRedirect = () => {
    if (data && data.roomSeq) {
      navigate(`/chat/delivery/${data.roomSeq}`, { state: { chatRoom } });
    }
  };

  const handleEndRecruitment = async () => {
    try {
      await changeDeliveryStatusApi({ deliverySeq: id, status: 'DONE' });
      navigate('/');
    } catch (error) {
      console.error(
        '모집 종료 중 오류 발생:',
        error.response?.data || error.message
      );
      alert('모집 종료 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col max-w-[360px] mx-auto relative h-screen">
      <div className="flex bg-main items-center px-4 py-3">
        <BackButton />
        <div className="mt-2.5 mb-2 flex-grow text-center text-lg font-bold text-white">
          배달 <span className="font-dela">took!</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center mb-4 justify-between">
          <div className="flex items-center">
            <img
              src={getProfileImagePath(userInfo?.imageNo)}
              alt="avatar"
              className="w-10 h-10 mr-4"
            />
            <div>
              <div className="text-base font-bold">{userInfo?.userName}</div>
              <div className="text-xs text-gray-500">
                {data ? formatBeforeTime(data.createdAt) : ''}
              </div>
            </div>
          </div>
          {isLeader && (
            <div className="flex items-center">
              <TbPencil
                className="w-5 h-5 text-neutral-500 mr-4"
                onClick={handleModify}
              />
              <FaRegTrashAlt
                className="w-5 h-4 text-neutral-500"
                onClick={() => setShowDeleteModal(true)}
              />
            </div>
          )}
        </div>

        <div className="my-2 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 border-neutral-400 border-opacity-40 min-h-[0.5px]" />

        <div className="mb-10 px-2">
          <div className="text-xl font-bold mb-1 mt-3">{data?.storeName}</div>
          <div className="text-gray-700 mb-3">{data?.pickupPlace}</div>
          <div className="my-2 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 border-neutral-400 border-opacity-40 min-h-[0.5px]" />
          <div className="text-gray-700 my-3">
            배달팁 : {data?.deliveryTip}원
          </div>
          <div className="text-gray-700 my-3">
            {data ? formatDeliveryTime(data.deliveryTime) : ''}
          </div>
          <div className="text-gray-700 my-3">{data?.content}</div>
        </div>

        {isParticipant || isLeader ? (
          <button
            className="w-full p-2 bg-main text-white rounded-lg"
            onClick={handleChatRedirect}
          >
            채팅방 입장
          </button>
        ) : (
          <button
            className="w-full p-2 mt-2 bg-gray-300 text-gray-700 rounded-lg"
            onClick={handleParticipate}
            disabled={isParticipant}
          >
            {isParticipant ? '이미 참여중' : '참여하기'}
          </button>
        )}

        {isLeader && (
          <button
            className="w-full p-2 mt-2 bg-red-500 text-white rounded-lg"
            onClick={handleEndRecruitment}
          >
            모집 종료하기
          </button>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="text-center mb-4">정말 삭제하시겠습니까?</div>
            <div className="flex justify-center">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
                onClick={handleDelete}
              >
                삭제
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                onClick={() => setShowDeleteModal(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="text-center mb-4">삭제가 완료되었습니다!</div>
          </div>
        </div>
      )}

{showEndModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-7 rounded-lg shadow-lg flex flex-col items-center">
          <img
            src={getProfileImagePath(userInfo?.imageNo)}
            alt="took"
            className="w-10 h-10 m-5 animate-jump"
          />
          <p>모집이 종료된 배달입니다</p>
        </div>
      </div>
      )}
    </div>
  );
}

export default DeliveryDetailPage;
