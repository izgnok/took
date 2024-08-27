package com.took.shop_api.dto;

import com.took.shop_api.entity.Product;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class UpdateProductRequest {

    @Schema(description = "제품 이름", example = "샴푸")
    private String productName;  // 제품 이름

    @Schema(description = "제품 옵션 상세", example = "300ml")
    private String optionDetails;  // 제품 옵션 상세

    @Schema(description = "기타 사항", example = "무향")
    private String etc;  // 기타 사항

    public Product toEntity() {
        return Product.builder()
                .productName(productName)
                .optionDetails(optionDetails)
                .etc(etc)
                .build();
    }
}
