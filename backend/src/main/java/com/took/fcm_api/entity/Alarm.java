package com.took.fcm_api.entity;

import com.took.user_api.entity.PartyEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "alarm")
@Table(name = "alarm")
@Builder
public class Alarm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alarmSeq; // 알람Seq

    @Column
    private String title; // 제목

    @Column
    private String body; // 내용

    @Column
    private Long sender; // 보내는 사람

    @Column
    private Long userSeq; // 받는 사람

    @Column
    private Long partySeq; // 파티Seq

    @Column
    private int category; // 카테고리

    @Column
    private LocalDateTime createAt; // 보낸 날짜

    @Column
    private String url1; // 이동 경로1

    @Column
    private String url2; // 이동 경로 2

    @Column
    private long preCost; // 선결제 금액

    @Column
    private long actualCost; // 실결제 금액

    @Column
    private long differenceCost; // 차액

    @Column
    private long deliveryCost; // 배달비

    @Column
    private long orderCost; // 주문 금액

    @Column
    private long cost; // 요청 금액

    @Column
    private Boolean status;

    public void updateStatus(boolean b) {
        this.status = b;
    }
}
