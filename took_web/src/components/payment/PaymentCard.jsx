import React, { useState, useEffect } from 'react';
import { formatNumber } from '../../utils/format';
import getProfileImagePath from '../../utils/getProfileImagePath';

const PaymentCard = ({ payment, setPayment, onDelete, onCardDelete }) => {
  const [totalAmount, setTotalAmount] = useState('0'); // 초기값을 '0'으로 설정
  const [isFocused, setIsFocused] = useState(false); // input이 포커스 상태인지 여부

  useEffect(() => {
    if (totalAmount === '' || totalAmount === '0') return; // 빈 문자열이나 '0'이면 계산을 건너뜀

    const total = parseFloat(totalAmount.replace(/,/g, '')) || 0;
    const numOfPayments = payment.users.length;
    const averageAmount = Math.ceil(total / numOfPayments);
    const remainingAmount = total - averageAmount * (numOfPayments - 1);

    const updatedUsers = payment.users.map((user, index) => ({
      ...user,
      amount: formatNumber(index === 0 ? remainingAmount : averageAmount),
    }));

    setPayment({
      ...payment,
      users: updatedUsers,
      totalAmount: formatNumber(total),
    });
  }, [totalAmount, payment.users.length]);

  const handleAmountChange = (index, amount) => {
    const numericAmount = parseFloat(amount.replace(/,/g, '')) || 0;
    const updatedUsers = payment.users.map((user, idx) =>
      idx === index ? { ...user, amount: formatNumber(numericAmount) } : user
    );

    setPayment({ ...payment, users: updatedUsers });
  };

  const handleTotalAmountChange = (e) => {
    const value = e.target.value.replace(/,/g, '');
    if (!isNaN(value)) {
      setTotalAmount(value === '' ? '' : formatNumber(value)); // 빈 값 처리 추가
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (totalAmount === '0') {
      setTotalAmount('');
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (totalAmount === '') {
      setTotalAmount('0');
    }
  };

  return (
    <div className="px-12 pb-6 bg-white ">
      <div className="border-gray-300 border rounded-2xl shadow-md p-6 ">
        {onCardDelete && (
          <button
            onClick={onCardDelete}
            className="relative top-0 left-0 rounded-full p-1 text-main"
          >
            <span className="text-xl">×</span>
          </button>
        )}
        <div className="flex gap-x-2 mb-3 text-right text-main font-extrabold text-2xl">
          <input
            type="text"
            value={totalAmount}
            onChange={handleTotalAmountChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="0"
            className="mx-1 text-right w-full max-w-xs"
          />
          <span>원</span>
        </div>
        <div className="text-main p-1 text-xs mb-2 underline">인원 추가</div>
        <div className="flex flex-col gap-3 overflow-y-scroll h-[30vh] scroll-m-1">
          {payment.users.map((user, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-1"
            >
              <div className="flex items-center gap-2 text-sm font-semibold">
                <img
                  loading="lazy"
                  src={getProfileImagePath(user.img_no)}
                  className="w-6 h-6 animate-shake"
                  alt={user.name}
                />
                <div className="w-24 text-xs">{user.name}</div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={user.amount || ''}
                  onChange={(e) => handleAmountChange(index, e.target.value)}
                  placeholder=""
                  className="w-full max-w-xs px-2 py-1 border-b-[1px] border-main border-opacity-50 text-right font-semibold"
                  style={{ minWidth: '80px' }}
                />
                {index !== 0 && (
                  <img
                    onClick={() => {
                      onDelete(index);
                      handleTotalAmountChange();
                    }}
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/f3f9a2394cc2191cd008c8dab3edbceb90b6adf5025fc60fcb23c80910d0f59b?"
                    className="shrink-0 aspect-[0.82] fill-orange-400 w-2 mt-2 opacity-80"
                    alt="icon"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
