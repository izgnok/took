package com.took.delivery_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 배달 파티 퇴장 요청 DTO
 */
@Data
public class DeliveryGuestDeleteRequest {

    @Schema(description = "배달 고유 번호", example = "123")
    private Long deliverySeq;  // 배달 고유 번호

    @Schema(description = "배달 파티 참가자 고유 번호", example = "789")
    private Long deliveryGuestSeq;  // 배달 파티 참가자 고유 번호
}
