package com.took.user_api.dto.response.account;

import com.took.user_api.dto.response.ResponseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
@Schema(description = "계좌 잔액 응답 DTO")
public class AccountBalanceResponseDto extends ResponseDto {

    @Schema(description = "계좌의 잔액", example = "150000")
    private Long balance;

    private AccountBalanceResponseDto(Long balance){
        this.balance = balance;
    }

    public static ResponseEntity<AccountBalanceResponseDto> success(Long balance) {
        AccountBalanceResponseDto responseBody = new AccountBalanceResponseDto(balance);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
}
