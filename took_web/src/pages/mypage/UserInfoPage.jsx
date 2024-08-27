import React, { useState, useEffect } from 'react';
import BackButton from '../../components/common/BackButton';
import { useUser } from '../../store/user';
import { getUserInfoApi, modifyUserInfoApi } from '../../apis/user';
import InputButton from '../../components/signup/InputButton';
import InfoCard from '../../components/mypage/modify/InfoCard';

function UserInfoPage() {
  const { seq } = useUser();
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      const params = { userSeq: seq };
      const userInfo = await getUserInfoApi(params);
      console.log('Fetched User Info:', userInfo);

      if (userInfo) {
        setId(userInfo.userId);
        setName(userInfo.userName);
        setPhoneNumber(userInfo.phoneNumber);
        setEmail(userInfo.email);
      }
    };

    fetchUserInfo();
  }, [seq]);

  const handleUpdate = async () => {
    const params = {
      userId: id,
      userName: name,
      phoneNumber: phoneNumber,
      email: email,
    };
    const response = await modifyUserInfoApi(params);
    console.log('Update Response:', response);
  };

  return (
    <div className="flex flex-col bg-white max-w-[360px] mx-auto py-16 px-10">
      <div className="flex items-center">
        <BackButton />
        <div className="flex-grow text-center text-lg font-bold text-black">
          회원정보 수정
        </div>
      </div>

      <div className="mt-4">
        <InputButton
          label="이름"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력해주세요"
          error=""
        />
        <InputButton
          label="휴대폰 번호"
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="휴대폰 번호를 입력해주세요"
          error=""
        />
        <InputButton
          label="아이디"
          type="text"
          value={id}
          readOnly
          placeholder="아이디"
          error=""
        />
        <InputButton
          label="이메일"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일을 입력해주세요"
          error=""
          readOnly
        />

        <div className="flex justify-center mt-4">
          <button
            className="w-full bg-main text-white font-bold text-lg py-2 mt-4 px-4 rounded-2xl shadow-md focus:outline-none focus:shadow-outline"
            onClick={handleUpdate}
          >
            수정
          </button>
        </div>
        <InfoCard label="비밀번호 변경" name="" arrow={true} url="/modifyPwd" />
      </div>
    </div>
  );
}

export default UserInfoPage;
