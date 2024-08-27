package com.took.shop_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

import java.util.List;

@Getter
public class PurchaseInfoListResponse {

    @Schema(description = "구매 정보 응답 리스트",
            example = "[{ \"shopSeq\": 1, \"userSeq\": 2, \"price\": 10000, \"shipCost\": 2000, \"productList\": [...] }]")
    private List<PurchaseInfoResponse> purchaseInfoResponseList;  // 구매 정보 응답 리스트

    @Schema(description = "구매 정보 총 개수", example = "10")
    private int listTotal;  // 구매 정보 총 개수

    public PurchaseInfoListResponse(List<PurchaseInfoResponse> purchaseInfoResponseList, int listTotal) {
        this.purchaseInfoResponseList = purchaseInfoResponseList;
        this.listTotal = listTotal;
    }
}
