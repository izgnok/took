package com.took.user_api.dto.request.party;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "최종 택시 파티 요청 객체")
public class FinalTaxiPartyRequest {

    @Schema(description = "파티 시퀀스", example = "123")
    private Long partySeq;

    @Schema(description = "총 실제 결제 비용", example = "20000")
    private Long cost;

    @Schema(description = "사용자 목록")
    private List<User> users;

    @Data
    @Schema(description = "사용자 정보 객체")
    public static class User {
        @Schema(description = "사용자 시퀀스", example = "456")
        private Long userSeq;

        @Schema(description = "사용자별 비용", example = "5000")
        private Long cost;
    }
}
