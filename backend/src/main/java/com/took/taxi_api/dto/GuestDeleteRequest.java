package com.took.taxi_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "게스트 삭제 요청 데이터")
public class GuestDeleteRequest {

    @Schema(description = "택시 식별 번호", example = "12345")
    private Long taxiSeq;

    @Schema(description = "사용자 식별 번호", example = "67890")
    private Long userSeq;
}
