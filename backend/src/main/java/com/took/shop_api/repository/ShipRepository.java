package com.took.shop_api.repository;

import com.took.shop_api.entity.ShipInfo;
import com.took.shop_api.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShipRepository extends JpaRepository<ShipInfo, Long> {
    ShipInfo findByShop(Shop shop);
}
