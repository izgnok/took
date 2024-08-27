package com.took.taxi_api.dto;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
public class TaxiStatusRequest {

    @Schema(description = "택시 식별 번호", example = "12345")
    private Long taxiSeq;  // 택시 식별 번호

    @Schema(description = "택시 상태", example = "FILLED")
    private String status;
}
