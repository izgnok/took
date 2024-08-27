import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';
import check from '../../assets/payment/check.png';

function AccountCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bank, account, password, accountName } = location.state || {};

  const bankName = bank;
  const accountNumber = account;

  return (
    <div
      className="flex flex-col items-center p-5 h-[70vh]"
      style={{ fontFamily: "'Nanum Gothic', sans-serif" }}
    >
      <div className="w-full flex items-center justify-between mb-5 border-b border-gray-300 pb-2">
        <BackButton />
        <span className="text-lg font-bold mx-auto">계좌 등록</span>
      </div>
      <div className="flex flex-col items-center flex-1 justify-center">
        <div className="bg-[#FF7F50] rounded-full w-16 h-16 flex items-center justify-center mb-5">
          <img src={check} alt="check" className="w-10" />
        </div>
        <div className="text-center text-2xl font-bold mb-5">
          계좌 등록이 <br />
          완료되었습니다.
        </div>
        <div className="w-64 border-t border-b border-gray-300 py-2 mt-5">
          <div className="text-sm mb-2 ml-1">은행명 : {bankName}</div>
          <div className="text-sm mb-1 ml-1">계좌번호 : {accountNumber}</div>
        </div>
      </div>
      <button
        className="w-[calc(100%-40px)] py-3 rounded-full text-white text-lg font-bold cursor-pointer bg-[#FF7F50] mt-5 absolute bottom-5 left-1/2 transform -translate-x-1/2"
        onClick={() => navigate('/')}
      >
        완료
      </button>
    </div>
  );
}

export default AccountCompletePage;
