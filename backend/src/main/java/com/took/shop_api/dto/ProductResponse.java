package com.took.shop_api.dto;

import com.took.shop_api.entity.Product;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class ProductResponse {

    @Schema(description = "상품 고유 번호", example = "1")
    private final Long productSeq;  // 상품 고유 번호

    @Schema(description = "상품 이름", example = "스마트폰")
    private final String productName;  // 상품 이름

    @Schema(description = "상품 옵션 상세", example = "64GB, 블랙")
    private final String optionDetails;  // 상품 옵션 상세

    @Schema(description = "기타 정보", example = "추가 액세서리 포함")
    private final String etc;  // 기타 정보

    public ProductResponse(Product product) {
        this.productSeq = product.getProductSeq();
        this.productName = product.getProductName();
        this.optionDetails = product.getOptionDetails();
        this.etc = product.getEtc();
    }
}
