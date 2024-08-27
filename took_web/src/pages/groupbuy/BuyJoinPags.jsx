import React from 'react';
// import { useParams } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';
import getProfileImagePath from '../../utils/getProfileImagePath';

// todo: 실제 데이터와 연결해야 함
const temp_data = {
  id: 1,
  title: '마이프로틴 공동구매 모집합니다',
  site: '마이프로틴',
  item: '프로틴',
  content: `마프대란 프로틴 같이 공동구매 하실 분 구해요
            <br />
            <br />
            8만원 이상 채워서 주문하고 싶어요! 같이 쿠폰 적용해서 주문해요!!!`,
  place: '송정삼정그린코아더시티 1층',
  current_person: 4,
  max_person: 6,
  img_no: 1,
  visit: 1,
  created_at: new Date(),
};
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const formattedDate = temp_data.created_at.toLocaleDateString('ko-KR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const BuyDetailPage = () => {
  //   const { id } = useParams();
  return (
    <div className="flex flex-col pt-5 bg-white max-w-screen min-h-screen">
      <div className="flex flex-col px-5 w-full ">
        <div className="flex flex-col px-5 w-full">
          <BackButton />
          <div className="mx-6 text-2xl text-main font-extrabold">
            공구 <span className="font-dela">took !</span>
          </div>
        </div>
        <div className="flex flex-col p-4 mt-5 w-full border border-neutral-200 bg-neutral-50 rounded-3xl shadow-md">
          <div className="text-md font-extrabold text-neutral-800 py-2 p-1">
            {temp_data.title}
          </div>
          <div className="shrink-0 h-[0.5px] border border-neutral-300 my-1" />
          <div className="flex gap-5 justify-between mt-3 w-full">
            <div className="flex gap-2.5 items-start text-black">
              <img
                loading="lazy"
                src={getProfileImagePath(temp_data.img_no)}
                className="w-5 mt-1 ml-1"
              />
              <div className="flex flex-col">
                <div className="text-xs font-bold">정 희 수</div>
                <div className="text-[10px]">07/16 16:31</div>
              </div>
            </div>
            <div className="text-[10px] text-neutral-500-500">
              조회 : {temp_data.visit}
            </div>
          </div>
          <div className="mt-9 text-sm text-zinc-800">{temp_data.content}</div>
          <div className="flex gap-2 px-5 py-5 mt-8 bg-white text-black rounded-xl border border-collapse">
            <div className="flex flex-col justify-between text-xs gap-3 font-bold">
              <div>물품명</div>
              <div>구매링크</div>
              <div>수령장소</div>
            </div>
            <div className="self-stretch w-px border border-neutral-300 border-opacity-60" />
            <div className="flex flex-col justify-between text-xs">
              <div className="font-base">{temp_data.item}</div>
              <div>
                <a
                  href="https://www.myprotein.co.kr/"
                  className="font-normal text-black underline underline-offset-4"
                  target="_blank"
                  rel="noreferrer"
                >
                  {temp_data.site}
                </a>
              </div>
              <div className="font-normal">{temp_data.place}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center pt-3 pb-1 mt-4 bg-main rounded-2xl shadow-md">
          <div className="flex flex-col px-16 text-xs font-semibold text-white">
            <div className="mt-4">
              {temp_data.current_person}/{temp_data.max_person}명 | 채팅 개설일{' '}
              {formattedDate}
              <br />
            </div>
            <div className="flex items-center gap-2 justify-center py-auto overflow-x-scroll">
              {Array.from({ length: temp_data.current_person }).map(
                (_, index) => (
                  <img
                    key={index}
                    loading="lazy"
                    src={getProfileImagePath(getRandomNumber(1, 20))}
                    className="w-8 mx-auto mt-3 animate-semijump "
                  />
                )
              )}
            </div>
          </div>
          <div className="shrink-0 mt-4 max-w-full border border-solid border-white border-opacity-40 w-[80%] mx-10" />
          <div className="my-3 text-base font-bold text-white">참여하기</div>
        </div>
      </div>
    </div>
  );
};

export default BuyDetailPage;
