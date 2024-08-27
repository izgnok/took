package com.took.sms_api.controller;

import com.took.sms_api.dto.SmsRequest;
import com.took.sms_api.dto.VerifyRequest;
import com.took.sms_api.service.SmsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sms")
@RequiredArgsConstructor
@Tag(name = "SMS 인증 API", description = "SMS 인증을 위한 API입니다.")
public class SmsController {

    private final SmsService smsService;

    @Operation(summary = "SMS 전송", description = "사용자의 전화번호로 인증 코드를 전송합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "SMS 전송 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/send")
    public ResponseEntity<?> sendSms(
            @RequestBody @Parameter(description = "SMS 전송 요청 정보", required = true) SmsRequest smsRequest) {
        smsService.createOrUpdateIdentity(smsRequest.getPhoneNumber());
        return ResponseEntity.ok(1);  // SMS 전송 성공 응답
    }

    @Operation(summary = "휴대폰 인증", description = "휴대폰 인증을 진행합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "인증 결과 반환"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(
            @RequestBody @Parameter(description = "휴대폰 인증 요청 정보", required = true) VerifyRequest verifyRequest) {
        boolean result = smsService.verifyCode(verifyRequest.getPhoneNumber(), verifyRequest.getCode());
        return ResponseEntity.ok(result);  // 인증 결과 반환
    }
}
