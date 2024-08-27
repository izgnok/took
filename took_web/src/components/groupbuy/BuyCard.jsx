import React from 'react';
import getProfileImagePath from '../../utils/getProfileImagePath';
import { useNavigate } from 'react-router-dom';

export const BuyCard = ({
  id,
  title,
  item,
  place,
  count,
  maxCount,
  img_no,
  status, // status 추가
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="p-2 cursor-pointer"
      onClick={() => navigate(`/groupbuy/${id}`)}
    >
      <div className="flex gap-5 justify-between items-center">
        <div className="flex flex-col text-black">
          <div className="text-sm font-extrabold">{title}</div>
          <div className="mt-2 text-xs">
            물품명: {item}
            <br />
            수령 장소: {place}
          </div>
        </div>
        <div className="flex flex-col items-end text-[10px] mt-2 font-bold text-black whitespace-nowrap">
          <img
            loading="lazy"
            src={getProfileImagePath(img_no)}
            className="w-6 h-6"
            alt="Profile"
          />
          <div className="mt-2">
            {count + 1}/{maxCount + 1}명
          </div>
        </div>
      </div>
    </div>
  );
};
