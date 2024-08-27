import React, { useState, useEffect } from 'react';
import { FaLocationDot, FaCrown } from 'react-icons/fa6';
import { FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { IoIosSettings } from 'react-icons/io';
import { TbMapCheck } from 'react-icons/tb';
import { LiaUserMinusSolid } from 'react-icons/lia';
import getProfileImagePath from '../../utils/getProfileImagePath';
import { getUserInfoApi } from '../../apis/user';
import { useUser } from '../../store/user';
import { usePosition } from '../../store/position.js';
import { deleteRoomApi } from '../../apis/chat/chat.js';
import { makeTaxiPartyApi } from '../../apis/payment/jungsan.js';
import {
  updateTaxiPartyStatusApi,
  linkSettlementApi,
  deleteTaxiGuestApi,
  getAllTaxiPartyMembersApi,
  deleteTaxiPartyApi,
} from '../../apis/taxi';
import { useNavigate } from 'react-router-dom';

const TaxiChattingMenu = ({
  members,
  setMembers,
  taxiParty,
  taxiStatus,
  setTaxiStatus, // 상태 변경 함수 받기
  handleMenuToggle,
  setPartySeq,
}) => {
  const { seq: currentUserSeq } = useUser();
  const [userInfos, setUserInfos] = useState({});
  const { latitude, longitude } = usePosition();
  const [modalMessageLine1, setModalMessageLine1] = useState('');
  const [modalMessageLine2, setModalMessageLine2] = useState('');
  const [modalType, setModalType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfos = async () => {
      const userInfoPromises = members.map(async (member) => {
        const userInfo = await getUserInfoApi({ userSeq: member.userSeq });
        return {
          userSeq: member.userSeq,
          userName: userInfo.userName,
          imageNo: userInfo.imageNo,
        };
      });

      const resolvedUserInfos = await Promise.all(userInfoPromises);
      const userInfoMap = resolvedUserInfos.reduce((acc, userInfo) => {
        acc[userInfo.userSeq] = {
          userName: userInfo.userName,
          profileImagePath: getProfileImagePath(userInfo.imageNo),
        };
        return acc;
      }, {});

      setUserInfos(userInfoMap);
      setLoading(true);
    };

    fetchUserInfos();
  }, [members]);

  const handleEndRecruitment = async () => {
    if (taxiParty.status === 'OPEN') {
      setModalType('endRecruitment');
      setModalMessageLine1('모집을 종료하시겠어요?');
      setModalMessageLine2('※ 종료 후엔 인원을 추가할 수 없어요.');
    } else {
      setModalType('info');
      setModalMessageLine1('이미 모집이 종료되었어요.');
      setModalMessageLine2('');
    }
    setShowModal(true);
  };

  const handleConfirmRoute = async () => {
    if (!taxiParty.partySeq) {
      setModalType('confirmRoute');
      setModalMessageLine1('경로를 확정하시겠어요?');
      setModalMessageLine2('※ 확정 후엔 경로를 변경할 수 없어요.');
    } else {
      setModalType('info');
      setModalMessageLine1('이미 경로 확정 완료되었어요.');
      setModalMessageLine2('');
    }
    setShowModal(true);
  };

  const handleLeaveChatting = async () => {
    setModalType('leaveChat');
    setModalMessageLine1('채팅방을 나가시겠어요?');
    if (taxiParty.userSeq === currentUserSeq) {
      setModalMessageLine2('방장이 나가면 채팅방이 없어져요');
    } else {
      setModalMessageLine2('');
    }
    setShowModal(true);
  };

  const handleModalAction = async () => {
    try {
      if (modalType === 'endRecruitment') {
        await updateTaxiPartyStatusApi({
          taxiSeq: taxiParty.taxiSeq,
          status: 'FILLED',
        });
        setTaxiStatus('FILLED'); // 상태 변경

      } else if (modalType === 'confirmRoute') {
        await updateTaxiPartyStatusApi({
          taxiSeq: taxiParty.taxiSeq,
          status: 'FILLED',
        });
        setTaxiStatus('FILLED'); // 상태 변경
        console.log('택시 파티 상태가 FILLED로 업데이트되었습니다.');

        // 택시파티내의 모든 멤버 조회
        const membersResponse = await getAllTaxiPartyMembersApi(
          taxiParty.taxiSeq
        );
        const partyParams = {
          title: `taxi ${taxiParty.taxiSeq}`,
          category: 2,
          cost: membersResponse.reduce((sum, member) => sum + member.cost, 0),
          users: membersResponse.map((member) => ({
            userSeq: member.userSeq,
            fakeCost: member.cost,
          })),
          master: taxiParty.master,
          startLat: latitude,
          startLon: longitude,
          taxiSeq: taxiParty.taxiSeq,
        };
        
        // 택시 정산 파티 생성(가결제시) 가결제 실패시 -1 반환
        const partyResponse = await makeTaxiPartyApi(partyParams);
        setPartySeq(partyResponse)
        console.log('택시 정산 partyseq:', partyResponse);
        // 나가기 버튼 클릭시
      } else if (modalType === 'leaveChat') {
        if (taxiParty.userSeq === currentUserSeq) {
          // 택시 파티 삭제
          await deleteTaxiPartyApi(taxiParty.taxiSeq);
          // 룸 삭제
          await deleteRoomApi(taxiParty.roomSeq);
          console.log('방장으로서 택시 파티와 채팅방을 삭제했습니다.');
        } else {
          await deleteTaxiGuestApi({
            taxiSeq: taxiParty.taxiSeq,
            userSeq: currentUserSeq,
          });
          console.log('게스트로서 택시 파티에서 나갔습니다.');
        }

        const updatedMemberList = await getAllTaxiPartyMembersApi(
          taxiParty.taxiSeq
        );
        setMembers(updatedMemberList);

        navigate('/'); // "/" 경로로 이동
      }
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error);
    } finally {
      setShowModal(false);
    }
  };

  // 택시 파티 멤버 삭제 핸들러
  const handleDeleteGuest = async (guestUserSeq) => {
    try {
      await deleteTaxiGuestApi({
        taxiSeq: taxiParty.taxiSeq,
        userSeq: guestUserSeq,
      });
      console.log('게스트가 성공적으로 삭제되었습니다.');

      const updatedMembers = members.filter(
        (member) => member.userSeq !== guestUserSeq
      );
      setMembers(updatedMembers);

      const updatedMemberList = await getAllTaxiPartyMembersApi(
        taxiParty.taxiSeq
      );
      setMembers(updatedMemberList);
    } catch (error) {
      console.error('게스트 삭제 중 오류 발생:', error);
    }
  };

  // 채팅 설정 페이지로 이동하는 함수
  const handleChatSetting = () => {
    navigate(`/taxi/setting/${taxiParty.roomSeq}`, {
      state: { taxiSeq: taxiParty.taxiSeq, taxiParty },
    });
  };
  if(!loading) {
    <div>Loading...</div>
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="w-4/5 h-full bg-white shadow-md p-4 relative">
        <button
          onClick={handleMenuToggle}
          className="text-gray-400 focus:outline-none absolute top-5 right-4"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        <div className="text-base font-bold mt-6 ml-1 mb-4">경로</div>
        <ul>
          {Array.from(new Set(members.map((member) => member.destiName))).map(
            (destiName, index) => (
              <li
                key={`${destiName}-${index}`}
                className="flex items-center justify-between mb-2 py-1"
              >
                <div className="items-center flex flex-row text-sm text-black">
                  <FaLocationDot className="mr-1 w-4 h-4 text-neutral-300" />
                  <span className="px-2">{destiName}</span>
                </div>
              </li>
            )
          )}
        </ul>

        {taxiParty.userSeq === currentUserSeq && (
          <div className="mt-6">
            <div className="mt-6 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 border-neutral-400 border-opacity-40 min-h-[0.5px]" />
            <h2 className="text-base font-bold mb-4 ml-1 mt-6">모임 관리</h2>
            <div className="flex items-center justify-between mb-2 ml-1 mr-10">
              <div
                className="flex items_center text-sm text-black cursor-pointer"
                onClick={handleEndRecruitment}
              >
                <LiaUserMinusSolid className="mr-2 w-5 h-5 text-neutral-700" />
                <span>모집 종료</span>
              </div>
              <div
                className="flex items-center text-sm text-black cursor-pointer"
                onClick={handleConfirmRoute}
              >
                <TbMapCheck className="mr-2 w-5 h-5 text-neutral-700" />
                <span>경로 확정</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 border-neutral-400 border-opacity-40 min-h-[0.5px]" />

        <h2 className="text-base font-bold mt-6 mb-4 ml-1">참여자</h2>
        <ul>
          {members.map((member) => (
            <li
              key={member.userSeq}
              className="flex items-center justify-between mb-2 ml-1"
            >
              <div className="flex items-center py-2">
                <img
                  src={
                    userInfos[member.userSeq]?.profileImagePath || 'Loading...'
                  }
                  alt={userInfos[member.userSeq]?.userName || 'Loading...'}
                  className="w-8 h-8 mr-2"
                />
                <span className="text-sm">
                  {userInfos[member.userSeq]?.userName || 'Loading...'}
                </span>
                {currentUserSeq === member.userSeq && (
                  <div className="ml-1 text-xs bg-neutral-400 px-1.5 py-1 rounded-full text-white">
                    나
                  </div>
                )}
                {member.userSeq === taxiParty.userSeq && (
                  <FaCrown className="text-yellow-500 ml-1 w-5" />
                )}
              </div>
              <div className="flex items-center">
                {member.userSeq === taxiParty.master && (
                  <div className="text-xs bg-main px-2 py-1 rounded-lg shadow-sm text-white">
                    결제자
                  </div>
                )}
                {taxiParty.userSeq === currentUserSeq &&
                  member.userSeq !== taxiParty.master &&
                  member.userSeq !== taxiParty.userSeq && (
                    <button
                      className="text-red-600 border-2 border-red-600 rounded-lg py-1 px-2 text-xs ml-2"
                      onClick={() => handleDeleteGuest(member.userSeq)}
                    >
                      내보내기
                    </button>
                  )}
              </div>
            </li>
          ))}
        </ul>
        {taxiStatus !== 'BOARD' && taxiStatus !== 'DONE' && (
          <button
            className="absolute bottom-4 left-4 text-gray-400"
            onClick={handleLeaveChatting}
          >
            <FaSignOutAlt className="w-6 h-6" />
          </button>
        )}
        {currentUserSeq === taxiParty.userSeq && (
          <button
            className="absolute bottom-4 right-4 text-gray-400"
            onClick={handleChatSetting}
          >
            <IoIosSettings className="w-7 h-7" />
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-72">
            <p
              className="text-center font-semibold whitespace-pre-line"
              style={{ fontSize: '17px', color: 'black' }}
            >
              {modalMessageLine1}
            </p>
            {modalMessageLine2 && (
              <p
                className="text-center font-medium whitespace-pre-line"
                style={{
                  fontSize: '14px',
                  color: '#555555',
                  marginTop: '10px',
                }}
              >
                {modalMessageLine2}
              </p>
            )}
            {modalType === 'info' ? (
              <button
                className="mt-4 px-4 py-2 bg-neutral-300 text-white font-bold rounded-2xl mx-auto"
                onClick={() => setShowModal(false)}
                style={{ display: 'block', width: '100px' }}
              >
                확인
              </button>
            ) : (
              <div className="flex justify-between mt-4 ml-4 mr-4">
                <button
                  className="px-4 py-2 bg-neutral-200 text-black font-bold rounded-xl w-full mr-2"
                  onClick={() => setShowModal(false)}
                >
                  취소
                </button>
                <button
                  className="px-4 py-2 bg-main text-white font-bold rounded-xl w-full"
                  onClick={handleModalAction}
                >
                  {modalType === 'endRecruitment'
                    ? '종료하기'
                    : modalType === 'confirmRoute'
                      ? '확정하기'
                      : '확인'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxiChattingMenu;
