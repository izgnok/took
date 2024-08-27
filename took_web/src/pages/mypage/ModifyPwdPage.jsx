import React, { useState } from 'react';
import BackButton from '../../components/common/BackButton';
import InputButton from '../../components/signup/InputButton';
import { isValidPassword } from '../../utils/validation';

function ModifyPwdPage() {
  const currentPwd = 'password123';
  const [current, setCurrent] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [currentError, setCurrentError] = useState('');
  const [newError, setNewError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const handleModifyClick = (e) => {
    e.preventDefault();
    let valid = true;

    if (current === '') {
      setCurrentError('현재 비밀번호를 입력하세요.');
      valid = false;
    } else if (current !== currentPwd) {
      setCurrentError('현재 비밀번호가 일치하지 않습니다.');
      valid = false;
    }

    if (newPwd === '') {
      setNewError('변경할 비밀번호를 입력하세요.');
      valid = false;
    } else if (!isValidPassword(newPwd)) {
      setNewError(
        '비밀번호는 최소 8자, 최대 13자, 영문자와 숫자를 포함해야 합니다.'
      );
      valid = false;
    } else {
      setNewError('');
    }

    if (confirmPwd !== newPwd) {
      setConfirmError('비밀번호가 일치하지 않습니다.');
      valid = false;
    } else {
      setConfirmError('');
    }
  };

  return (
    <div className="flex flex-col bg-white max-w-[360px] mx-auto">
      <div className="flex items-center px-4 py-3">
        <BackButton />
        <div className="mt-2 flex-grow text-center text-lg font-bold text-black">
          비밀번호 변경
        </div>
      </div>

      <div className="mt-2 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 border-neutral-400 border-opacity-40 min-h-[1px]" />
      <div className="flex flex-col px-10 mt-3 w-full">
        <InputButton
          label="현재 비밀번호"
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          placeholder="현재 비밀번호를 입력해주세요"
          styleClass=""
          error={currentError}
        />

        <InputButton
          label="새 비밀번호"
          type="password"
          value={newPwd}
          onChange={(e) => setNewPwd(e.target.value)}
          placeholder="새 비밀번호를 입력해주세요"
          styleClass=""
          error={newError}
        />

        <InputButton
          label="비밀번호 확인"
          type="password"
          value={confirmPwd}
          onChange={(e) => setConfirmPwd(e.target.value)}
          placeholder="비밀번호를 다시 한 번 입력해주세요"
          styleClass=""
          error={confirmError}
        />
        <button
          className="w-full mb-6 bg-main text-white font-bold text-lg py-3 mt-8 px-4 rounded-2xl shadow-md focus:outline-none focus:shadow-outline"
          type="submit"
          onClick={handleModifyClick}
        >
          비밀번호 변경
        </button>
      </div>
    </div>
  );
}

export default ModifyPwdPage;
