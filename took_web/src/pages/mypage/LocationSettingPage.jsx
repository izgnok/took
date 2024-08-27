import React, { useState, useEffect } from 'react';
import BackButton from '../../components/common/BackButton';
import NotificationIcon from '../../assets/mypage/notification.png';
import LocationIcon from '../../assets/mypage/location.png';
import { searchPlaces } from '../../utils/map';
import { modifyUserLocation } from '../../apis/user';
import { getUserSeq } from '../../utils/getUserSeq';
import { useNavigate } from 'react-router-dom';
import SearchNotice from '../../components/map/SearchNotice';
import { useLocation } from 'react-router-dom';

function LocationSettingPage() {
  const { state } = useLocation();
  console.log(state);
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState('');
  const [location, setLocation] = useState(state?.addr || '');
  const [lat, setLatitude] = useState(null);
  const [lon, setLongitude] = useState(null);
  const seq = getUserSeq();

  const handleChangeLocation = async () => {
    try {
      const params = {
        userSeq: seq,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        addr: location,
      };
      const response = await modifyUserLocation(params);
      console.log('Location change API response:', response);
      navigate(-1);
    } catch (error) {
      console.log('Error changing location:', error);
    }
  };

  return (
    <div className="flex flex-col bg-white max-w-[360px] mx-auto relative h-screen">
      <div className="flex items-center px-4 py-3">
        <BackButton />
        <div className="mt-2.5 flex-grow text-center text-lg font-bold text-black">
          위치 / 주소 설정
        </div>
      </div>

      <div className="mt-2 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 border-neutral-400 border-opacity-40 min-h-[0.5px]" />

      <div className="flex flex-col items-center mt-4 px-2">
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <img
            src={NotificationIcon}
            alt="Notification"
            className="w-3.5 h-4 mr-2"
          />
          배달 took 알림을 받을 위치를 설정해주세요
        </div>
        <div className="flex flex-col space-y-4 mt-4 w-[80%]">
          <div className="mb-3">
            <div className="text-base font-bold mb-2">현재 등록한 주소</div>
            <div className="w-full bg-gray-100 outline-none rounded-lg p-3 shadow">
              {location}
            </div>

            <SearchNotice
              label="주소 검색"
              name="location"
              value={searchInput}
              setTempLocation={(e) => setSearchInput(e.target.value)}
              placeholder="주소를 검색하세요"
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              setLocation={setLocation}
            />
          </div>
        </div>
        <button
          className="text-white text-sm bg-[#A1A1A1] rounded-full font-bold px-4 py-2 shadow-md transition-shadow"
          onClick={handleChangeLocation}
        >
          변경하기
        </button>
      </div>
    </div>
  );
}

export default LocationSettingPage;
