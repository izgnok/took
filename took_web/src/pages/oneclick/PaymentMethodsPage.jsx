// src/pages/oneclick/PaymentMethodsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 추가된 부분
import BackButton from '../../components/common/BackButton';
import {
  getAccountListApi,
  changeMainAccountApi,
  deleteAccountApi,
  linkAccountApi,
} from '../../apis/account/info.js';
import { useUser } from '../../store/user.js';
import { bankIcons, bankNumToName } from '../../assets/payment/index.js';

const getImagePath = (bankNum) => {
  const bankName = bankNumToName[bankNum];
  return bankIcons[bankName] || '';
};

const PaymentMethodsPage = () => {
  const { seq: userSeq } = useUser();
  const [accounts, setAccounts] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 추가된 부분

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await getAccountListApi({ userSeq });
        setAccounts(response.list || []);
      } catch (error) {
        console.error('계좌 목록을 가져오는 중 오류가 발생했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [userSeq]);

  useEffect(() => {
    if (accounts.length > 0) {
      handleSetMainAccount(0);
    }
  }, [accounts]);

  const handleSetMainAccount = async (index) => {
    try {
      const accountSeq = accounts[index].accountSeq;
      await changeMainAccountApi({ userSeq, accountSeq });
      console.log('주계좌가 변경되었습니다.');
    } catch (error) {
      console.error('주계좌를 변경하는 중 오류가 발생했습니다:', error);
    }
  };

  const handleDelete = async (index) => {
    try {
      const accountSeq = accounts[index].accountSeq;
      await deleteAccountApi({ accountSeq });
      const newAccounts = accounts.filter((_, i) => i !== index);
      setAccounts(newAccounts);
    } catch (error) {
      console.error('계좌를 삭제하는 중 오류가 발생했습니다:', error);
    }
  };

  const onDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.parentNode);
    setDraggingIndex(index);
  };

  const onDragOver = (index) => {
    if (draggingIndex === index) return;

    const tempAccounts = [...accounts];
    const [draggedItem] = tempAccounts.splice(draggingIndex, 1);
    tempAccounts.splice(index, 0, draggedItem);

    setDraggingIndex(index);
    setAccounts(tempAccounts);
  };

  const onDragEnd = () => {
    setDraggingIndex(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center p-5 h-screen font-nanum">
      <div className="w-full flex items-center justify-between mb-5 border-b border-gray-300 pb-2">
        <BackButton />
        <span className="text-lg font-bold mx-auto">결제수단 관리</span>
      </div>
      <div className="w-full">
        <div className="mb-2 text-sm text-gray-600">
          등록 계좌 <span className="font-bold">{accounts.length}</span>개
        </div>
        {accounts.map((account, index) => (
          <div
            key={index}
            className={`flex items-center py-2 border-b border-gray-300 cursor-grab transition duration-200 relative ${draggingIndex === index ? 'bg-gray-200 opacity-50' : 'bg-white'}`}
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={() => onDragOver(index)}
            onDragEnd={onDragEnd}
          >
            <div className="text-lg mr-2">≡</div>
            <div className="flex items-center ml-2 flex-1">
              <img
                src={getImagePath(account.bankNum)}
                alt={`${account.bankName} 로고`}
                className="w-10 h-10 mr-2"
              />
              <div className="flex flex-col">
                <div className="flex items-center text-lg font-bold">
                  {bankNumToName[account.bankNum]}
                  {index === 0 && (
                    <span className="bg-orange-100 text-main text-xs ml-2 px-2 py-1 rounded-full">
                      주계좌
                    </span>
                  )}
                </div>
                <div className="text-sm text-black">{account.accountNum}</div>
                <div className="text-sm text-gray-500">
                  {account.accountName}
                </div>
              </div>
            </div>
            <button
              className="border border-gray-400 bg-white text-sm text-black cursor-pointer rounded-full px-3 py-1 absolute right-2"
              onClick={() => handleDelete(index)}
            >
              삭제
            </button>
          </div>
        ))}
      </div>
      <button
        className="w-[calc(100%-40px)] py-3 rounded-full border-none text-white text-lg font-bold cursor-pointer bg-main mt-5 absolute bottom-5 left-1/2 transform -translate-x-1/2"
        onClick={() => navigate('/account')} // 수정된 부분
      >
        + 결제 수단 추가
      </button>
    </div>
  );
};

export default PaymentMethodsPage;
