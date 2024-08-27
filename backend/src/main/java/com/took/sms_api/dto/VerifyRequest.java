package com.took.sms_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Schema(description = "휴대폰 인증 요청 정보를 담고 있는 DTO 클래스")
public class VerifyRequest {

    @NotNull
    @Schema(description = "사용자의 전화번호", example = "+821012345678", required = true)
    private String phoneNumber;

    @NotNull
    @Schema(description = "인증 코드", example = "123456", required = true)
    private int code;
}
