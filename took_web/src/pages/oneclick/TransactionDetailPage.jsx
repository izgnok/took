// src/pages/TransactionDetailPage.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';
import { formatNumber } from '../../utils/format';
import getProfileImagePath from '../../utils/getProfileImagePath';

const TransactionDetailPage = () => {
  const location = useLocation();
  const transaction = location.state.transaction;
  console.log(transaction);
  const { userName, imgNo, cost, type, bankName, accountNum, createdAt } =
    transaction;
  const accountLabel = type === '받기' ? '입금 계좌' : '출금 계좌';

  return (
    <div className="flex flex-col bg-white max-w-[360px] mx-auto relative h-screen">
      <div className="flex items-center border-b border-gray-300 px-4 py-3 mb-3">
        <BackButton />
        <div className="mt-2.5 flex-grow text-center text-lg font-bold text-black">
          상세내역
        </div>
      </div>
      <div className="flex flex-col items-center mt-8">
        <img
          src={getProfileImagePath(imgNo)}
          alt={userName}
          className="w-16 h-16 mb-4"
        />
        <div className="text-lg font-bold">{userName}</div>
        <div className="text-gray-500">{type}</div>
        <div className="text-3xl font-bold mt-4">{formatNumber(cost)}원</div>
      </div>
      <div className="mt-8 px-4">
        <div className="border-t border-b border-gray-300 py-4 ml-2 mr-2">
          <div className="flex justify-between py-2">
            <span className="text-gray-500">{accountLabel}</span>
            <span className="font-bold">
              {bankName}({accountNum})
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">일시</span>
            <span className="font-bold">
              {new Date(createdAt).toLocaleString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailPage;
