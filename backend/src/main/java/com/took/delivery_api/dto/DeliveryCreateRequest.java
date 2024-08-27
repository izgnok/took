package com.took.delivery_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 배달 생성 요청 DTO
 */
@Data
public class DeliveryCreateRequest {

    @Schema(description = "사용자 고유 번호", example = "456")
    private Long userSeq;  // 사용자 고유 번호

    @Schema(description = "채팅방 고유 번호", example = "123")
    private Long roomSeq;  // 채팅방 고유 번호

    @Schema(description = "상점 이름", example = "피자헛")
    private String storeName;  // 상점 이름

    @Schema(description = "픽업 장소", example = "서울역")
    private String pickupPlace;  // 픽업 장소

    @Schema(description = "픽업 장소의 위도", example = "37.5665")
    private double pickupLat;  // 픽업 장소의 위도

    @Schema(description = "픽업 장소의 경도", example = "126.9780")
    private double pickupLon;  // 픽업 장소의 경도

    @Schema(description = "배달 팁", example = "5000원")
    private String deliveryTip;  // 배달 팁

    @Schema(description = "배달 시간", example = "2024-12-31T12:00:00")
    private LocalDateTime deliveryTime;  // 배달 시간

    @Schema(description = "추가 내용", example = "배달 시 주의 사항 등")
    private String content;  // 추가 내용
}
