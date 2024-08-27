import React, { useState } from 'react';
import BackButton from '../../components/common/BackButton';

function NotificationSettingPage() {
  const [chatToggle, setChatToggle] = useState(true);
  const [deliveryToggle, setDeliveryToggle] = useState(true);
  const [groupBuyToggle, setGroupBuyToggle] = useState(true);

  return (
    <div className="flex flex-col bg-white max-w-[360px] mx-auto relative h-screen">
      <div className="flex items-center px-4 py-3">
        <BackButton />
        <div className="mt-2.5 flex-grow text-center text-lg font-bold text-black">
          앱푸시 알림 설정
        </div>
      </div>

      <div className="mt-2 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 border-neutral-400 border-opacity-40 min-h-[0.5px]" />

      <div className="px-6 py-4">
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <div>
            <div className="text-lg font-bold">채팅 알림</div>
            <div className="text-sm text-gray-500">채팅 메시지 알림</div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={chatToggle}
              onChange={() => setChatToggle(!chatToggle)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#FF7F50]"></div>
          </label>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <div>
            <div className="text-lg font-bold">
              배달 <span className="font-dela">took</span> 알림
            </div>
            <div className="text-sm text-gray-500">
              주변 위치의 배달 took 푸시 알림
            </div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={deliveryToggle}
              onChange={() => setDeliveryToggle(!deliveryToggle)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#FF7F50]"></div>
          </label>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <div>
            <div className="text-lg font-bold">
              공동구매 <span className="font-dela">took</span> 알림
            </div>
            <div className="text-sm text-gray-500">
              공동구매 배송 완료 푸시 알림
            </div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={groupBuyToggle}
              onChange={() => setGroupBuyToggle(!groupBuyToggle)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#FF7F50]"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

export default NotificationSettingPage;
