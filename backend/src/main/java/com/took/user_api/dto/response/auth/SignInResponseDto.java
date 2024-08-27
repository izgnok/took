package com.took.user_api.dto.response.auth;

import com.took.common.ResponseCode;
import com.took.common.ResponseMessage;
import com.took.user_api.dto.response.ResponseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;

import java.time.Duration;

@Schema(description = "로그인 응답 DTO")
@Getter
public class SignInResponseDto extends ResponseDto {

    @Schema(description = "액세스 토큰")
    private String accessToken;

    @Schema(description = "리프레시 토큰")
    private String refreshToken;

    @Schema(description = "사용자 시퀀스")
    private Long userSeq;

    private SignInResponseDto(String accessToken, Long userSeq) {
        this.accessToken = accessToken;
        this.userSeq = userSeq;
    }

    @Schema(description = "로그인 성공 응답")
    public static ResponseEntity<SignInResponseDto> success(String accessToken, String refreshToken, Long userSeq) {
        SignInResponseDto responseBody = new SignInResponseDto(accessToken, userSeq);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofDays(30))
                .build();

        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(responseBody);
    }

    @Schema(description = "로그인 실패 응답")
    public static ResponseEntity<ResponseDto> signInFail() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.SIGN_IN_FAIL, ResponseMessage.SIGN_IN_FAIL);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
    }
}
