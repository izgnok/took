package com.took.delivery_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 배달 파티 참가 여부 확인 요청 DTO
 */
@Data
public class DeliveryGuestIsJoinRequest {

    @Schema(description = "배달 고유 번호", example = "123")
    private Long deliverySeq;  // 배달 고유 번호

    @Schema(description = "사용자 고유 번호", example = "456")
    private Long userSeq;  // 사용자 고유 번호
}
