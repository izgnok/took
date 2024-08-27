import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../../css/dutchpay/PaymentInputPage.css';
import PaymentCard from '../../components/payment/PaymentCard';
import { useUser } from '../../store/user';
import BackButton from "../../components/common/BackButton.jsx";

// 알고리즘 추가 작성 필요!
function PaymentInputPage() {
  const { seq: userSeq ,img_no : img_no} = useUser();
  // 네비게이트 설정 (버튼 클릭시 이동을 위한 연동)
  const navigate = useNavigate();

  const location = useLocation();
  const usersFromLocation = location.state?.users || [];

  // 이거는 실제 유저가 들어갈 것여서 넣어두면 될 것 같습니다.
  const currentUser = {
    userSeq,
    name: '나',
    userName: '나',
    img_no: img_no,
    selected: true,
    distance: 0,
  };

  const users = [currentUser, ...usersFromLocation];

  const [payments, setPayments] = useState({
    1: {
      users: users.map((user) => ({
        ...user,
        amount: 0,
      })),
      totalAmount: 0,
    },
  });

  const swiperRef = useRef(null);

  const addNewPayment = () => {
    const newPayment = {
      users: users.map((user) => ({
        ...user,
        amount: 0,
      })),
      totalAmount: 0,
    };
    const newPayments = {
      ...payments,
      [Object.keys(payments).length + 1]: newPayment,
    };
    setPayments(newPayments);

    console.log('차수를 추가합니다', newPayments);

    setTimeout(() => {
      if (swiperRef.current && swiperRef.current.swiper) {
        swiperRef.current.swiper.slideTo(Object.keys(newPayments).length - 1);
      }
    }, 0); // 타임아웃을 사용하여 상태 업데이트가 완료된 후 실행
  };

  const handleDeleteUser = (paymentIndex, userIndex) => {
    const updatedPayments = { ...payments };
    updatedPayments[paymentIndex].users.splice(userIndex, 1);
    setPayments(updatedPayments);
  };

  const handleDeleteCard = (index) => {
    const updatedPayments = { ...payments };
    delete updatedPayments[index];

    // 카드 삭제 후 재정렬
    const newPayments = {};
    let newIndex = 1;
    for (const key in updatedPayments) {
      newPayments[newIndex] = updatedPayments[key];
      newIndex++;
    }

    setPayments(newPayments);
  };

  const [totalMember, setTotalMember] = useState('');

  const handleClick = async () => {
    setLoading(true);

    const params = {
      userSeq,
      title: 'Took 정산',
      category: 4,
      cost: Number(payments),
      totalMember: Number(totalMember),
      reciever: false,
      deliveryTip: 0,
    };
  };

  // 다음 차수를 표시해줄 페이지에 payments를 들고 갑니다.
  const moveNextPage = () => {
    navigate('/dutch/total', { state: { payments } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="mt-8">
        <BackButton />
      </div>
      <h1 className="text-4xl font-bold my-3 text-main mt-5">
        정산 <span className="font-dela">took !</span>
      </h1>
      <div className="relative flex items-center text-main">
        <p className="mb-4 text-sm">정산할 금액을 입력해주세요!</p>
      </div>

      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination]}
        spaceBetween={10}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        className="w-full h-full"
        style={{ height: '400px' }}
      >
        {Object.values(payments).map((payment, index) => (
          <SwiperSlide key={index}>
            <PaymentCard
              payment={payment}
              setPayment={(updatedPayment) => {
                const updatedPayments = {
                  ...payments,
                  [index + 1]: updatedPayment,
                };
                setPayments(updatedPayments);
              }}
              onDelete={(userIndex) => handleDeleteUser(index + 1, userIndex)}
              onCardDelete={
                index === 0 ? null : () => handleDeleteCard(index + 1)
              } // 첫 번째 카드에는 onCardDelete를 전달하지 않음
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        className="text-main mb-2 mt-4 pb-1 border-main border-b-[1px] text-xs"
        onClick={addNewPayment}
      >
        차수 추가하기
      </button>
      <button
        onClick={moveNextPage}
        className="bg-main px-12 py-2 shadow font-bold text-white rounded-full"
      >
        정산 요청하기
      </button>
    </div>
  );
}

export default PaymentInputPage;
