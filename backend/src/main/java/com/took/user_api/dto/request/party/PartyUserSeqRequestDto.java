package com.took.user_api.dto.request.party;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PartyUserSeqRequestDto {

    @Schema(description = "파티 시퀀스 (예: 1)", example = "1", required = true)
    private Long partySeq;


    private Long userSeq;
}
