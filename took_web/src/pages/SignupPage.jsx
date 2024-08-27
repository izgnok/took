import React, { useState } from 'react';
import BackButton from '../components/common/BackButton';
import { isValidEmail, isValidPassword } from '../utils/validation';
import InputButton from '../components/signup/InputButton';
import GenderInput from '../components/signup/GenderInput';
import { formatPhoneNumber, removeHyphens } from '../utils/format';
import { useNavigate } from 'react-router-dom';
import { msgToAndroid } from '../android/message';
import {
  signUpApi,
  validIdApi,
  emailCertificateApi,
  checkEmailCodeApi,
} from '../apis/user';
function SignupPage() {
  const [id, setId] = useState('');
  const [isIdValid, setIsIdValid] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('남');
  const [birth, setBirth] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [idError, setIdError] = useState('');
  const [nameError, setNameError] = useState('');
  const [birthError, setBirthError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [certificationNumber, setCertificationNumber] = useState('');
  const [certificationError, setCertificationError] = useState('');
  const [isCertificated, setIsCertificated] = useState(false);

  const navigate = useNavigate();

  const checkEmailNumber = async () => {
    if (certificationNumber === '') {
      setCertificationError('인증번호를 입력하세요.');
      return;
    }
    try {
      const result = await checkEmailCodeApi({
        userId: id,
        email,
        certificationNumber,
      });
      console.log(result);
      if (result.code == 'su') {
        setIsCertificated(true);
        alert('인증되었습니다');
        msgToAndroid('인증되었습니다');
        setCertificationError('');
      } else {
        setCertificationError('인증번호가 틀렸습니다.');
        setIsCertificated(false);
      }
    } catch (error) {
      setIdError('아이디 중복 검사 중 오류가 발생했습니다.');
      setIsIdValid(false);
    }
  };

  const handleCheckEmail = async () => {
    if (email === '') {
      setEmailError('이메일을 입력해주세요.');
      return;
    } else if (!isValidEmail(email)) {
      setEmailError('유효한 이메일 주소를 입력하세요.');
      return;
    }

    try {
      setIsEmailValid(true);
      const result = await emailCertificateApi({ userId: id, email });
      console.log(result);
      alert('이메일이 전송되었습니다');
      msgToAndroid('이메일이 전송되었습니다');
    } catch (error) {
      setEmailError('이메일 인증 중 오류가 발생했습니다.');
    }
  };

  const handleValidateId = async () => {
    if (id === '') {
      setIdError('아이디를 입력해주세요.');
      setIsIdValid(false);
    } else {
      try {
        setIsIdValid(true);
        const result = await validIdApi({ userId: id });

        if (result.code == 'su') {
          alert('인증되었습니다');
          msgToAndroid('인증되었습니다');
          setIdError('');
        } else {
          setIdError('이미 사용 중인 아이디입니다.');
          setIsIdValid(false);
        }
      } catch (error) {
        setIdError('아이디 중복 검사 중 오류가 발생했습니다.');
        setIsIdValid(false);
      }
    }
  };

  const handleSignupClick = async (e) => {
    e.preventDefault();
    let valid = true;

    if (isCertificated) {
      setEmailError('');
    } else {
      setEmailError('이메일 인증이 필요합니다.');
      valid = false;
    }

    if (!isValidPassword(password)) {
      setPasswordError(
        '비밀번호는 최소 8자, 최대 13자, 영문자와 숫자를 포함해야 합니다.'
      );
      valid = false;
    } else {
      setPasswordError('');
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (isIdValid) {
      setIdError('');
    } else {
      setIdError('아이디 중복확인이 필요합니다');
      valid = false;
    }

    if (name === '') {
      setNameError('이름을 입력해주세요.');
      valid = false;
    } else {
      setNameError('');
    }

    if (birth === '') {
      setBirthError('생년월일을 입력해주세요.');
      valid = false;
    } else if (!/^\d{8}$/.test(birth)) {
      setBirthError('생년월일은 8자리 숫자로 입력해주세요.');
      valid = false;
    } else {
      setBirthError('');
    }

    if (phoneNumber === '') {
      setPhoneNumberError('휴대폰 번호를 입력해주세요.');
      valid = false;
    } else {
      setPhoneNumberError('');
    }

    if (valid) {
      try {
        const res = await signUpApi({
          userId: id,
          password,
          userName: name,
          email,
          gender: gender === '남' ? 'M' : 'F',
          certificationNumber,
          phoneNumber: removeHyphens(phoneNumber),
          birth,
        });
        alert('회원가입이 완료되었습니다. 계좌를 등록해주세요.');
        msgToAndroid('회원가입이 완료되었습니다. 계좌를 등록해주세요.');
        navigate('/login');
      } catch (error) {
        alert('회원가입 중 오류가 발생했습니다.');
        msgToAndroid('회원가입 중 오류가 발생했습니다');
      }
    }
  };
  return (
    <div className="flex flex-col bg-white max-w-[360px] mx-auto">
      <div className="flex items-center px-4 py-3">
        <BackButton />
        <div className="mt-2 flex-grow text-center text-lg font-bold text-black">
          회원가입
        </div>
      </div>

      <div className="mt-2 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 border-neutral-400 border-opacity-40 min-h-[1px]" />

      <div className="flex flex-col px-10 mt-3 w-full">
        <InputButton
          label="이름"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력해주세요"
          styleClass="flex-grow"
          error={nameError}
        />
        <GenderInput gender={gender} setGender={setGender} />
        <div className="flex ">
          <InputButton
            label="아이디"
            type="text"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setIdError('');
              setIsIdValid(false);
            }}
            placeholder="아이디를 입력해주세요"
            styleClass="flex-grow"
            error={idError}
          />
          {isIdValid ? (
            <div className="justify-center ml-1 self-end p-2 text-xs font-bold tracking-normal leading-3 text-center whitespace-nowrap rounded bg-neutral-600 text-zinc-100">
              인증완료
            </div>
          ) : (
            <div
              onClick={handleValidateId}
              className="justify-center ml-1 self-end p-2 text-xs font-bold tracking-normal leading-3 text-center whitespace-nowrap rounded bg-neutral-600 text-zinc-100"
            >
              중복확인
            </div>
          )}
        </div>

        <InputButton
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력해주세요"
          styleClass=""
          error={passwordError}
        />

        <InputButton
          label="비밀번호 확인"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="비밀번호를 한 번 더 입력해주세요"
          error={confirmPasswordError}
        />
        <InputButton
          label="휴대폰 번호"
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
          placeholder="숫자만 입력해주세요"
          error={phoneNumberError}
        />

        <InputButton
          label="생년월일(8자리)"
          type="number"
          value={birth}
          onChange={(e) => setBirth(e.target.value)}
          placeholder="예: 20010129"
          error={birthError}
        />

        <div className="flex ">
          <InputButton
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="예: took@took.com"
            styleClass="flex-grow"
            error={emailError}
          />
          {isEmailValid ? (
            <div className="justify-center ml-1 self-end p-2 text-xs font-bold tracking-normal leading-3 text-center whitespace-nowrap rounded bg-neutral-600 text-zinc-100">
              전송완료
            </div>
          ) : (
            <div
              onClick={handleCheckEmail}
              className="justify-center ml-1 self-end p-2 text-xs font-bold tracking-normal leading-3 text-center whitespace-nowrap rounded bg-neutral-600 text-zinc-100"
            >
              인증요청
            </div>
          )}
        </div>
        <div className="flex">
          <InputButton
            label="이메일 인증 번호"
            type="number"
            value={certificationNumber}
            onChange={(e) => setCertificationNumber(e.target.value)}
            styleClass="flex-grow"
            error={certificationError}
          />
          {isCertificated ? (
            <div className="justify-center ml-1 self-end p-2 text-xs font-bold tracking-normal leading-3 text-center whitespace-nowrap rounded bg-neutral-600 text-zinc-100">
              인증완료
            </div>
          ) : (
            <div
              onClick={checkEmailNumber}
              className="justify-center ml-1 self-end p-2 text-xs font-bold tracking-normal leading-3 text-center whitespace-nowrap rounded bg-neutral-600 text-zinc-100"
            >
              인증하기
            </div>
          )}
        </div>
        <button
          className="w-full mb-6 bg-main text-white font-bold text-lg py-3 mt-8 px-4 rounded-2xl shadow-md focus:outline-none focus:shadow-outline"
          type="submit"
          onClick={handleSignupClick}
        >
          회원가입
        </button>
      </div>
    </div>
  );
}

export default SignupPage;
