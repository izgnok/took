package com.took.fcm_api.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class AlarmRequest {

    private String title; // 제목

    private String body; // 내용

    private Long sender; // 보내는 사람

    private Long userSeq; // 받는 사람

    private Long partySeq; // 파티Seq

    private int category; // 카테고리

    private String url1; // 이동 경로1

    private String url2; // 이동 경로 2

    private long preCost; // 선결제 금액

    private long actualCost; // 실결제 금액

    private long differenceCost; // 차액

    private long deliveryCost; // 배달비

    private long orderCost; // 주문 금액

    private long cost; // 요청 금액
}
