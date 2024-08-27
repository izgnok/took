package com.took.taxi_api.dto;

import lombok.Data;

@Data
public class TaxiSetPartyRequest {

    private Long taxiSeq;  // 택시 식별 번호

    private Long partySeq;  // 파티 식별 번호
}
