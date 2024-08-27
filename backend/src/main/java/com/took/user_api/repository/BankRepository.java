package com.took.user_api.repository;


import com.took.user_api.entity.BankEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BankRepository extends JpaRepository<BankEntity,Long> {

    List<BankEntity> findByBankSeqIn(List<Long> bankSeq);
}
