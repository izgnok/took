package com.took.shop_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class AddShopGuest {

    @Schema(description = "상점 고유 번호", example = "12345")
    private long shopSeq;  // 상점 고유 번호

    @Schema(description = "사용자 고유 번호", example = "67890")
    private long userSeq;  // 사용자 고유 번호
}
