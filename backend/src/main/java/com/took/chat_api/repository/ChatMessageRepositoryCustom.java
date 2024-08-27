package com.took.chat_api.repository;



import com.took.chat_api.entity.ChatMessage;
import com.took.chat_api.entity.ChatRoom;
import com.took.user_api.entity.UserEntity;

import java.util.List;

public interface ChatMessageRepositoryCustom {
    List<ChatMessage> findMessagesByRoomSeqAndUserJoinTime(ChatRoom chatRoom, UserEntity user);
    ChatMessage findLatestMessageByChatRoom(ChatRoom chatRoom);
}
