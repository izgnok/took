package com.took.user_api.dto.request.party;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class OnlyJungsanRequestDto {

    @Schema(description = "사용자 시퀀스", example = "123456")
    private Long userSeq;

    @Schema(description = "파티 시퀀스", example = "654321")
    private Long partySeq;

    @Schema(description = "계좌 시퀀스", example = "987654")
    private Long accountSeq;
}
