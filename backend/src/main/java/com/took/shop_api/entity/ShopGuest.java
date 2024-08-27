package com.took.shop_api.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.took.user_api.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopGuest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long shopGuestSeq;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_seq", nullable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "shop_seq", nullable = false)
    private Shop shop;

    @Column
    private boolean pickUp;

    public void updatePickUp(boolean pickUp) {
        this.pickUp = pickUp;
    }
}
