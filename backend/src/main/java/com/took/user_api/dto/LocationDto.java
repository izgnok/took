package com.took.user_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class LocationDto {

    @Schema(description = "위도", example = "37.5665")
    private double lat;

    @Schema(description = "경도", example = "126.978")
    private double lon;
}
