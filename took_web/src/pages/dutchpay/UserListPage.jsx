import React, { useEffect, useState } from 'react';
import { getUserStyle, getMyStyle } from '../../utils/getCharacterPostion';
import questionIcon from '../../assets/payment/question.svg';
import { Link, useNavigate  } from 'react-router-dom';
import getProfileImagePath from '../../utils/getProfileImagePath';
import { getNearByUserPositionApi } from '../../apis/position/userPosition';
import { useUser } from '../../store/user';
import { usePosition } from '../../store/position';
import backIcon from '../../assets/delivery/whiteBack.svg';

const BackButton = () => {
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1);
  };
  return (
    <img
      src={backIcon}
      alt="뒤로"
      className="w-6 h-6 mx-6 mt-8 absolute top-0 left-0 opacity-80"
      onClick={handleBackClick}
    />
  );
};

const UserListPage = () => {
  const { seq, img_no } = useUser();
  const { latitude, longitude } = usePosition();
  const [users, setUsers] = useState([]);
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();

  const imageSize = Math.max(5, 40 - (users.length - 8) * 1.6);
  const fontSize = Math.max(imageSize / 3, 12);

  useEffect(() => {
    loadNearUsers();
  }, []);

  const loadNearUsers = async () => {
    const res = await getNearByUserPositionApi({
      userSeq: seq,
      lat: latitude,
      lon: longitude,
    });
    const updatedUsers = res
      .filter((user) => user.userSeq !== seq) //나와 같은 거는 안불러오게
      .map((user) => ({
        ...user,
        selected: false,
        name: user.userName,
        img_no: user.imageNo,
      }));
    setUsers(updatedUsers);
  };

  const handleSelect = (index) => {
    setUsers((prevUsers) =>
      prevUsers.map((user, idx) =>
        idx === index ? { ...user, selected: !user.selected } : user
      )
    );
  };
  const handleHelpClick = () => {
    setShowHelp(true);
    setTimeout(() => setShowHelp(false), 5000);
  };

  const handleNavigate = () => {
    const selectedUsers = users.filter(user => user.selected); // selected가 true인 사용자만 필터링
    console.log('넘어갈 유저를 출력합니다', selectedUsers);
    navigate('/dutch/input', { state: { users: selectedUsers } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-main">
      <BackButton />
      <h1 className="text-4xl font-bold my-8 text-white mt-12">
        정산 <span className="font-dela">took !</span>
      </h1>
      <div className="relative flex items-center mb-4 text-white">
        <p className="mb-0">함께 정산할 유저를 선택해주세요!</p>
        <img
          src={questionIcon}
          alt="?"
          className="ml-2 w-6 h-6 cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
          onClick={handleHelpClick}
        />
      </div>
      {showHelp && (
        <div className="absolute bottom-16 text-white bg-gray-500 p-2 rounded-lg shadow-lg animate-fade-in-out mx-5 ">
          근처에 위치하고 있는 앱 사용자들에게 정산 요청을 보낼 수 있어요!
        </div>
      )}
      <div className="relative w-96 h-96">
        {users.map((user, index) => {
          return (
            <div
              key={index}
              className={`absolute flex flex-col items-center cursor-pointer transition-opacity ${
                user.selected ? 'opacity-100' : 'opacity-40'
              }`}
              onClick={() => handleSelect(index)}
              style={getUserStyle(index, users.length, imageSize)}
            >
              <img
                src={getProfileImagePath(user.img_no)}
                alt={user.name}
                className={`${user.selected ? 'animate-shake' : 'animate-none'}`}
                style={{ width: `${imageSize}px`, height: `${imageSize}px` }}
              />
              <span
                className={`mt-1 text-white `}
                style={{ fontSize: `${fontSize}px` }}
              >
                {user.name}
              </span>
            </div>
          );
        })}

        <div
          className="absolute flex flex-col items-center cursor-pointer transition-opacity"
          style={getMyStyle(imageSize - 6)}
        >
          <img
            src={getProfileImagePath(img_no)}
            alt="나"
            style={{
              width: `${imageSize - 6}px`,
              height: `${imageSize - 6}px`,
            }}
            className=" animate-jump"
          />
          <span className="text-xs mt-1 text-white">나</span>
        </div>
      </div>

      <button
        onClick={handleNavigate}
        className="bg-white px-12 py-2 shadow font-bold text-main rounded-full"
      >
        정산하러 가기
      </button>
    </div>
  );
};

export default UserListPage;
