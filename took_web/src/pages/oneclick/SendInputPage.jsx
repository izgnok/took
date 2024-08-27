import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdBackspace } from 'react-icons/md';
import getProfileImagePath from '../../utils/getProfileImagePath';
import BackButton from '../../components/common/BackButton';
import { formatNumber } from '../../utils/format'; // formatNumber 함수를 불러옵니다.

function SendInputPage() {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleButtonClick = (value) => {
    const newInput = input + value;
    setInput(newInput);
    console.log(formatNumber(newInput)); // 입력한 돈을 콘솔에 출력
  };

  const tempMember = {
    member_seq: 1,
    party_seq: 1,
    user_seq: 1,
    userName: '조현정',
    imgNo: 1,
    cost: 6600,
    status: false,
    receive: false,
    isLeader: false,
    createdAt: '2024-07-06T01:49:00',
  };

  const handleDelete = () => {
    const newInput = input.slice(0, -1);
    setInput(newInput);
    console.log(formatNumber(newInput)); // 입력한 돈을 콘솔에 출력
  };

  const isConfirmDisabled = input.length === 0;

  return (
    <div className="flex flex-col items-center justify-center bg-white font-[Nanum_Gothic] relative">
      <div className="flex items-center px-4 py-3">
        <BackButton />
        <div className="flex-grow text-center text-lg font-bold text-black mt-3">
          정산하기
        </div>
      </div>
      <div className="mt-3 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 min-h-[0.5px]" />

      <div className="flex flex-col items-center mb-4">
        <img
          src={getProfileImagePath(1)}
          alt="profile"
          className="w-16 h-16 mb-2 mt-8 animate-shake"
        />
        <div className="text-sm mb-5">{tempMember.userName}</div>
        <div className="text-2xl font-bold mb-1">
          {tempMember.userName} 님에게
        </div>
        <div
          className={`text-2xl font-bold ${input.length === 0 ? 'text-gray-300' : 'text-black'} mb-5`}
        >
          {input.length === 0
            ? '얼마를 보낼까요?'
            : `${formatNumber(input)} 원`}
        </div>
      </div>
      <div className="mt-2 w-full border-0 border-solid bg-neutral-400 bg-opacity-90 border-neutral-400 min-h-[0.5px]" />
      <div className="grid grid-cols-3 gap-2 mt-1 w-4/5  pt-3 mb-2">
        {Array.from({ length: 9 }, (_, i) => (
          <button
            key={i + 1}
            className="text-2xl py-4 bg-transparent border-none cursor-pointer font-extrabold text-center"
            onClick={() => handleButtonClick(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <div></div>
        <button
          className="text-2xl py-4 bg-transparent border-none cursor-pointer font-extrabold text-center"
          onClick={() => handleButtonClick(0)}
        >
          0
        </button>
        <button
          className="text-2xl py-4 bg-transparent border-none cursor-pointer font-extrabold text-center"
          onClick={handleDelete}
        >
          <MdBackspace size={24} className="ml-7" />
        </button>
      </div>
      <button
        className={`w-[calc(100%-40px)] py-3 rounded-full text-white text-lg font-bold cursor-pointer l ${isConfirmDisabled ? 'bg-main/50' : 'bg-main'} text-white font-bold`}
        disabled={isConfirmDisabled}
        onClick={() => {
          if (!isConfirmDisabled) {
            // 실제 금액 전송 기능을 여기에 추가
            // alert(`송금할 금액: ${formatNumber(input)} 원`);
            navigate('/payment');
          }
        }}
      >
        확인
      </button>
    </div>
  );
}

export default SendInputPage;
