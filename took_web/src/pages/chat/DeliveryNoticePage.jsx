import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';
import {
  getDeliveryDetailApi,
  writeNoticeApi,
  modifyDeliveryApi,
} from '../../apis/delivery';
import SearchNotice from '../../components/map/SearchNotice';

function DeliveryNoticePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deliveryInfo, setDeliveryInfo] = useState({});
  const [location, setLocation] = useState('');
  const [tempLocation, setTempLocation] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        const response = await getDeliveryDetailApi(id);
        setDeliveryInfo(response);
        console.log('delivery info', response);
        setLocation(response.pickupPlace);
        console.log(response.pickupPlace);
      } catch (error) {
        console.error('배달 상세 정보를 가져오는 중 오류 발생:', error);
      }
    };

    if (id) {
      fetchDeliveryData();
    }
  }, [id]);

  const handleSave = async () => {
    try {
      await writeNoticeApi({
        deliverySeq: id,
        notice: notice,
      });
      await modifyDeliveryApi({
        deliverySeq: id,
        storeName: deliveryInfo.storeName,
        pickupPlace: location,
        pickUpLat: latitude,
        pickUpLon: longitude,
        deliveryTip: deliveryInfo.deliveryTip,
        content: deliveryInfo.content,
        deliveryTime: deliveryInfo.deliveryTime,
      });

      setModalMessage('수정이 완료되었습니다');
      setIsModalVisible(true);
      setTimeout(() => {
        setIsModalVisible(false);
      }, 2000);
      navigate(-1);
    } catch (error) {
      console.error('공지사항을 저장하는 중 오류 발생:', error);
      setModalMessage('저장 중 오류가 발생했습니다');
      setIsModalVisible(true);
      setTimeout(() => {
        setIsModalVisible(false);
      }, 2000);
    }
  };

  const handleComplete = () => {
    console.log(location, latitude, longitude, notice);
    handleSave();
  };

  return (
    <div className="flex flex-col p-4 h-screen font-[Nanum_Gothic]">
      <div className="flex items-center justify-between mb-4">
        <BackButton />
        <div className="flex-grow text-center text-lg font-bold ml-5 mt-1">
          공지사항 설정
        </div>
        <button
          className="bg-main text-white font-bold px-3 py-1 rounded-xl mt-1"
          onClick={handleComplete}
        >
          완료
        </button>
      </div>
      <div className="mt-2 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 border-neutral-400 border-opacity-40 min-h-[0.5px]" />

      <div className="flex flex-col space-y-4 mt-4">
        <div className="mb-3">
          <div className="text-base font-bold mb-2">현재 등록한 수령 장소</div>
          <div className="w-full bg-gray-100 outline-none rounded-lg p-3 shadow">
            {typeof location === 'object' ? JSON.stringify(location) : location}
          </div>

          <SearchNotice
            label="수령 주소 검색"
            name="location"
            value={tempLocation}
            setTempLocation={(e) => setTempLocation(e.target.value)}
            placeholder="수령 주소를 검색하세요"
            setLatitude={setLatitude}
            setLongitude={setLongitude}
            setLocation={setLocation}
          />
        </div>
        <div>
          <div className="text-base font-bold mb-2">함께 주문하기 링크</div>
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow">
            <input
              type="text"
              className="w-full bg-transparent outline-none text-sm p-1"
              placeholder="링크를 입력하세요"
              value={notice}
              onClick={(e) => {
                e.target.select();
              }}
              onChange={(e) => setNotice(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-black">{modalMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeliveryNoticePage;
