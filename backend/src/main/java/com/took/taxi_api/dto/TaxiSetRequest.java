package com.took.taxi_api.dto;

import lombok.Data;

@Data
public class TaxiSetRequest {

    private Long taxiSeq;  // 택시 식별 번호

    private Long master;  // 결제자 식별 번호

    private int max;  // 최대 인원 수

    private boolean gender;  // 성별 여부
}
