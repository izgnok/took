package com.took.user_api.dto.response.account;


import com.took.user_api.dto.response.ResponseDto;
import com.took.user_api.entity.AccountEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Schema(description = "계좌 리스트 응답 DTO")
@Getter
public class AccountListResponsetDto extends ResponseDto {


    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    public static class BankAccount{

        @Schema(description = "사용자 일련번호", example = "2")
        private Long userSeq;

        @Schema(description = "계좌 일련번호", example = "3")
        private Long accountSeq;

        @Schema(description = "계좌 이름", example = "일반계좌")
        private String accountName;

        @Schema(description = "계좌 번호", example = "508134283342")
        private String accountNum;

        @Schema(description = "은행 번호", example = "21")
        private int bankNum;

        @Schema(description = "계좌 잔액", example = "150000")
        private Long balance;

    }

    private List<BankAccount> list;

    private AccountListResponsetDto(List<BankAccount> list){
        this.list=list;
    }

     public static ResponseEntity<AccountListResponsetDto> success(List<BankAccount> list) {
        AccountListResponsetDto responseBody = new AccountListResponsetDto(list);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }


}
