import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdBackspace } from 'react-icons/md';
import { linkAccountApi } from '../../apis/account/info.js';
import { useUser } from '../../store/user.js';
import Modal from 'react-modal';

function SetSimplePwdPage() {
  const [input, setInput] = useState('');
  const [isError, setIsError] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isPasswordSet, setIsPasswordSet] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [firstPassword, setFirstPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { bank, account, password, accountName } = location.state || {};
  const { seq: userSeq } = useUser(); // useUser 훅을 사용하여 seq 값을 가져옵니다.

  const handleButtonClick = (value) => {
    if (input.length < 6) {
      setInput(input + value);
    }
  };

  const handleDelete = () => {
    setInput(input.slice(0, -1));
  };

  const handleSetPassword = async () => {
    setFirstPassword(input);
    setIsPasswordSet(true);
    setInput('');
    setIsError(false);
  };

  const handleCheckPassword = async () => {
    if (input === firstPassword) {
      setInput('');
      setIsError(false);
      setAttemptCount(0); // 성공 시 시도 횟수 초기화
      await handleLinkAccount(); // 계좌 연동 처리
    } else {
      setIsError(true);
      setAttemptCount((prev) => prev + 1);
      setInput('');
      if (attemptCount >= 2) {
        setIsModalOpen(true);
        setTimeout(() => {
          navigate(-1);
        }, 3000);
      }
    }
  };

  const handleLinkAccount = async () => {
    const params = {
      userSeq,
      main: false, // 주계좌 여부 설정 (필요에 따라 변경)
      accountName,
      accountNum: account,
      accountPwd: parseInt(password, 10),
      easyPwd: firstPassword,
    };
    try {
      const response = await linkAccountApi(params);
      console.log(response);
      navigate('/accountcomplete', {
        state: { bank, account, password, accountName, easyPwd: firstPassword },
      });
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error);
    }
  };

  const handleInputChange = () => {
    if (input.length === 6) {
      if (!isPasswordSet) {
        handleSetPassword();
      } else {
        handleCheckPassword();
      }
    }
  };

  React.useEffect(() => {
    handleInputChange();
  }, [input]);

  const renderDots = () => {
    const dots = [];
    for (let i = 0; i < 6; i++) {
      dots.push(
        <span
          key={i}
          className={`text-2xl mx-1 ${i < input.length ? 'text-white' : 'text-gray-400'}`}
        >
          ●
        </span>
      );
    }
    return dots;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#FF7F50] font-[Nanum_Gothic] relative">
      <div className="w-full flex justify-center items-center px-5 relative">
        <div className="font-dela text-4xl text-white mb-5 text-center">
          took!
        </div>
        <div
          className="absolute right-5 top-[-20px] cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            width="24px"
            height="24px"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M18.3 5.71a1 1 0 00-1.41 0L12 10.59 7.11 5.7a1 1 0 00-1.41 1.41L10.59 12l-4.89 4.88a1 1 0 001.41 1.41L12 13.41l4.89 4.88a1 1 0 001.41-1.41L13.41 12l4.89-4.88a1 1 0 000-1.41z" />
          </svg>
        </div>
      </div>
      <div className="text-xl text-white mb-5 text-center font-bold">
        {isError ? (
          <div>
            비밀번호가 일치하지 않아요 <br /> 다시 입력해주세요{' '}
            <span className="text-black"> {attemptCount}/3</span>
          </div>
        ) : isPasswordSet ? (
          '다시 한 번 입력해주세요'
        ) : (
          '간편 비밀번호 설정'
        )}
      </div>
      <div className="flex justify-center mb-5">{renderDots()}</div>
      <div className="grid grid-cols-3 gap-5 mt-10 w-4/5">
        {Array.from({ length: 9 }, (_, i) => (
          <button
            key={i + 1}
            className="text-3xl py-5 text-white bg-transparent border-none cursor-pointer font-bold text-center"
            onClick={() => handleButtonClick(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <div className="col-span-1"></div>
        <button
          className="text-3xl py-5 text-white bg-transparent border-none cursor-pointer font-bold text-center"
          onClick={() => handleButtonClick(0)}
        >
          0
        </button>
        <button
          className="text-3xl py-5 text-white bg-transparent border-none cursor-pointer font-bold text-center ml-7"
          onClick={handleDelete}
        >
          <MdBackspace size={24} />
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        ariaHideApp={false}
      >
        <div className="bg-white p-5 rounded-lg text-center">
          <p>비밀번호 입력 횟수를 초과하였습니다</p>
        </div>
      </Modal>
    </div>
  );
}

export default SetSimplePwdPage;
