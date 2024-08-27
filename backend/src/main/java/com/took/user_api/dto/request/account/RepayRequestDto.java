package com.took.user_api.dto.request.account;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class RepayRequestDto {

    @Schema(description = "재지불 금액", example = "1000")
    private Long cost;

    @Schema(description = "계좌 식별 번호", example = "12345")
    private Long accountSeq;
}
