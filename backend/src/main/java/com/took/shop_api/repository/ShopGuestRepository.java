package com.took.shop_api.repository;

import com.took.shop_api.entity.Shop;
import com.took.shop_api.entity.ShopGuest;
import com.took.user_api.entity.UserEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopGuestRepository extends JpaRepository<ShopGuest, Long> {
    ShopGuest findByShopAndUser(Shop shop, UserEntity user);
    @Transactional
    void deleteByShopAndUser(Shop shop, UserEntity user);
    List<ShopGuest> findAllByShop(Shop shop);

    boolean existsByShopAndPickUpFalse(Shop shop);
}
