import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import 송금완료 from '../../assets/payment/송금완료.png';
import took1 from '../../assets/payment/took1.png';
import { formatNumber } from '../../utils/format';
import { maskName } from '../../utils/formatName';
import { getUserInfoApi } from '../../apis/user';
import { getAccountListApi } from '../../apis/account/info';
import { bankNumToName } from '../../assets/payment/index.js';

function CompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUserSeq, userSeq, amount, accountSeq } = location.state || {};

  const [userName, setUserName] = useState('');
  const [accountInfo, setAccountInfo] = useState({
    bankName: '',
    accountNum: '',
  });

  useEffect(() => {
    console.log(currentUserSeq)
    console.log(userSeq)
    console.log(amount)
    console.log(accountSeq)

    // 사용자의 이름을 가져오기 위한 API 호출
    const fetchUserName = async () => {
      try {
        const userInfo = await getUserInfoApi({ userSeq: userSeq });
        console.log();
        setUserName(userInfo.userName);
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    // 계좌 정보를 가져오기 위한 API 호출
    const fetchAccountInfo = async () => {
      try {
        const accountListResponse = await getAccountListApi({
          userSeq: currentUserSeq,
        });
        const account = accountListResponse.list.find(
          (acc) => acc.accountSeq === accountSeq
        );
        if (account) {
          const bankName = bankNumToName[account.bankNum];
          setAccountInfo({ bankName, accountNum: account.accountNum });
        }
      } catch (error) {
        console.error('Error fetching account info:', error);
      }
    };

    fetchUserName();
    fetchAccountInfo();
  }, [currentUserSeq, accountSeq]);

  const maskedName = maskName(userName);

  return (
    <div className="flex flex-col items-center justify-between h-[90vh] bg-white font-[Nanum_Gothic] pb-10 pt-20 relative">
      <FaTimes
        className="absolute top-4 right-4 text-2xl cursor-pointer mt-6 text-neutral-500"
        onClick={() => navigate('/')}
      />
      <div className="text-4xl font-bold text-[#FF7F50] mb-16 text-center">
        <span className="font-dela">to</span>{' '}
        <span className="font-[Nanum_Gothic] font-bold text-black text-[1.8rem]">
          {maskedName}
        </span>
        ,&nbsp; <span className="font-dela">ok!</span>
      </div>
      <div className="flex flex-col items-center mb-20">
        <img
          src={took1}
          alt="송금 완료"
          className="w-[130px] h-[150px] mb-10 animate-jump"
        />
        <div className="text-sm text-center mb-1">{maskedName} 님에게</div>
        <div className="text-sm mb-5">
          <span className="font-extrabold">{formatNumber(amount)}</span>
          원을 보냈어요.
        </div>
        <div className="w-64 border-t border-b border-gray-300 py-2 mt-5">
          <div className="flex justify-between w-full mt-1 mb-1 px-1">
            <div className="text-sm">출금 계좌</div>
            <div className="text-sm">
              {accountInfo.bankName} ({accountInfo.accountNum.slice(-4)})
            </div>
          </div>
        </div>
      </div>
      <button
        className={`w-[calc(100%-40px)] py-3 rounded-full bg-[#FF7F50] text-white text-lg font-bold cursor-pointer mb-5`}
        onMouseOver={(e) => e.currentTarget.classList.add('shadow-md')}
        onMouseOut={(e) => e.currentTarget.classList.remove('shadow-md')}
        onClick={() => navigate('/')}
        style={{ position: 'absolute', bottom: '10px' }} // 버튼을 화면 하단으로 이동
      >
        메인으로
      </button>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap');
        .font-dela {
          font-family: 'Dela Gothic One', sans-serif;
        }
      `}</style>
    </div>
  );
}

export default CompletePage;
