package com.took.positionsave_api.dto;

import com.took.positionsave_api.entity.Position;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class PositionSelectResponse {

    @Schema(description = "사용자 ID", example = "12345")
    private Long userSeq;  // 사용자 ID

    @Schema(description = "위치의 위도", example = "37.5665")
    private double lat;     // 위치의 위도 정보

    @Schema(description = "위치의 경도", example = "126.978")
    private double lon;     // 위치의 경도 정보

    /**
     * Position 엔터티를 기반으로하는 생성자
     * @param position Position 엔터티 객체
     */
    public PositionSelectResponse(Position position) {
        this.userSeq = Long.valueOf(position.getUserSeq());  // Position 엔터티의 userId 값을 가져와 필드에 설정
        this.lat = position.getLat();        // Position 엔터티의 lat 값을 가져와 필드에 설정
        this.lon = position.getLon();        // Position 엔터티의 lon 값을 가져와 필드에 설정
    }
}
