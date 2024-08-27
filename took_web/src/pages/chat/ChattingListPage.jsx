import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import taxiIcon from '../../assets/chat/taxiIcon.png';
import deliveryIcon from '../../assets/chat/deliveryIcon.png';
import buyingIcon from '../../assets/chat/buyingIcon.png';
import tookIcon from '../../assets/chat/tookIcon.png';
import { getChatListApi } from '../../apis/chat/chat';
import { useUser } from '../../store/user';
import { getSeletByRoomApi } from '../../apis/taxi';
import CompleteIcon from '../../assets/payment/complete.png';
import backIcon from '../../assets/common/back.svg';
function formatTime(timeString) {
  const date = new Date(timeString);
  const now = new Date();
  const diff = (now - date) / 1000 / 60; // difference in minutes

  

  if (diff < 1) {
    return '방금 전';
  } else if (diff < 60) {
    return `${Math.floor(diff)}분 전`;
  } else if (diff < 24 * 60) {
    return `${Math.floor(diff / 60)}시간 전`;
  } else if (diff < 7 * 24 * 60) {
    return `${Math.floor(diff / (24 * 60))}일 전`;
  } else if (diff < 30 * 24 * 60) {
    return `${Math.floor(diff / (7 * 24 * 60))}주 전`;
  } else if (diff < 12 * 30 * 24 * 60) {
    return `${Math.floor(diff / (30 * 24 * 60))}개월 전`;
  } else {
    return `${Math.floor(diff / (12 * 30 * 24 * 60))}년 전`;
  }
}

function getIcon(category) {
  switch (category) {
    case 2:
      return taxiIcon;
    case 1:
      return deliveryIcon;
    case 3:
      return buyingIcon;
    case 4:
      return tookIcon;
    default:
      return null;
  }
}

function ChattingListPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const { seq } = useUser();
  
  const handleBackClick = () => {
    navigate('/'); 
  };
  
  const handleChatRoomClick = async (chatRoom) => {
    let route;
    let state = { chatRoom, roomSeq: chatRoom.roomSeq }; // roomSeq 추가

    switch (chatRoom.category) {
      case 1:
        route = `/chat/delivery/${chatRoom.roomSeq}`;
        break;
      case 2:
        try {
          // getSeletByRoomApi 호출하여 taxiSeq를 가져옴
          console.log('roomSeq', chatRoom.roomSeq);
          const taxiData = await getSeletByRoomApi(chatRoom.roomSeq);
          console.log('taxiData', taxiData);
          state = { ...state, taxiSeq: taxiData.taxiSeq }; // taxiSeq를 state에 추가
        } catch (error) {
          console.error('Error fetching taxi data:', error);
        }
        route = `/chat/taxi/${chatRoom.roomSeq}`;
        break;
      case 3:
        route = `/chat/buy/${chatRoom.roomSeq}`;
        break;
      default:
        route = `/chat/${chatRoom.roomSeq}`;
    }

    navigate(route, { state });
  };

  const loadChatRooms = async () => {
    const response = await getChatListApi(seq);
    console.log(response);
    setRooms(response);
    console.log('rooms', rooms);
  };

  useEffect(() => {
    loadChatRooms();
  }, []);

  return (
    <div className="flex flex-col bg-white max-w-[360px] mx-auto relative h-screen">
      <div className="flex items-center px-4 py-3">
          <img
          src={backIcon}
          alt="뒤로"
          className="w-6 h-6 mx-6 mt-6 absolute top-0 left-0 opacity-80"
          onClick={handleBackClick}
        />
        <div className="mt-2 flex-grow ml-11 text-left text-xl font-bold text-main">
          <span className="font-dela">took</span> 채팅
        </div>
      </div>

      <div className="mt-2 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 border-neutral-400 border-opacity-40 min-h-[0.5px]" />

      <div className="flex flex-col">
      {rooms.map((chat) => (
          <div
            key={chat.roomSeq}
            className="flex items-center px-6 py-4 border-b border-gray-200 cursor-pointer"
            onClick={() => handleChatRoomClick(chat)}
          >
            <img
              src={getIcon(chat.category)}
              alt={chat.category}
              className="w-11 h-11 mr-4"
            />
            <div className="flex-grow">
              <div className="flex justify-between">
                <div className={`text-base font-extrabold`}>
                  {chat.roomTitle}
                </div>
                <div className="text-xs text-gray-500">
                  {formatTime(chat.createdAt)}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {chat.recentChatMessage}
                </div>
                {chat.unreadMessages > 0 && (
                  <div className="text-xs font-bold text-white bg-main rounded-full px-2.5 py-0.5">
                    {chat.unreadMessages}
                  </div>
                )}
              {chat.status === false && (
                <div className=" text-xs text-white bg-red-500 opacity-90 px-2 py-1 rounded-full shadow-md">
                  정산 완료
                </div>
              )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChattingListPage;
