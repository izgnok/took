package com.took.user_api.dto.response.account;

import com.took.user_api.dto.response.ResponseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Schema(description = "계좌 쉬운 비밀번호 응답 DTO")
@Getter
public class AccountEasyPwdResponseDto extends ResponseDto {

    @Schema(description = "계좌 쉬운 비밀번호 응답 DTO", example = "성공적으로 응답을 반환합니다.")
    public static ResponseEntity<AccountEasyPwdResponseDto> success() {
        AccountEasyPwdResponseDto responseBody = new AccountEasyPwdResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
}
