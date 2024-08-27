package com.took.user_api.service;


import com.took.user_api.dto.request.account.*;
import com.took.user_api.dto.response.VoidResponseDto;
import com.took.user_api.dto.response.account.*;
import org.springframework.http.ResponseEntity;



public interface AccountService {

    ResponseEntity<? super AccountLinkResponseDto> saveAccount(AccountLinkRequestDto dto);
    ResponseEntity<? super ChangeMainResponseDto> changeMain(ChangeMainRequestDto dto);
    ResponseEntity<? super AccountListResponsetDto> accountList(AccountListRequestDto dto);
    ResponseEntity<? super AccountBalanceResponseDto> balance(AccountSeqRequestDto dto);
    ResponseEntity<String> deleteAccount(Long accountSeq);
    ResponseEntity<? super AccountEasyPwdResponseDto> updateEasyPwd(AccountEasyPwdRequestDto requestBody);
    ResponseEntity<? super CheckEasyPwdResponseDto> checkEasyPwd(AccountEasyPwdRequestDto requestBody);
    ResponseEntity<? super VoidResponseDto> repay(RepayRequestDto requestBody);

    MainAccountSelectResponse getMainAccount(Long userSeq);
}
