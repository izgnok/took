package com.took.chat_api.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.took.chat_api.entity.ChatMessage;
import com.took.chat_api.entity.ChatRoom;
import com.took.chat_api.entity.QChatMessage;
import com.took.chat_api.entity.QChatUser;
import com.took.user_api.entity.UserEntity;
import lombok.RequiredArgsConstructor;


import java.util.List;

@RequiredArgsConstructor  // Lombok 어노테이션으로, final 필드에 대해 생성자를 자동으로 생성
public class ChatMessageRepositoryCustomImpl implements ChatMessageRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    /**
     * 주어진 방 번호와 유저 ID를 기반으로 해당 유저의 방 참가 시간 이후에 생성된 모든 메시지를 조회합니다.
     *
     * @param chatRoom 조회할 채팅방의 고유 번호
     * @param user 조회할 유저의 번호
     * @return 해당 유저의 방 참가 시간 이후에 생성된 메시지 리스트
     */
    @Override
    public List<ChatMessage> findMessagesByRoomSeqAndUserJoinTime(ChatRoom chatRoom, UserEntity user) {
        QChatMessage chatMessage = QChatMessage.chatMessage;  // QueryDSL을 사용한 ChatMessage 엔티티의 메타데이터
        QChatUser chatUser = QChatUser.chatUser;  // QueryDSL을 사용한 ChatUser 엔티티의 메타데이터

        // QueryDSL을 사용하여 조건에 맞는 메시지를 조회
        return queryFactory.selectFrom(chatMessage)
                // ChatUser 엔티티와 조인
                .join(chatUser).on(chatMessage.chatRoom.roomSeq.eq(chatUser.chatRoom.roomSeq)
                        .and(chatUser.user.userSeq.eq(user.getUserSeq())))
                // 채팅방 번호가 일치하고, 메시지 생성 시간이 유저의 방 참가 시간 이후인 경우 필터링
                .where(chatMessage.chatRoom.roomSeq.eq(chatRoom.getRoomSeq())
                        .and(chatMessage.createdAt.after(chatUser.joinTime)))
                // 결과를 리스트로 반환
                .fetch();
    }


    public ChatMessage findLatestMessageByChatRoom(ChatRoom chatRoom) {
        QChatMessage chatMessage = QChatMessage.chatMessage;  // QueryDSL을 사용한 ChatMessage 엔티티의 메타데이터
        return queryFactory.selectFrom(chatMessage)
                .where(chatMessage.chatRoom.eq(chatRoom))
                .orderBy(chatMessage.createdAt.desc())
                .fetchFirst();
    }
}
