package com.took.delivery_api.repository;


import com.took.delivery_api.entity.Delivery;
import com.took.delivery_api.entity.DeliveryGuest;
import com.took.user_api.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryGuestRepository extends JpaRepository<DeliveryGuest, Long> {
    List<DeliveryGuest> findAllByDelivery(Delivery delivery);

    DeliveryGuest findByDeliveryAndUser(Delivery delivery, UserEntity user);

    List<DeliveryGuest> findAllByUser(UserEntity user);

    boolean existsByDeliveryAndPickUpFalse(Delivery delivery);
}
