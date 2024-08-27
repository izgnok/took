package com.took.fcm_api.dto;

import com.took.fcm_api.entity.Alarm;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class AlarmResponse {
    private final long alarmSeq;

    private final String title; // 제목

    private final String body; // 내용

    private final Long sender; // 보내는 사람

    private final Long userSeq; // 받는 사람

    private final Long partySeq; // 파티Seq

    private final int category; // 카테고리

    private final LocalDateTime createAt; // 보낸 날짜

    private final String url1; // 이동 경로1

    private final String url2; // 이동 경로 2

    private final long preCost; // 선결제 금액

    private final long actualCost; // 실결제 금액

    private final long differenceCost; // 차액

    private final long deliveryCost; // 배달비

    private final long orderCost; // 주문 금액

    private final long cost; // 요청 금액

    private final Boolean status;



    public AlarmResponse(Alarm alarm) {
        this.alarmSeq = alarm.getAlarmSeq();
        this.title = alarm.getTitle();
        this.body = alarm.getBody();
        this.sender = alarm.getSender();
        this.userSeq = alarm.getUserSeq();
        this.partySeq = alarm.getPartySeq();
        this.category = alarm.getCategory();
        this.createAt = alarm.getCreateAt();
        this.url1 = alarm.getUrl1();
        this.url2 = alarm.getUrl2();
        this.preCost = alarm.getPreCost();
        this.actualCost = alarm.getActualCost();
        this.differenceCost = alarm.getDifferenceCost();
        this.deliveryCost = alarm.getDeliveryCost();
        this.orderCost = alarm.getOrderCost();
        this.cost = alarm.getCost();
        this.status=alarm.getStatus();
    }
}
