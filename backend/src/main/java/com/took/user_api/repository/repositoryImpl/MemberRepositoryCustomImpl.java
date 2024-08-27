package com.took.user_api.repository.repositoryImpl;


import com.querydsl.jpa.impl.JPAQueryFactory;
import com.took.user_api.entity.MemberEntity;
import com.took.user_api.entity.QMemberEntity;
import com.took.user_api.entity.UserEntity;
import com.took.user_api.repository.custom.MemberRepositoryCustom;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class MemberRepositoryCustomImpl implements MemberRepositoryCustom {
    
    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public void deleteMemberByPartySeq(Long partySeq, Long userSeq) {

        QMemberEntity member = QMemberEntity.memberEntity;
        jpaQueryFactory.delete(member).where(member.party.partySeq.eq(partySeq).and(member.user.userSeq.eq(userSeq))).execute();
    }


    @Override
    public Long findLeaderByPartySeq(Long partySeq) {

        QMemberEntity member = QMemberEntity.memberEntity;

        Long result = null;

        result = jpaQueryFactory.select(member.user.userSeq)
                                .from(member)
                                .where(member.party.partySeq.eq(partySeq).and(member.leader.isTrue()))
                                .fetchOne();

        return result;
    }

    @Override
    public List<MemberEntity> findNoLeaderAndNoStatusByUser(UserEntity user) {
        QMemberEntity member = QMemberEntity.memberEntity;
        return jpaQueryFactory
                .selectFrom(member)
                .where(
                        member.user.eq(user)
                                .and(member.leader.isFalse())
                                .and(member.status.isFalse())
                )
                .fetch();
    }

}
