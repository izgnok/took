import React, { useState, useEffect } from 'react';
import BackButton from '../../components/common/BackButton';
import SelectArrow from '../../assets/payment/selectArrow.png';
import { formatNumber } from '../../utils/format';
import { useNavigate, useLocation } from 'react-router-dom';
import AccountCard from '../../components/payment/AccountCard';
import getProfileImagePath from '../../utils/getProfileImagePath';
import { getUserInfoApi } from '../../apis/user';
import { getMainAccount } from '../../apis/account/oneclick';
import { getAccountListApi } from '../../apis/account/info';
import { bankNumToName } from '../../assets/payment/index.js';
import { useUser } from '../../store/user';
import { msgToAndroid } from '../../android/message';
import {
  onlyjungsanPayApi,
  deliveryGroupPayApi,
  restCostPayApi,
} from '../../apis/payment/jungsan';
const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { seq: currentUserSeq } = useUser();
  const { accountSeq, amount, userSeq, numCategory, partySeq } =
    location.state || {};
  const [userName, setUserName] = useState('');
  const [imageNo, setImageNo] = useState(null);
  const [mainAccount, setMainAccount] = useState(null);
  const [accountList, setAccountList] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfoApi({ userSeq });
        setUserName(userInfo.userName);
        setImageNo(userInfo.imageNo);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    const fetchMainAccount = async () => {
      try {
        const mainAccountResponse = await getMainAccount(currentUserSeq);
        const bankName = bankNumToName[mainAccountResponse.bankNum];
        const mainAccount = {
          ...mainAccountResponse,
          bankName: bankName
            ? bankName.length === 2
              ? `${bankName}은행`
              : bankName
            : '',
        };
        setMainAccount(mainAccount);
        setSelectedAccount(mainAccount);
      } catch (error) {
        console.error('Error fetching main account:', error);
      }
    };

    const fetchAccountList = async () => {
      try {
        const accountListResponse = await getAccountListApi({
          userSeq: currentUserSeq,
        });
        const accountList = accountListResponse.list.map((account) => ({
          ...account,
          bankName: bankNumToName[account.bankNum],
        }));
        setAccountList(accountList);
      } catch (error) {
        console.error('Error fetching account list:', error);
      }
    };

    fetchUserInfo();
    fetchMainAccount();
    fetchAccountList();
  }, [userSeq, currentUserSeq]);
  // 생체 인증 및 결과 처리 함수
  const handleAuthentication = ({
    accountSeq,
    amount,
    accountNum,
    bankName,
    numCategory,
    partySeq,
  }) => {
    if (window.Android) {
      window.Android.authenticate();
    }
    
    window.onAuthenticate = (result) => {
      if (result) {
        alert('생체 인증 성공');
        msgToAndroid('생체 인증 성공');
        processPayment(accountSeq);
        navigate('/complete', {
          state: { accountSeq, amount, userSeq, currentUserSeq },
        });
      } else {
        navigate('/pwd', {
          state: {
            accountSeq,
            accountNum,
            bankName,
            amount,
            userSeq,
            numCategory,
            partySeq,
          },
        });
      }
    };
  };
  const handleSendMoney = () => {
    if (selectedAccount) {
      const { accountSeq, accountNum, bankName } = selectedAccount;
      handleAuthentication({
        accountSeq,
        amount,
        accountNum,
        bankName,
        numCategory,
        partySeq,
      });
    } else if (mainAccount) {
      const { accountSeq, accountNum, bankName } = mainAccount;
      handleAuthentication({
        accountSeq,
        amount,
        accountNum,
        bankName,
        numCategory,
        partySeq,
      });
    }
  };
  const processPayment = async (accountSeq) => {
    const requestData = {
      userSeq: currentUserSeq,
      partySeq,
      accountSeq,
    };

    console.log('데이터를 출력합니다.', requestData);

    try {
      console.log('processPayment 호출됨:', requestData); // 로그 추가
      console.log('카테고리,', numCategory);
      if (numCategory === 4) {
        console.log('정산합수 출력');
        const response = await onlyjungsanPayApi(requestData);
        console.log('onlyjungsanPayApi 응답:', response); // 로그 추가
      } else if (numCategory === 1 || numCategory === 3) {
        const response = await deliveryGroupPayApi(requestData);
        console.log('deliveryGroupPayApi 응답:', response); // 로그 추가
      } else {
        // 택시일 경우
        const response = await restCostPayApi(requestData);
        console.log('taxi restCostPayApi 응답:', response); // 로그 추가
      }
      navigate('/complete', {
        state: { accountSeq, amount, userSeq, currentUserSeq },
      });
    } catch (error) {
      console.log('응답:', requestData);
      console.error('결제 처리 중 오류 발생:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    }
  };
  const handleAccountChange = (account) => {
    setSelectedAccount(account);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col bg-white max-w-[360px] mx-auto h-screen justify-between">
      <div>
        <div className="flex items-center px-4 py-3">
          <BackButton />
          <div className="mt-2.5 flex-grow text-center text-lg font-bold text-black">
            정산하기
          </div>
        </div>

        <div className="mt-2 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 border-neutral-400 border-opacity-40 min-h-[0.5px]" />

        <div className="mt-10 text-center">
          <img
            src={getProfileImagePath(imageNo)}
            alt="User"
            className="w-20 h-20 mx-auto animate-shake"
          />
          <div className="mt-10 text-xl font-bold text-black">
            {userName} 님에게
          </div>
          <div className="mt-1 text-3xl font-bold text-black">
            {formatNumber(amount)}원
          </div>
          <div className="mt-1 text-xl font-bold text-black">
            <span className="font-dela text-main">took!</span> 할까요?
          </div>
        </div>
      </div>

      <div className="mb-8 text-xs">
        <div className="flex items-center justify-between w-full px-8">
          <div className="text-gray-500 font-bold">출금계좌</div>
          <div className="relative">
            {selectedAccount && selectedAccount.accountNum && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-1"
              >
                <span className="text-black font-bold mr-1">
                  {selectedAccount.bankName} (
                  {selectedAccount.accountNum.slice(-4)}) (
                  {formatNumber(selectedAccount.balance)}원)
                </span>
                <img src={SelectArrow} alt="selectArrow" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 flex w-full space-x-6 px-6">
          <button
            className="flex-grow text-lg font-bold text-white py-4 rounded-full bg-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
          <button
            className="flex-grow text-lg font-bold text-white py-4 rounded-full bg-main shadow-md hover:shadow-lg transition-shadow duration-300"
            onClick={handleSendMoney}
          >
            송금하기
          </button>
        </div>
      </div>

      {isModalOpen && (
        <AccountCard
          accounts={accountList}
          onClose={() => setIsModalOpen(false)}
          onSelect={handleAccountChange}
        />
      )}
    </div>
  );
};

export default PaymentPage;
