package com.took.taxi_api.entity;

import com.took.user_api.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaxiGuest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long guestSeq;  // 게스트 번호

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "taxi_seq", nullable = false)
    private Taxi taxi;  // 택시 참조


    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_seq", nullable = false)
    private UserEntity user; // 사용자 번호

    @Column(nullable = false)
    private Long cost;  // 비용

    @Column(nullable = false)
    private String destiName;  // 목적지 이름

    @Column(nullable = false)
    private double destiLat;  // 목적지 위도

    @Column(nullable = false)
    private double destiLon;  // 목적지 경도

    @Column(nullable = false)
    private int routeRank;  // 경로 순위

    public void updateDestiAndCost(String destiName, double destiLat, double destiLon, Long cost, int routeRank) {
        this.destiName = destiName;
        this.destiLat = destiLat;
        this.destiLon = destiLon;
        this.cost = cost;
        this.routeRank = routeRank;
    }

    public void updateRouteRank(int routeRank) {
        this.routeRank = routeRank;
    }
}
