package com.took.taxi_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "게스트의 목적지 및 비용 설정 요청 데이터")
public class GuestSetDestinationAndCostRequest {

    @Schema(description = "게스트 식별 번호", example = "1")
    private Long guestSeq;

    @Schema(description = "목적지 이름", example = "서울역")
    private String destiName;

    @Schema(description = "목적지 위도", example = "37.5665")
    private double destiLat;

    @Schema(description = "목적지 경도", example = "126.978")
    private double destiLon;

    @Schema(description = "비용", example = "15000")
    private Long cost;

    @Schema(description = "목적지 순위", example = "1")
    private int routeRank;
}
