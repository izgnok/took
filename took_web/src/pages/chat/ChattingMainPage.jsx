import React, { useState, useEffect, useRef } from 'react';
import BackButton from '../../components/common/BackButton';
import getProfileImagePath from '../../utils/getProfileImagePath';
import { getChatRoomMessageApi, getUsersApi } from '../../apis/chat/chat';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../store/user';
import { formatDateOnly, formatTime } from '../../utils/formatDate';
import speaker from '../../assets/common/speaker.png';
import delivery from '../../assets/chat/delivery.png';
import calculator from '../../assets/chat/calculator.png';
import money from '../../assets/chat/money.png';
import {
  FaChevronUp,
  FaChevronDown,
  FaPaperPlane,
  FaArrowDown,
  FaBars,
} from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';
import CalculatorModal from '../../components/chat/CalculatorModal';
import MoneyModal from '../../components/chat/MoneyModal';
import DeliveryModal from '../../components/chat/DeliveryModal';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import ParticipantList from '../../components/chat/ParticipantList';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function ChattingMainPage() {
  const { id } = useParams();
  const { seq } = useUser();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showActionIcons, setShowActionIcons] = useState(false);
  const [currentModal, setCurrentModal] = useState(null);
  const [showParticipantList, setShowParticipantList] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const actionIconsRef = useRef(null);
  const textareaRef = useRef(null);
  const stompClient = useRef(null);
  const currentSubscription = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const chatRoom = location.state?.chatRoom || null;

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

  const fetchRoomMessages = async () => {
    try {
      const response = await getChatRoomMessageApi({
        roomSeq: id,
        userSeq: seq,
      });
      setMessages(response);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await getUsersApi(id);
      setUsers(response);
      console.log(response);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const enterRoom = () => {
    if (currentSubscription.current) {
      currentSubscription.current.unsubscribe();
    }
    // const enterRequest = { roomSeq: id, userSeq: seq };
    // stompClient.current.send(
    //   '/pub/room/enter',
    //   {},
    //   JSON.stringify(enterRequest)
    // );
    currentSubscription.current = subscribeToRoomMessages(id);
    fetchRoomMessages();
  };

  function subscribeToRoomMessages(roomSeq) {
    return stompClient.current.subscribe(
      `/sub/chat/room/${roomSeq}`,
      (messageOutput) => {
        const newMessage = JSON.parse(messageOutput.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    );
  }

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const messageRequest = {
      type: 'TALK',
      roomSeq: id,
      userSeq: seq,
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

  const leaveRoom = ({ roomSeq, userSeq }) => {
    if (stompClient.current && stompClient.current.connected) {
      const leaveRequest = { roomSeq, userSeq };
      stompClient.current.send(
        '/pub/room/leave',
        {},
        JSON.stringify(leaveRequest)
      );
    }
    navigate(-1);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    const isAtBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 1;
    setShowScrollButton(!isAtBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollButton(false);
  };

  const toggleActionIcons = () => {
    setShowActionIcons(!showActionIcons);
  };

  const openModal = (modalType) => {
    setCurrentModal(modalType);
  };

  const closeModal = () => {
    setCurrentModal(null);
  };

  const handleShowParticipantList = () => {
    setShowParticipantList(true);
  };

  const handleCloseParticipantList = () => {
    setShowParticipantList(false);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    const isAtBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 1;
    setShowScrollButton(!isAtBottom);
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 72)}px`;
    }
  }, [inputMessage]);

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
          {chatRoom?.roomTitle || '채팅방'}
        </div>
        <FaBars className="mt-2.5" onClick={handleShowParticipantList} />
      </div>
      <div className="mt-1 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 min-h-[0.5px]" />

      <div className="w-full px-2 py-1">
        <div
          className={`flex items-start p-2 m-1 rounded-lg shadow-md ${isCollapsed ? 'bg-opacity-80 bg-white shadow-none' : 'bg-white'}`}
        >
          <img src={speaker} alt="speaker" className="w-6 h-6 ml-1" />
          <div className="ml-2 flex-grow">
            <div className="text-sm mt-[2px]"></div>
            {!isCollapsed && (
              <div className="text-sm text-gray-500">
                함께 주문하기 :
                <a href="https://s.baemin.com/bfp.lty8b" className="underline">
                  {' '}
                  https://s.baemin.com/bfp.lty8b
                </a>
              </div>
            )}
          </div>
          <button onClick={toggleCollapse} className="focus:outline-none">
            {isCollapsed ? (
              <FaChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <FaChevronUp className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div
        className="flex-grow overflow-y-scroll px-4 py-2 space-y-4 relative"
        onScroll={handleScroll}
        ref={scrollContainerRef}
      >
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((message, index) => {
            const { userSeq, message: text, createdAt } = message;
            const isCurrentUser = userSeq === seq;
            const messageDate = new Date(createdAt);
            const formattedTime = formatTime(messageDate);

            const user = users.find((user) => user.userSeq === userSeq);
            const userProfileImage = user
              ? getProfileImagePath(user.imageNo)
              : '';
            const userName = user ? user.userName : '';

            return (
              <div
                key={index}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}
              >
                {isCurrentUser ? (
                  <>
                    <div className="flex items-end flex-col mr-2">
                      {/* <span className="text-xs text-gray-500 text-right mb-1">{userName}</span> */}
                      <div className="flex items-end ">
                        <div className="text-[10px] text-gray-500 top-full mr-2 left-0 mt-1">
                          {formattedTime}
                        </div>
                        <div className="px-4 py-2 rounded-xl max-w-xs shadow-md bg-main text-white relative">
                          {text}
                        </div>
                      </div>
                    </div>
                    <img
                      src={userProfileImage}
                      alt={userName}
                      className="w-8 h-8 ml-2"
                    />
                  </>
                ) : (
                  <>
                    <img
                      src={userProfileImage}
                      alt={userName}
                      className="w-8 h-8 mr-2 mt-2"
                    />
                    <div className="flex items-start flex-col ml-2">
                      <span className="text-xs text-gray-500 text-left mb-1">
                        {userName}
                      </span>
                      <div className="flex items-end">
                        <div className="px-4 py-2 rounded-xl max-w-xs shadow-md bg-white relative">
                          {text}
                        </div>
                        <div className="text-[10px] text-gray-500  mt-1 ml-2">
                          {formattedTime}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center rounded-xl m-2 text-sm py-1 shadow bg-gray-500 bg-opacity-10">
            메시지가 없습니다.
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

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
              onClick={() => openModal('calculator')}
            >
              <img src={calculator} alt="정산" className="w-6 h-6" />
            </div>
            <span className="mt-1 text-[11px] text-gray-500">정산</span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-11 h-11 rounded-full bg-[#E4C0ED] flex items-center justify-center"
              onClick={() => openModal('money')}
            >
              <img src={money} alt="주문금액" className="w-7 h-7" />
            </div>
            <span className="mt-1 text-[11px] text-gray-500">주문금액</span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-11 h-11 rounded-full bg-[#D2ACA4] flex items-center justify-center"
              onClick={() => openModal('delivery')}
            >
              <img src={delivery} alt="배달" className="w-6 h-5" />
            </div>
            <span className="mt-1 text-[11px] text-gray-500">배달</span>
          </div>
        </div>
      )}
      {currentModal === 'calculator' && (
        <CalculatorModal
          onClose={closeModal}
          tempMember={users}
          leader={chatRoom.userSeq}
        />
      )}
      {currentModal === 'money' && (
        <MoneyModal onClose={closeModal} tempMember={users} />
      )}
      {currentModal === 'delivery' && (
        <DeliveryModal onClose={closeModal} tempMember={users} />
      )}

      {showParticipantList && (
        <ParticipantList
          participants={users}
          onClose={handleCloseParticipantList}
          onSignOut={leaveRoom}
          leaderSeq={chatRoom.userSeq}
        />
      )}
    </div>
  );
}

export default ChattingMainPage;
