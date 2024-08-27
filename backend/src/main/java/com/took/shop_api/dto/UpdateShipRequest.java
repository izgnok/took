package com.took.shop_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class UpdateShipRequest {

    @Schema(description = "운송업체 이름", example = "CJ대한통운")
    private String courier;  // 운송업체 이름

    @Schema(description = "운송장 번호", example = "1234567890")
    private String invoiceNum;  // 운송장 번호
}
