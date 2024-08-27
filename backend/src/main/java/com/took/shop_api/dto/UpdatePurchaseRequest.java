package com.took.shop_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class UpdatePurchaseRequest {

    @Schema(description = "구매 금액", example = "50000")
    private int price;  // 구매 금액

    @Schema(description = "배송비", example = "5000")
    private int shipCost;  // 배송비

    @Schema(description = "제품 목록", example = "[{\"productName\": \"샴푸\", \"optionDetails\": \"300ml\", \"etc\": \"\"}]")
    private List<UpdateProductRequest> productList;  // 제품 목록
}
