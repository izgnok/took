import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TookButton } from '../components/main/TookButton';
import taxi from '../assets/main/taxi.png';
import pay from '../assets/main/pay.png';
import delivery from '../assets/main/delivery.png';
import shop from '../assets/main/shop.png';
import took from '../assets/took.png';
import { useUser } from '../store/user';
import tookImage from '../assets/payment/took1.png';

function MainPage() {
  const { isLoggedIn, seq } = useUser();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = (link) => {
    if (isLoggedIn) {
      navigate(link);
    } else {
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/login');
      }, 1000);
    }
  };

  console.log('유저 seq는' + seq);

  return (
    <div className="flex min-h-screen items-center justify-center flex-col max-w-screen">
      <div className="flex gap-5 justify-between w-full items-center bg-white pt-10 px-7">
        <div className="flex flex-col justify-center ml-3 items-center">
          <Link to="/">
            <div className="font-dela text-main text-4xl">took</div>
            <span className="text-black font-nanum text-[11px] mt-[1px] ml-2">
              쉽지만, 완벽하게
            </span>
          </Link>
        </div>

        <div className="flex gap-3 self-start pt-4">
          <Link to={isLoggedIn ? '/mypage' : '#'}>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/c1e55df56d29e4336515bf13d6aa348e4b790a713dffb53d03b32f27bdf6ac66?apiKey=6a63372050fb46b6bb21a2ca3b7359ed"
              className="object-contain shrink-0 aspect-square w-[29px]"
              onClick={() => handleButtonClick('/mypage')}
            />
          </Link>
          <Link to={isLoggedIn ? '/chat/took' : '#'}>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/2fa2a9fc8ce9754513ab432bdb5a90489c27cbfa14306819517cd655141328fe?placeholderIfAbsent=true&apiKey=6a63372050fb46b6bb21a2ca3b7359ed"
              alt=""
              className="object-contain shrink-0 my-auto aspect-[0.95] w-[21px] mt-0.5"
              onClick={() => handleButtonClick('/chat/took')}
            />
          </Link>
        </div>
      </div>
      <div className="bg-gradient-to-b from-white to-[#FFDCCF] pb-5 px-7 w-full">
        <div className="flex flex-col p-4 mt-12 mx-auto w-full font-nanum rounded-3xl bg-[#ffe1d6]">
          <div className="grid grid-cols-2 gap-2">
            <div onClick={() => handleButtonClick('/dutch/userlist')}>
              <TookButton
                title="정산 툭"
                content="<div>주변 사람들과<br/>간편한 정산</div>"
                img={pay}
              />
            </div>
            <div onClick={() => handleButtonClick('/taxi/main')}>
              <TookButton
                title="택시 툭"
                content="<div>먼거리 이동도<br/>저렴하고 빠르게</div>"
                img={taxi}
              />
            </div>
            <div onClick={() => handleButtonClick('/delivery/list')}>
              <TookButton
                title="배달 툭"
                content="<div>배달비 절약하고<br/>음식도 맛있게</div>"
                img={delivery}
              />
            </div>
            <div onClick={() => handleButtonClick('/groupbuy/list')}>
              <TookButton
                title="공구 툭"
                content="<div>공동구매로<br/>알뜰하게 구매</div>"
                img={shop}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-5 self-center mt-5 w-full items-end justify-around">
          <div onClick={() => handleButtonClick('/chat/list')}>
            <img
              loading="lazy"
              srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/9b7cf5453b4748f0f35ba95b2c3864245916cbd798cffe83216258f085f64f0d?apiKey=6a63372050fb46b6bb21a2ca3b7359ed&&apiKey=6a63372050fb46b6bb21a2ca3b7359ed&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/9b7cf5453b4748f0f35ba95b2c3864245916cbd798cffe83216258f085f64f0d?apiKey=6a63372050fb46b6bb21a2ca3b7359ed&&apiKey=6a63372050fb46b6bb21a2ca3b7359ed&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9b7cf5453b4748f0f35ba95b2c3864245916cbd798cffe83216258f085f64f0d?apiKey=6a63372050fb46b6bb21a2ca3b7359ed&&apiKey=6a63372050fb46b6bb21a2ca3b7359ed&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/9b7cf5453b4748f0f35ba95b2c3864245916cbd798cffe83216258f085f64f0d?apiKey=6a63372050fb46b6bb21a2ca3b7359ed&&apiKey=6a63372050fb46b6bb21a2ca3b7359ed&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/9b7cf5453b4748f0f35ba95b2c3864245916cbd798cffe83216258f085f64f0d?apiKey=6a63372050fb46b6bb21a2ca3b7359ed&&apiKey=6a63372050fb46b6bb21a2ca3b7359ed&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9b7cf5453b4748f0f35ba95b2c3864245916cbd798cffe83216258f085f64f0d?apiKey=6a63372050fb46b6bb21a2ca3b7359ed&&apiKey=6a63372050fb46b6bb21a2ca3b7359ed&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/9b7cf5453b4748f0f35ba95b2c3864245916cbd798cffe83216258f085f64f0d?apiKey=6a63372050fb46b6bb21a2ca3b7359ed&&apiKey=6a63372050fb46b6bb21a2ca3b7359ed&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/9b7cf5453b4748f0f35ba95b2c3864245916cbd798cffe83216258f085f64f0d?apiKey=6a63372050fb46b6bb21a2ca3b7359ed&&apiKey=6a63372050fb46b6bb21a2ca3b7359ed"
              className="object-contain shrink-0 max-w-full rounded-none aspect-[0.87] w-[122px]"
            />
          </div>
          <div className="flex flex-col">
            <div onClick={() => handleButtonClick('/payment-methods')}>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/2437fd8c46307376b7ba98f8386a396d9170469f1fd601196ad923b3edeb12c1?placeholderIfAbsent=true&apiKey=6a63372050fb46b6bb21a2ca3b7359ed"
                className="object-contain rounded-none aspect-[2.41] w-[147px]"
                alt=""
              />
            </div>
            <div onClick={() => handleButtonClick('/transaction-history')}>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/85f4160bae50be89544857494d7049d87b93b2c4a8df0bcd5704b860230a5afc?apiKey=6a63372050fb46b6bb21a2ca3b7359ed&&apiKey=6a63372050fb46b6bb21a2ca3b7359ed"
                className="object-contain mt-5 rounded-none w-full"
              />
            </div>
          </div>
        </div>
        <div
          onClick={() => handleButtonClick('/tookHistory')}
          className="relative font-nanum"
        >
          <img
            src={took}
            alt="took"
            className="absolute right-2 -top-6 w-7 opacity-90 h-6"
          />
          <div className="relative flex justify-between px-5 text-sm py-5 mt-8 bg-white bg-opacity-80 rounded-2xl ">
            <div>툭 히스토리 보러가기</div>
            <div className="text-gray-700">{'>'}</div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg shadow-lg flex flex-col items-center">
            <img
              src={tookImage}
              alt="took"
              className="w-12 h-16 m-5 animate-jump"
            />
            <p>로그인이 필요합니다</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;
