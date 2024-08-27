package com.took.shop_api.dto;

import com.took.shop_api.entity.Shop;
import com.took.user_api.entity.UserEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ShopResponse {

    @Schema(description = "상점 고유 번호", example = "1")
    private final Long shopSeq;  // 상점 고유 번호

    @Schema(description = "사용자 고유 번호", example = "1")
    private final Long userSeq;  // 사용자 고유 번호

    @Schema(description = "채팅방 고유 번호", example = "1")
    private final Long roomSeq;  // 채팅방 고유 번호

    @Schema(description = "파티 고유 번호", example = "1")
    private final Long partySeq;  // 채팅방 고유 번호

    @Schema(description = "상점 제목", example = "상점 제목")
    private final String title;  // 상점 제목

    @Schema(description = "상점 내용", example = "상점에 대한 자세한 설명입니다.")
    private final String content;  // 상점 내용

    @Schema(description = "조회수", example = "100")
    private final int hit;  // 조회수

    @Schema(description = "사이트 URL", example = "https://example.com")
    private final String site;  // 사이트 URL

    @Schema(description = "상품명", example = "상품명")
    private final String item;  // 상품명

    @Schema(description = "상점 위치", example = "서울시 강남구")
    private final String place;  // 상점 위치

    @Schema(description = "상점 위도", example = "37.5665")
    private final double lat;  // 상점 위도

    @Schema(description = "상점 경도", example = "126.9780")
    private final double lon;  // 상점 경도

    @Schema(description = "현재 참여 인원 수", example = "5")
    private final int count;  // 현재 참여 인원 수

    @Schema(description = "최대 참여 인원 수", example = "10")
    private final int maxCount;  // 최대 참여 인원 수

    @Schema(description = "상점 상태", example = "ACTIVE")
    private final Shop.statusType status;  // 상점 상태

    @Schema(description = "생성 시간", example = "2024-08-05T10:00:00")
    private final LocalDateTime createAt;  // 생성 시간

    @Schema(description = "사용자 이름", example = "홍길동")
    private final String userName;  // 사용자 이름

    @Schema(description = "사용자 이미지 번호", example = "1")
    private final int imageNo;  // 사용자 이미지 번호

    public ShopResponse(Shop shop, UserEntity user) {
        this.shopSeq = shop.getShopSeq();
        this.userSeq = shop.getUser().getUserSeq();
        this.roomSeq = shop.getRoomSeq();
        this.partySeq = shop.getPartySeq();
        this.title = shop.getTitle();
        this.content = shop.getContent();
        this.hit = shop.getHit();
        this.item = shop.getItem();
        this.place = shop.getPlace();
        this.status = shop.getStatus();
        this.createAt = shop.getCreateAt();
        this.site = shop.getSite();
        this.lat = shop.getLat();
        this.lon = shop.getLon();
        this.count = shop.getCount();
        this.maxCount = shop.getMaxCount();
        this.userName = user.getUserName();
        this.imageNo = user.getImageNo();
    }
}
