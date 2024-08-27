import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import backIcon from '../../assets/common/back.svg';
import BackButton from '../../components/common/BackButton';
import getProfileImagePath from '../../utils/getProfileImagePath';
import { modifyShopStatusApi } from '../../apis/groupBuy/shop';
import { TbPencil } from 'react-icons/tb';
import { FaRegTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import {
  getShopApi,
  deleteShopApi,
  joinGroupBuyApi,
  isJoinApi,
} from '../../apis/groupBuy/shop';
import { useUser } from '../../store/user';

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function formattedDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
}

const BuyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shopData, setShopData] = useState(null);
  const { seq: userSeq } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [chatRoom, setChatRoom] = useState();

  const fetchShopData = async () => {
    try {
      const data = await getShopApi(id);

     
      setShopData(data);
      setIsLeader(data.userSeq === userSeq);

      console.log('userSeq', userSeq);

      setChatRoom((prev) => ({
        ...prev,
        userSeq: data.userSeq,
        roomTitle: data.title,
      }));

      const isJoin = await isJoinApi(data.shopSeq, userSeq);
      setIsParticipant(isJoin);
    } catch (error) {
      console.log('fetching shop data error', error);
    }
  };

  useEffect(() => {
    const socket = new SockJS('https://i11e205.p.ssafy.io/ws');
    const stompClientInstance = Stomp.over(socket);
    stompClientInstance.connect({}, () => {
      console.log('WebSocket 연결 성공');
      setConnected(true);
    });
    setStompClient(stompClientInstance);
    fetchShopData();

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

  useEffect(() => {
    const updateStatusIfNeeded = async () => {
      if (shopData && shopData.count === shopData.maxCount) {
        try {
          const params = { status: 'IN_PROGRESS' };
          console.log('Params:', params);
          await modifyShopStatusApi(shopData.shopSeq, params);
          console.log('Status updated to IN_PROGRESS');
          const updatedData = await getShopApi(id);
          setShopData(updatedData);
        } catch (error) {
          console.error('Error updating status:', error);
        }
      }
    };

    updateStatusIfNeeded();
  }, [shopData, id]);

  useEffect(() => {
    const checkIfJoined = async () => {
      try {
        const isJoinResponse = await isJoinApi(shopData.shopSeq, userSeq);
        setIsParticipant(isJoinResponse);
      } catch (error) {
        console.error('Error checking join status:', error);
      }
    };

    if (shopData) {
      checkIfJoined();
    }
  }, [shopData, userSeq]);

  if (!shopData) {
    return <div>Loading...</div>;
  }

  const handleJoinGroup = async () => {
    try {
      const params = { shopSeq: shopData.shopSeq, userSeq: userSeq };
      const success = await joinGroupBuyApi(params);


      if (success) {
        await enterRoom({ roomSeq: shopData.roomSeq, userSeq });
        setIsParticipant(true);

        // todo: 실제 채팅방으로 연결
        console.log('들어가기전 마지막 출력', chatRoom);
        console.log('들어갈 방 번호', shopData.roomSeq);
        navigate(`/chat/buy/${shopData.roomSeq}`, { state: { chatRoom } });
        
      } else {
        console.error('Failed to join the group buy');
      }
    } catch (error) {
      console.error('API call error:', error);
    }
  };

  const handleChatRedirect = () => {
    navigate(`/chat/buy/${shopData.roomSeq}`, { state: { chatRoom } });
  }

  const handleDelete = async () => {
    try {
      await deleteShopApi(shopData.shopSeq);
      console.log('삭제 완료');
      navigate('/groupbuy/list', { state: { shouldRefresh: true } });
    } catch (error) {
      console.error('API call error:', error);
    }
  };

  const handleEndRecruitment = async () => {
    try {
      const params = { status: 'IN_PROGRESS' };
      console.log('Params:', params); // 로그 추가
      await modifyShopStatusApi(shopData.shopSeq, params);
      console.log('모집 종료 완료');
      navigate('/groupbuy/list', { state: { shouldRefresh: true } });
    } catch (error) {
      console.error('API call error:', error);
    }
  };

  const handleNavigateToList = () => {
    navigate('/groupbuy/list');
  };

  return (
    <div className="flex flex-col pt-5 bg-white max-w-screen min-h-screen">
      <div className="flex flex-col px-5 w-full ">
        <div className="flex flex-col px-5 w-full ">
          <img
            src={backIcon}
            alt="뒤로"
            className="w-6 h-6 mx-6 mt-6 absolute top-0 left-0 opacity-80"
            onClick={() => navigate('/groupbuy/list')}
          />
          <div
            onClick={handleNavigateToList}
            className="mx-6 text-2xl text-main font-extrabold"
          >
            공구 <span className="font-dela">took !</span>
          </div>
        </div>
        <div className="flex flex-col p-4 mt-5 w-full bg-neutral-50 border border-neutral-200 rounded-3xl shadow-md">
          <div className="flex flex-row justify-between items-center">
            <div className="text-md font-bold text-neutral-800 py-2 p-1">
              {shopData.title}
            </div>
            {isLeader && (
              <div className="flex flex-row gap-2">
                <button
                  onClick={() => navigate(`/groupbuy/form/${shopData.shopSeq}`)}
                >
                  <TbPencil className="text-neutral-500 w-5 h-5" />
                </button>
                <button onClick={() => setShowModal(true)}>
                  <FaRegTrashAlt className="text-neutral-500 w-5 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="shrink-0 h-[0.5px] border border-neutral-300 my-1" />
          <div className="flex gap-5 justify-between mt-3 w-full">
            <div className="flex gap-2.5 items-start text-black">
              <img
                loading="lazy"
                src={getProfileImagePath(shopData.imageNo)}
                className="w-5 mt-1 ml-1"
              />
              <div className="flex flex-col">
                <div className="text-xs font-bold">{shopData.userName}</div>
                <div className="text-[10px]">
                  {new Date(shopData.createAt).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="text-[10px] text-neutral-500-500">
              조회 : {shopData.hit}
            </div>
          </div>
          <div
            className="mt-9 text-sm text-zinc-800"
            dangerouslySetInnerHTML={{ __html: shopData.content }}
          ></div>
          <div className="flex gap-2 px-5 py-5 mt-8 bg-white text-black rounded-xl border border-collapse">
            <div className="flex flex-col justify-between text-xs gap-10 font-bold flex-none w-[70px]">
              <div>물품명</div>
              <div>구매링크</div>
              <div>수령장소</div>
            </div>
            <div className="self-stretch w-px border border-neutral-300 border-opacity-60" />
            <div className="flex flex-col justify-between text-xs overflow-x-hidden">
              <div className="font-base break-words">{shopData.item}</div>
              <div>
                <Link
                  to={shopData.site}
                  className="font-normal text-black underline underline-offset-4 break-words overflow-hidden"
                >
                  {shopData.site}
                </Link>
              </div>
              <div className="font-normal break-words">{shopData.place}</div>
            </div>
          </div>
          <Link to={shopData.site}>
            <div className="p-3 mt-4 text-sm font-bold text-neutral-500 text-center border border-neutral-300 bg-white rounded-xl">
              사이트 보러가기
            </div>
          </Link>
        </div>

        {!isParticipant && ( <button
            className="bg-main px-12 py-3 mt-6 w-full shadow-sm font-bold text-white rounded-2xl"
            onClick={handleChatRedirect}
          >
            채팅방 입장
          </button>)}

        {shopData.userSeq !== userSeq && isParticipant && (
          <div className="flex flex-col items-center pt-3 pb-1 mt-4 bg-main rounded-2xl shadow-md">
            <div className="flex flex-col px-16 text-xs font-semibold text-white">
              <div className="mt-4">
                {shopData.count + 1}/{shopData.maxCount + 1}명 | 채팅 개설일{' '}
                {formattedDate(shopData.createAt)}
                <br />
              </div>
              <div className="flex items-center gap-2 justify-center py-auto overflow-x-scroll">
                {Array.from({ length: shopData.count + 1 }).map((_, index) => (
                  <img
                    key={index}
                    loading="lazy"
                    src={getProfileImagePath(getRandomNumber(1, 20))}
                    className="w-8 mx-auto mt-3 animate-semijump "
                  />
                ))}
              </div>
            </div>
            <div className="shrink-0 mt-4 max-w-full border border-solid border-white border-opacity-40 w-[80%] mx-10" />
            <div
              onClick={handleJoinGroup}
              className="my-3 text-base font-bold text-white"
            >
              참여하기
            </div>
          </div>
        )}
        {shopData.userSeq === userSeq && (
          <button
            onClick={handleEndRecruitment}
            className="bg-red-500 px-12 py-3 mb-8 mt-6 w-full shadow-sm font-bold text-white rounded-2xl"
          >
            모집 종료하기
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 shadow-md rounded-2xl">
            <div className="mb-4 font-bold">게시물을 삭제하시겠습니까?</div>
            <div className="flex justify-center gap-2 text-neutral-600 font-bold">
              <button
                onClick={() => setShowModal(false)}
                className="px-8 py-2 bg-neutral-200 rounded-xl"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="px-8 py-2 bg-main text-white rounded-xl"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyDetailPage;
