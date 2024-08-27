package com.took.taxi_api.dto;

import com.took.taxi_api.entity.Taxi;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "택시 선택 응답 데이터")
public class TaxiSelectResponse {

    @Schema(description = "택시 식별 번호", example = "1")
    private Long taxiSeq;

    @Schema(description = "채팅방 식별 번호", example = "1")
    private Long roomSeq;

    @Schema(description = "사용자 식별 번호", example = "1")
    private Long userSeq;

    @Schema(description = "파티 식별 번호", example = "1")
    private Long partySeq;

    @Schema(description = "출발지 위도", example = "37.5665")
    private double startLat;

    @Schema(description = "출발지 경도", example = "126.978")
    private double startLon;

    @Schema(description = "성별 (남성: true, 여성: false)", example = "true")
    private boolean gender;

    @Schema(description = "현재 탑승 인원 수", example = "3")
    private int count;

    @Schema(description = "최대 탑승 인원 수", example = "4")
    private int max;

    @Schema(description = "택시 상태 (예: OPEN, FILLED, BOARD, DONE)", example = "OPEN")
    private Taxi.Status status;

    @Schema(description = "택시 생성 시간", example = "2024-08-05T10:00:00")
    private LocalDateTime createdAt;

    @Schema(description = "택시 종료 시간", example = "2024-08-05T12:00:00")
    private LocalDateTime finishTime;

    @Schema(description = "총 비용", example = "5000")
    private Long cost;

    @Schema(description = "마스터 식별 번호", example = "1")
    private Long master;

    public TaxiSelectResponse(Taxi taxi) {
        this.taxiSeq = taxi.getTaxiSeq();
        this.roomSeq = taxi.getRoomSeq();
        this.userSeq = taxi.getUser().getUserSeq();
        this.partySeq = taxi.getPartySeq();
        this.startLat = taxi.getStartLat();
        this.startLon = taxi.getStartLon();
        this.gender = taxi.isGender();
        this.count = taxi.getCount();
        this.max = taxi.getMax();
        this.status = taxi.getStatus();
        this.createdAt = taxi.getCreatedAt();
        this.finishTime = taxi.getFinishTime();
        this.cost = taxi.getCost();
        this.master = taxi.getMaster();
    }
}
