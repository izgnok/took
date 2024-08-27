import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDeliveryListApi } from '../../apis/delivery';
import { formatBeforeTime } from '../../utils/formatDate';
import plusIcon from '../../assets/delivery/plus.png'; // '+' 아이콘 경로
import mapIcon from '../../assets/delivery/map.png'; // 지도 아이콘 경로
import BackButton from '../../components/common/BackButton';
import { usePosition } from '../../store/position';
import { useUser } from '../../store/user';
import { getUserSeq } from '../../utils/getUserSeq';
import { getSavedUserPositionApi } from '../../apis/position/userPosition';
import { getUserInfoApi } from '../../apis/user';

const DeliveryListPage = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('주소지');
  const [deliveryList, setDeliveryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  const { latitude, longitude } = usePosition(); // 현위치 선택되어 있을 때의 주소
  const seq = getUserSeq();

  useEffect(() => {
    console.log('selectedOption를 출력합니다.', selectedOption);

    const fetchDeliveryList = async (latitude, longitude) => {
      try {
        const params = { lat: latitude, lon: longitude };

        console.log('lat', latitude);
        console.log('lon', longitude);

        const response = await getDeliveryListApi(params);
        const openList = response.filter((item) => item.status === 'OPEN');
        const sortedList = openList.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setDeliveryList(sortedList || []);
      } catch (error) {
        console.error('배달 목록을 가져오는 중 오류가 발생했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchStoredAddress = async () => {
      try {
        const response = await getUserInfoApi({ userSeq: seq });
        if (response) {
          setLat(response.lat);
          setLon(response.lon);

          console.log('2. 유저의 위치 정보를 출력합니다', response.lat);
          console.log('2. 유저의 위치 정보를 출력합니다', response.lon);
          return { lat: response.lat, lon: response.lon };
        }
      } catch (e) {
        console.error('저장된 주소를 가져오는 중 오류가 발생했습니다:', e);
      }
    };

    const fetchData = async () => {
      if (selectedOption === '주소지') {
        console.log('1. 먼저 위치 정보를 불러옵니다');
        const userPosition = await fetchStoredAddress();
        if (userPosition) {
          fetchDeliveryList(userPosition.lat, userPosition.lon);
        }
      } else {
        fetchDeliveryList(latitude, longitude);
      }
    };

    fetchData();
  }, [selectedOption, latitude, longitude, seq]);

  const handleCreateDelivery = () => {
    navigate('/delivery/create');
  };

  const handleDetailClick = (deliverySeq) => {
    navigate(`/delivery/detail/${deliverySeq}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col max-w-[360px] mx-auto relative h-screen">
      <div className="flex items-center px-4 mt-4">
        <BackButton path="/"/>
        <div className="flex-grow text-center">
          <span className="mt-2.5 mb-1 text-2xl font-bold text-main">
            배달{' '}
            <span className="font-dela">
              took<span className="font-noto">!</span>
            </span>
          </span>
        </div>
      </div>

      <div className="px-6 mt-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl text-black font-bold mt-2">
            주변 배달 목록
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex w-1/2 rounded-full border">
            <button
              type="button"
              className={`w-1/2 text-sm font-bold py-2 rounded-l-full border ${selectedOption === '주소지' ? 'bg-neutral-500 text-white' : 'bg-transparent text-gray-900'}`}
              onClick={() => setSelectedOption('주소지')}
            >
              주소지
            </button>
            <button
              type="button"
              className={`w-1/2 text-sm font-bold py-2 rounded-r-full border ${selectedOption === '현위치' ? 'bg-neutral-500 text-white' : 'bg-transparent text-gray-900'}`}
              onClick={() => setSelectedOption('현위치')}
            >
              현위치
            </button>
          </div>
        </div>
        <div className="text-[10px] text-gray-300 p-2">
          {selectedOption === '주소지'
            ? '사용자가 설정한 기본 주소지 주변의 배달 글을 불러옵니다'
            : '현재 위치 주변의 배달 글을 불러옵니다'}
        </div>

        {deliveryList.map((item, index) => (
          <div
            key={index}
            className="my-4 cursor-pointer"
            onClick={() => handleDetailClick(item.deliverySeq)}
          >
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold text-black">
                {item.storeName}
              </div>
              <div className="text-xs text-gray-500">
                {formatBeforeTime(item.createdAt)}
              </div>
            </div>
            <div className="text-black font-bold text-sm mb-1">
              {item.pickupPlace}
            </div>
            <div className="my-1">
              <div className="text-neutral-500 font-bold text-xs">
                배달팁 : {item.deliveryTip}원
              </div>
            </div>
            <div className="my-4 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 border-neutral-400 border-opacity-40 min-h-[0.5px]" />
          </div>
        ))}
        <button
          className="text-white rounded-full text-lg font-bold fixed bottom-8 right-7"
          onClick={handleCreateDelivery}
        >
          <img src={plusIcon} alt="+" className="w-12 h-12" />
        </button>
      </div>
    </div>
  );
};

export default DeliveryListPage;
