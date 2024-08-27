package com.took.shop_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class AddProduct {

    @Schema(description = "제품 이름", example = "스마트폰")
    private String productName;  // 제품 이름

    @Schema(description = "제품 옵션 세부사항", example = "128GB, 블랙")
    private String optionDetails;  // 제품 옵션 세부사항

    @Schema(description = "기타 정보", example = "보증 기간: 2년")
    private String etc;  // 기타 정보
}
