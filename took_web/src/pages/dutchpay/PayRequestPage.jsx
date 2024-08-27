import React from 'react';
import BackButton from '../../components/common/BackButton';

function PayRequestPage() {
  return (
    <div className="flex flex-col items-center px-20 text-4xl text-main bg-white max-w-[360px] relative">
      <div className="self-start mt-4 ml-4">
        <BackButton />
      </div>
      <div className="mt-12">
        <span className="text-3xl font-extrabold text-main">정산</span>{' '}
        <span className="text-main font-dela">took !</span>
      </div>
      <div className="mt-4 text-sm">송금 요청이 도착했습니다</div>
      <img
        loading="lazy"
        srcSet="/src/assets/profile/img1.png"
        className="mt-16 max-w-full aspect-[0.84] w-[141px] animate-jump"
      />
      <div className="mt-20 font-extrabold">
        8,777<span> 원</span>
      </div>
      <div className="self-stretch px-7 py-4 mt-28 text-base font-extrabold text-white bg-main rounded-2xl shadow-sm">
        공지환님께 송금하기
      </div>
    </div>
  );
}

export default PayRequestPage;
