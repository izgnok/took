package com.took.user_api.dto.request.user;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class UserSeqRequestDto {

    @Schema(description = "사용자 시퀀스 (예: 12345)", example = "12345")
    private Long userSeq;
}
