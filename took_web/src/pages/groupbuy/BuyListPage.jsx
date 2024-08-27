import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BuyCard } from '../../components/groupbuy/BuyCard';
import { useUser } from '../../store/user';
import backIcon from '../../assets/common/back.svg';
import { nearShopApi } from '../../apis/groupBuy/shop';

function BuyListPage() {
  const { seq: userSeq } = useUser();
  const [buyList, setBuyList] = useState([]);
  const location = useLocation();
  const shouldRefresh = location.state?.shouldRefresh;

  useEffect(() => {
    const fetchBuyList = async () => {
      try {
        const data = await nearShopApi(userSeq);
        console.log('근처 유저들을 데리고 옵니다', data);

        if (Array.isArray(data)) {
          const updatedData = data
            .map((buy) => ({
              ...buy,
              status: buy.count === buy.maxCount ? 'IN_PROGRESS' : buy.status,
            }))
            .filter((buy) => buy.status === 'OPEN'); // 'OPEN' 상태인 항목만 필터링
          setBuyList(updatedData);
          console.log("출력1",buyList);
        } else {
          setBuyList([]); // 응답이 배열이 아닌 경우 빈 배열로 설정
        }
      } catch (error) {
        console.error('API call error:', error);
        setBuyList([]); // API 호출 에러 발생 시 빈 배열로 설정
      }
    };

    fetchBuyList();
  }, [userSeq, shouldRefresh]);

  return (
    <div className="flex flex-col pt-5 bg-white min-w-screen min-h-screen">
      <div className="flex flex-col items-center justify-center px-5 w-full">
        <Link to="/">
          <img
            src={backIcon}
            alt="뒤로"
            className="w-6 h-6 mx-6 mt-6 absolute top-0 left-0 opacity-80"
          />{' '}
        </Link>
        <div className="self-center mb-3 text-2xl text-main font-extrabold">
          공구 <span className="font-dela">took !</span>
        </div>
        <div className="flex flex-col p-5 mt-2.5 w-full bg-neutral-50 shadow-md rounded-2xl border border-neutral-200 overflow-y-auto">
          {buyList.map((buy, index) => (
            <React.Fragment key={buy.shopSeq}>
              <BuyCard
                id={buy.shopSeq}
                title={buy.title}
                site={buy.site}
                item={buy.item}
                place={buy.place}
                count={buy.count || 0} // 현재 인원 수를 제공하지 않는 경우 기본값 0 설정
                maxCount={buy.maxCount}
                img_no={buy.imageNo || 1} // 이미지 번호를 제공하지 않는 경우 기본값 1 설정
                status={buy.status} // status 전달
              />
              {index < buyList.length - 1 && (
                <div className="shrink-0 my-2 border border-solid border-neutral-300 border-opacity-40" />
              )}
            </React.Fragment>
          ))}
        </div>
        <Link to="/groupbuy/form" className="w-full">
          <button className="bg-main px-12 py-3 mb-8 mt-6 w-full shadow-sm font-bold text-white rounded-2xl">
            공동구매 모집하기
          </button>
        </Link>
      </div>
    </div>
  );
}

export default BuyListPage;
