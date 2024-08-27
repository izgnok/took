package com.took.delivery_api.dto;

import com.took.delivery_api.entity.Delivery;
import com.took.user_api.entity.UserEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 배달 조회 응답 DTO
 */
@Data
public class DeliverySelectResponse {

    @Schema(description = "배달 고유 번호", example = "123")
    private Long deliverySeq;  // 배달 고유 번호

    @Schema(description = "사용자 고유 번호", example = "456")
    private Long userSeq;  // 사용자 고유 번호

    @Schema(description = "채팅방 고유 번호", example = "789")
    private Long roomSeq;  // 채팅방 고유 번호

    @Schema(description = "파티 고유 번호", example = "101112")
    private Long partySeq;  // 파티 고유 번호

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

    @Schema(description = "추가 내용", example = "배달 시 주의 사항 등")
    private String content;  // 추가 내용

    @Schema(description = "공지사항 내용", example = "배달 시 주의 사항을 꼭 확인하세요.")
    private String notice;  // 공지사항 내용

    @Schema(description = "배달 시간", example = "2024-12-31T12:00:00")
    private LocalDateTime deliveryTime;  // 배달 시간

    @Schema(description = "배달 상태", example = "OPEN")
    private Delivery.Status status;  // 배달 상태

    @Schema(description = "참가자 수", example = "4")
    private int count;  // 참가자 수

    @Schema(description = "생성 시간", example = "2024-12-31T10:00:00")
    private LocalDateTime createdAt;  // 생성 시간

    @Schema(description = "완료 시간", example = "2024-12-31T14:00:00")
    private LocalDateTime finishTime;  // 완료 시간

    @Schema(description = "사용자 이름", example = "김투")
    private String userName;

    @Schema(description = "사용자 이미지", example = "1")
    private int userImage;

    public DeliverySelectResponse(Delivery delivery, UserEntity user) {
        this.deliverySeq = delivery.getDeliverySeq();
        this.userSeq = delivery.getUser().getUserSeq();
        this.roomSeq = delivery.getRoomSeq();
        this.partySeq = delivery.getPartySeq();
        this.storeName = delivery.getStoreName();
        this.pickupPlace = delivery.getPickupPlace();
        this.pickupLat = delivery.getPickupLat();
        this.pickupLon = delivery.getPickupLon();
        this.deliveryTip = delivery.getDeliveryTip();
        this.content = delivery.getContent();
        this.notice = delivery.getNotice();
        this.deliveryTime = delivery.getDeliveryTime();
        this.status = delivery.getStatus();
        this.count = delivery.getCount();
        this.createdAt = delivery.getCreatedAt();
        this.finishTime = delivery.getFinishTime();
        this.userName = user.getUserName();
        this.userImage = user.getImageNo();
    }
}
