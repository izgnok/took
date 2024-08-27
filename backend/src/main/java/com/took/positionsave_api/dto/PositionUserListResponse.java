package com.took.positionsave_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class PositionUserListResponse {

    @Schema(description = "사용자 ID", example = "12345")
    private Long userSeq;  // 사용자 ID

    @Schema(description = "사용자와의 거리차이 (단위: m)", example = "100")
    private int distance;  // 사용자와의 거리차이 (단위: m)

    @Schema(description = "사용자 이름", example = "홍길동")
    private String userName;

    @Schema(description = "사용자 이미지 번호", example = "1")
    private int imageNo;
}
