package com.took.chat_api.repository;


import com.took.chat_api.entity.ChatRoom;
import com.took.user_api.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository  // 이 클래스가 리포지토리 역할을 한다는 것을 Spring에게 알려주는 어노테이션
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    // JpaRepository를 상속받아 기본적인 CRUD 메서드를 사용할 수 있습니다.

    // 카테고리로 채팅방을 조회하는 메서드
    List<ChatRoom> findByCategory(int category);

    // 카테고리와 사용자 번호 목록으로 채팅방을 조회하는 메서드
    List<ChatRoom> findByCategoryAndUserIn(int category, List<UserEntity> users);
}
