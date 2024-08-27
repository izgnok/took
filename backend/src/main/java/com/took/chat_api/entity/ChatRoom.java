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
public class ChatRoom {

    @Id  // 기본 키(PK)로 설정
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // 자동 증가 설정
    private Long roomSeq;  // 채팅방 고유 번호

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_seq", nullable = false)  // 외래키(FK) 설정
    private UserEntity user;

    @Column(nullable = false)  // Not Null 설정
    private String roomTitle;  // 채팅방 제목

    @Column(nullable = false) // Not Null 설정
    private LocalDateTime createdAt; // 채팅방이 만들어진 시간

    @Column(nullable = false) // Not Null 설정
    private int category;

    @Column(nullable = false) // Not Null 설정
    private boolean status;

    public void updateStaus(boolean b) {
        this.status = b;
    }
}