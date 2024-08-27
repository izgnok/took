import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../../components/common/BackButton';
import getProfileImagePath from '../../../utils/getProfileImagePath';
import { TbPencil } from 'react-icons/tb';
import { FaRegTrashAlt } from 'react-icons/fa';
import {
  writeShipApi,
  getShipApi,
  modifyShipApi,
  deleteShipApi,
} from '../../../apis/groupBuy/ship.js';

const initialData = [{ name: '', option: '', etc: '' }];

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function OrderFormPage() {
  const { id: shopSeq } = useParams(); // URL 파라미터에서 shopSeq를 가져옴
  const [courier, setCourier] = useState('');
  const [invoiceNum, setInvoiceNum] = useState('');
  const [images, setImages] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasOrderInfo, setHasOrderInfo] = useState(false); // 기존 배송 정보가 있는지 여부를 추적
  const [shipSeq, setShipSeq] = useState(null); // 배송 정보 시퀀스 추적
  const [showModal, setShowModal] = useState(false); // 삭제 모달 상태

  useEffect(() => {
    const newImages = Array.from({ length: 4 }).map(() =>
      getProfileImagePath(getRandomNumber(1, 20))
    );
    setImages(newImages);

    const fetchOrderInfo = async () => {
      try {
        const existingOrderInfo = await getShipApi(shopSeq);
        console.log('getShipApi:', existingOrderInfo);
        setCourier(existingOrderInfo.courier);
        setInvoiceNum(existingOrderInfo.invoiceNum);
        setShipSeq(existingOrderInfo.shipSeq);
        setHasOrderInfo(true); // 기존 배송 정보가 있음을 표시
        console.log('hasOrderInfo (after setting true): ', true);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          console.log('No order info found, entering creation mode.');
          setHasOrderInfo(false); // 등록한 정보가 없음을 표시
          console.log('hasOrderInfo (after setting false): ', false);
        } else {
          console.error('Error fetching order info:', error);
        }
      }
    };

    fetchOrderInfo();
  }, [shopSeq]);

  const handleCourierChange = (e) => {
    setCourier(e.target.value);
  };

  const handleInvoiceNumChange = (e) => {
    setInvoiceNum(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (hasOrderInfo && shipSeq) {
      // 수정 모드
      const params = {
        courier: courier,
        invoiceNum: invoiceNum,
      };

      try {
        const response = await modifyShipApi(shipSeq, params);
        alert('배송 정보가 성공적으로 수정되었습니다.');
        console.log('Updated ship info:', response);
      } catch (error) {
        alert('에러가 발생했습니다. 다시 시도해주세요.');
        console.error('API call error:', error);
      }
    } else {
      // 등록 모드
      const params = {
        shopSeq: parseInt(shopSeq, 10), /// 라우트 파라미터에서 가져온 shopSeq를 10진수로 변환
        courier: courier,
        invoiceNum: invoiceNum,
      };

      try {
        const response = await writeShipApi(params);
        alert('배송 정보가 성공적으로 등록되었습니다.');
        const newShipSeq = response.shipSeq;
        console.log('Created ship info:', newShipSeq);
        window.location.reload(); // 페이지 새로고침
      } catch (error) {
        alert('에러가 발생했습니다. 다시 시도해주세요.');
        console.error('API call error:', error);
      }
    }

    setIsEditMode(false); // 수정 모드를 종료합니다.
  };

  const handleDelete = async () => {
    try {
      await deleteShipApi(shipSeq);
      alert('배송 정보가 성공적으로 삭제되었습니다.');
      setCourier('');
      setInvoiceNum('');
      setShipSeq(null);
      setHasOrderInfo(false);
      setShowModal(false);
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
        <div className="flex flex-col pt-5 pb-1 mt-6 bg-neutral-50 border border-neutral-200 rounded-2xl shadow-md">
          <div className="flex flex-col px-4 text-xs text-black">
            <div className="text-lg font-bold">상품 주문 정보 등록</div>
            <hr className="border border-neutral-300 w-full mx-auto my-3" />
            <div className="flex flex-row justify-between items-center">
              <div className="text-base font-semibold pl-2 pt-2 ">
                배송 정보
              </div>
              {hasOrderInfo && !isEditMode && (
                <div className="flex flex-row gap-2 mt-2 mr-1">
                  <button onClick={() => setIsEditMode(true)}>
                    <TbPencil className="text-neutral-500 w-5 h-5" />
                  </button>
                  <button onClick={() => setShowModal(true)}>
                    <FaRegTrashAlt className="text-neutral-500 w-5 h-4" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex text-sm flex-col items-start py-1 px-4 mt-5 text-black bg-white rounded-xl shadow-sm border border-neutral-200 font-medium">
              {isEditMode || !hasOrderInfo ? (
                <>
                  <label className="w-full my-2 flex font-bold justify-between items-center">
                    택배사
                    <input
                      type="text"
                      value={courier}
                      onChange={handleCourierChange}
                      className="ml-4 p-2 rounded-md font-normal text-right border border-collapse focus:outline-none focus:ring-2 focus:ring-main"
                    />
                  </label>
                  <label className="w-full my-2 flex font-bold justify-between items-center mt-2">
                    송장번호
                    <input
                      type="number"
                      value={invoiceNum}
                      onChange={handleInvoiceNumChange}
                      className="ml-4 p-2 rounded-md font-normal text-right border border-collapse focus:outline-none focus:ring-2 focus:ring-main"
                    />
                  </label>
                </>
              ) : (
                <>
                  <div className="w-full my-2 flex font-bold justify-between items-center">
                    택배사
                    <span className="ml-4 p-2 font-normal rounded-md text-right">
                      {courier}
                    </span>
                  </div>
                  <div className="w-full my-2 flex font-bold justify-between items-center mt-2">
                    송장번호
                    <span className="ml-4 p-2 font-normal rounded-md text-right">
                      {invoiceNum}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 justify-center p-10 overflow-x-scroll">
              {images.map((src, index) => (
                <img
                  key={index}
                  loading="lazy"
                  src={src}
                  className="w-8 mx-auto mt-3 animate-semijump"
                />
              ))}
            </div>
          </div>
        </div>
        {(!hasOrderInfo || isEditMode) && (
          <div
            onClick={handleSubmit}
            className="px-16 py-3 my-6 text-md text-center font-bold text-white bg-main rounded-2xl shadow-md cursor-pointer"
          >
            {isEditMode ? '수정하기' : '등록하기'}
          </div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 shadow-md rounded-2xl">
            <div className="mb-4 font-bold">배송 정보를 삭제하시겠습니까?</div>
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

export default OrderFormPage;
