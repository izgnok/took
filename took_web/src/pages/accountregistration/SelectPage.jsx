import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import BackButton from '../../components/common/BackButton';
import { banks, stocks } from '../../utils/bankdata';

function SelectPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('은행'); // "은행" 또는 "증권사" 중 하나

  const handleSelect = (name) => {
    let fullName = name;
    if (
      selectedTab === '은행' &&
      !name.endsWith('뱅크') &&
      !name.endsWith('우체국') &&
      !name.endsWith('금고')
    ) {
      fullName = `${name}은행`;
    }
    navigate('/account', { state: { selectedName: fullName } });
  };

  return (
    <div className="flex flex-col items-center p-5 relative h-screen font-[Nanum_Gothic]">
      <div className="w-full flex items-center justify-between mb-2 border-b border-gray-300 pb-2">
        <BackButton className="flex-shrink-0" />
        <span className="text-lg font-bold mx-auto">계좌 등록</span>
        <AiOutlineClose
          className="text-2xl cursor-pointer flex-shrink-0"
          onClick={() => navigate('/account')}
        />
      </div>
      <div className="flex justify-around w-full mb-5">
        <div
          className={`text-lg font-bold pb-2 cursor-pointer ${selectedTab === '은행' ? 'border-b-2 border-[#FF7F50]' : ''}`}
          onClick={() => setSelectedTab('은행')}
        >
          은행
        </div>
        <div
          className={`text-lg font-bold pb-2 cursor-pointer ${selectedTab === '증권사' ? 'border-b-2 border-[#FF7F50]' : ''}`}
          onClick={() => setSelectedTab('증권사')}
        >
          증권사
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {selectedTab === '은행' &&
          banks.map((bank) => (
            <div
              key={bank.name}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleSelect(bank.name)}
            >
              <img src={bank.icon} alt={bank.name} className="w-12 h-12 mb-1" />
              <div className="text-sm text-center">{bank.name}</div>
            </div>
          ))}
        {selectedTab === '증권사' &&
          stocks.map((stock) => (
            <div
              key={stock.name}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleSelect(stock.name)}
            >
              <img
                src={stock.icon}
                alt={stock.name}
                className="w-12 h-12 mb-1"
              />
              <div className="text-sm text-center">{stock.name}</div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default SelectPage;
