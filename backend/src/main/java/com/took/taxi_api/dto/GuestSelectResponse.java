package com.took.taxi_api.dto;

import com.took.taxi_api.entity.TaxiGuest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "게스트 조회 응답 데이터")
public class GuestSelectResponse {

    @Schema(description = "게스트 식별 번호", example = "1")
    private Long guestSeq;

    @Schema(description = "택시 식별 번호", example = "100")
    private Long taxiSeq;

    @Schema(description = "사용자 식별 번호", example = "200")
    private Long userSeq;

    @Schema(description = "목적지 이름", example = "서울역")
    private String destiName;

    @Schema(description = "목적지 위도", example = "37.5665")
    private double destiLat;

    @Schema(description = "목적지 경도", example = "126.978")
    private double destiLon;

    @Schema(description = "비용", example = "15000")
    private Long cost;

    @Schema(description = "목적지 순위", example = "1")
    private int routeRank;

    public GuestSelectResponse(TaxiGuest taxiGuest) {
        this.guestSeq = taxiGuest.getGuestSeq();
        this.taxiSeq = taxiGuest.getTaxi().getTaxiSeq();
        this.userSeq = taxiGuest.getUser().getUserSeq();
        this.destiName = taxiGuest.getDestiName();
        this.destiLat = taxiGuest.getDestiLat();
        this.destiLon = taxiGuest.getDestiLon();
        this.cost = taxiGuest.getCost();
        this.routeRank = taxiGuest.getRouteRank();
    }
}
