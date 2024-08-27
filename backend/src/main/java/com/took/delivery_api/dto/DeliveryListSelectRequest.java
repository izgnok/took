package com.took.delivery_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 배달 글 목록 조회 요청 DTO
 */
@Data
public class DeliveryListSelectRequest {

    @Schema(description = "위도", example = "37.5665")
    private double lat;  // 위도

    @Schema(description = "경도", example = "126.9780")
    private double lon;  // 경도
}
