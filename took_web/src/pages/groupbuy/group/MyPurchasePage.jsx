import BackButton from '../../../components/common/BackButton';
import getProfileImagePath from '../../../utils/getProfileImagePath';
import { formatNumber } from '../../../utils/format';

// todo: 실제 데이터와 연결해야 함
const my_temp_data = {
  id: 1,
  items: [
    '삼성 갤럭시 S23',
    '삼성 갤럭시 워치 5',
    '삼성 갤럭시 버즈 2 프로',
    '삼성 프리미어 프로젝터',
  ],
  deliveryFee: 1500,
  totalAmount: 1251500,
  itemAmount: 1250000,
  userName: '정희수',
};
const temp_delivery = 'CJ대한통운';
const temp_delivery_number = '841212579583';

function MyPurchasePage() {
  return (
    <div className="flex flex-col pt-5 bg-white max-w-screen min-h-screen">
      <div className="flex flex-col px-5 w-full">
        <div className="flex flex-col px-5 w-full">
          <BackButton />
          <div className="mx-6 text-2xl text-main font-extrabold">
            공구 <span className="font-dela">took !</span>
          </div>
        </div>
        <div className="flex flex-col pb-7 pt-5 mt-6 bg-neutral-50 border border-neutral-200 rounded-2xl shadow-md">
          <div className="flex flex-col px-4 text-sm text-white">
            <div className="text-lg text-black ml-1 font-bold ">주문 정보</div>
            <hr className="border border-neutral-300 w-full mx-auto my-3" />
            <div className="text-sm text-black font-semibold my-3 ml-1">
              내 구매 정보
            </div>
            <div className="bg-white rounded-lg text-black p-3 border border-neutral-200 shadow-sm">
              <div className="flex justify-between mb-2">
                <span className="font-bold">물품명</span>
                <div className="text-right">
                  {my_temp_data.items.map((item, idx) => (
                    <div key={idx} className="text-xs">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-bold">배달비</span>
                <div className="text-right">
                  {formatNumber(my_temp_data.deliveryFee)}원
                </div>
              </div>
              <hr className="my-3 border-neutral-400 border-opacity-40" />
              <div className="flex justify-between">
                <span className="font-bold">전체 금액</span>
                <div className="text-right font-semibold">
                  {formatNumber(my_temp_data.totalAmount)}원
                </div>
              </div>
            </div>
            <div className="text-sm font-semibold mb-3 text-black mt-10 ml-1">
              배송 조회
            </div>
            <div className="bg-white rounded-lg text-black px-3 py-4 border border-neutral-200 shadow-sm">
              <div className="flex justify-between mb-3">
                <span className="font-bold">택배사</span>
                <div className="text-right text-sm">{temp_delivery}</div>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">송장번호</span>
                <div className="text-right text-sm">{temp_delivery_number}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPurchasePage;
