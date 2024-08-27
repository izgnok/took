package com.took.delivery_api.entity;


import com.took.delivery_api.dto.DeliveryModifyRequest;
import com.took.user_api.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

// 엔티티 클래스 정의
@Entity
@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Delivery {

    // 배달 상태를 나타내는 열거형(enum) 정의
    public enum Status {
        OPEN, DELIVERY, DONE
    }

    // 기본 키(primary key)로 사용될 필드 정의 및 자동 생성 전략 설정
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long deliverySeq;

    // 사용자의 고유 식별자 필드
    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_seq", nullable = false)
    private UserEntity user;

    // 채팅방 번호
    @Column(nullable = false)
    private Long roomSeq;

    // 정산 번호
    @Column
    private Long partySeq;

    // 가게 이름 필드
    @Column(nullable = false)
    private String storeName;

    // 픽업 장소 필드
    @Column(nullable = false)
    private String pickupPlace;

    @Column(nullable = false)
    private double pickupLat;

    @Column(nullable = false)
    private double pickupLon;

    // 배달 팁 필드
    @Column(nullable = false)
    private String deliveryTip;
    
    // 배달 시간
    @Column(nullable = false)
    private LocalDateTime deliveryTime;

    // 배달 내용 필드
    @Column(nullable = false)
    private String content;

    // 공지 사항 필드 (nullable)
    @Column
    private String notice;

    // 배달파티 인원수 필드
    @Column(nullable = false)
    private int count;

    // 배달 상태 필드, 문자열 형태로 저장
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    // 생성 시간 필드
    @Column(nullable = false)
    private LocalDateTime createdAt;

    // 종료 시간 필드
    @Column(nullable = false)
    private LocalDateTime finishTime;

    // 업데이트 메서드 추가
    public void updateDelivery(DeliveryModifyRequest request) {
        this.storeName = request.getStoreName();
        this.pickupPlace = request.getPickupPlace();
        this.pickupLat = request.getPickupLat();
        this.pickupLon = request.getPickupLon();
        this.deliveryTip = request.getDeliveryTip();
        this.content = request.getContent();
        this.deliveryTime = request.getDeliveryTime();
    }

    public void updateParty(Long partySeq) {
        this.partySeq = partySeq;
    }

    public void updateNotice(String notice) {
        this.notice = notice;
    }

    public void updateStatus(String status) {
        this.status = Status.valueOf(status);
    }

    public void updateCount(int i) {
        this.count += i;
    }

}
