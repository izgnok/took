package com.took.user_api.dto.request.member;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class MemberSaveRequestDto {

    @Schema(description = "사용자 시퀀스 (예: 1)", example = "1", required = true)
    private Long userSeq;

    @Schema(description = "파티 시퀀스 (예: 100)", example = "100", required = true)
    private Long partySeq;

}
