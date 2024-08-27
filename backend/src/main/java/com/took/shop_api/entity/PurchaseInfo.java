package com.took.shop_api.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.took.user_api.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.List;


@Entity
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long purchaseSeq;


    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_seq", nullable = false)
    private UserEntity user;


    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "shop_seq", nullable = false)
    private Shop shop;

    @Column(nullable = false)
    private int price;

    @Column
    private int shipCost;

    public void update(int price, int shipCost) {
        this.price = price;
        this.shipCost = shipCost;
    }
}