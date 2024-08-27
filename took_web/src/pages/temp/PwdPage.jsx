import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdBackspace } from 'react-icons/md';
import { msgToAndroid } from '../../android/message';
import { checkEasyPasswordApi } from '../../apis/account/oneclick';
import { useUser } from '../../store/user';
import {
  onlyjungsanPayApi,
  deliveryGroupPayApi,
} from '../../apis/payment/jungsan';

function PwdPage() {
  const [input, setInput] = useState('');
  const [isError, setIsError] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { seq: currentUserSeq } = useUser();
  const { accountSeq, amount, userSeq, numCategory, partySeq } =
    location.state || {};

  useEffect(() => {
    if (!accountSeq || !amount || !userSeq) {
      alert('필수 데이터가 없습니다.');
      navigate(-1);
    }
  }, [accountSeq, amount, userSeq, navigate]);

  const handleButtonClick = (value) => {
    if (input.length < 6) {
      setInput(input + value);
    }
  };

  const handleDelete = () => {
    setInput(input.slice(0, -1));
  };

  const checkPassword = async () => {
    try {
      const response = await checkEasyPasswordApi({
        accountSeq,
        easyPwd: input,
      });
      if (response.checked) {
        await processPayment();
      } else {
        setIsError(true);
        setAttemptCount((prev) => prev + 1);
        setInput('');
      }
    } catch (error) {
      console.error('비밀번호 확인 중 오류 발생:', error);
      setIsError(true);
      setAttemptCount((prev) => prev + 1);
      setInput('');
    }
  };

  const processPayment = async () => {
    const requestData = {
      userSeq: currentUserSeq,
      partySeq,
      accountSeq,
    };

    console.log('데이터를 출력합니다.', requestData);

    try {
      console.log('processPayment 호출됨:', requestData); // 로그 추가
      console.log('카테고리,', numCategory);
      if (numCategory === 4) {
        console.log('정산합수 출력');
        const response = await onlyjungsanPayApi(requestData);
        console.log('onlyjungsanPayApi 응답:', response); // 로그 추가
      } else if (numCategory === 1 || numCategory === 3) {
        const response = await deliveryGroupPayApi(requestData);
        console.log('deliveryGroupPayApi 응답:', response); // 로그 추가
      }
      navigate('/complete', {
        state: { accountSeq, amount, userSeq, currentUserSeq },
      });
    } catch (error) {
      console.log('응답:', requestData);
      console.error('결제 처리 중 오류 발생:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (input.length === 6) {
      checkPassword();
    }
    [input];
  });

  useEffect(() => {
    if (attemptCount >= 5) {
      alert('비밀번호 입력 제한 횟수를 초과하였습니다.');
      msgToAndroid('비밀번호 입력 횟수 초과!');
      navigate(-1);
    }
  }, [attemptCount, navigate]);

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
            비밀번호가 맞지 않아요 <br /> 다시 입력해주세요{' '}
            <span className="text-black"> {attemptCount}/5</span>
          </div>
        ) : (
          '간편 비밀번호 입력'
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
    </div>
  );
}

export default PwdPage;
