package com.took.taxi_api.dto;

import lombok.Data;

@Data
public class TaxiStartRequest {

    private Long taxiSeq;  // 택시 식별 번호

    private double startLat;  // 출발지 위도

    private double startLon;  // 출발지 경도
}
