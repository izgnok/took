package com.took.user_api.controller;

import com.took.user_api.dto.request.auth.*;
import com.took.user_api.dto.response.auth.*;
import com.took.user_api.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "아이디 중복 체크", description = "입력된 아이디의 중복 여부를 확인합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "아이디 중복 체크 성공",
                    content = @Content(schema = @Schema(implementation = IdCheckResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/id-check")
    public ResponseEntity<? super IdCheckResponseDto> idCheck(
            @RequestBody @Valid IdCheckRequestDto requestBody
    ) {
        return authService.idCheck(requestBody);
    }

    @Operation(summary = "이메일 인증", description = "이메일 인증을 위한 코드를 발송합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "이메일 인증 성공",
                    content = @Content(schema = @Schema(implementation = EmailCertificationResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/email-certification")
    public ResponseEntity<? super EmailCertificationResponseDto> emailCertification(
            @RequestBody @Valid EmailCertificaionRequestDto requestBody
    ) {
        return authService.emailCertification(requestBody);
    }

    @Operation(summary = "인증 코드 확인", description = "발송된 인증 코드를 확인합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "인증 코드 확인 성공",
                    content = @Content(schema = @Schema(implementation = CheckCertificationResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/check-certification")
    public ResponseEntity<? super CheckCertificationResponseDto> checkCertification(
            @RequestBody @Valid CheckCertificationRequestDto requestBody
    ) {
        return authService.checkCertification(requestBody);
    }

    @Operation(summary = "회원 가입", description = "새로운 회원을 등록합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "회원 가입 성공",
                    content = @Content(schema = @Schema(implementation = SignUpResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/sign-up")
    public ResponseEntity<? super SignUpResponseDto> signUp(
            @RequestBody @Valid SignUpRequestDto requestBody
    ) {
        return authService.signUp(requestBody);
    }

    @Operation(summary = "로그인", description = "회원 로그인을 처리합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그인 성공",
                    content = @Content(schema = @Schema(implementation = SignInResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/sign-in")
    public ResponseEntity<? super SignInResponseDto> signIn(
            @RequestBody @Valid SignInRequestDto requestBody
    ) {
        return authService.signIn(requestBody);
    }

    @Operation(summary = "토큰 갱신", description = "리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "토큰 갱신 성공",
                    content = @Content(schema = @Schema(implementation = RefreshTokenResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/refresh-token")
    public ResponseEntity<? super RefreshTokenResponseDto> refreshToken(
            @RequestBody @Valid RefreshTokenRequestDto requestBody
    ) {
        return authService.refreshAccessToken(requestBody);
    }
}
