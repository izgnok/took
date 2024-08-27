package com.took.user_api.dto.request.party;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "택시 파티 생성 요청 객체")
public class MakeTaxiPartyRequest {

    @Schema(description = "파티 제목", example = "공항까지 같이 가요")
    private String title;

    @Schema(description = "카테고리", example = "2")
    private int category;

    @Schema(description = "예상 결제 총 비용", example = "15000")
    private Long cost;

    @Schema(description = "사용자 목록")
    private List<User> users;

    @Schema(description = "결제자", example = "123")
    private Long master;

    @Schema(description = "출발지 위도", example = "37.123456")
    private double startLat;

    @Schema(description = "출발지 경도", example = "127.123456")
    private double startLon;

    @Schema(description = "택시 번호", example = "1")
    private Long taxiSeq;

    @Data
    @Schema(description = "사용자 정보 객체")
    public static class User {
        @Schema(description = "사용자 시퀀스", example = "456")
        private Long userSeq;

        @Schema(description = "가결제 비용", example = "5000")
        private Long fakeCost;
    }
}
