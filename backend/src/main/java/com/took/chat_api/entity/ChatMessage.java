package com.took.chat_api.entity;

import com.took.user_api.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity  // JPA 엔티티임을 나타내는 어노테이션
@Getter
@ToString
@NoArgsConstructor  // Lombok 어노테이션으로, 기본 생성자를 자동으로 생성
@AllArgsConstructor  // Lombok 어노테이션으로, 모든 필드를 매개변수로 받는 생성자를 자동으로 생성
@Builder
public class ChatMessage {

    public enum MessageType {
        ENTER, TALK, EXIT, MATCH, MATCH_REQUEST  // 메시지 유형을 정의하는 열거형
    }

    @Id  // 기본 키(PK)로 설정
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // 자동 증가 설정
    private Long messageSeq;  // 메시지 고유 번호

    @Enumerated(EnumType.STRING)  // Enum 값을 문자열로 데이터베이스에 저장
    private MessageType type;  // 메시지 타입

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "room_seq", nullable = false)  // 외래 키 설정 및 Not Null 설정
    private ChatRoom chatRoom;  // 메시지가 속한 채팅방

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_seq", nullable = false)  // 외래 키 설정 및 Not Null 설정
    private UserEntity user;  // 메시지 송신자

    @Column(nullable = false)  // Not Null 설정
    private String message;  // 메시지 내용

    @Column(nullable = false) // Not Null 설정
    private LocalDateTime createdAt; // 메시지 작성 시간
}
