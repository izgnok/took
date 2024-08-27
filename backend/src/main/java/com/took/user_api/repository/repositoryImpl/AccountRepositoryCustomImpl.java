package com.took.user_api.repository.repositoryImpl;


import com.querydsl.jpa.impl.JPAQueryFactory;
import com.took.user_api.entity.AccountEntity;
import com.took.user_api.entity.QAccountEntity;
import com.took.user_api.repository.custom.AccountRepositoryCustom;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@RequiredArgsConstructor
@Repository
public class AccountRepositoryCustomImpl implements AccountRepositoryCustom {

    private final EntityManager entityManager;
    private final JPAQueryFactory queryFactory;

    @Override
    public void isMain(Long userSeq) {

        QAccountEntity account = QAccountEntity.accountEntity;

        queryFactory.update(account)
                .set(account.main, false)
                .where(account.user.userSeq.eq(userSeq))
                .execute();
    }

    @Override
    public List<AccountEntity> findAccountsByUserSeq(Long userSeq) {

        QAccountEntity account = QAccountEntity.accountEntity;

        List<AccountEntity> list = queryFactory.selectFrom(account)
                .where(account.user.userSeq.eq(userSeq))
                .fetch();

        return list;
    }

    @Override
    public void changeMain(Long userSeq, Long accountSeq) {
        QAccountEntity accountEntity = QAccountEntity.accountEntity;

        queryFactory.update(accountEntity)
                .set(accountEntity.main, false)
                .where(accountEntity.user.userSeq.eq(userSeq).and(accountEntity.accountSeq.ne(accountSeq)))
                .execute();

        queryFactory.update(accountEntity)
                .set(accountEntity.main, true)
                .where(accountEntity.accountSeq.eq(accountSeq))
                .execute();
    }

    @Override
    public Long findBankSeqByAccountSeq(Long accountSeq) {

        Long bankSeq = null;

        QAccountEntity account = QAccountEntity.accountEntity;

        bankSeq = queryFactory.select(account.bank.bankSeq)
                .from(account)
                .where(account.accountSeq.eq(accountSeq)) // 조건: accountSeq가 일치
                .fetchOne();

        return bankSeq;
    }

    @Override
    public void updateEasyPwd(Long accountSeq, String easyPwd) {
        
        QAccountEntity account = QAccountEntity.accountEntity;

        queryFactory.update(account)
                .set(account.easyPwd,easyPwd)
                .where(account.accountSeq.eq(accountSeq))
                .execute();
    }

    @Override
    public String checkEasyPwd(Long accountSeq) {
       
        String result = null;

        QAccountEntity account = QAccountEntity.accountEntity;

        result = queryFactory.select(account.easyPwd)
                            .from(account)
                            .where(account.accountSeq.eq(accountSeq))
                            .fetchOne();
        return result;
    }

    @Override
    public Long findMainBank(Long userSeq) {

        Long mainBankSeq = null;
        QAccountEntity account = QAccountEntity.accountEntity;

        mainBankSeq = queryFactory.select(account.bank.bankSeq)
                .from(account)
                .where(account.user.userSeq.eq(userSeq).and(account.main.isTrue()))
                .fetchOne();

        return mainBankSeq;
    }

}
