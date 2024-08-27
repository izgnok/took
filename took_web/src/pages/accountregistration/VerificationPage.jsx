import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';
import { sendSmsApi, verifySmsApi } from '../../apis/sms';
import { useUser } from '../../store/user.js';

function VerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bank, account, password, accountName } = location.state || {};

  const { seq: userSeq } = useUser(); // useUser 훅을 사용하여 seq 값을 가져옵니다.

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [isValidCode, setIsValidCode] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerHeight < 500) {
        setKeyboardVisible(true);
      } else {
        setKeyboardVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleNameChange = (e) => setName(e.target.value);
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 허용
    if (value.length <= 15) {
      setPhoneNumber(value);
    }
  };
  const handleVerificationCodeChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 허용
    if (value.length <= 6) {
      setVerificationCode(value);
    }
  };

  const handleRequestClick = async () => {
    if (name && phoneNumber) {
      try {
        await sendSmsApi({ phoneNumber: phoneNumber.toString() });
        setRequestSent(true);
        setVerificationStatus('');
        setIsVerified(false);
      } catch (error) {
        setVerificationStatus('문자 전송 중 오류가 발생했습니다.');
      }
    } else {
      setVerificationStatus('이름과 휴대폰 번호를 입력해주세요.');
    }
  };

  const handleVerifyClick = async () => {
    if (!verificationCode) {
      setVerificationStatus('인증번호를 입력해주세요.');
      setIsVerified(false);
      setIsValidCode(false);
      return;
    }

    try {
      const response = await verifySmsApi({
        phoneNumber: phoneNumber.toString(),
        code: parseInt(verificationCode, 10),
      });
      if (response) {
        setIsVerified(true);
        setIsValidCode(true);
        setVerificationStatus('인증이 완료되었습니다.');
      } else {
        setIsVerified(false);
        setIsValidCode(false);
        setVerificationStatus('잘못된 인증번호를 입력하였습니다.');
      }
    } catch (error) {
      setVerificationStatus('인증 중 오류가 발생했습니다.');
      setIsVerified(false);
      setIsValidCode(false);
    }
  };

  const handleNextClick = () => {
    if (isFormValid) {
      navigate('/setsimplepwd', {
        state: { bank, account, password, accountName },
      });
    }
  };

  const isFormValid = name && phoneNumber && isValidCode;

  return (
    <div className="flex flex-col items-center p-5 relative h-screen font-[Nanum_Gothic]">
      <div className="w-full flex items-center justify-between mb-5 border-b border-gray-300 pb-2">
        <BackButton />
        <span className="text-lg font-bold mx-auto">계좌 등록</span>
        <div className="w-6"></div> {/* 오른쪽 여백 확보용 */}
      </div>
      <div className="w-full">
        <div className="flex flex-col mb-5">
          <div className="text-base font-bold text-gray-500 mb-5 flex items-center">
            <span className="inline-block w-5 h-5 rounded-full border border-gray-300 text-center leading-5 mr-2">
              1
            </span>{' '}
            본인 명의 계좌 번호 등록
          </div>
          <div className="text-base font-bold text-gray-500 mb-5 flex items-center">
            <span className="inline-block w-5 h-5 rounded-full border border-gray-300 text-center leading-5 mr-2">
              2
            </span>{' '}
            약관 동의
          </div>
          <div className="text-base font-bold flex items-center">
            <span className="inline-block w-5 h-5 rounded-full bg-[#FF7F50] text-white text-center leading-5 mr-2">
              3
            </span>{' '}
            본인 인증
          </div>
        </div>
        <label className="flex flex-col mb-3">
          <span className="text-sm font-bold mb-2">이름</span>
          <div className="flex">
            <input
              type="text"
              placeholder="성명입력"
              value={name}
              onChange={handleNameChange}
              className="flex-1 h-12 rounded-lg border border-gray-300 px-3 text-base outline-none"
            />
          </div>
        </label>
        <label className="flex flex-col mb-3">
          <span className="text-sm font-bold mb-2">휴대폰번호</span>
          <div className="flex">
            <input
              type="text"
              placeholder="'-' 없이 숫자만 입력"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className="flex-1 h-12 rounded-lg border border-gray-300 px-3 text-base outline-none mr-2"
            />
            <button
              className="bg-[#FF7F50] text-white rounded-lg px-4 h-12 cursor-pointer"
              onClick={handleRequestClick}
            >
              {requestSent ? '재전송' : '인증 요청'}
            </button>
          </div>
        </label>
        {requestSent && (
          <label className="flex flex-col mb-3">
            <span className="text-sm font-bold mb-2">인증번호</span>
            <div className="flex">
              <input
                type="text"
                placeholder="인증번호 6자리 입력"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                className="flex-1 h-12 rounded-lg border border-gray-300 px-3 text-base outline-none mr-2"
              />
              <button
                className="bg-[#FF7F50] text-white rounded-lg px-4 h-12 cursor-pointer"
                onClick={handleVerifyClick}
              >
                확인
              </button>
            </div>
          </label>
        )}
        <div
          className={`text-sm mt-3 ${isValidCode ? 'text-black' : 'text-red-500'}`}
        >
          {verificationStatus}
        </div>
      </div>
      {!keyboardVisible && ( // 키패드가 보일 때는 숨김
        <button
          className={`w-[calc(100%-40px)] py-3 rounded-full text-white text-lg font-bold cursor-pointer transition-all duration-300 ${isFormValid ? 'bg-[#FF7F50] shadow-md' : 'bg-[#FF7F50]/50'} absolute bottom-5 left-1/2 transform -translate-x-1/2`}
          disabled={!isFormValid}
          onMouseOver={(e) =>
            isFormValid &&
            (e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)')
          }
          onMouseOut={(e) => (e.currentTarget.style.boxShadow = 'none')}
          onClick={handleNextClick}
        >
          다음
        </button>
      )}
    </div>
  );
}

export default VerificationPage;
