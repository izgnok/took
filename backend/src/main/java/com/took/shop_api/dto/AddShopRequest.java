package com.took.shop_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AddShopRequest {

    @Schema(description = "채팅방 고유 번호", example = "12345")
    private Long roomSeq;  // 채팅방 고유 번호

    @Schema(description = "사용자 고유 번호", example = "67890")
    private Long userSeq;  // 사용자 고유 번호

    @Schema(description = "상점 제목", example = "내 상점")
    private String title;  // 상점 제목

    @Schema(description = "상점 내용", example = "상점에 대한 설명")
    private String content;  // 상점 내용

    @Schema(description = "상품 목록", example = "전자제품, 가전제품")
    private String item;  // 상품 목록

    @Schema(description = "상점 사이트", example = "https://www.example.com")
    private String site;  // 상점 사이트

    @Schema(description = "상점 위치", example = "서울 강남구")
    private String place;  // 상점 위치

    @Schema(description = "현재 인원 수", example = "1")
    private int count = 1;  // 현재 인원 수

    @Schema(description = "위도", example = "37.5665")
    private double lat;  // 위도

    @Schema(description = "경도", example = "126.9780")
    private double lon;  // 경도

    @Schema(description = "최대 인원 수", example = "10")
    private int maxCount;  // 최대 인원 수
}
