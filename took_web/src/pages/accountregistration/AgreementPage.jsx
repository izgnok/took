// src/pages/accountregistration/AgreementPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineRight } from 'react-icons/ai';
import BackButton from '../../components/common/BackButton';

function AgreementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [allChecked, setAllChecked] = useState(false);
  const [checkedItems, setCheckedItems] = useState({
    terms1: false,
    terms2: false,
    terms3: false,
    terms4: false,
    terms5: false,
    terms6: false,
  });

  const { bank, account, password, accountName } = location.state || {};

  useEffect(() => {
    const allChecked = Object.values(checkedItems).every(Boolean);
    setAllChecked(allChecked);
  }, [checkedItems]);

  const handleAllCheckChange = () => {
    const newCheckedState = !allChecked;
    setAllChecked(newCheckedState);
    const newCheckedItems = {
      terms1: newCheckedState,
      terms2: newCheckedState,
      terms3: newCheckedState,
      terms4: newCheckedState,
      terms5: newCheckedState,
      terms6: newCheckedState,
    };
    setCheckedItems(newCheckedItems);
  };

  const handleCheckChange = (name) => {
    setCheckedItems((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const isFormValid = ['terms1', 'terms2', 'terms3'].every(
    (term) => checkedItems[term]
  );

  const handleNavigateDetail = (index) => {
    navigate('/agreementdetail', {
      state: { scrollToIndex: index, checkedItems },
    });
  };

  const handleNextClick = () => {
    if (isFormValid) {
      navigate('/verification', {
        state: { bank, account, password, accountName },
      });
    }
  };

  return (
    <div className="flex flex-col items-center p-5 relative h-screen font-[Nanum_Gothic]">
      <div className="w-full flex items-center justify-between mb-5 border-b border-gray-300 pb-2">
        <BackButton />
        <span className="text-lg font-bold mx-auto">계좌 등록</span>
        <div className="w-6"></div> {/* 오른쪽 여백 확보용 */}
      </div>
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <div
            className="text-base font-bold text-black mb-5 flex items-center cursor-pointer"
            onClick={() => navigate('/account', { state: { bank, account } })}
          >
            <span className="inline-block w-5 h-5 rounded-full border border-gray-300 text-center leading-5 mr-2">
              1
            </span>{' '}
            본인 명의 계좌 번호 등록
          </div>
          <div className="text-base font-bold flex items-center">
            <span className="inline-block w-5 h-5 rounded-full bg-[#FF7F50] text-white text-center leading-5 mr-2">
              2
            </span>{' '}
            약관 동의
          </div>
        </div>
        <div className="text-sm text-black mb-2">
          <strong>took에 계좌를 등록하기 위해 약관을 동의해주세요</strong>
          <br />
          설명 및 약관을 이해하였음을 확인합니다.
        </div>
        <div className="border border-gray-300 rounded-lg p-5 w-full bg-[#fafafa] mb-2">
          <div className="flex items-center justify-between mb-2">
            <label
              className="text-base font-bold flex items-center mb-2 cursor-pointer"
              onClick={handleAllCheckChange}
            >
              <span className="text-lg mr-2">{allChecked ? '🗹' : '☐'}</span>{' '}
              전체 동의하기
            </label>
            <AiOutlineRight
              className="text-xl text-gray-300 cursor-pointer"
              onClick={() => handleNavigateDetail(0)}
            />
          </div>
          <div className="flex items-center justify-between mb-2">
            <label
              className="text-sm flex items-center cursor-pointer"
              onClick={() => handleCheckChange('terms1')}
            >
              <span className="text-lg mr-2">
                {checkedItems.terms1 ? '🗹' : '☐'}
              </span>{' '}
              (필수) 상품 이용약관
            </label>
            <AiOutlineRight
              className="text-xl text-gray-300 cursor-pointer"
              onClick={() => handleNavigateDetail(1)}
            />
          </div>
          <div className="mb-2">
            <div className="text-sm text-gray-600 ml-5 mb-1">
              - 예금거래기본약과
            </div>
            <div className="text-sm text-gray-600 ml-5 mb-3">
              - 입출금이자유로운예금 약관
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <label
              className="text-sm flex items-center cursor-pointer"
              onClick={() => handleCheckChange('terms2')}
            >
              <span className="text-lg mr-2">
                {checkedItems.terms2 ? '🗹' : '☐'}
              </span>{' '}
              (필수) 불법·탈법 차명거래 금지 설명 <br /> 확인
            </label>
            <AiOutlineRight
              className="text-xl text-gray-300 cursor-pointer"
              onClick={() => handleNavigateDetail(2)}
            />
          </div>
          <div className="flex items-center justify-between mb-2">
            <label
              className="text-sm flex items-center cursor-pointer"
              onClick={() => handleCheckChange('terms3')}
            >
              <span className="text-lg mr-2">
                {checkedItems.terms3 ? '🗹' : '☐'}
              </span>{' '}
              (필수) 예금자보호법 설명 확인
            </label>
            <AiOutlineRight
              className="text-xl text-gray-300 cursor-pointer"
              onClick={() => handleNavigateDetail(3)}
            />
          </div>
          <div className="flex items-center justify-between mb-2">
            <label
              className="text-sm flex items-center cursor-pointer"
              onClick={() => handleCheckChange('terms4')}
            >
              <span className="text-lg mr-2">
                {checkedItems.terms4 ? '🗹' : '☐'}
              </span>{' '}
              (선택) 개인신용정보 선택적 제공 동의
            </label>
            <AiOutlineRight
              className="text-xl text-gray-300 cursor-pointer"
              onClick={() => handleNavigateDetail(4)}
            />
          </div>
          <div className="flex items-center justify-between mb-2">
            <label
              className="text-sm flex items-center cursor-pointer"
              onClick={() => handleCheckChange('terms5')}
            >
              <span className="text-lg mr-2">
                {checkedItems.terms5 ? '🗹' : '☐'}
              </span>{' '}
              (선택) 개인신용정보 선택적 수집 및 <br />
              이용 동의
            </label>
            <AiOutlineRight
              className="text-xl text-gray-300 cursor-pointer"
              onClick={() => handleNavigateDetail(5)}
            />
          </div>
          <div className="flex items-center justify-between mb-2">
            <label
              className="text-sm flex items-center cursor-pointer"
              onClick={() => handleCheckChange('terms6')}
            >
              <span className="text-lg mr-2">
                {checkedItems.terms6 ? '🗹' : '☐'}
              </span>{' '}
              (선택) 광고성 정보 수신 동의
            </label>
            <AiOutlineRight
              className="text-xl text-gray-300 cursor-pointer"
              onClick={() => handleNavigateDetail(6)}
            />
          </div>
        </div>
        <div className="text-base font-bold text-gray-500 mb-2 flex items-center">
          <span className="inline-block w-5 h-5 rounded-full border border-gray-300 text-center leading-5 mr-2">
            3
          </span>{' '}
          본인 인증
        </div>
      </div>
      <button
        className={`w-[calc(100%-40px)] py-3 rounded-full text-white text-lg font-bold cursor-pointer transition-all duration-300 ${isFormValid ? 'bg-[#FF7F50] shadow-md' : 'bg-[#FF7F50]/50'} absolute bottom-5 left-1/2 transform -translate-x-1/2`}
        disabled={!isFormValid}
        onMouseOver={(e) =>
          isFormValid &&
          (e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)')
        }
        onMouseOut={(e) => (e.currentTarget.style.boxShadow = 'none')}
        onClick={handleNextClick}
      >
        다음
      </button>
    </div>
  );
}

export default AgreementPage;
