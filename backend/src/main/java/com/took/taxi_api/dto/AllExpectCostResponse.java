package com.took.taxi_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "모든 사용자의 예상 비용 계산 응답 데이터")
public class AllExpectCostResponse {

    @Schema(description = "총 예상 비용", example = "50000")
    private Long allCost;

    @Schema(description = "총 거리", example = "10.5")
    private double distance;

    @Schema(description = "총 소요 시간 (초)", example = "600")
    private int duration;

    @Schema(description = "사용자 목록")
    private List<User> users;

    @Data
    @Schema(description = "사용자 정보")
    public static class User {
        @Schema(description = "사용자 식별 번호", example = "123")
        private Long userSeq;

        @Schema(description = "비용", example = "10000")
        private Long cost;
    }
}
