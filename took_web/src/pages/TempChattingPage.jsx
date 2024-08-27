import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import {
  createChatApi,
  getChatListApi,
  getChatFilterApi,
} from '../apis/chat/chat';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

let stompClient = null; // STOMP 클라이언트 객체
let currentUserSeq = null; // 현재 사용자 시퀀스
let currentRoomSeq = null; // 현재 채팅방 시퀀스
let isCreator = false; // 현재 사용자가 방 생성자인지 여부
let rooms = []; // 채팅방 목록
let users = []; // 사용자 목록
let currentSubscription = null; // 현재 구독 중인 채널

// WebSocket 연결 설정
function connect() {
  const socket = new SockJS('https://i11e205.p.ssafy.io/ws');
  stompClient = Stomp.over(socket);
  stompClient.connect({}, function (frame) {
    console.log('Connected: ' + frame);
    stompClient.subscribe('/sub/chat/rooms', function (messageOutput) {
      // loadChatRooms(); // 방 목록 불러오기
    });
    stompClient.subscribe('/sub/chat/users', function (userOutput) {
      loadUsers(); // 사용자 목록 불러오기
    });
  });
}

// 사용자 시퀀스 설정
function setUserSeq() {
  // currentUserSeq = document.getElementById('userSeq').value;
  // document.getElementById('userSeqInput').style.display = 'none'; // 사용자 입력 섹션 숨김
  // document.getElementById('chatRooms').style.display = 'block'; // 채팅방 목록 섹션 표시
  // //loadChatRooms(); // 채팅방 목록 로드
  enterRoom(66);
}

// 채팅방 생성 UI 표시
function showCreateRoom() {
  document.getElementById('createRoom').style.display = 'block'; // 방 생성 UI 표시
}

// 새로운 채팅방 생성
async function createRoom() {
  const roomTitle = document.getElementById('roomTitle').value;
  const category = document.getElementById('roomCategory').value;
  const response = await createChatApi({
    roomTitle: roomTitle,
    category: category,
    userSeq: 1,
  });
  console.log(response);
}

// const loadChatRooms = async () => {
//   const response = await getChatListApi();
//   console.log(response);
//   rooms = response;
//   showChatRooms(rooms);
// }

// async function loadChatRooms() {
//   fetch('/api/chat/rooms')
//     .then((response) => response.json())
//     .then((data) => {
//       rooms = data; // 채팅방 목록 업데이트
//       showChatRooms(rooms); // 채팅방 목록 표시
//     });
// }

// 사용자 목록 로드
function loadUsers() {
  fetch('/api/chat/users')
    .then((response) => response.json())
    .then((data) => {
      users = data; // 사용자 목록 업데이트
      showUsers(users); // 사용자 목록 표시
    });
}

// 사용자 목록 표시
function showUsers(users) {
  const userSelect = document.getElementById('userSelect');
  userSelect.innerHTML = '<option value="">All Users</option>'; // 기본 선택 항목 추가
  users.forEach((user) => {
    const option = document.createElement('option');
    option.value = user.userSeq; // 사용자 시퀀스를 옵션 값으로 설정
    option.textContent = user.userSeq; // 옵션 텍스트로 사용자 시퀀스 설정
    userSelect.appendChild(option); // 사용자 드롭다운에 추가
  });
}

// 카테고리별로 방 필터링
function filterRoomsByCategory() {
  const selectedCategory = document.getElementById('categorySelect').value;
  const filteredRooms = selectedCategory
    ? rooms.filter((room) => room.category == selectedCategory)
    : rooms;
  filterRoomsByUser(filteredRooms); // 필터링된 방 목록을 사용자별로 추가 필터링
}

// 사용자별로 방 필터링
function filterRoomsByUser(filteredRooms = rooms) {
  const selectedUser = document.getElementById('userSelect').value;
  const finalFilteredRooms = selectedUser
    ? filteredRooms.filter((room) => room.users.includes(selectedUser))
    : filteredRooms;
  showChatRooms(finalFilteredRooms); // 필터링된 방 목록 표시
}

// 채팅방 목록 표시
function showChatRooms(rooms) {
  const roomsList = document.getElementById('roomsList');
  roomsList.innerHTML = ''; // 기존 채팅방 목록 초기화
  rooms.forEach((room) => {
    const roomElement = document.createElement('div');
    roomElement.className = 'border p-2 mt-2';
    roomElement.style.cursor = 'pointer'; // 클릭 가능하게 설정
    roomElement.onclick = () => enterRoom(room.roomSeq); // 방 클릭 시 해당 방으로 이동
    roomElement.appendChild(
      document.createTextNode(
        '방번호: ' +
          room.roomSeq +
          ' - ' +
          room.roomTitle +
          ' (Category: ' +
          room.category +
          ')'
      )
    );
    roomsList.appendChild(roomElement); // 채팅방 목록에 추가
  });
}

// 채팅방 입장
function enterRoom(roomSeq) {
  if (currentSubscription) {
    currentSubscription.unsubscribe(); // 기존 구독 해제
  }

  currentRoomSeq = roomSeq;
  document.getElementById('chatRooms').style.display = 'none'; // 채팅방 목록 숨김
  document.getElementById('chatRoom').style.display = 'block'; // 채팅방 UI 표시
  document.getElementById('messages').innerHTML = ''; // 메시지 영역 초기화

  if (isCreator) {
    document.getElementById('deleteRoomBtn').style.display = 'block'; // 방 생성자일 경우 방 삭제 버튼 표시
    isCreator = false;
  }

  const enterRequest = { roomSeq: roomSeq, userSeq: currentUserSeq };
  stompClient.send('/pub/room/enter', {}, JSON.stringify(enterRequest)); // 방 입장 요청 전송

  currentSubscription = subscribeToRoomMessages(roomSeq); // 해당 방 메시지 구독
  fetchRoomMessages(roomSeq); // 방의 메시지 로드
}

// 메시지 전송
function sendMessage() {
  const messageContent = document.getElementById('messageContent').value;
  const messageRequest = {
    type: 'TALK',
    roomSeq: currentRoomSeq,
    userSeq: currentUserSeq,
    message: messageContent,
  };
  stompClient.send('/pub/message/send', {}, JSON.stringify(messageRequest)); // 메시지 전송 요청
  document.getElementById('messageContent').value = ''; // 입력 필드 초기화
}

// 채팅방 나가기
function leaveRoom() {
  const leaveRequest = { roomSeq: currentRoomSeq, userSeq: currentUserSeq };
  stompClient.send('/pub/room/leave', {}, JSON.stringify(leaveRequest)); // 방 나가기 요청 전송
  backToRooms(); // 방 목록으로 돌아가기
}

// 방 목록으로 돌아가기
function backToRooms() {
  if (currentSubscription) {
    currentSubscription.unsubscribe(); // 메시지 구독 해제
  }
  document.getElementById('chatRoom').style.display = 'none'; // 채팅방 UI 숨김
  document.getElementById('chatRooms').style.display = 'block'; // 채팅방 목록 UI 표시
  currentRoomSeq = null; // 현재 방 시퀀스 초기화
  //loadChatRooms(); // 채팅방 목록 로드
}

// 채팅방 삭제
function deleteRoom() {
  fetch(`/api/chat/room/${currentRoomSeq}`, {
    method: 'DELETE',
  }).then(() => {
    backToRooms(); // 방 삭제 후 방 목록으로 돌아가기
  });
}

// 채팅방 메시지 구독
function subscribeToRoomMessages(roomSeq) {
  return stompClient.subscribe(
    '/sub/chat/room/' + roomSeq,
    function (messageOutput) {
      showMessage(JSON.parse(messageOutput.body)); // 메시지 수신 후 표시
    }
  );
}

// 채팅방 메시지 가져오기
function fetchRoomMessages(roomSeq) {
  fetch(`/api/chat/message/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      roomSeq: roomSeq,
      userSeq: currentUserSeq,
      joinTime: new Date().toISOString(),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((message) => showMessage(message)); // 메시지 목록을 표시
    });
}

// 메시지 표시
function showMessage(message) {
  const messagesDiv = document.getElementById('messages');
  const messageElement = document.createElement('div');
  let messageclassName = '';
  switch (message.type) {
    case 'ENTER':
      messageclassName = 'message-enter'; // 입장 메시지 스타일
      break;
    case 'EXIT':
      messageclassName = 'message-exit'; // 퇴장 메시지 스타일
      break;
    case 'TALK':
      messageclassName = 'message-talk'; // 일반 채팅 메시지 스타일
      break;
  }
  messageElement.className = messageclassName;
  messageElement.appendChild(
    document.createTextNode(message.userSeq + ': ' + message.message)
  ); // 메시지 내용 설정
  messagesDiv.appendChild(messageElement); // 메시지 영역에 추가
}

const TempChattingPage = () => {
  const userSeq = 1;

  useEffect(() => {
    connect();
  }, []);

  return (
    <div className="container">
      <h1 className="mt-5">Chat Application</h1>
      {/* 
      <div id="userSeqInput" className="mt-3">
        <h2>Enter User Sequence</h2>
        <input
          type="text"
          id="userSeq"
          className="form-control"
          placeholder="User Sequence"
        />
        <button onClick={setUserSeq} className="btn btn-primary mt-2">
          Enter
        </button>
      </div> */}

      <div id="chatRooms" className="mt-3">
        <h2>Chat Rooms</h2>
        <button onClick={showCreateRoom} className="btn btn-success">
          Create Room
        </button>
        <div id="createRoom" style={{ display: 'none' }} className="mt-3">
          <input
            type="text"
            id="roomTitle"
            className="form-control"
            placeholder="Room Title"
          />
          <input
            type="number"
            id="roomCategory"
            className="form-control mt-2"
            placeholder="Category"
            min="1"
            max="3"
          />
          <button onClick={createRoom} className="btn btn-primary mt-2">
            Create
          </button>
        </div>
        <div className="mt-3">
          <label htmlFor="categorySelect">Select Category:</label>
          <select
            id="categorySelect"
            className="form-control"
            onChange={filterRoomsByCategory}
          >
            <option value="">All Categories</option>
            <option value="1">Category 1</option>
            <option value="2">Category 2</option>
            <option value="3">Category 3</option>
          </select>
        </div>
        <div className="mt-3">
          <label htmlFor="userSelect">Select User:</label>
          <select
            id="userSelect"
            className="form-control"
            onChange={filterRoomsByUser}
          >
            <option value="">All Users</option>
          </select>
        </div>
        <div id="roomsList" className="mt-3"></div>
      </div>

      <div id="chatRoom" className="mt-3">
        <h2 id="roomTitleHeader"></h2>
        <div
          id="messages"
          className="border p-3"
          style={{ height: '300px', overflowY: 'scroll' }}
        ></div>
        <input
          type="text"
          id="messageContent"
          className="form-control mt-2"
          placeholder="Message"
        />
        <button onClick={sendMessage} className="btn btn-primary mt-2">
          Send
        </button>
        <button onClick={leaveRoom} className="btn btn-danger mt-2">
          Leave Room
        </button>
        <button onClick={backToRooms} className="btn btn-secondary mt-2">
          Back to Rooms
        </button>
        <button
          onClick={deleteRoom}
          id="deleteRoomBtn"
          className="btn btn-danger mt-2"
          style={{ display: 'none' }}
        >
          Delete Room
        </button>
      </div>
    </div>
  );
};

export default TempChattingPage;
