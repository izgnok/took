package com.took.shop_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UpdateShopRequest {

    @Schema(description = "사용자 고유 번호", example = "123")
    private Long userSeq;
    
    @Schema(description = "상점 제목", example = "스타벅스 강남점")
    private String title;  // 상점 제목

    @Schema(description = "상점 설명", example = "편안한 분위기의 커피숍")
    private String content;  // 상점 설명

    @Schema(description = "판매 품목", example = "커피, 차, 디저트")
    private String item;  // 판매 품목

    @Schema(description = "상점 웹사이트 URL", example = "https://www.starbucks.co.kr")
    private String site;  // 상점 웹사이트 URL

    @Schema(description = "상점 위치", example = "서울 강남구 테헤란로 123")
    private String place;  // 상점 위치

    @Schema(description = "상점 위도", example = "37.123456")
    private double lat;  // 상점 위도

    @Schema(description = "상점 경도", example = "127.123456")
    private double lon;  // 상점 경도

    @Schema(description = "최대 수용 인원", example = "50")
    private int maxCount;  // 최대 수용 인원
}
