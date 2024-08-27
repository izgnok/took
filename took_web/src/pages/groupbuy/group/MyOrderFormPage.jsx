import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BackButton from '../../../components/common/BackButton';
import {
  writePurchaseApi,
  updateMyPurchaseApi,
} from '../../../apis/groupBuy/purchase';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useUser } from '../../../store/user.js';
import { getShopApi } from '../../../apis/groupBuy/shop.js';

const initialData = [{ name: '', option: '', etc: '' }];

function MyOrderFormPage() {
  const { id: shopSeq } = useParams(); // 현재 경로에서 shopSeq 값을 가져옴
  const { state } = useLocation(); // navigate를 통해 전달된 상태 값 (purchase 정보 포함)
  const { seq: userSeq } = useUser();
  const [shopInfo, setShopInfo] = useState({});
  const [myData, setMyData] = useState(initialData);
  const [total, setTotal] = useState('');
  const [shipCost, setShipCost] = useState(''); // 배송비 상태 추가
  const navigate = useNavigate();
  const isEditMode = state && state.purchase; // 수정 모드인지 확인
  const [isLeader, setIsLeader] = useState(false);

  useEffect(() => {
    // 수정 모드인 경우, 기존 구매 정보를 폼에 설정
    if (isEditMode) {
      const { purchase } = state;
      setTotal(purchase.price); // 기존 총 금액 설정
      setShipCost(purchase.shipCost); // 기존 배송비 설정
      loadShopInfo();
      setMyData(
        purchase.productList.map((product) => ({
          name: product.productName,
          option: product.optionDetails,
          etc: product.etc,
        }))
      );
    }
  }, [isEditMode, state]);

  useEffect(() => {
      loadShopInfo();
  }, [userSeq]);

  const loadShopInfo = async () => {
    try {
      const response = await getShopApi(shopSeq);
      console.log('shopInfo', response);
      setShopInfo(response);
      if (userSeq === response.userSeq) {
        setIsLeader(true);
      }
    } catch (err) {
      console.log('Error fetching shop info', err);
    }
  };
  const handleChange = (idx, field, value) => {
    const newData = myData.map((item, index) =>
      index === idx ? { ...item, [field]: value } : item
    );
    setMyData(newData);
  };

  const addNewItem = () => {
    setMyData([...myData, { name: '', option: '', etc: '' }]);
  };

  const removeItem = (idx) => {
    if (idx > 0) {
      const newData = myData.filter((_, index) => index !== idx);
      setMyData(newData);
    }
  };

  const handleSubmit = async () => {
    const price = parseInt(total, 10);

    const productList = myData.map((item) => ({
      productName: item.name,
      optionDetails: item.option,
      etc: item.etc,
    }));

    const params = {
      userSeq,
      shopSeq: parseInt(shopSeq, 10),
      price,
      shipCost: parseInt(shipCost, 10),
      productList,
    };

    try {
      if (isEditMode) {
        // 수정 모드일 때, updateMyPurchaseApi 호출
        await updateMyPurchaseApi({
          purchaseSeq: state.purchase.purchaseSeq,
          params,
        });
        alert('주문 정보가 성공적으로 수정되었습니다.');
      } else {
        // 등록 모드일 때, writePurchaseApi 호출
        await writePurchaseApi(params);
        alert('주문 정보가 성공적으로 등록되었습니다.');
      }
      navigate(`/groupbuy/total/${shopSeq}`, { state: { shopInfo } });
    } catch (error) {
      alert('에러가 발생했습니다. 다시 시도해주세요.');
      console.error('API call error:', error);
    }
  };

  return (
    <div className="flex flex-col pt-5 bg-white max-w-screen min-h-screen">
      <div className="flex flex-col px-5 w-full">
        <div className="flex flex-col px-5 w-full">
          <BackButton />
          <div className="mx-6 text-2xl text-main font-extrabold">
            공구 <span className="font-dela">took !</span>
          </div>
        </div>
        <div className="flex flex-col border border-neutral-200 pt-5 pb-1 mt-6 bg-neutral-50 rounded-2xl shadow-md">
          <div className="flex flex-col px-4 text-xs text-black">
            <div className="text-base font-bold">
              내 구매 정보 {isEditMode ? '수정' : '등록'}
            </div>
            <hr className="border border-neutral-300 w-full mx-auto my-3" />

            {myData.map((data, idx) => (
              <div
                key={idx}
                className="flex text-sm flex-col gap-3 items-start border border-neutral-200 py-3 px-4 mt-2 text-black bg-white rounded-xl shadow-sm font-medium"
              >
                <label className="w-full flex justify-between items-center">
                  물품명
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => handleChange(idx, 'name', e.target.value)}
                    className="ml-4 p-2 rounded-md text-right border border-collapse focus:outline-none focus:ring-2 focus:ring-main"
                  />
                </label>
                <label className="w-full flex justify-between items-center">
                  선택옵션
                  <input
                    type="text"
                    value={data.option}
                    onChange={(e) =>
                      handleChange(idx, 'option', e.target.value)
                    }
                    className="ml-4 p-2 rounded-md text-right border border-collapse focus:outline-none focus:ring-2 focus:ring-main"
                  />
                </label>
                <label className="w-full flex justify-between items-center">
                  기타사항
                  <input
                    type="text"
                    value={data.etc}
                    onChange={(e) => handleChange(idx, 'etc', e.target.value)}
                    className="ml-4 p-2 rounded-md text-right border border-collapse focus:outline-none focus:ring-2 focus:ring-main"
                  />
                </label>
                {idx > 0 &&
                  data.name === '' &&
                  data.option === '' &&
                  data.etc === '' && (
                    <button
                      onClick={() => removeItem(idx)}
                      className="self-end mt-1 text-neutral-400"
                    >
                      <FaRegTrashAlt />
                    </button>
                  )}
              </div>
            ))}
            <div
              className="self-center mt-4 text-main text-xs underline cursor-pointer"
              onClick={addNewItem}
            >
              상품 추가하기
            </div>
          </div>
          {isLeader && (
            <div className="flex text-sm flex-col items-start py-3 px-4 m-4 border border-neutral-200 text-black bg-white rounded-xl shadow-sm">
              <label className="w-full flex justify-between items-center">
                배송비
                <input
                  type="text"
                  value={shipCost} // 배송비 상태와 연결
                  onChange={(e) => setShipCost(e.target.value)} // 배송비 상태 업데이트
                  className="ml-4 py-2 p-2 rounded-md text-right border border-collapse focus:outline-none focus:ring-2 focus:ring-main"
                />
              </label>
            </div>
          )}
          <div className="flex text-sm flex-col items-start py-3 px-4 m-4 border border-neutral-200 text-black bg-white rounded-xl shadow-sm">
            <label className="w-full flex justify-between items-center">
              총 금액
              <input
                type="text"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className="ml-4 py-2 p-2 rounded-md text-right border border-collapse focus:outline-none focus:ring-2 focus:ring-main"
              />
            </label>
          </div>
        </div>
        <div
          onClick={handleSubmit}
          className="px-16 py-3 my-6 text-md text-center font-bold text-white bg-main rounded-xl shadow-md cursor-pointer"
        >
          {isEditMode ? '수정하기' : '등록하기'}
        </div>
      </div>
    </div>
  );
}

export default MyOrderFormPage;
