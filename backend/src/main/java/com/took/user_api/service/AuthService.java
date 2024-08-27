package com.took.user_api.service;


import com.took.user_api.dto.request.auth.*;
import com.took.user_api.dto.response.auth.*;
import org.springframework.http.ResponseEntity;


public interface AuthService {

    ResponseEntity<? super IdCheckResponseDto> idCheck(IdCheckRequestDto dto);
    ResponseEntity<? super EmailCertificationResponseDto> emailCertification(EmailCertificaionRequestDto dto);
    ResponseEntity<? super CheckCertificationResponseDto> checkCertification(CheckCertificationRequestDto dto);
    ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto);
    ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto);
    ResponseEntity<? super RefreshTokenResponseDto> refreshAccessToken(RefreshTokenRequestDto dto);
} 
