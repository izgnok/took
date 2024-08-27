package com.took.delivery_api.dto;

import com.took.delivery_api.entity.Delivery;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 배달 생성 응답 DTO
 */
@Data
public class DeliveryCreateResponse {

    @Schema(description = "배달 고유 번호", example = "123")
    private Long deliverySeq;

    @Schema(description = "사용자 고유 번호", example = "456")
    private Long userSeq;

    @Schema(description = "채팅방 고유 번호", example = "789")
    private Long roomSeq;

    @Schema(description = "상점 이름", example = "피자헛")
    private String storeName;

    @Schema(description = "픽업 장소", example = "서울역")
    private String pickupPlace;

    @Schema(description = "픽업 장소의 위도", example = "37.5665")
    private double pickupLat;

    @Schema(description = "픽업 장소의 경도", example = "126.9780")
    private double pickupLon;

    @Schema(description = "배달 팁", example = "5000원")
    private String deliveryTip;

    @Schema(description = "배달 시간", example = "2024-12-31T12:00:00")
    private LocalDateTime deliveryTime;

    @Schema(description = "추가 내용", example = "배달 시 주의 사항 등")
    private String content;

    @Schema(description = "참가자 수", example = "1")
    private int count = 1;

    @Schema(description = "배달 상태", example = "PENDING")
    private Delivery.Status status;

    @Schema(description = "생성 시간", example = "2024-12-31T10:00:00")
    private LocalDateTime createdAt;

    @Schema(description = "완료 시간", example = "2024-12-31T14:00:00")
    private LocalDateTime finishTime;

    public DeliveryCreateResponse(Delivery delivery) {
        this.deliverySeq = delivery.getDeliverySeq();
        this.userSeq = delivery.getUser().getUserSeq();
        this.roomSeq = delivery.getRoomSeq();
        this.storeName = delivery.getStoreName();
        this.pickupPlace = delivery.getPickupPlace();
        this.pickupLat = delivery.getPickupLat();
        this.pickupLon = delivery.getPickupLon();
        this.deliveryTip = delivery.getDeliveryTip();
        this.deliveryTime = delivery.getDeliveryTime();
        this.content = delivery.getContent();
        this.status = delivery.getStatus();
        this.createdAt = delivery.getCreatedAt();
        this.finishTime = delivery.getFinishTime();
    }
}
