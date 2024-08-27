package com.took.user_api.dto.request.user;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class RepayRequestDto {

    @Schema(description = "계좌 시퀀스 (예: \"12345\")", example = "12345")
    private String accountSeq;
}
