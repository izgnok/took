import React from 'react';

const Modal = ({ title, message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-xl p-6 w-60 mx-auto shadow-lg">
        {/* <h2 className="text-lg font-bold mb-4">{title}</h2> */}
        <p className="mb-6 text-center">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="w-20 bg-neutral-300 text-white py-2 rounded-xl font-bold"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
