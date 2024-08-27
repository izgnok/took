package com.took.shop_api.entity;

import com.took.user_api.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shop {

    public void updateHit(int i) {
        this.hit += i;
    }

    public void updateStatus(statusType status) {
        this.status = status;
    }

    public void updateCount(int i) {
        this.count += i;
    }

    public enum statusType {
        OPEN, IN_PROGRESS, COMPLETED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long shopSeq;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_seq", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    private Long roomSeq;

    @Column
    private Long partySeq; // 정산 참조 번호

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String content;

    @Column(nullable = true)
    private int hit;

    @Column(nullable = false)
    private double lat;

    @Column(nullable = false)
    private double lon;

    @Column
    private int count;

    @Column(nullable = false)
    private String item;

    @Column(nullable = false)
    private String site;

    @Column(nullable = false)
    private String place;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private statusType status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createAt;

    @Column
    private int maxCount;

    @PrePersist
    protected void onCreate() {
        if (this.createAt == null) {
            this.createAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = statusType.OPEN;
        }
    }

    public void update(String title, String content, String item, String site, String place, int maxCount) {
        this.title = title;
        this.content = content;
        this.item = item;
        this.site = site;
        this.place = place;
        this.maxCount = maxCount;
    }

    public void updateParty(Long partySeq) {
        this.partySeq = partySeq;
    }


}
