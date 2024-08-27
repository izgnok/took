package com.took.taxi_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "게스트의 목적지 순위 설정 요청 데이터")
public class GuestSetRankRequest {

    @Schema(description = "택시 식별 번호", example = "1")
    private Long taxiSeq;

    @Schema(description = "목적지 이름", example = "서울역")
    private String destiName;

    @Schema(description = "목적지 순위", example = "1")
    private int routeRank;
}
