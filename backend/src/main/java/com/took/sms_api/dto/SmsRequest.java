package com.took.sms_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Schema(description = "SMS 전송 요청 정보를 담고 있는 DTO 클래스")
public class SmsRequest {

    @NotNull
    @Schema(description = "사용자의 전화번호", example = "+821012345678", required = true)
    private String phoneNumber;
}
