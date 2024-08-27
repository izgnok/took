import React, { useState } from 'react';
import kakaoImage from '../assets/login/kakao.svg';
import googleImage from '../assets/login/google.png';
import BackButton from '../components/common/BackButton.jsx';
import Button from '../components/login/Button.jsx';
import { loginApi, getUserInfoApi } from '../apis/user.js';
import { useToken } from '../store/token.js';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../store/user.js';
import { msgToAndroid, postLoginInfoToApp } from '../android/message.js';
import Cookies from 'js-cookie';

function LoginPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const { setAccessToken } = useToken();
  const { setUserSeq, setLoggedIn, setUser } = useUser();
  const navigate = useNavigate();
  const handleLoginClick = async (e) => {
    e.preventDefault();
    console.log('id:', id);
    console.log('pwd:', password);

    try {
      const response = await loginApi({ userId: id, password }, setAccessToken);
      if (response.code == 'su') {
        console.log(response);
        setUserSeq(response.userSeq);
        console.log(response.userSeq);
        const userInfo = await getUserInfoApi({ userSeq: response.userSeq });
        setUser(userInfo);
        const userSeq = response.userSeq;
        const jwt = response.accessToken;
        setLoggedIn();
        if (window.Android) {
          postLoginInfoToApp(userSeq, jwt, id, password);
        }

        navigate('/');
      } else {
        alert('로그인 실패');
      }
    } catch (error) {
      alert('로그인 중 오류가 발생했습니다.');
      msgToAndroid('로그인 중 오류가 발생했습니다');
    }
  };
  return (
    <div className="max-h-screen">
      <BackButton />
      <div className="flex flex-col mt-[30%] w-[65%] items-center justify-center  bg-white p-4 mx-auto">
        <div className="text-main font-dela text-4xl mb-10">took !</div>
        <div className="w-full">
          <div className="mb-4">
            <input
              className="appearance-none block w-full  placeholder-main text-main placeholder:text-opacity-50 text-base placeholder:text-sm border-b-2 border-opacity-60 border-main pt-2 pb-1 px-1 my-4 leading-tight focus:outline-none focus:bg-white focus:border-main"
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="아이디"
            />
            <input
              className="appearance-none block w-full  placeholder-main text-main text-base placeholder:text-sm placeholder:text-opacity-60 border-b-2 border-opacity-60 border-main  pt-2 pb-1 px-1 my-4 leading-tight focus:outline-none focus:bg-white focus:border-main"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            name="로그인"
            textColor="white"
            width="full"
            handleClick={handleLoginClick}
            style="mt-10 font-bold bg-main"
          />
          <div className="flex justify-between text-main text-xs mb-16 mt-6">
            <a href="/signup" className="hover:underline">
              회원가입
            </a>
            <a href="/userinfo" className="hover:underline">
              비밀번호 찾기
            </a>
          </div>
          <div className="flex items-center my-4 text-xs">
            <hr className="flex-grow border-t border-main" />
            <span className="mx-2 text-main">또는</span>
            <hr className="flex-grow border-t border-main" />
          </div>
          <Button
            name="카카오로 로그인"
            width="full"
            textColor="black"
            image={kakaoImage}
            style="bg-yellow-400 mb-4 text-xs font-bold "
          />
          <Button
            name="구글로 로그인"
            width="full"
            textColor="white"
            image={googleImage}
            style="text-xs font-bold bg-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
