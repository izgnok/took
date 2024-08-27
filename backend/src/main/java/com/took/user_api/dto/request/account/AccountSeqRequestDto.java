package com.took.user_api.dto.request.account;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class AccountSeqRequestDto {

    @Schema(description = "계좌 식별 번호", example = "12345")
    private Long accountSeq;
}
