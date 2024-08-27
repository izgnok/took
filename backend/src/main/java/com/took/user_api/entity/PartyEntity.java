package com.took.user_api.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Entity(name = "party")
@Table(name="party")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class PartyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long partySeq;

    @Column(name = "title")
    private String title;

    @Column(name = "category")
    private int category;

    @Column(name = "cost")
    private Long cost;

    @Column(name="status")
    private Boolean status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "count")
    private int count;

    @Column(name="total_member")
    private int totalMember;

    @Column(name="receive_cost")
    private Long receiveCost;

    @Column(name="delivery_tip")
    private Long deliveryTip;


    public void updateCost(Long cost){
        this.cost = cost;
    }

    public void updateReceiveCost(Long recieveCost) {
        this.receiveCost = recieveCost;
    }

    public void updateStatus(boolean b) {
        this.status = b;
    }

    public void updateCount(int i) {
        this.count += i;
    }

    public void updateTotalMember(int i) {
        this.totalMember = i;
    }

    public void updateDeliveryTip(long totalDeliveryTip) {
        this.deliveryTip = totalDeliveryTip;
    }
}
