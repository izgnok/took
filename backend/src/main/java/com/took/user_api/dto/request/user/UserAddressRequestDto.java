package com.took.user_api.dto.request.user;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class UserAddressRequestDto {

    @Schema(description = "사용자 시퀀스 (예: 1)", example = "1")
    private Long userSeq;

    @Schema(description = "위도", example = "37.5665")
    private double lat;

    @Schema(description = "경도", example = "126.9780")
    private double lon;

    @Schema(description = "주소", example = "서울특별시 종로구 세종로 1-68")
    private String addr;

}
