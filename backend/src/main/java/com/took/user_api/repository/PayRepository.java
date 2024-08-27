package com.took.user_api.repository;

import com.took.user_api.entity.PayEntity;
import com.took.user_api.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PayRepository extends JpaRepository<PayEntity, Long> {

    List<PayEntity> findByUserOrderByCreatedAtDesc(UserEntity user);
}
