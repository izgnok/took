import React from 'react';
import getProfileImagePath from '../../utils/getProfileImagePath';
import { formatNumber } from '../../utils/format';
import { formatDateWithoutTime } from '../../utils/formatDate';

const SendMoneyCard = ({
  imgNo,
  userName,
  cost,
  createdAt,
  status,
  onClick,
}) => {
  return (
    <div
      className={`flex flex-col font-[Nanum_Gothic] justify-between p-5 mb-4 bg-white border border-slate-100 rounded-2xl shadow-lg ${status ? 'opacity-50' : ''}`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <img
            src={getProfileImagePath(imgNo)}
            alt={userName}
            className="w-10 h-10 mr-4"
          />
          <div>
            <div className="text-sm font-bold">{userName}</div>
            <div className="text-lg font-bold">{formatNumber(cost)}원</div>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {formatDateWithoutTime(createdAt)}
        </div>
      </div>
      {status ? (
        <div></div>
      ) : (
        <button
          className="text-s text-white font-[Nanum_Gothic] font-semibold bg-main py-2 px-12 rounded-2xl self-center"
          onClick={onClick}
        >
          송금하기
        </button>
      )}
    </div>
  );
};

export default SendMoneyCard;
