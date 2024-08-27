import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';
import {
  writeShopApi,
  getShopApi,
  modifyShopApi,
} from '../../apis/groupBuy/shop.js';
import { useUser } from '../../store/user.js';
import Search from '../../components/groupbuy/Search.jsx';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

import { createChatApi } from '../../apis/chat/chat.js';

function BuyFormPage() {
  const { id } = useParams(); // 수정 모드에서 사용할 shopSeq
  const navigate = useNavigate();
  const { seq: userSeq } = useUser();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [room, setRoom] = useState();

  const [formData, setFormData] = useState({
    title: '',
    site: '',
    item: '',
    content: '',
    place: '',
    max_person: '',
    lat: latitude, // 위도와 경도 추가
    lon: longitude,
  });

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
      console.error('WebSocket 연결이 아직 준비되지 않았습니다');
    }
  };

  useEffect(() => {
    if (id) {
      // id가 있는 경우 기존 데이터를 불러옴
      const fetchShopData = async () => {
        try {
          const data = await getShopApi(id);
          setFormData({
            title: data.title,
            site: data.site,
            item: data.item,
            content: data.content,
            place: data.place,
            max_person: data.maxCount,
            lat: data.lat,
            lon: data.lon,
          });
          setRoom(data.roomSeq);
        } catch (error) {
          console.error('API call error:', error);
        }
      };

      fetchShopData();
    }
  }, [id]);

  const createRoom = async () => {
    const response = await createChatApi({
      roomTitle: formData.title,
      category: 3,
      userSeq,
    });
    console.log(response);
    return response;
  };

  const createShop = async (roomSeq) => {
    const response = await writeShopApi({
      roomSeq,
      userSeq,
      title: formData.title,
      content: formData.content,
      item: formData.item,
      site: formData.site,
      place: formData.place,
      lat: parseFloat(latitude),
      lon: parseFloat(longitude),
      maxCount: parseInt(formData.max_person),
    });
    console.log('공동 구매 등록 완료');
    const shopSeq = response.shopSeq;
    navigate(`/groupbuy/${shopSeq}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData, latitude, longitude);

    if (userSeq === null) {
      alert('사용자 정보가 올바르지 않습니다.');
      return;
    }

    // const params = {
    //   roomSeq: 28, // todo: 실제 채팅방 시퀀스로 교체
    //   userSeq: userSeq,
    //   title: formData.title,
    //   content: formData.content,
    //   item: formData.item,
    //   site: formData.site,
    //   place: formData.place,
    //   lat: formData.lat,
    //   lon: formData.lon,
    //   maxCount: parseInt(formData.max_person),
    // };

    try {
      if (id) {
        // 수정 모드
        await modifyShopApi(id, {
          userSeq,
          title: formData.title,
          content: formData.content,
          item: formData.item,
          site: formData.site,
          place: formData.place,
          lat: parseFloat(latitude),
          lon: parseFloat(longitude),
          maxCount: parseInt(formData.max_person),
        });
        console.log('수정 완료');
        navigate(`/groupbuy/${id}`); // 수정된 게시물로 이동
      } else {
        // 새 글 작성 모드
        const newRoom = await createRoom();
        const newShop = await createShop(newRoom.roomSeq);
        await enterRoom({ roomSeq: newRoom.roomSeq, userSeq });

        navigate(`/groupbuy/${newShop.shopSeq}`); // 생성된 게시물로 이동
      }
    } catch (error) {
      console.error('API call error:', error);
    }
  };

  return (
    <div className="flex flex-col pt-5 bg-white max-w-screen">
      <div className="flex flex-col px-5 w-full">
        <div className="flex flex-col items-baseline px-5 w-full ">
          <BackButton />
          <div className="mx-6 text-2xl text-main font-extrabold">
            공구 <span className="font-dela">took !</span>
          </div>
        </div>
        <div className="flex flex-col px-7 pt-5 pb-5 mt-5 border border-neutral-200 bg-neutral-50 rounded-3xl shadow-md">
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="제목"
            className="my-2 text-sm text-zinc-800 bg-neutral-50"
          ></input>
          <hr className="border-neutral-400 border-opacity-50" />
          <textarea
            id="content"
            name="content"
            rows="8"
            value={formData.content}
            onChange={handleChange}
            required
            placeholder="내용을 입력하세요."
            className="block resize-none mt-3 text-sm text-zinc-800 bg-neutral-50 "
          ></textarea>
        </div>
        <div className="pl-5 pr-4 py-2 mt-5 bg-neutral-50 rounded-2xl border border-neutral-200 shadow-md">
          {/* <input
                id="place"
                name="place"
                type="text"
                value={formData.place}
                onChange={handleChange}
                required
                placeholder="수령 장소를 입력하세요"
                className="text-black py-2 text-xs rounded-md border border-collapse placeholder-neutral-300 font-medium text-right pr-2 focus:border-b-main"
              ></input> */}
          <Search
            label="수령 장소"
            name="place"
            value={formData.place}
            onChange={handleChange}
            placeholder="수령 장소를 입력하세요"
            setLatitude={setLatitude}
            setLongitude={setLongitude}
          />
        </div>

        <div className="pl-5 pr-4 py-5 mt-5 bg-neutral-50 rounded-2xl border border-neutral-200 shadow-md">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm font-normal  text-black">
              물품명
              <input
                id="item"
                name="item"
                type="text"
                value={formData.item}
                onChange={handleChange}
                required
                placeholder="물품명을 입력하세요"
                className="text-black py-2 text-xs rounded-md border border-collapse placeholder-neutral-300 font-medium text-right pr-2 focus:border-b-main"
              ></input>
            </div>
            <div className="flex justify-between items-center text-sm font-normal  text-black">
              구매링크
              <input
                id="site"
                name="site"
                type="text"
                value={formData.site}
                onChange={handleChange}
                required
                placeholder="구매 링크를 입력하세요"
                className="text-black py-2 text-xs rounded-md border border-collapse placeholder-neutral-300 font-medium text-right pr-2 focus:border-b-main"
              ></input>
            </div>

            <div className="flex justify-between items-center text-sm font-normal  text-black">
              최대 모집 인원
              <input
                id="max_person"
                name="max_person"
                type="number"
                value={formData.max_person}
                onChange={handleChange}
                required
                placeholder="최대 모집 인원"
                className="text-black py-2 text-xs rounded-md border border-collapse placeholder-neutral-300 font-medium text-right pr-2 focus:border-b-main"
              ></input>
            </div>
          </div>
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          className="px-16 py-3 mt-9 text-sm text-center font-bold text-white bg-main rounded-2xl shadow-md"
        >
          {id ? '수정하기' : '등록하기'}
        </button>
      </div>
    </div>
  );
}

export default BuyFormPage;
