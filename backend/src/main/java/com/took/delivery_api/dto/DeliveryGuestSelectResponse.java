package com.took.delivery_api.dto;

import com.took.delivery_api.entity.DeliveryGuest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 배달 파티 참가자 조회 응답 DTO
 */
@Data
public class DeliveryGuestSelectResponse {

    @Schema(description = "배달 파티 참가자 고유 번호", example = "789")
    private Long deliveryGuestSeq;  // 배달 파티 참가자 고유 번호

    @Schema(description = "배달 고유 번호", example = "123")
    private Long deliverySeq;  // 배달 고유 번호

    @Schema(description = "사용자 고유 번호", example = "456")
    private Long userSeq;  // 사용자 고유 번호

    @Schema(description = "픽업 여부", example = "true")
    private boolean pickUp;  // 픽업 여부

    public DeliveryGuestSelectResponse(DeliveryGuest deliveryGuest) {
        this.deliveryGuestSeq = deliveryGuest.getDeliveryGuestSeq();
        this.deliverySeq = deliveryGuest.getDelivery().getDeliverySeq();
        this.userSeq = deliveryGuest.getUser().getUserSeq();
        this.pickUp = deliveryGuest.isPickUp();
    }
}
