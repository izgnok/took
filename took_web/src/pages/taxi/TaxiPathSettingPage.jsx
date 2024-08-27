import React, { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import BackButton from '../../components/common/BackButton';
import SearchDropdown from '../../components/map/SearchDropDown';
import {
  calculateIndividualExpectedCostApi,
  setDestinationAndCostApi,
  getNextDestinationRankApi,
} from '../../apis/taxi';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useUser } from '../../store/user';
import { usePosition } from '../../store/position';

const TaxiPathSettingPage = (members, taxiParty) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: taxiSeq } = useParams();
  const [destination, setDestination] = useState('');
  const [endLatitude, setLatitude] = useState(null);
  const [endLongitude, setLongitude] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const { latitude, longitude} = usePosition();
  const dropdownRef = useRef(null);
  const { guestSeq } = location.state || {};

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
    setShowDropdown(true);
  };

  const handleAddClick = () => {
    if (destination) {
      setSelectedAddress(destination);
      setIsModalOpen(true);
      setShowDropdown(false); // 선택하면 드롭다운을 닫음
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmAdd = async () => {
    setLoading(true);
    try {
      // 1. 다음 목적지 순위 가져오기
      const rank = await getNextDestinationRankApi(taxiSeq);
      console.log(rank);
      // 2. 개인 예상 비용 계산
      const paramsForCost = {
        startLat: latitude,
        startLon: longitude,
        endLat: endLatitude,
        endLon: endLongitude,
      };
      console.log(paramsForCost)
      const costResponse = await calculateIndividualExpectedCostApi(paramsForCost);
      const cost = costResponse.cost; // cost 변수에 값을 할당

      // 3. 택시 파티 목적지 및 비용 설정
      const paramsForDestination = {
        guestSeq,
        destiName: selectedAddress,
        destiLat: endLatitude,
        destiLon: endLongitude,
        cost: cost,
        routeRank: rank,
      };
      await setDestinationAndCostApi(paramsForDestination);

      console.log('택시 파티 목적지 및 비용 설정 완료:', paramsForDestination);
      navigate(-1); // 완료 후 채팅방으로 이동
    } catch (error) {
      console.error('오류 발생:', error);
      // 오류 처리 (예: 오류 메시지 표시)
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col bg-white max-w-[360px] mx-auto relative h-screen">
      <div className="flex items-center px-4 py-3">
        <BackButton />
        <div className="mt-2.5 flex-grow text-center text-lg font-bold text-black">
          경로 설정
        </div>
      </div>

      <div className="mt-2 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 min-h-[0.5px]" />

      <div className="flex flex-col px-6 py-4">
        <div ref={dropdownRef}>
          <SearchDropdown
            placeholder="목적지를 입력하세요"
            label="목적지 검색"
            name="destination"
            value={destination}
            onChange={handleDestinationChange}
            setLatitude={setLatitude}
            setLongitude={setLongitude}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
          />
        </div>
      </div>

      <button
        onClick={handleAddClick}
        className="bg-main font-bold mx-auto text-white w-24 py-2 rounded-xl">
        추가하기
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl max-w-[250px] w-full text-center">
            <div className="mb-6 ml-1 text-left font-bold">
              해당 경로를 추가하시겠습니까?
            </div>
            <div className="flex items-center justify-center mb-2">
              <FaMapMarkerAlt className="h-5 w-5 mr-2 ml-1 mb-3 text-main" />
              <span className="text-sm text-left mb-3">{selectedAddress}</span>
            </div>
            <div className="text-sm font-bold">
              <button
                onClick={handleCloseModal}
                className="bg-gray-200 text-gray-700 w-24 py-2 rounded-xl mr-4"
                disabled={loading}
              >
                이전
              </button>
              <button
                onClick={handleConfirmAdd}
                className="bg-main text-white w-24 py-2 rounded-xl"
                disabled={loading}
              >
                {loading ? '처리 중...' : '추가하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxiPathSettingPage;
