import React from 'react';
import { useNavigate } from 'react-router-dom';
import getProfileImagePath from '../../utils/getProfileImagePath';
import formatNumber from '../../utils/format';
import maskName from '../../utils/formatName';
import { formatDate } from '../../utils/formatDate';
import BackButton from '../../components/common/BackButton';

function SendDetailPage() {
  const navigate = useNavigate();

  // 임시 데이터
  const tempMember = {
    userName: '정희수',
    cost: 6500,
    totalCost: 19500,
    status: false, // true이면 "송금 완료", false이면 "송금 미완료"
    bank: '국민은행',
    accountNumber: '12345678910',
    createdAt: '2024-07-13T16:32:00',
  };

  return (
    <div className="flex flex-col items-center bg-white font-[Nanum_Gothic] h-screen">
      <div className="w-full flex items-center px-4 py-5">
        <BackButton />
        <div className="flex-grow text-center text-lg font-bold text-black">
          상세내역
        </div>
      </div>
      <div className="w-full border-b border-gray-300 mb-4" />
      <div className="flex flex-col items-center mb-4">
        <img
          src={getProfileImagePath(1)}
          alt="profile"
          className="w-16 h-16 mb-2 mt-5"
        />
        <div className="text-sm mb-3 ">{maskName(tempMember.userName)}</div>
        <div className="text-lg mb-1">
          {maskName(tempMember.userName)} 님에게 보낼 금액
        </div>
        <div className="text-3xl font-bold text-black mb-2">
          {formatNumber(tempMember.cost)}원
        </div>
        <div className="w-64 border-gray-300 py-3 mt-5">
          <div className="flex justify-between w-full mt-1 mb-2 px-1">
            <div className="text-sm">정산</div>
            <div className="text-sm">
              {formatNumber(tempMember.totalCost)} /{' '}
              <span className="font-bold">
                {formatNumber(tempMember.cost)}원
              </span>
            </div>
          </div>
          {tempMember.status ? (
            <>
              <div className="flex justify-between w-full mt-1 mb-1 px-1">
                <div className="text-sm">송금 상태</div>
                <div className="text-sm font-bold">
                  {tempMember.status ? '송금 완료' : '송금 미완료'}
                </div>
              </div>
              <div className="w-64 border-t border-b border-gray-300 py-3">
                <div className="flex justify-between w-full mt-1 mb-2 px-1">
                  <div className="text-sm">출금 계좌</div>
                  <div className="text-sm font-bold">
                    {tempMember.bank}({tempMember.accountNumber.slice(-4)})
                  </div>
                </div>
              </div>
            </>
          ) : (
            ''
          )}
          <div className="flex justify-between w-full mt-1 mb-1 px-1">
            <div className="text-sm">요청 일시</div>
            <div className="text-sm font-bold">
              {formatDate(tempMember.createdAt)}
            </div>
          </div>
        </div>
        {tempMember.status ? (
          <button
            className="w-80 rounded-full py-3 text-lg font-bold text-gray-300 bg-gray-100 cursor-not-allowed mt-4"
            style={{ position: 'absolute', bottom: '20px' }}
            // disabled
          >
            정산 완료되었습니다
          </button>
        ) : (
          <button
            className="w-80 rounded-full py-3 text-lg font-bold text-white bg-main cursor-not-allowed mt-4"
            style={{ position: 'absolute', bottom: '20px' }}
            // disabled
            onClick={() => {
              navigate('/complete');
            }}
          >
            송금하기
          </button>
        )}
      </div>
    </div>
  );
}

export default SendDetailPage;
