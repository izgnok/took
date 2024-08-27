import React, { useState, useEffect } from 'react';
import BackButton from '../../components/common/BackButton';
import { useNavigate, useParams } from 'react-router-dom';
import {
  writeDeliveryApi,
  modifyDeliveryApi,
  getDeliveryDetailApi,
} from '../../apis/delivery';
import { useUser } from '../../store/user';
import SearchDropdown from '../../components/map/SearchDropDown';
import { createChatApi } from '../../apis/chat/chat';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import InputField from '../../components/delivery/InputField';
import TextAreaField from '../../components/delivery/TextAreaField';
import Modal from '../../components/delivery/Modal';

function CreateDeliveryPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { seq: userSeq } = useUser();
  const [form, setForm] = useState({
    storeName: '', // lat이 y, lng이 x
    deliveryAddress: '',
    deliveryTip: '',
    orderTime: '',
    additionalInfo: '',
  });
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);

  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pickLat, setPickLat] = useState();
  const [pickLng, setPickLng] = useState();
  const [room, setRoom] = useState();

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
      // 재시도 로직을 추가하거나 사용자에게 알림
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await getDeliveryDetailApi(id);
          setForm({
            storeName: response.storeName,
            deliveryAddress: response.pickupPlace,
            deliveryTip: response.deliveryTip,
            orderTime: response.deliveryTime,
            additionalInfo: response.content,
          });
          setRoom(response.roomSeq);
        } catch (error) {
          console.error('배달 글 조회 중 오류 발생:', error);
        }
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleBackClick = () => {
    if (Object.values(form).some((field) => field !== '')) {
      setShowModal(true);
    } else {
      navigate("/delivery/list");
    }
  };

  const handleConfirmExit = () => {
    setShowModal(false);
    navigate(-1);
  };

  const createRoom = async () => {
    const response = await createChatApi({
      roomTitle: form.storeName,
      category: 1,
      userSeq,
    });
    console.log(response); // 응답
    return response;
  };

  const createDelivery = async (roomSeq) => {
    const response = await writeDeliveryApi({
      userSeq: parseInt(userSeq),
      roomSeq: parseInt(roomSeq),
      storeName: form.storeName,
      pickupPlace: form.deliveryAddress,
      pickupLat: parseFloat(pickLat),
      pickupLon: parseFloat(pickLng),
      deliveryTip: form.deliveryTip,
      deliveryTime: form.orderTime,
      content: form.additionalInfo,
    });
    return response;
  };

  const handleSubmit = async () => {
    if (Object.values(form).some((field) => field === '')) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } else {
      try {
        let response;
        if (id) {
          // 배달 글 수정
          await modifyDeliveryApi({
            userSeq,
            roomSeq: room,
            deliverySeq: id,
            storeName: form.storeName,
            pickupPlace: form.deliveryAddress,
            pickupLat: parseFloat(pickLat),
            pickupLon: parseFloat(pickLng),
            deliveryTip: form.deliveryTip,
            deliveryTime: form.orderTime,
            content: form.additionalInfo,
          });
        } else {
          // 채팅방 생성
          const newRoom = await createRoom();

          // 룸 번호 받아서 배달 방 생성
          const newDelivery = await createDelivery(newRoom.roomSeq);
          response = newDelivery; // 새로운 배달 정보 저장
          await enterRoom({ roomSeq: newRoom.roomSeq, userSeq });
        }

        setShowCompletionMessage(true);
        setTimeout(() => {
          setShowCompletionMessage(false);
          navigate(
            id
              ? `/delivery/detail/${id}`
              : `/delivery/detail/${response.deliverySeq}`
          );
        }, 2000);
      } catch (error) {
        console.error('배달 글 작성 중 오류 발생:', error);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000);
      }
    }
  };

  return (
    <div className="flex flex-col bg-white max-w-[360px] mx-auto relative h-screen">
      <div className="flex items-center px-4 py-3">
        <button onClick={handleBackClick}>
          <BackButton />
        </button>
        <div className="mt-2 ml-12 flex-grow text-center text-lg font-bold text-black">
          배달 <span className="font-dela">took</span>{' '}
          {id ? '수정하기' : '작성하기'}
        </div>
        <button
          className="text-white mt-2 bg-[#FF7F50] px-3 py-1.5 rounded-full text-sm font-bold"
          onClick={handleSubmit}
        >
          등록
        </button>
      </div>

      <div className="mt-2 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 border-neutral-400 border-opacity-40 min-h-[0.5px]" />

      <div className="flex flex-col mt-4 px-6 text-sm h-full">
        <SearchDropdown
          label="배달 가게 이름"
          name="storeName"
          value={form.storeName}
          onChange={handleChange}
          setLatitude={() => {}}
          setLongitude={() => {}}
          placeholder="원하는 배달 가게 이름을 입력해주세요."
        />
        <SearchDropdown
          label="배달 수령 장소"
          name="deliveryAddress"
          value={form.deliveryAddress}
          onChange={handleChange}
          setLatitude={setPickLat}
          setLongitude={setPickLng}
          placeholder="배달 수령 장소를 입력해주세요."
        />
        <InputField
          label="예상 배달팁"
          name="deliveryTip"
          type="number"
          value={form.deliveryTip}
          onChange={handleChange}
          placeholder="₩ 예상 배달팁을 입력해주세요."
        />
        <InputField
          label="배달 주문 시간"
          name="orderTime"
          type="datetime-local"
          value={form.orderTime}
          onChange={handleChange}
          placeholder="배달 주문 시간을 입력해주세요."
          min={new Date().toISOString().slice(0, 16)}
        />
        <TextAreaField
          label="추가 정보"
          name="additionalInfo"
          value={form.additionalInfo}
          onChange={handleChange}
          placeholder="배달에 관련된 정보 및 공유할 내용을 작성해주세요."
        />
      </div>

      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white px-6 py-4 rounded-lg shadow-lg text-center font-bold text-base ">
            모든 필드를 작성해주세요.
          </div>
        </div>
      )}

      {showCompletionMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white px-6 py-4 rounded-lg shadow-lg text-center text-base font-bold">
            배달 <span className="font-dela">took</span>{' '}
            {id ? '수정 완료' : '작성 완료'}
          </div>
        </div>
      )}

      <Modal
        show={showModal}
        message="작성 중인 글쓰기를 종료하시겠습니까?"
        onConfirm={handleConfirmExit}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}

export default CreateDeliveryPage;
