package com.took.shop_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class AddPurchaseInfo {

    @Schema(description = "사용자 고유 번호", example = "12345")
    private Long userSeq;  // 사용자 고유 번호

    @Schema(description = "상점 고유 번호", example = "67890")
    private Long shopSeq;  // 상점 고유 번호

    @Schema(description = "총 가격", example = "25000")
    private int price;  // 총 가격

    @Schema(description = "배송비", example = "3000")
    private int shipCost;  // 배송비

    @Schema(description = "제품 목록")
    private List<AddProduct> productList;  // 제품 목록
}
