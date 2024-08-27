package com.took.shop_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import com.took.shop_api.entity.ShipInfo;
import lombok.Getter;

@Getter
public class ShipResponse {

    @Schema(description = "배송 고유 번호", example = "1")
    private final long shipSeq;  // 배송 고유 번호

    @Schema(description = "택배사 이름", example = "CJ대한통운")
    private final String courier;  // 택배사 이름

    @Schema(description = "운송장 번호", example = "1234567890")
    private final String invoiceNum;  // 운송장 번호

    public ShipResponse(ShipInfo shipInfo) {
        this.shipSeq = shipInfo.getShipSeq();
        this.courier = shipInfo.getCourier();
        this.invoiceNum = shipInfo.getInvoiceNum();
    }
}
