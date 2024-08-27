package com.took.user_api.dto.request.party;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
public class InsertAllMemberRequestDto {

    @Schema(description = "파티의 고유 식별자", example = "123", required = true)
    private Long partySeq;

    @Schema(description = "유저별 비용 목록", required = true)
    private List<userCost> userCosts;

    @Schema(description = "배달 팁 (배달, 공구에서만)", example = "5000")
    private Long deliveryTip;

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class userCost {

        @Schema(description = "유저의 고유 식별자", example = "456", required = true)
        private Long userSeq;

        @Schema(description = "유저의 비용", example = "20000", required = true)
        private Long cost;
    }
}
