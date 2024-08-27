import React from 'react';

const InputButton = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  styleClass,
  error,
  readOnly,
}) => {
  return (
    <div className={`mt-8 ${styleClass}`}>
      <div className="text-sm font-bold leading-5 text-neutral-600">
        {label}
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`mt-1.5 text-xs leading-5 text-neutral-600 border-b-2 w-full px-2 py-1 ${readOnly ? 'bg-gray-200 cursor-not-allowed' : ''}`}
        placeholder={placeholder}
        readOnly={readOnly}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default InputButton;
