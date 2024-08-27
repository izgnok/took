package com.took.user_api.dto.response.party;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NoPayResponseDto {

    @Schema(description = "파티의 고유 식별자", example = "1")
    private Long partySeq;

    @Schema(description = "유저의 고유 식별자", example = "101")
    private Long userSeq;

    @Schema(description = "유저의 이름", example = "John Doe")
    private String userName;

    @Schema(description = "유저의 프로필 이미지 번호", example = "3")
    private int imageNo;

    @Schema(description = "결제해야 할 금액", example = "50000")
    private Long cost;

    @Schema(description = "카테고리 번호", example = "2")
    private int category;

    @Schema(description = "생성된 시간", example = "2024-08-09T14:00:00")
    private LocalDateTime createdAt;

    public NoPayResponseDto(Long partySeq, Long userSeq, String userName, int imageNo, Long cost, int category, LocalDateTime createdAt) {
        this.partySeq = partySeq;
        this.userSeq = userSeq;
        this.userName = userName;
        this.imageNo = imageNo;
        this.cost = cost;
        this.category = category;
        this.createdAt = createdAt;
    }
}
