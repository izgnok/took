package com.took.shop_api.dto;

import com.took.shop_api.entity.Shop;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class UpdateStatusShopRequest {

    @Schema(description = "상점 상태", example = "OPEN", allowableValues = {"OPEN", "IN_PROGRESS", "COMPLETED"})
    private Shop.statusType status;  // 상점 상태
}
