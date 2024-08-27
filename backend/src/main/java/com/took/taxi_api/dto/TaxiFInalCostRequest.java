package com.took.taxi_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "최종 비용 요청 데이터")
public class TaxiFInalCostRequest {

    @Schema(description = "택시 식별 번호", example = "123")
    private Long taxiSeq;

    @Schema(description = "전체 비용", example = "50000")
    private Long allCost;

    @Schema(description = "사용자들의 비용 정보")
    private List<User> users;

    @Data
    @Schema(description = "사용자 비용 정보")
    public static class User {
        @Schema(description = "사용자 식별 번호", example = "456")
        private Long userSeq;

        @Schema(description = "사용자 비용", example = "10000")
        private Long cost;
    }
}
