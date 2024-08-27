package com.took.taxi_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "예상 비용 응답 데이터")
public class ExpectCostResponse {

    @Schema(description = "택시 비용 + 톨게이트 비용", example = "15000")
    private Long cost;

    public ExpectCostResponse(Long cost) {
        this.cost = cost;
    }
}
