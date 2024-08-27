package com.took.taxi_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "게스트 추가 요청 데이터")
public class GuestCreateRequest {

    @Schema(description = "택시 식별 번호", example = "12345")
    private Long taxiSeq;

    @Schema(description = "사용자 식별 번호", example = "67890")
    private Long userSeq;

    @Schema(description = "목적지 이름", example = "서울역")
    private String destiName;

    @Schema(description = "목적지 위도", example = "37.5665")
    private double destiLat;

    @Schema(description = "목적지 경도", example = "126.978")
    private double destiLon;

    @Schema(description = "비용", example = "10000")
    private Long cost;

    @Schema(description = "경로 순위", example = "1")
    private int routeRank;
}
