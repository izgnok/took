package com.took.user_api.repository;


import com.took.user_api.entity.PartyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartyRepository extends JpaRepository<PartyEntity,Long> {

    List<PartyEntity> findByPartySeqIn(List<Long> partySeqList);
}
