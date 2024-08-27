package com.took.shop_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class AddShipRequest {

    @Schema(description = "상점 고유 번호", example = "12345")
    private Long shopSeq;  // 상점 고유 번호

    @Schema(description = "택배사", example = "CJ대한통운")
    private String courier;  // 택배사

    @Schema(description = "송장 번호", example = "1234-5678-9012")
    private String invoiceNum;  // 송장 번호
}
