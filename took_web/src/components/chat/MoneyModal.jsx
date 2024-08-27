import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MoneyModal = ({ onClose, tempMember, deliverySeq }) => {
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg p-4 w-3/4 max-w-sm"
      >
        <h2 className="text-[14px] font-bold mb-5 ml-2 mt-2">주문금액</h2>
        <ul className="text-sm ml-2 mb-3">
          <li
            className="mb-5"
            onClick={() =>
              navigate(`/delivery/input/${deliverySeq}`, {
                state: { users: [tempMember] },
              })
            }
          >
            주문금액 입력하기
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MoneyModal;
