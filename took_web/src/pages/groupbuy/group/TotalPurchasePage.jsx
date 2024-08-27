import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import getProfileImagePath from '../../../utils/getProfileImagePath';
import { FiPlusCircle } from 'react-icons/fi';
import { FaRegTrashAlt } from 'react-icons/fa';
import { TbPencil } from 'react-icons/tb';
import { formatNumber } from '../../../utils/format';
import {
  getAllPurchaseApi,
  deleteMyPurchaseApi,
} from '../../../apis/groupBuy/purchase';
import { getUserInfoApi } from '../../../apis/user.js';
import { useUser } from '../../../store/user.js';
import { useLocation } from 'react-router-dom';
import { makePartyApi } from '../../../apis/pay.js';
import { insertAllMemberApi } from '../../../apis/payment/jungsan.js';
import { setPartyApi, getShopApi } from '../../../apis/groupBuy/shop.js';
import backIcon from '../../../assets/common/back.svg'

function TotalPurchasePage() {
  const location = useLocation();
  const { shopInfo } = location.state || {};
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅
  const { id: shopSeq } = useParams(); // 현재 경로에서 shopSeq 값을 가져옴
  const [purchaseData, setPurchaseData] = useState([]);
  const [totalAmountSum, setTotalAmountSum] = useState(0);
  const [loading, setLoading] = useState(true);
  const { seq: currentUserSeq } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState(null);
  const [chatRoom, setChatRoom] = useState();
  const [deliveryTip, setDeliveryTip] = useState(0);

  const handleBackClick = () => {
    const id = shopInfo.roomSeq;
    console.log(id);
    navigate(`/chat/buy/${id}`); 
  };

  const fetchShopData = async () => {
    try {
      const data = await getShopApi(shopSeq);

      setChatRoom((prev) => ({
        ...prev,
        userSeq: data.userSeq,
        roomTitle: data.title,
      }));

    } catch (error) {
      console.log('fetching shop data error', error);
    }
  };

  useEffect(() => {
    const fetchPurchaseData = async () => {
      try {
        const response = await getAllPurchaseApi(shopSeq);
        const purchases = response.purchaseInfoResponseList || [];

        const purchasesWithUserNames = await Promise.all(
          purchases.map(async (purchase) => {
            try {
              const userInfo = await getUserInfoApi({
                userSeq: purchase.userSeq,
              });
              return { ...purchase, userName: userInfo.userName, imgNo: userInfo.imageNo };
            } catch (error) {
              console.error('Error fetching user info:', error);
              return purchase;
            }
          })
        );

        // userSeq가 shopInfo.userSeq와 일치하는 항목의 shipCost를 찾기
        const leaderPurchase = purchasesWithUserNames.find(
          (purchase) => purchase.userSeq === shopInfo.userSeq
        );

        // 배달비로 shipCost 저장
        const calculatedDeliveryTip = leaderPurchase ? leaderPurchase.shipCost : 0;
        setDeliveryTip(calculatedDeliveryTip);

        setPurchaseData(purchasesWithUserNames);
        setTotalAmountSum(response.listTotal || 0);
      } catch (error) {
        console.error('Error fetching purchase data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShopData();
    fetchPurchaseData();
  }, [shopSeq]);
  
  const handleDelete = async () => {
    try {
      await deleteMyPurchaseApi(purchaseToDelete);
      setPurchaseData(
        purchaseData.filter(
          (purchase) => purchase.purchaseSeq !== purchaseToDelete
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting purchase:', error);
    }
  };

  // 파티 생성
  const handleComplete = async () => {
    try {

      const response = await makePartyApi({
        userSeq: shopInfo.userSeq,
        title: shopInfo.title,
        category: 3
      });
      // 정산 API 호출 
      if(response){
        const setParty = await setPartyApi({
          shopSeq: shopInfo.shopSeq,
          partySeq: response.partySeq
        });

        const userCosts = purchaseData.map(purchase => ({
          userSeq: purchase.userSeq,
          cost: purchase.price,
        }));
        
        // shopInfo.userSeq와 일치하는 사용자의 shipCost를 deliveryTip으로 설정
        const leaderPurchase = purchaseData.find(purchase => purchase.userSeq === shopInfo.userSeq);
        const calculatedDeliveryTip = leaderPurchase ? leaderPurchase.shipCost : 0;

        // 최종 요청 바디 생성
        const requestBody = {
          partySeq: response.partySeq,  // 이 값은 필요에 따라 동적으로 설정해야 함
          userCosts: userCosts,
          deliveryTip: calculatedDeliveryTip,
        };
        
        const response2 = await insertAllMemberApi(requestBody);
        navigate(`/chat/buy/${shopInfo.roomSeq}`, { state: { chatRoom } });
      }
      
    } catch (error) {
      console.error('Error:', error);
    }
  };
  // 수정 버튼 클릭 시 호출되는 함수
  const handleEdit = (purchase) => {
    // 특정 구매 정보(purchase)를 상태로 전달하며, /groupbuy/my-order/:shopSeq 페이지로 이동
    navigate(`/groupbuy/my-order/${shopSeq}`, { state: { purchase } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col pt-5 bg-white max-w-screen min-h-screen">
      <div className="flex flex-col px-5 w-full">
        <div className="flex flex-col px-5 w-full">
          <img
          src={backIcon}
          alt="뒤로"
          className="w-6 h-6 mx-6 mt-6 absolute top-0 left-0 opacity-80"
          onClick={handleBackClick}
        />
          <div className="mx-6 text-2xl text-main font-extrabold">
            공구 <span className="font-dela">took !</span>
          </div>
        </div>
        <div className="flex flex-col py-5 pb-1 my-6 bg-neutral-50 border border-neutral-200 rounded-2xl shadow-md">
          <div className="flex flex-col px-4 text-xs text-black">
            <div className="flex flex-row justify-between">
              <div className="text-lg font-bold">전체 구매 정보</div>
              <FiPlusCircle
                onClick={() => navigate(`/groupbuy/my-order/${shopSeq}`)}
                className="w-5 h-5 mt-1 mr-1"
              />
            </div>
            <hr className="border border-neutral-300 w-full mx-auto my-3" />
            {purchaseData.length === 0 ? (
              <div className="text-center text-gray-500">
                등록된 구매 정보가 없습니다.
              </div>
            ) : (
              purchaseData.map((el, idx) => (
                <div key={idx} className="my-4">
                  <div className="flex items-center mb-2">
                    <img
                      loading="lazy"
                      src={getProfileImagePath(el.imgNo)}
                      alt="Profile"
                      className="w-7"
                    />
                    <div className="ml-2 text-sm text-black font-semibold">
                      {el.userName || 'Unknown'}
                    </div>
                    {el.userSeq === currentUserSeq && (
                      <div className="flex flex-row items-center ml-auto mr-2 gap-2">
                        <TbPencil
                          className="w-5 h-5 text-neutral-500 cursor-pointer"
                          onClick={() => handleEdit(el)} // 수정 버튼 클릭 시 handleEdit 호출
                        />
                        <FaRegTrashAlt
                          className="w-4 h-4 text-neutral-500 cursor-pointer"
                          onClick={() => {
                            setShowModal(true);
                            setPurchaseToDelete(el.purchaseSeq);
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="bg-white rounded-lg text-gray-500 p-3 border border-collapse shadow-sm">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold">물품명</span>
                      <div className="text-right">
                        {el.productList.map((product, productIdx) => (
                          <div key={productIdx} className="text-xs">
                            {product.productName}
                          </div>
                        ))}
                      </div>
                    </div>
                    <hr className="my-2 border-neutral-300" />
                    <div className="flex justify-between">
                      <span className="font-bold text-black">전체 금액</span>
                      <div className="text-right text-black font-semibold">
                        {formatNumber(el.price)}원
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <hr className="border border-neutral-300 w-[90%] my-2 mx-auto" />
          <div className="text-black font-bold text-lg text-center px-5 py-3">
            배송비 : {formatNumber(deliveryTip)}원
          </div>
          <div className="text-black font-bold text-lg text-center px-5 py-3">
            총 금액 : {formatNumber(totalAmountSum)}원
          </div>
        </div>
      </div>
      {!shopInfo.partySeq && currentUserSeq === shopInfo.userSeq && (
          <button
            className="bg-main px-12 py-3 mt-6 w-full shadow-sm font-bold text-white rounded-2xl"
            onClick={handleComplete}
          >
            주문 확정
          </button>
        )}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 shadow-md rounded-2xl">
            <div className="mb-4 font-bold">게시물을 삭제하시겠습니까?</div>
            <div className="flex justify-center gap-2 text-neutral-600 font-bold">
              <button
                onClick={() => setShowModal(false)}
                className="px-8 py-2 bg-neutral-200 rounded-xl"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="px-8 py-2 bg-main text-white rounded-xl"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TotalPurchasePage;
