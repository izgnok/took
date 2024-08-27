package com.took.shop_api.dto;

import lombok.Data;

@Data
public class ShopSetPartyRequest {

    private Long shopSeq;  // 공동 구매 식별 번호

    private Long partySeq;  // 파티 식별 번호
}
