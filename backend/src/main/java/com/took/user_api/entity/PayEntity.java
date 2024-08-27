package com.took.user_api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Entity
public class PayEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paySeq;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name="user_seq")
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name="account_seq")
    private AccountEntity account;

    // 상대방
    @Column
    private Long targetUserSeq;

    @Column(nullable = false)
    private int category; // 1: 배달 , 2: 택시 , 3: 공구 , 4: 정산

    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private Long cost;

    @Column(nullable = false)
    private boolean receive; // true: 입금, false: 송금

}
