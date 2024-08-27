import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import getProfileImagePath from '../../utils/getProfileImagePath';
import { formatNumber } from '../../utils/format';
import { AiOutlineClose } from 'react-icons/ai';
import {
  onlyjungsanPayApi,
  deliveryGroupPayApi,
} from '../../apis/payment/jungsan';
import { useUser } from '../../store/user';
import { getMainAccount } from '../../apis/account/oneclick';
import { msgToAndroid } from '../../android/message';
import { bankNumToName } from '../../assets/payment/index.js';
import { BiRepost } from 'react-icons/bi';

const SlideCard = ({ member, onClose, onNavigate  }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [slid, setSlid] = useState(false);
  const [backgroundWidth, setBackgroundWidth] = useState(0);
  const { seq: currentUserSeq } = useUser();
  const [tempMainAccount, setTempMainAccount] = useState(null);
  const amount = member.cost;
  const userSeq = member.userSeq;
  const numCategory = member.category;
  const partySeq = member.partySeq;
  
  const handleAuthentication = () => {
    const accountSeq = tempMainAccount.accountSeq
    const accountNum = tempMainAccount.accountNum
    const bankName = tempMainAccount.bankName
    if (window.Android) {
      window.Android.authenticate();
    }
    window.onAuthenticate = (result) => {
      if (result) {
        processPayment();
        alert('생체 인증 성공');
        msgToAndroid('생체 인증 성공');
        onClose();
        onNavigate('/complete', 
        { accountSeq, amount, userSeq, currentUserSeq },
        );
      } else {
        onClose();
        onNavigate('/pwd', {
            accountSeq,
            accountNum,
            bankName,
            amount,
            userSeq,
            numCategory,
            partySeq,
          },
        );
      }
    };
  };
  useEffect(() => {
    setBackgroundWidth(position.x + 32); // 배경이 좀 더 빠르게 업데이트되도록 설정
  }, [position]);
  useEffect(() => {
    const fetchMainAccount = async () => {
      try {
        const mainAccountResponse = await getMainAccount(currentUserSeq);
        const tempBankName = bankNumToName[mainAccountResponse.bankNum];
        const mainAccount = {
          ...mainAccountResponse,
          bankName: tempBankName
            ? tempBankName.length === 2
              ? `${tempBankName}은행`
              : tempBankName
            : '',
        };
        setTempMainAccount(mainAccount)
      } catch (error) {
        console.error('Error fetching main account:', error);
      }
    };
    fetchMainAccount();
  }, [currentUserSeq]);
  const handleStop = (e, data) => {
    if (data.x >= 100) {
      // 동그라미가 충분히 오른쪽으로 이동했는지 확인
      setSlid(true);
      setTimeout(() => {
        // 실제 송금 기능을 여기에 추가하면 됩니다.
        handleAuthentication();
      }, 1000);
    } else {
      setPosition({ x: 0, y: 0 }); // 동그라미를 원래 위치로 되돌림
    }
  };
  const processPayment = async () => {
    const response = await getMainAccount(currentUserSeq);
    const requestData = {
      userSeq: currentUserSeq, // 지금 로그인한 userSeq 사용해야 함 (useUser 사용해도 됨)
      partySeq: member.partySeq,
      accountSeq: response.accountSeq,
    };
    console.log(requestData);
    try {
      if (member.category === 4) {
        await onlyjungsanPayApi(requestData);
      } else if (member.category === 1 || member.category === 3) {
        await deliveryGroupPayApi(requestData);
      }
    } catch (error) {
      console.error('결제 처리 중 오류 발생:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    }
  };
  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: 0 });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-md p-10 rounded-t-2xl relative">
        <AiOutlineClose
          className="text-2xl cursor-pointer absolute top-4 right-4"
          onClick={onClose}
        />
        <div className="font-[Nanum_Gothic] flex flex-col items-center mb-4">
          <img
            src={getProfileImagePath(member.imgNo)}
            alt={member.userName}
            className="w-14 h-14 mb-4 animate-shake"
          />
          <div className="text-xl font-bold mb-1">{member.userName} 님에게</div>
          <div className="text-2xl font-bold mb-1">
            {formatNumber(member.cost)}원
          </div>
          <div className="text-xl font-bold mb-1">보낼까요?</div>
          <div
            className="text-xs text-gray-500 font-[Nanum_Gothic] text-center underline cursor-pointer mb-4"
            onClick={() => navigate('/sendinput')}
          >
            금액 수정하기
          </div>
        </div>
        <div className="relative w-full h-14 bg-gray-200 rounded-full overflow-hidden z-10">
          <div
            className={`absolute top-0 left-0 bottom-0 bg-main transition-all duration-100 rounded-r-full`}
            style={{ width: `${backgroundWidth + 28}px` }}
          />
          <div className="absolute inset-0 flex items-center justify-center font-[Nanum_Gothic] text-gray-300 font-semibold z-20">
            {slid ? '송금하기' : '밀어서 송금하기'}
          </div>
          <Draggable
            axis="x"
            bounds="parent"
            position={position}
            onStop={handleStop}
            onDrag={handleDrag}
          >
            <div
              className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer border border-gray-300 absolute z-30"
              style={{ top: '-2px', left: '-1px' }}
            >
              <div className="text-main text-lg font-bold">{'>>'}</div>
            </div>
          </Draggable>
        </div>
      </div>
    </div>
  );
};

export default SlideCard;
