// src/pages/MyTookMoneyPage.jsx
import React, { useEffect, useState } from 'react';
import { AiOutlineRight } from 'react-icons/ai';
import { formatNumber } from '../../utils/format';
import BackButton from '../../components/common/BackButton';
import HistoryCard from '../../components/mypage/tookHistory/historyCard';
import { bankIcons, bankNumToName } from '../../assets/payment/index.js';
import { getAccountListApi } from '../../apis/account/info.js';
import { useUser } from '../../store/user';
import { Link } from 'react-router-dom';
import { payHistoryApi, noPayList } from '../../apis/payment/jungsan';
import SendMoneyCard from '../../components/payment/SendMoneyCard';
// 임의의 데이터

// const getImagePath = (bankName) => {
//   const bankImages = import.meta.glob('../../assets/payment/bank/*.png', {
//     eager: true,
//   });
//   const stockImages = import.meta.glob('../../assets/payment/stock/*.png', {
//     eager: true,
//   });

//   if (bankName.endsWith('은행')) {
//     bankName = bankName.slice(0, -2);
//     return (
//       bankImages[`../../assets/payment/bank/${bankName}.png`]?.default || ''
//     );
//   }
//   if (bankName.endsWith('증권')) {
//     bankName = bankName.slice(0, -2);
//     return (
//       stockImages[`../../assets/payment/stock/${bankName}.png`]?.default || ''
//     );
//   }
//   return bankImages[`../../assets/payment/bank/${bankName}.png`]?.default || '';
// };
const getImagePath = (bankNum) => {
  const bankName = bankNumToName[bankNum];
  return bankIcons[bankName] || '';
};
const getProfileImagePath = (imgNo) => {
  const profileImages = import.meta.glob('../../assets/profile/*.png', {
    eager: true,
  });
  return profileImages[`../../assets/profile/img${imgNo}.png`]?.default || '';
};

const MyTookMoneyPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [history, sethistory] = useState([]);
  const [noPay, setNoPay] = useState([]);
  const { seq } = useUser();
  const params = { userSeq: seq };
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await getAccountListApi(params);
        if (response && response.list) {
          const accountList = response.list.map((account) => ({
            bankNum: account.bankNum,
            accountSeq: account.accountSeq,
            accountName: account.accountName,
            accountNum: account.accountNum,
            balance: account.balance,
          }));
          setAccounts(accountList);
        }
      } catch (error) {
        console.error('계좌 정보를 불러오는데 실패했습니다:', error);
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await payHistoryApi(seq);
        if (response) {
          const historyList = response.map((history) => ({
            userName: history.userName,
            imgNo: history.imageNo,
            createdAt: history.createdAt,
            cost: history.cost,
            type: history.receive == 1 ? '받기' : '송금',
          }));
          sethistory(historyList);
        }
      } catch (error) {
        console.error('거래 내역 정보를 불러오는데 실패했습니다:', error);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    const fetchNoPay = async () => {
      try {
        const response = await noPayList(seq);
        if (response) {
          const noPayList = response.map((noPay) => ({
            partySeq: noPay.partySeq,
            userSeq: noPay.userSeq,
            userName: noPay.userName,
            imgNo: noPay.imageNo,
            cost: noPay.cost,
            category: noPay.category,
            createdAt: noPay.createdAt,
          }));
          setNoPay(noPayList);
        }
      } catch (error) {
        console.error('미정산 내역 정보를 불러오는데 실패했습니다:', error);
      }
    };
    fetchNoPay();
  }, []);

  return (
    <div className="flex flex-col bg-white max-w-[360px] mx-auto relative h-screen">
      <div className="flex items-center border-b border-gray-300 px-4 py-3 mb-3">
        <BackButton />
        <div className="mt-2.5 flex-grow text-center text-lg font-bold text-black">
          나의 툭머니
        </div>
      </div>
      <Link to="/payment-methods">
        <div className="flex items-center justify-between mb-5 p-3 bg-[#FBFBFB] rounded-lg shadow-md mx-4">
          <span className="text-black text-sm">등록 계좌</span>
          <div className="flex items-center text-sm font-bold">
            {accounts.length > 0 ? (
              <>
                <img
                  src={getImagePath(accounts[0].bankNum)}
                  alt="은행 로고"
                  className="w-6 h-6 mr-2"
                />
                {bankNumToName[accounts[0].bankNum]} 외 {accounts.length - 1}개
              </>
            ) : (
              <span>0개</span>
            )}
          </div>
        </div>
      </Link>
      <div className="mx-4">
        <div className="bg-[#FBFBFB] p-4 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-lg font-bold mb-2">
            거래내역
            <Link to="/transaction-history">
              <AiOutlineRight className="text-xl" />
            </Link>
          </div>
          {history.slice(0, 3).map((transaction, index) => (
            <div
              key={index}
              className="flex justify-between py-3 border-b border-gray-300 mb-3"
            >
              <div className="flex items-center">
                <img
                  src={getProfileImagePath(transaction.imgNo)}
                  alt={transaction.userName}
                  className="w-9 h-9 mr-5"
                />
                <div>
                  <div className="text-sm font-bold">
                    {transaction.userName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(transaction.createdAt).toLocaleTimeString(
                      'ko-KR',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      }
                    )}
                  </div>
                </div>
              </div>
              <div
                className={`text-sm font-bold ${transaction.type === '받기' ? 'text-green-600' : 'text-red-600'}`}
              >
                {transaction.type === '받기' ? '+ ' : '- '}
                {formatNumber(Math.abs(transaction.cost))}원
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 mx-4">
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-lg font-bold mb-2">
            <div className="text-lg font-bold">미정산 내역</div>
            <Link to="/mytook">
              <AiOutlineRight className="text-xl" />
            </Link>
          </div>

          {noPay.length > 0 &&
            noPay
              .slice(0, 2)
              .map((settlement, index) => (
                <SendMoneyCard key={index} {...settlement} status={true} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default MyTookMoneyPage;
