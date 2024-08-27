package com.took.delivery_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class DeliverySetStatusRequest {

    @Schema(description = "배달의 고유 번호", example = "12345")
    private Long deliverySeq;  // 배달의 고유 번호

    @Schema(description = "배달의 상태", example = "DONE")
    private String status;     // 배달의 상태
}
