package com.took.user_api.dto.request.account;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class AccountEasyPwdRequestDto {

    @Schema(description = "계좌 식별 번호", example = "12345")
    private Long accountSeq;

    @Schema(description = "간편 비밀번호", example = "password123")
    private String easyPwd;
}
