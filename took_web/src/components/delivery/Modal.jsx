// src/components/common/Modal.js
import React from 'react';

const Modal = ({ show, message, onConfirm, onCancel }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white px-6 py-4 rounded-lg shadow-lg text-center">
        <div className="text-base font-bold mb-2">안내</div>
        <div className="mb-4 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 border-neutral-400 border-opacity-40 min-h-[0.5px]" />
        <div className="text-base mb-4">{message}</div>
        <div className="flex justify-center">
          <button
            className="bg-gray-200 font-bold text-[#3D3D3D] px-10 py-2 rounded-2xl mx-2"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            className="bg-main font-bold text-white px-10 py-2 rounded-2xl mx-2"
            onClick={onConfirm}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
