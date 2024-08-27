package com.took.user_api.repository;


import com.took.user_api.entity.MemberEntity;
import com.took.user_api.entity.PartyEntity;
import com.took.user_api.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberRepository extends JpaRepository<MemberEntity,Long> {

    MemberEntity findByPartyAndLeaderTrue(PartyEntity party);

    MemberEntity findByPartyAndUser(PartyEntity party, UserEntity user);

    List<MemberEntity> findByParty(PartyEntity party);

    List<MemberEntity> findByUser(UserEntity user);
}
