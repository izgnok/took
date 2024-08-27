import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { FaPaperPlane, FaArrowDown, FaBars } from 'react-icons/fa';
import { FaCalculator } from 'react-icons/fa6';
import { MdAdd } from 'react-icons/md';
import backIcon from '../../assets/common/back.svg';
import speaker from '../../assets/common/speaker.png';
import listIcon from '../../assets/chat/list.png';
import locationIcon from '../../assets/chat/location.png';
import boardIcon from '../../assets/chat/boardTaxi.png';
import doneIcon from '../../assets/chat/doneTaxi.png';
import TaxiChattingMenu from '../../components/taxi/TaxiChattingMenu';
import { useUser } from '../../store/user';
import { getChatRoomMessageApi, getUsersApi } from '../../apis/chat/chat';
import { updateTaxiPartyStatusApi, getAllTaxiPartyMembersApi, getTaxiPartyApi } from '../../apis/taxi';
import { getUserInfoApi } from '../../apis/user';
import getProfileImagePath from '../../utils/getProfileImagePath';
import { formatDateOnly, formatTime } from '../../utils/formatDate';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const BackButton = () => {
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate("/chat/list");
  };
  return (
    <img
      src={backIcon}
      alt="메인으로"
      className="w-6 h-6 mx-6 mt-6 absolute top-0 left-0 opacity-80"
      onClick={handleBackClick}
    />
  );
};

function TaxiChattingMainPage() {
  const { id: roomSeq } = useParams();
  const location = useLocation();
  const { taxiSeq, chatRoom } = location.state || {};
  const { seq: userSeq, setName } = useUser();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showActionIcons, setShowActionIcons] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [taxiStatus, setTaxiStatus] = useState('');
  const [showSettlementButton, setShowSettlementButton] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [taxiParty, setTaxiParty] = useState(null);
  const [members, setMembers] = useState([]);
  const [userName, setUserName] = useState('');
  const [chatUsers, setChatUsers] = useState([]);
  const [guestSeq, setGuestSeq] = useState(null);
  const [partySeq, setPartySeq] = useState(null);
  const [userCount, setUserCount] = useState(null);
  const textareaRef = useRef(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const actionIconsRef = useRef(null);
  const lastDateRef = useRef('');
  const stompClient = useRef(null);
  const currentSubscription = useRef(null);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfoApi({ userSeq });
        setUserName(userInfo.userName);
        setName(userInfo.userName);
      } catch (error) {
        console.error('사용자 정보를 불러오는 중 오류 발생:', error);
      }
    };

    if (userSeq) {
      fetchUserInfo();
    }
  }, [userSeq, setName]);

 

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 72)}px`;
    }
  }, [inputMessage]);

  useEffect(() => {
    const socket = new SockJS(`${SERVER_URL}/ws`);
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect({}, () => {
      console.log('WebSocket connected');
      enterRoom();
      loadUsers();
    });

    return () => {
      if (stompClient.current && stompClient.current.connected) {
        stompClient.current.disconnect();
      }
    };
  }, []);

  const enterRoom = () => {
    if (currentSubscription.current) {
      currentSubscription.current.unsubscribe();
    }
    currentSubscription.current = subscribeToRoomMessages(roomSeq);
    fetchRoomMessages();
  };

  function subscribeToRoomMessages(roomSeq) {
    return stompClient.current.subscribe(
      `/sub/chat/room/${roomSeq}`,
      (messageOutput) => {
        const newMessage = JSON.parse(messageOutput.body);
        // 추가된 메시지의 사용자 정보를 가져와 병합
        getUserInfoApi({ userSeq: newMessage.userSeq })
          .then((userInfo) => {
            setMessages((prevMessages) => {
              const updatedMessages = [
                ...prevMessages,
                {
                  ...newMessage,
                  userName: userInfo.userName,
                  imgNo: userInfo.imageNo,
                },
              ];
              console.log("Updated Messages:", updatedMessages); // 상태가 잘 병합되었는지 확인
              return updatedMessages;
            });
          })
          .catch((error) => console.error('Error fetching user info:', error));
      }
    );
  }

  const fetchRoomMessages = async () => {
    try {
      const response = await getChatRoomMessageApi({
        roomSeq: roomSeq,
        userSeq: userSeq,
      });
      console.log('채팅 내용:', response);
      // 각 메시지에 대해 추가 유저 정보를 가져옴
      const messagesWithUserInfo = await Promise.all(
        response.map(async (msg) => {
          const userInfo = await getUserInfoApi({ userSeq: msg.userSeq });
          return {
            ...msg,
            userName: userInfo.userName,
            imgNo: userInfo.imgNo,
          };
        })
      );
  
      setMessages(messagesWithUserInfo);
    } catch (error) {
      console.error('메시지를 불러오는 중 오류 발생:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await getUsersApi(roomSeq);
      setChatUsers(response);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const messageRequest = {
      type: 'TALK',
      roomSeq: roomSeq,
      userSeq: userSeq,
      message: inputMessage,
    };

    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.send(
        '/pub/message/send',
        {},
        JSON.stringify(messageRequest)
      );
      setInputMessage('');
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      console.error('WebSocket is not connected.');
    }
  };

  const getUserProfileImgNo = (userSeq) => {
    const user = chatUsers.find((member) => member.userSeq === userSeq);
    const imgNo = user ? user.imageNo : 1;
    return imgNo;
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    const isAtBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 100;
    setShowScrollButton(!isAtBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollButton(false);
  };

  const toggleActionIcons = () => {
    setShowActionIcons(!showActionIcons);
  };

  const handleClickOutside = (event) => {
    if (
      actionIconsRef.current &&
      !actionIconsRef.current.contains(event.target)
    ) {
      setShowActionIcons(false);
    }
  };

  const handleSettingDestination = () => {
    if (taxiParty?.partySeq === null) {
      navigate(`/taxi/path/${taxiSeq}`, { state: { guestSeq: guestSeq } });
    } else {
      openModal('이미 경로가 확정되었어요');
    }
  };

  const handleCheckDestinationList = () => {
    navigate(`/taxi/path-list/${taxiSeq}`, {
      state: {
        members: members,
        taxiParty: taxiParty,
      },
    });
  };

  const handleChatSetting = () => {
    navigate('/taxi/setting');
  };

  const openModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleKickMember = (userName) => {
    openModal(`${userName}님을 채팅방에서\n내보내시겠습니까?`);
  };

  const handleLeaveChatting = () => {
    openModal('채팅방을 나가시겠습니까?');
  };

  const handleConfirmLeaveChatting = () => {
    navigate('/chat/list');
    closeModal();
  };

  const handleBoardTaxi = async () => {
    setConfirmAction('board'); // 'board' 작업을 설정
    openModal('탑승 처리하시겠습니까?');
  };

  const handleDoneTaxi = async () => {
    setConfirmAction('done'); // 'done' 작업을 설정
    openModal('하차 처리하시겠습니까?');
  };

  const handleConfirmBoardTaxi = async () => {
    try {
      await updateTaxiPartyStatusApi({
        taxiSeq: taxiParty.taxiSeq,
        status: 'BOARD',
      });
      setTaxiStatus('BOARD');
      closeModal();
    } catch (error) {
      console.error('택시 상태를 BOARD로 업데이트하는 중 오류 발생:', error);
    }
  };

  const handleConfirmDoneTaxi = async () => {
    setShowSettlementButton(true); // '정산하기' 버튼을 표시합니다.
    closeModal(); // 모달을 닫습니다.
  };

  const handleSettlement = () => {
    navigate(`/taxi/input/${partySeq}`, {
      state: { taxiParty, members, userName },
    });
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!taxiSeq || !userSeq || !roomSeq) return;

    const fetchTaxiPartyData = async () => {
      try {
        const [taxiPartyData, membersData, chatUsersData, messagesData] =
          await Promise.all([
            getTaxiPartyApi(taxiSeq),
            getAllTaxiPartyMembersApi(taxiSeq),
            getUsersApi(roomSeq),
            getChatRoomMessageApi({
              roomSeq: roomSeq,
              userSeq: userSeq,
            }),
          ]);

        setTaxiParty(taxiPartyData);
        setTaxiStatus(taxiPartyData.status); // 상태 설정
        setMembers(membersData);
        setChatUsers(chatUsersData);
        setMessages(messagesData);

        // userSeq와 일치하는 guestSeq 찾기
        const member = membersData.find((member) => member.userSeq === userSeq);
        if (member) {
          setGuestSeq(member.guestSeq);
        }
      } catch (error) {
        console.error('데이터를 불러오는 중 오류 발생:', error);
      }
    };

    fetchTaxiPartyData();
  }, [taxiSeq, userSeq, roomSeq, partySeq, showMenu ]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const isAtBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 1;
    setShowScrollButton(!isAtBottom);
  }, [messages]);

  useEffect(() => {
    const handleKeyboardShow = () => {
      setIsKeyboardVisible(true);
    };
    const handleKeyboardHide = () => {
      setIsKeyboardVisible(false);
    };

    window.addEventListener('keyboardDidShow', handleKeyboardShow);
    window.addEventListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      window.removeEventListener('keyboardDidShow', handleKeyboardShow);
      window.removeEventListener('keyboardDidHide', handleKeyboardHide);
    };
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex flex-col bg-[#FFF7ED] max-w-[360px] mx-auto relative h-screen">
      <div className="flex items-center px-5 py-3">
        <BackButton />
        <div className="mt-2.5 flex-grow text-center text-lg font-bold text-black">
          {chatRoom?.roomTitle || members[0]?.destiName || '채팅방'}
        </div>
        <FaBars className="mt-2.5" onClick={handleMenuToggle} />
      </div>

      {showMenu && (
        <TaxiChattingMenu
          members={members}
          setMembers={setMembers}
          taxiParty={taxiParty}
          taxiStatus={taxiStatus}
          setTaxiStatus={setTaxiStatus} // 상태 변경 함수를 전달
          handleMenuToggle={handleMenuToggle}
          handleKickMember={handleKickMember}
          handleLeaveChatting={handleLeaveChatting}
          handleChatSetting={handleChatSetting}
          setPartySeq={setPartySeq}
        />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center text-center text-base items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-64">
            <p className="whitespace-pre-line font-bold mb-4">{modalMessage}</p>
            <div className="flex flex-row gap-3 justify-center">
              <button
                onClick={closeModal}
                className="bg-gray-200 text-[#3D3D3D] text-sm px-8 py-2 rounded-xl font-bold"
              >
                취소
              </button>
              <button
                onClick={
                  confirmAction === 'board'
                    ? handleConfirmBoardTaxi
                    : handleConfirmDoneTaxi
                }
                className="bg-main text-white text-sm px-8 py-2 rounded-xl font-bold"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full px-2 py-1">
        <div className="flex items-center bg-white p-2 rounded-lg shadow-md">
          <img src={speaker} alt="speaker" className="w-6 h-6 mx-1" />
          <div className="text-sm text-gray-700">경로를 설정해주세요!</div>
        </div>
      </div>

      <div
        className="flex-grow overflow-y-scroll px-4 py-2 mb-11 space-y-4 relative"
        onScroll={handleScroll}
        ref={scrollContainerRef}
      >
        {messages.map((message, index, array) => {
          const sameUserAndTime =
            index > 0 &&
            message.userSeq === array[index - 1].userSeq &&
            formatTime(new Date(message.createdAt)) ===
              formatTime(new Date(array[index - 1].createdAt));
          const lastMessageFromSameUser =
            index < array.length - 1 &&
            message.userSeq === array[index + 1].userSeq &&
            formatTime(new Date(message.createdAt)) ===
              formatTime(new Date(array[index + 1].createdAt));
          const showDate =
            lastDateRef.current !== formatDateOnly(message.createdAt);
          lastDateRef.current = formatDateOnly(message.createdAt);

          return (
            <div key={message.id}>
              {showDate && (
                <div className="w-1/2 text-center text-xs mx-auto py-1 bg-neutral-200 bg-opacity-70 rounded-full text-black mt-2 mb-5">
                  {formatDateOnly(message.createdAt)}
                </div>
              )}
              <div
                className={`flex ${
                  message.userSeq === userSeq ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.userSeq !== userSeq && (
                  <div className="flex flex-col items-center mr-2">
                    <img
                      src={getProfileImagePath(getUserProfileImgNo(message.userSeq))}
                      alt={message.userName}
                      className="w-9 h-9 self-start"
                    />
                  </div>
                )}
                <div className="flex flex-col max-w-[88%]">
                  {!sameUserAndTime && message.userSeq !== userSeq && (
                    <span
                      className={`text-xs mb-1 text-black ${
                        message.userSeq === userSeq ? 'text-right' : 'text-left'
                      }`}
                    >
                      {message.userName}
                    </span>
                  )}
                  <div className="flex items-end">
                    {message.userSeq === userSeq &&
                      !lastMessageFromSameUser && (
                        <div className="text-[9px] text-gray-400 mr-2 whitespace-nowrap">
                          {formatTime(new Date(message.createdAt))}
                        </div>
                      )}
                    <div
                      className={`p-2 rounded-xl shadow-md ${
                        message.userSeq === userSeq
                          ? 'bg-main text-white'
                          : 'bg-white text-black'
                      }`}
                    >
                      <div className="text-sm">{message.message}</div>
                    </div>
                    {message.userSeq !== userSeq &&
                      !lastMessageFromSameUser && (
                        <div className="text-[9px] text-gray-400 ml-2 whitespace-nowrap">
                          {formatTime(new Date(message.createdAt))}
                        </div>
                      )}
                  </div>
                </div>
                {message.userSeq === userSeq && (
                  <div className="flex flex-col items-center ml-2">
                    <img
                      src={getProfileImagePath(getUserProfileImgNo(message.userSeq))}
                      alt={message.userName}
                      className="w-9 h-9 self-start"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <div
        className={`absolute bottom-0 left-0 w-full ${
          isKeyboardVisible ? 'hidden' : ''
        }`}
      >
        {taxiParty?.master === userSeq && showSettlementButton && (
          <button
            onClick={handleSettlement}
            className="w-full py-4 bg-neutral-400 text-white text-lg font-bold flex items-center justify-center"
          >
            <FaCalculator className="mr-2" />
            정산하기
          </button>
        )}

        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 p-2 bg-main text-white rounded-full"
          >
            <FaArrowDown />
          </button>
        )}

        <div className="flex flex-col">
          <div className="relative bottom-0 left-0 right-0 bg-white p-2 shadow-md flex items-center">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              rows="1"
              onKeyDown={handleKeyPress}
              className="flex-grow p-2 border rounded-lg resize-none overflow-hidden"
              placeholder="메시지를 입력하세요"
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 p-2 bg-main text-white rounded-full"
            >
              <FaPaperPlane />
            </button>
            <MdAdd
              onClick={toggleActionIcons}
              className="ml-2 text-2xl text-main cursor-pointer"
            />
          </div>
        </div>
        {showActionIcons && (
          <div
            className="w-full px-4 py-12 bg-white flex justify-around"
            ref={actionIconsRef}
          >
            <div className="flex flex-col items-center mb-4">
              <div
                className="w-11 h-11 rounded-full bg-[#AEC8F0] flex items-center justify-center"
                onClick={handleSettingDestination}
              >
                <img src={locationIcon} alt="경로 설정" className="w-5 h-6" />
              </div>
              <span className="mt-1 text-[11px] text-gray-500">경로 설정</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className="w-11 h-11 rounded-full bg-[#E4C0ED] flex items-center justify-center"
                onClick={handleCheckDestinationList}
              >
                <img src={listIcon} alt="현재 경로 목록" className="w-5 h-6" />
              </div>
              <span className="mt-1 text-[11px] text-gray-500">
                현재 경로 목록
              </span>
            </div>
          </div>
        )}
      </div>

      {taxiParty?.master === userSeq && !showSettlementButton && (
        <>
          {partySeq && taxiStatus === 'FILLED'&& (
            <button
              onClick={handleBoardTaxi}
              className="absolute bottom-16 left-4"
            >
              <img src={boardIcon} alt="탑승하기" className="w-14 h-14" />
            </button>
          )}
          {taxiStatus === 'BOARD' && (
            <button
              onClick={handleDoneTaxi}
              className="absolute bottom-16 left-4"
            >
              <img src={doneIcon} alt="하차하기" className="w-14 h-14" />
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default TaxiChattingMainPage;
