package com.took.user_api.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "member")
@Table(name="member")
@Builder
public class MemberEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long memberSeq;

    @Column(name="cost")
    private Long cost;

    @Column(name="status")
    private boolean status;

    @Column(name = "receive")
    private boolean receive;

    @Column(name="leader")
    private boolean leader;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "party_seq")
    private PartyEntity party;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name="user_seq")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private UserEntity user;

    @Column(name = "created_at", nullable = true)
    private LocalDateTime createdAt;

    @Column(name = "fake_cost")
    private Long fakeCost;

    @Column(name = "rest_cost")
    private Long restCost;

    public void updateCost(Long cost) {
        this.cost = cost;
    }

    public void updateStatus(boolean b) {
        this.status = b;
    }

    public void updateRecieve(boolean b) {
        this.receive = b;
    }

    public void updateRestCost(Long restCost) {
        this.restCost = restCost;
    }
}
