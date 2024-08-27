package com.took.user_api.dto.response.auth;

import com.took.common.ResponseCode;
import com.took.common.ResponseMessage;
import com.took.user_api.dto.response.ResponseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Schema(description = "리프레시 토큰 응답 DTO")
@Getter
public class RefreshTokenResponseDto extends ResponseDto {

    @Schema(description = "새로운 액세스 토큰")
    private String newAccessToken;

    private RefreshTokenResponseDto(String newAccessToken) {
        this.newAccessToken = newAccessToken;
    }

    @Schema(description = "리프레시 토큰 성공 응답")
    public static ResponseEntity<RefreshTokenResponseDto> success(String newAccessToken) {
        RefreshTokenResponseDto responseBody = new RefreshTokenResponseDto(newAccessToken);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    @Schema(description = "리프레시 토큰 실패 응답")
    public static ResponseEntity<ResponseDto> refreshFail() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.SIGN_IN_FAIL, ResponseMessage.SIGN_IN_FAIL);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
    }
}
