// src/pages/TransactionHistoryPage.jsx
import React, { useEffect, useState } from 'react';
import { formatNumber } from '../../utils/format';
import BackButton from '../../components/common/BackButton';
import { useUser } from '../../store/user';
import { payHistoryApi } from '../../apis/payment/jungsan';
import { bankNumToName } from '../../assets/payment/index.js';
import { useNavigate } from 'react-router-dom';
const getProfileImagePath = (imgNo) => {
  const profileImages = import.meta.glob('../../assets/profile/*.png', {
    eager: true,
  });
  return profileImages[`../../assets/profile/img${imgNo}.png`]?.default || '';
};

const TransactionHistoryPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('전체');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  const navigate = useNavigate();

  const handleTransactionClick = (transaction) => {
    navigate('/transaction-detail', { state: { transaction } });
  };

  const getStartDate = (period) => {
    const startDate = new Date();
    switch (period) {
      case '1주일':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '1개월':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3개월':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6개월':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1년':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        return '';
    }
    return startDate.toISOString().split('T')[0];
  };

  const startDateString = getStartDate(selectedPeriod);
  const [history, sethistory] = useState([]);
  const { seq } = useUser();
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
            type: history.receive ? '받기' : '송금',
            bankName: bankNumToName[history.bankNum],
            accountNum: history.accountNum,
          }));
          sethistory(historyList);
        }
      } catch (error) {
        console.error('거래 내역 정보를 불러오는데 실패했습니다:', error);
      }
    };
    fetchHistory();
  }, []);
  const filteredTransactions =
    selectedPeriod === '전체'
      ? history
      : history.filter(
          (transaction) =>
            transaction.createdAt.split(' ')[0] >= startDateString
        );

  const groupedTransactions = filteredTransactions.reduce(
    (acc, transaction) => {
      const date = transaction.createdAt.split(' ')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(transaction);
      return acc;
    },
    {}
  );

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const handleSelect = (period) => {
    setSelectedPeriod(period);
    setDropdownOpen(false);
  };

  return (
    <div className="flex flex-col bg-white max-w-[360px] mx-auto relative h-screen font-[Nanum Gothic]">
      <div className="flex items-center mb-3 border-b border-gray-300 px-4 py-3">
        <BackButton />
        <div className="mt-2.5 flex-grow text-center text-lg font-bold text-black">
          거래내역
        </div>
      </div>
      <div className="flex items-center text-sm font-bold justify-between border-b border-gray-800 ml-4 mr-4 px-2 py-1 ">
        <span>
          {startDateString
            ? `${startDateString} ~ ${todayString}`
            : '전체 기간'}
        </span>
        <div className="relative w-20">
          <div
            className="border border-gray-300 rounded p-1 text-sm appearance-none pr-10 focus:outline-none cursor-pointer w-full"
            onClick={toggleDropdown}
          >
            {selectedPeriod}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
            </div>
          </div>
          {dropdownOpen && (
            <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
              {['전체', '1주일', '1개월', '3개월', '6개월', '1년'].map(
                (option) => (
                  <div
                    key={option}
                    className={`px-1 py-2 cursor-pointer flex items-center w-full ${selectedPeriod === option ? 'text-black' : 'text-gray-700'}`}
                    onClick={() => handleSelect(option)}
                  >
                    <span className="text-black ml-3">{option}</span>
                    {selectedPeriod === option && (
                      <span className="text-black ml-2">✔</span>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
      <div className="overflow-y-auto">
        <div className="px-4 py-2">
          {Object.keys(groupedTransactions).map((date) => (
            <div key={date}>
              <div className="text-xs font-bold text-gray-700 mb-2 mt-4">
                {new Date(date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short',
                })}
              </div>
              {groupedTransactions[date].map((transaction, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-3 border-b border-gray-300 mt-2 mb-2"
                  onClick={() => handleTransactionClick(transaction)}
                >
                  <div className="flex items-center">
                    <img
                      src={getProfileImagePath(transaction.imgNo)}
                      alt={transaction.userName}
                      className="w-8 h-8 mr-4 ml-3"
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
                  <div className="text-right">
                    <div
                      className={`text-sm font-bold mb-1 ${transaction.type === '받기' ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {transaction.type === '받기' ? '+ ' : '- '}
                      {formatNumber(transaction.cost)}원
                    </div>
                    <div className="text-xs text-gray-500">
                      {transaction.bankName}({transaction.accountNum.slice(-4)})
                      | {transaction.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
