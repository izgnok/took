// src/components/common/TextAreaField.js
import React from 'react';

const TextAreaField = ({ label, name, value, onChange, placeholder }) => (
  <div className="flex-grow">
    <div className="text-base font-bold leading-5 text-neutral-600">
      {label}
    </div>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-transparent py-2 placeholder-gray-300 focus:outline-none focus:border-[#FF7F50] resize-none w-full h-32"
    />
  </div>
);

export default TextAreaField;
