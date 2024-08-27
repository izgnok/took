package com.took.user_api.repository;


import com.took.user_api.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    boolean existsByUserId(String userId);
    UserEntity findByUserId(String userId);
    List<UserEntity> findByUserSeqIn(List<Long> userSeqs);
    Optional<UserEntity> findByEmail(String email);
}
