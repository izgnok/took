package com.took.taxi_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "택시 생성 요청 데이터")
public class TaxiCreateRequest {

    @Schema(description = "성별", example = "true (남성) 또는 false (여성)")
    private boolean gender;

    @Schema(description = "최대 승객 수", example = "4")
    private int max;

    @Schema(description = "방 식별 번호", example = "123")
    private Long roomSeq;

    @Schema(description = "사용자 식별 번호", example = "456")
    private Long userSeq;

    @Schema(description = "위도", example = "37.123456")
    private double lat;

    @Schema(description = "경도", example = "127.123456")
    private double lon;
}
