import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineRight } from 'react-icons/ai';
import { MdBackspace } from 'react-icons/md';
import BackButton from '../../components/common/BackButton';

function AccountPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedName, savedAccount, savedPassword } = location.state || {
    selectedName: '',
    savedAccount: '',
    savedPassword: '',
  };

  const [bank, setBank] = useState(selectedName);
  const [account, setAccount] = useState(savedAccount || '');
  const [password, setPassword] = useState(savedPassword || '');
  const [accountName, setAccountName] = useState('');
  const [showKeypad, setShowKeypad] = useState(false);
  const [keypadNumbers, setKeypadNumbers] = useState([]);

  useEffect(() => {
    generateRandomKeypad();
  }, [showKeypad]);

  useEffect(() => {
    if (selectedName) {
      setBank(selectedName);
    }
  }, [selectedName]);

  const generateRandomKeypad = () => {
    const numbers = [...Array(10).keys()];
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    setKeypadNumbers(numbers);
  };

  const handleAccountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAccount(value);
    setShowKeypad(false);
  };

  const handleAccountNameChange = (e) => {
    setAccountName(e.target.value);
    setShowKeypad(false);
  };

  const handleNextClick = async () => {
    console.log('bankName: ', bank);
    console.log('accountNum: ', account);
    console.log('accountPwd: ', password);
    console.log('accountName: ', accountName);
    if (isFormValid) {
      navigate('/agreement', {
        state: {
          bank,
          account,
          password,
          accountName,
        },
      });
    }
  };

  const handleKeypadClick = (value) => {
    if (value === 'backspace') {
      setPassword(password.slice(0, -1));
    } else if (value === 'confirm') {
      setShowKeypad(false);
    } else if (password.length < 4) {
      setPassword(password + value);
    }
  };

  const handlePasswordFocus = () => {
    setPassword('');
    setShowKeypad(true);
    if (document.activeElement) {
      document.activeElement.blur(); // Remove focus from the current input to close the native keyboard
    }
  };

  const isFormValid = bank !== '' && account !== '' && password.length === 4;

  return (
    <div className="flex flex-col items-center p-5 relative h-screen font-[Nanum_Gothic]">
      <div className="w-full flex items-center justify-between mb-5 border-b border-gray-300 pb-2">
        <BackButton />
        <span className="text-lg font-bold mx-auto">계좌 등록</span>
        <div className="w-6"></div> {/* 오른쪽 여백 확보용 */}
      </div>
      <div className="w-full mb-5">
        <label className="flex flex-col mb-2">
          <span className="text-lg font-bold mb-4">
            <span className="inline-block w-5 h-5 rounded-full bg-[#FF7F50] text-white text-center leading-5 mr-2">
              1
            </span>
            본인 명의 계좌 번호 등록
          </span>
          <div
            className="flex items-center justify-between h-14 rounded-lg border border-gray-300 px-3 text-base cursor-pointer"
            onClick={() =>
              navigate('/select', {
                state: { savedAccount: account, savedPassword: password },
              })
            }
          >
            <span className={`${bank ? 'text-black' : 'text-gray-400'}`}>
              {bank || '은행 / 증권사'}
            </span>
            <AiOutlineRight className="text-2xl text-gray-400" />
          </div>
        </label>
        <label className="flex flex-col mb-2">
          <input
            type="text"
            placeholder="계좌 번호 등록"
            value={account}
            onChange={handleAccountChange}
            className="h-14 rounded-lg border border-gray-300 px-3 text-base outline-none placeholder-gray-400"
            onFocus={() => setShowKeypad(false)}
          />
        </label>
        <label className="flex flex-col mb-2">
          <input
            type="password"
            placeholder="계좌 비밀번호 (4자리)"
            value={password.replace(/./g, '●')}
            onFocus={handlePasswordFocus}
            readOnly
            className="h-14 rounded-lg border border-gray-300 px-3 text-base outline-none cursor-pointer"
          />
        </label>
        <div className="mb-10">
          <input
            type="text"
            placeholder="(선택) 계좌별칭 등록 / 최대16글자"
            value={accountName}
            onChange={handleAccountNameChange}
            onFocus={() => setShowKeypad(false)}
            maxLength="16"
            className={`text-sm w-full border-b border-gray-300 py-2 outline-none ${accountName ? 'text-black' : 'text-gray-400'}`}
          />
        </div>
      </div>
      <div className="w-full mb-5">
        <div className="text-lg font-bold text-gray-500 mb-5">
          <span className="inline-block w-5 h-5 rounded-full border border-gray-300 text-center leading-5 mr-2">
            2
          </span>
          약관 동의
        </div>
        <div className="text-lg font-bold text-gray-500">
          <span className="inline-block w-5 h-5 rounded-full border border-gray-300 text-center leading-5 mr-2">
            3
          </span>
          본인 인증
        </div>
      </div>
      <button
        className={`py-3 rounded-full text-white text-lg font-bold cursor-pointer transition-all duration-300 ${isFormValid ? 'bg-[#FF7F50] shadow-md' : 'bg-[#FF7F50]/50 shadow-none'} absolute bottom-5 left-1/2 transform -translate-x-1/2 w-[calc(100%-40px)]`}
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
      {showKeypad && (
        <div className="fixed bottom-0 left-0 w-full bg-[#FF7F50] grid grid-cols-4 gap-2 p-2 z-50">
          {keypadNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handleKeypadClick(number.toString())}
              className="bg-[#FF7F50] border-none text-white text-xl py-3 rounded-lg text-center cursor-pointer outline-none"
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => handleKeypadClick('backspace')}
            className="bg-[#FF7F50] border-none text-white text-xl py-3 rounded-lg text-center cursor-pointer outline-none ml-6"
          >
            <MdBackspace size={24} />
          </button>
          <button
            onClick={() => handleKeypadClick('confirm')}
            className="bg-[#FF7F50] border-none text-white text-xl py-3 rounded-lg text-center cursor-pointer outline-none"
          >
            확인
          </button>
        </div>
      )}
    </div>
  );
}

export default AccountPage;
