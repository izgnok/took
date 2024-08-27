package com.took.taxi_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "예상 비용 요청 데이터")
public class ExpectCostRequest {

    @Schema(description = "출발지 위도", example = "37.5665")
    private double startLat;

    @Schema(description = "출발지 경도", example = "126.978")
    private double startLon;

    @Schema(description = "도착지 위도", example = "37.5511")
    private double endLat;

    @Schema(description = "도착지 경도", example = "126.9882")
    private double endLon;
}
