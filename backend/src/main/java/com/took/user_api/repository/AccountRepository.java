package com.took.user_api.repository;


import com.took.user_api.entity.AccountEntity;
import com.took.user_api.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountRepository extends JpaRepository<AccountEntity,Long>{

    AccountEntity findByUserAndMainTrue(UserEntity user);

    List<AccountEntity> findByUser(UserEntity user);
}
