package com.took.taxi_api.entity;

import com.took.user_api.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Taxi {

    // 택시 상태를 나타내는 열거형 타입
    public enum Status {
        OPEN, FILLED, BOARD, DONE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long taxiSeq;  // 택시 번호

    @Column(nullable = false)
    private Long roomSeq;  // 채팅방 참조 번호

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_seq", nullable = false)
    private UserEntity user;  // 사용자 참조

    @Column
    private Long partySeq; // 정산 참조 번호

    @Column
    private double startLat;  // 출발지 위도

    @Column
    private double startLon;  // 출발지 경도

    @Column(nullable = false)
    private boolean gender;  // 성별 여부

    @Column(nullable = false)
    private int count;  // 현재 인원 수

    @Column(nullable = false)
    private int max;  // 최대 인원 수

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;  // 택시 상태

    @Column(nullable = false)
    private LocalDateTime createdAt;  // 생성 일시

    @Column(nullable = false)
    private LocalDateTime finishTime;  // 종료 일시

    @Column
    private Long cost;  // 비용

    @Column(nullable = false)
    private Long master;  // 결제자 번호

    @Column(nullable = false) 
    private double writeLat; // 작성한 위치

    @Column(nullable = false)
    private double writeLon; // 작성한 위치

    public void updateTaxi(Long master, int max, boolean gender) {
        this.master = master;
        this.max = max + 1;
        this.gender = gender;
    }

    public void updateStatus(Status status) {
        this.status = status;
    }

    public void updateStart(double startLat, double startLon) {
        this.startLat = startLat;
        this.startLon = startLon;
    }

    public void updateCost(Long cost) {
        this.cost = cost;
    }

    public void updateParty(Long partySeq) {
        this.partySeq = partySeq;
    }

    public void updateCount(int i) {
        this.count += i;
    }


}
 