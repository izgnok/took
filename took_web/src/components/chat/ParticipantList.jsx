// components/chat/ParticipantList.jsx
import React from 'react';
import { FaCrown, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import getProfileImagePath from '../../utils/getProfileImagePath';
import { useUser } from '../../store/user';

// todo: 특정 채팅방의 속한 모든 유저 조회 api 연결 필요
const ParticipantList = ({ participants, onClose, onSignOut, leaderSeq }) => {
  const { seq } = useUser();
  return (
    <div className="fixed inset-0 flex justify-end bg-black bg-opacity-50 z-50">
      <div className="bg-white w-4/5 max-w-md h-full shadow-lg relative">
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold">참여자</h2>
          <button
            onClick={onClose}
            className="text-gray-400 focus:outline-none"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          {participants.map((participant) => (
            <div key={participant.userSeq} className="flex items-center mb-4">
              <img
                src={getProfileImagePath(participant.imageNo)}
                alt={participant.userName}
                className="w-8 h-8"
              />
              <div className="ml-2.5 flex items-center">
                {participant.userSeq === seq && (
                  <div className="bg-gray-400 text-white text-[9px] rounded-full px-1 py-0.5 mr-2">
                    나
                  </div>
                )}
                <div className="text-sm font-medium">
                  {participant.userName}
                </div>
                {leaderSeq === participant.userSeq && (
                  <FaCrown className="text-yellow-400 ml-2" />
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onSignOut}
          className="absolute left-4 bottom-4 text-gray-400 focus:outline-none flex items-center"
        >
          <FaSignOutAlt className="w-5 h-5 mr-1" />
          {/* <span className="text-sm">나가기</span> */}
        </button>
      </div>
    </div>
  );
};

export default ParticipantList;
