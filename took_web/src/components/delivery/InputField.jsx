// src/components/common/InputField.js
import React from 'react';

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  min,
}) => (
  <div>
    <div className="text-base font-bold leading-8 text-neutral-600">
      {label}
    </div>
    <div className="flex items-center mb-4 border-b border-gray-300">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-grow bg-transparent py-2 placeholder-gray-300 focus:outline-none focus:border-[#FF7F50]"
        min={min}
      />
      {type === 'number' && <span className="text-neutral-600 ml-2">원</span>}
    </div>
  </div>
);

export default InputField;
