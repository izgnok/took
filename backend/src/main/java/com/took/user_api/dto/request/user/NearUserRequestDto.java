package com.took.user_api.dto.request.user;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class NearUserRequestDto {

    @Schema(description = "사용자 시퀀스 (예: 1)", example = "1")
    private Long userSeq;

    @Schema(description = "위도", example = "37.5665")
    private double lat;

    @Schema(description = "경도", example = "126.978")
    private double lon;
}
