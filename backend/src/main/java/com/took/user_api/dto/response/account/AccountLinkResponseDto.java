package com.took.user_api.dto.response.account;

import com.took.user_api.dto.response.ResponseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Schema(description = "계좌 연결 응답 DTO")
@Getter
public class AccountLinkResponseDto extends ResponseDto {

    private AccountLinkResponseDto() {
        super();
    }

    @Schema(description = "계좌 연결 성공 응답", example = "계좌 연결이 성공적으로 처리되었습니다.")
    public static ResponseEntity<AccountLinkResponseDto> success() {
        AccountLinkResponseDto responseBody = new AccountLinkResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    @Schema(description = "계좌 연결 실패 응답", example = "계좌 연결에 실패하였습니다.")
    public static ResponseEntity<ResponseDto> notFound() {
        ResponseDto responseBody = new ResponseDto();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseBody);
    }
}
