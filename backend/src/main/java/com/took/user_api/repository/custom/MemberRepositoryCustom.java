package com.took.user_api.repository.custom;


import com.took.user_api.entity.MemberEntity;
import com.took.user_api.entity.UserEntity;

import java.util.List;

public interface MemberRepositoryCustom {

    void deleteMemberByPartySeq(Long partySeq, Long userSeq);

    Long findLeaderByPartySeq(Long partySeq);

    List<MemberEntity> findNoLeaderAndNoStatusByUser(UserEntity user);
}
