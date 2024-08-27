package com.took.delivery_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 배달과 파티 연결 요청 DTO
 */
@Data
public class DeliverySerPartyRequest {

    @Schema(description = "배달 고유 번호", example = "123")
    private Long deliverySeq;  // 배달 고유 번호

    @Schema(description = "파티 고유 번호", example = "456")
    private Long partySeq;  // 파티 고유 번호
}
