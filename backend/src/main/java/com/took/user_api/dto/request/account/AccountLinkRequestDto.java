package com.took.user_api.dto.request.account;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AccountLinkRequestDto {

    @Schema(description = "사용자 식별 번호", example = "1")
    private Long userSeq;

    @Schema(description = "주계좌 여부", example = "true")
    private Boolean main;

    @Schema(description = "계좌 번호", example = "1234567890")
    @NotBlank(message = "계좌 번호는 필수 입력 항목입니다.")
    private String accountNum;

    @Schema(description = "계좌 비밀번호", example = "1234")
    @NotNull(message = "계좌 비밀번호는 필수 입력 항목입니다.")
    private int accountPwd;

    @Schema(description = "간편 비밀번호", example = "password123")
    @NotNull(message = "간편 비밀번호는 필수 입력 항목입니다.")
    private String easyPwd;

    @Schema(description = "계좌 이름", example = "홍길동 계좌")
    private String accountName;
}
