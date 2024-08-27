import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';
import taxiIcon from '../../assets/payment/taxiTook.png';
import getProfileImagePath from '../../utils/getProfileImagePath';
import { formatNumber } from '../../utils/format';
import { formatDate } from '../../utils/formatDate';
import {
  calculateFinalCostApi,
  setTotalCostApi,
  finalizeTaxiSettlementApi,
} from '../../apis/taxi';
import { partyDetailApi } from '../../apis/payment/jungsan';
import { sendReminderNotification } from '../../apis/alarm/sendAlarm';
import { useUser } from '../../store/user';

function TaxiCostInputPage() {
  const location = useLocation();
  const { taxiParty, members, userName } = location.state || {}; // 전달된 데이터를 받음
  const [totalAmount, setTotalAmount] = useState('');
  const [partyMembers, setPartyMembers] = useState(members || []);
  const navigate = useNavigate();
  const { id } = useParams(); // partySeq
  const { seq: userSeq } = useUser();
  useEffect(() => {
    const fetchPartyDetails = async () => {
      try {
        const response = await partyDetailApi(id);
        // console.log(response);
        const partyDetailMembers = response.partyDetailList.map((detail) => ({
          member_seq: detail.memberSeq,
          party_seq: detail.party.partySeq,
          user_seq: detail.user.userSeq,
          userName: detail.user.userName,
          imgNo: detail.user.imageNo,
          cost: detail.fakeCost, // 예상 비용 (선결제)
          real_cost: detail.fakeCost, // 나중에 업데이트될 실결제 금액
          status: detail.status,
          receive: detail.receive,
          is_leader: detail.leader,
        }));

        setPartyMembers(partyDetailMembers);
      } catch (error) {
        console.error('Error fetching party details:', error);
      }
    };

    if (taxiParty?.partySeq) {
      fetchPartyDetails();
    }
  }, [taxiParty]);

  const handleInputChange = async (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setTotalAmount(value);
  
    if (value && members.length > 0) {
      try {
        const params = {
          users: members.map((member) => ({
            userSeq: member.userSeq, // location.state에서 받아온 members의 userSeq 사용
            cost: member.cost, // location.state에서 받아온 members의 cost 사용
          })),
          allCost: parseInt(value, 10),
          taxiSeq: taxiParty.taxiSeq,
        };

        const result = await calculateFinalCostApi(params);

        const updatedMembers = partyMembers.map((member) => {
          const updatedUser = result.users.find(
            (user) => user.userSeq === member.user_seq
          );
          return {
            ...member,
            real_cost: updatedUser ? updatedUser.cost : member.real_cost,
          };
        });
        setPartyMembers(updatedMembers);
      } catch (error) {
        console.error('Error calculating final cost:', error);
      }
    }
  };

  const handleSubmit = async () => {
    if (totalAmount) {
      try {
        // 총 비용 설정 API 호출
        const setTotalCostParams = {
          taxiSeq: taxiParty.taxiSeq,
          cost: parseInt(totalAmount, 10),
        };
        await setTotalCostApi(setTotalCostParams);
  
        // 택시 정산 실결제 API 호출
        const finalizeSettlementParams = {
          partySeq: taxiParty.partySeq,
          cost: parseInt(totalAmount, 10),
          users: partyMembers.map((member) => ({
            userSeq: member.user_seq,
            cost: member.real_cost, // 실결제 금액(real_cost) 사용
          })),
        };

        console.log('이거다!!!!!!!!!!!!!!!!!!!!!', finalizeSettlementParams);
        const response = await finalizeTaxiSettlementApi(finalizeSettlementParams);
        console.log('택시 정산 응답:', response);

        // 성공적으로 처리된 경우, 메인 화면으로 이동
        navigate('/');
      } catch (error) {
        console.error('Error finalizing taxi settlement:', error);
      }
    }
  };

  return (
    <div className="flex flex-col bg-white max-w-[360px] mx-auto relative h-screen font-[Nanum_Gothic]">
      <div className="flex items-center px-4 py-3">
        <BackButton />
        <div className="mt-2.5 flex-grow text-center text-lg font-bold text-black">
          정산하기
        </div>
      </div>

      <div className="mt-2 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 min-h-[0.5px]" />

      <div className="flex flex-col mt-4 px-4 font-[Nanum_Gothic] h-[calc(100%-160px)] relative">
        <div className="p-5 rounded-xl shadow-lg border border-inherit h-full overflow-y-scroll pb-24">
          <div className="text-gray-500 mb-4 text-sm">
            {formatDate(taxiParty.createdAt)}
          </div>
          <div className="flex items-center mb-6">
            <img src={taxiIcon} alt="Took" className="w-14 h-14" />
            <div className="ml-4 relative">
              <div className="text-sm font-bold text-black mb-1">
                총 {taxiParty.count}명
              </div>
              <div className="text-lg flex items-center">
                <input
                  type="text"
                  placeholder="금액입력"
                  value={totalAmount ? `${formatNumber(totalAmount)}` : ''}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 outline-none text-lg text-black w-28"
                />
                <span className="text-lg font-bold text-black ml-1">원</span>
              </div>
            </div>
          </div>

          {partyMembers.map((member) => {
            const balance = member.cost - member.real_cost;
            const formattedBalance =
              balance > 0 ? `+${formatNumber(balance)}` : formatNumber(balance);
            return (
              <div key={member.member_seq} className="mb-4">
                <div className="flex items-center mb-3">
                  <div className="flex-grow items-center">
                    <div className="flex items-center font-bold">
                      <img
                        src={getProfileImagePath(member.imgNo)}
                        alt={member.userName}
                        className="font-[Nanum_Gothic] w-9 h-9 mr-4"
                      />
                      <span>{member.userName}</span>
                      {member.is_leader && (
                        <span className="ml-2 bg-gray-300 text-white text-xs rounded-full px-2 py-0.5">
                          본인
                        </span>
                      )}
                    </div>
                    {totalAmount ? (
                      <div>
                        <div className="flex justify-between mt-2 ml-1">
                          <span className="text-sm">선결제금액</span>
                          <span className="text-sm">
                            {formatNumber(member.cost)} 원
                          </span>
                        </div>
                        <div className="flex justify-between mt-2 ml-1">
                          <span className="text-sm">실결제금액</span>
                          <span className="text-sm font-bold">
                            {formatNumber(member.real_cost)} 원
                          </span>
                        </div>
                        <div className="flex justify-between mt-2 ml-1">
                          <span className="text-sm">차액</span>
                          <span
                            className={`text-sm font-bold ${
                              balance >= 0 ? 'text-green-500' : 'text-red-500'
                            }`}
                          >
                            {formattedBalance} 원
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="border-b border-gray-300 my-2"></div>
              </div>
            );
          })}
        </div>
        <div className="absolute bottom-4 left-0 w-full flex justify-center px-4">
          <button
            className={`w-full max-w-[280px] py-3 rounded-2xl text-white text-lg font-bold ${
              totalAmount ? 'bg-main' : 'bg-main/50'
            }`}
            onClick={handleSubmit}
            disabled={!totalAmount}
          >
            {totalAmount ? 'took 요청하기' : '금액을 입력해 주세요'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaxiCostInputPage;
