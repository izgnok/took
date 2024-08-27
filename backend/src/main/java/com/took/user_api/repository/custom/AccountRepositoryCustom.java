package com.took.user_api.repository.custom;


import com.took.user_api.entity.AccountEntity;

import java.util.List;


public interface AccountRepositoryCustom {
 
    List<AccountEntity> findAccountsByUserSeq(Long userSeq);
    void isMain(Long userSeq);
    void changeMain(Long userSeq,Long accountSeq);
    Long findBankSeqByAccountSeq(Long accountSeq);
    void updateEasyPwd(Long accountSeq, String easyPwd);
    String checkEasyPwd(Long accountSeq);
    Long findMainBank(Long userSeq);
}
