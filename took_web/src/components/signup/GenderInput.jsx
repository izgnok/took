import React from 'react';

function GenderInput({ gender, setGender }) {
  return (
    <div className="mt-8">
      <div className="text-sm font-bold leading-5 text-neutral-600">성별</div>
      <div className="mt-2 flex gap-4">
        <label className="flex items-center">
          <input
            type="radio"
            value="남"
            checked={gender === '남'}
            onChange={() => setGender('남')}
            className="hidden"
          />
          <div
            className={`cursor-pointer flex items-center justify-center w-20 h-7 text-xs font-bold leading-5 text-center rounded-lg ${
              gender === '남'
                ? 'bg-main text-white'
                : 'bg-gray-200 text-neutral-600'
            }`}
          >
            남
          </div>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="여"
            checked={gender === '여'}
            onChange={() => setGender('여')}
            className="hidden"
          />
          <div
            className={`cursor-pointer flex items-center justify-center w-20 h-7 text-xs font-bold leading-5 text-center rounded-lg ${
              gender === '여'
                ? 'bg-main text-white'
                : 'bg-gray-200 text-neutral-600'
            }`}
          >
            여
          </div>
        </label>
      </div>
    </div>
  );
}

export default GenderInput;
