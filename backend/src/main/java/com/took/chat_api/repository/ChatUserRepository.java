package com.took.chat_api.repository;


import com.took.chat_api.entity.ChatRoom;
import com.took.chat_api.entity.ChatUser;
import com.took.user_api.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository  // 이 클래스가 리포지토리 역할을 한다는 것을 Spring에게 알려주는 어노테이션
public interface ChatUserRepository extends JpaRepository<ChatUser, Long> {
    // 특정 채팅방에 속한 모든 사용자를 조회하는 메서드
    List<ChatUser> findByChatRoom(ChatRoom chatRoom);

    // 특정 사용자가 특정 채팅방에 있는지 확인하는 메서드
    ChatUser findByUserAndChatRoom(UserEntity user, ChatRoom chatRoom);

    List<ChatUser> findByUser(UserEntity user);
}
