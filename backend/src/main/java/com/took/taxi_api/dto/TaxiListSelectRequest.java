package com.took.taxi_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "택시 목록 조회 요청 데이터")
public class TaxiListSelectRequest {

    @Schema(description = "위도", example = "37.123456")
    private double lat;

    @Schema(description = "경도", example = "127.123456")
    private double lon;


}
