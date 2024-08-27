package com.took.taxi_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "모든 사용자의 예상 비용 계산 요청 데이터")
public class AllExpectCostRequest {

    @Schema(description = "위치 목록", required = true)
    private List<Location> locations;

    @Schema(description = "사용자 목록", required = true)
    private List<User> users;

    @Data
    @Schema(description = "위치 정보")
    public static class Location {
        @Schema(description = "위도", example = "37.5665")
        private double lat;

        @Schema(description = "경도", example = "126.978")
        private double lon;
    }

    @Data
    @Schema(description = "사용자 정보")
    public static class User {
        @Schema(description = "사용자 식별 번호", example = "123")
        private Long userSeq;

        @Schema(description = "비용", example = "10000")
        private Long cost;
    }
}
