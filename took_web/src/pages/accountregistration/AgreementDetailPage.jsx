// src/pages/accountregistration/AgreementDetailPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';

const termsData = [
  {
    title: '상품 이용약관 (필수)',
    content:
      '- 예금거래기본약관 : 예금계약 체결 시 필요한 기본적인 사항을 규정한 약관입니다. 고객과 은행 간의 예금 거래에 대한 권리와 의무를 명시합니다.\n- 입출금이자유로운예금 약관 : 입출금이 자유로운 예금 상품에 대한 이용 조건, 거래 방식, 수수료 등에 관한 약관입니다.',
  },
  {
    title: '불법·탈법 차명거래 금지 설명 확인 (필수)',
    content:
      '"금융실명거래 및 비밀보장에 관한 법률" 제3조 제3항에 따라 누구든지 불법재산의 은닉, 지급사태방위, 공중협박자금 조달행위 및 강제집행의 면탈, 그 밖의 탈법행위를 목적으로 차명거래를 할 수 없으며, 이를 위반할 경우 법적인 처벌을 받을 수 있음을 설명합니다.',
  },
  {
    title: '예금자보호법 설명 확인 (필수)',
    content:
      '본인이 가입하는 금융상품의 예금자보호여부 및 보호한도(원금과 소정의 이자를 합하여 1인당 5천만원)에 대해 설명하며, 예금자보호법에 따라 예금보험공사가 보호하는 한도 내에서 예금을 안전하게 보호받을 수 있음을 안내합니다.',
  },
  {
    title: '개인신용정보 선택적 제공 동의 (선택)',
    content:
      '부정 사용방지 등의 목적 달성을 위해 개인신용정보를 제3자에게 제공하는 것에 대한 동의입니다. 제공되는 정보는 범죄 예방 및 법적 요구 사항 준수를 위해 사용됩니다.',
  },
  {
    title: '개인신용정보 선택적 수집 및 이용 동의 (선택)',
    content:
      '부정 사용방지, 서비스 개선, 맞춤형 서비스 제공 등을 위해 개인신용정보를 수집하고 이용하는 것에 대한 동의입니다. 수집된 정보는 서비스 운영 및 마케팅 목적으로 활용됩니다.',
  },
  {
    title: '광고성 정보 수신 동의 (선택)',
    content:
      '고객에게 광고성 정보를 제공하기 위한 동의입니다. 동의한 고객에게는 다양한 프로모션, 이벤트, 신규 상품 안내 등의 정보가 제공됩니다.',
  },
];

function AgreementDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollToIndex, checkedItems: initialCheckedItems = {} } =
    location.state || {};
  const termRefs = useRef([]);
  const [checkedItems, setCheckedItems] = useState(initialCheckedItems);

  useEffect(() => {
    if (scrollToIndex !== undefined) {
      const adjustedIndex = scrollToIndex - 1; // 인덱스를 하나 줄입니다.
      if (termRefs.current[adjustedIndex]) {
        termRefs.current[adjustedIndex].scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [scrollToIndex]);

  const handleAgreementChange = (index) => {
    setCheckedItems((prev) => ({
      ...prev,
      [`terms${index + 1}`]: !prev[`terms${index + 1}`],
    }));
  };

  const handleAllAgreementChange = () => {
    const allChecked = Object.values(checkedItems).every(Boolean);
    const newCheckedItems = {};
    termsData.forEach((_, index) => {
      newCheckedItems[`terms${index + 1}`] = !allChecked;
    });
    setCheckedItems(newCheckedItems);
  };

  const isFormValid = ['terms1', 'terms2', 'terms3'].every(
    (term) => checkedItems[term]
  );

  const handleNextClick = () => {
    if (isFormValid) {
      navigate('/verification');
    }
  };

  return (
    <div className="flex flex-col items-center p-5 relative h-screen font-[Nanum_Gothic]">
      <div className="w-full flex items-center justify-between mb-5 border-b border-gray-300 pb-2">
        <BackButton />
        <span className="text-lg font-bold mx-auto">약관 동의 상세</span>
        <div className="w-6"></div> {/* 오른쪽 여백 확보용 */}
      </div>
      <div className="w-full overflow-y-auto flex-1">
        <div className="mb-5">
          <div
            className="flex items-center cursor-pointer text-base"
            onClick={handleAllAgreementChange}
          >
            <span className="text-lg mr-2">
              {Object.values(checkedItems).every(Boolean) ? '🗹' : '☐'}
            </span>
            <span className="text-lg font-bold">전체 동의하기</span>
          </div>
        </div>
        {termsData.map((term, index) => (
          <div
            key={index}
            className={`mb-5 ${index === termsData.length - 1 ? 'mb-[500px]' : ''}`}
            ref={(el) => (termRefs.current[index] = el)}
          >
            <div className="text-base font-bold mb-1">{term.title}</div>
            <div className="text-sm mb-2 whitespace-pre-wrap">
              {term.content}
            </div>
            <div
              className="flex items-center cursor-pointer text-sm"
              onClick={() => handleAgreementChange(index)}
            >
              <span className="text-base mr-2">
                {checkedItems[`terms${index + 1}`] ? '🗹' : '☐'}
              </span>
              <span className="text-sm font-bold">동의합니다.</span>
            </div>
          </div>
        ))}
      </div>
      <button
        className={`w-[calc(100%-40px)] py-3 rounded-full text-white text-lg font-bold cursor-pointer transition-all duration-300 ${isFormValid ? 'bg-[#FF7F50]' : 'bg-[#FF7F50]/50'} absolute bottom-5 left-1/2 transform -translate-x-1/2`}
        disabled={!isFormValid}
        onClick={handleNextClick}
      >
        다음
      </button>
    </div>
  );
}

export default AgreementDetailPage;
