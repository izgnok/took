package com.took.shop_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import com.took.shop_api.entity.PurchaseInfo;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PurchaseInfoResponse {

    @Schema(description = "구매 고유 번호", example = "1")
    private Long purchaseSeq;  // 구매 고유 번호

    @Schema(description = "사용자 고유 번호", example = "123")
    private Long userSeq;  // 사용자 고유 번호

    @Schema(description = "상점 고유 번호", example = "456")
    private Long shopSeq;  // 상점 고유 번호

    @Schema(description = "구매 가격", example = "10000")
    private int price;  // 구매 가격

    @Schema(description = "배송비", example = "2000")
    private int shipCost;  // 배송비

    @Schema(description = "제품 리스트", example = "[{ \"productSeq\": 1, \"productName\": \"상품1\", \"optionDetails\": \"옵션1\", \"etc\": \"기타1\" }]")
    private List<ProductResponse> productList;  // 제품 리스트

    @Schema(description = "총 비용", example = "12000")
    private int total;  // 총 비용

    public PurchaseInfoResponse(PurchaseInfo purchaseInfo) {
        this.purchaseSeq = purchaseInfo.getPurchaseSeq();
        this.userSeq = purchaseInfo.getUser().getUserSeq();
        this.shopSeq = purchaseInfo.getShop().getShopSeq();
        this.price = purchaseInfo.getPrice();
        this.shipCost = purchaseInfo.getShipCost();
        this.total = this.price + this.shipCost;
    }
}
