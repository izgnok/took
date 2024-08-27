package com.took.user_api.dto.response.party;

import com.took.user_api.entity.PartyEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MyPartyListResponseDto {

    @Schema(description = "파티 시퀀스 ID", example = "1")
    private Long partySeq;

    @Schema(description = "파티 제목", example = "친구들과의 저녁 식사")
    private String title;

    @Schema(description = "카테고리", example = "3")
    private int category;

    @Schema(description = "총 결제금액", example = "15000")
    private Long cost;

    @Schema(description = "상태", example = "true")
    private Boolean status;

    @Schema(description = "생성 날짜", example = "2023-08-08T18:30:00")
    private LocalDateTime createdAt;

    @Schema(description = "참여 인원 수", example = "5")
    private int count;

    @Schema(description = "총 멤버 수", example = "10")
    private int totalMember;

    @Schema(description = "중간 계좌", example = "12000")
    private Long receiveCost;

    @Schema(description = "배달 팁", example = "3000")
    private Long deliveryTip;

    public MyPartyListResponseDto(PartyEntity party) {
        this.partySeq = party.getPartySeq();
        this.title = party.getTitle();
        this.category = party.getCategory();
        this.cost = party.getCost();
        this.status = party.getStatus();
        this.createdAt = party.getCreatedAt();
        this.count = party.getCount();
        this.totalMember = party.getTotalMember();
        this.receiveCost = party.getReceiveCost();
        this.deliveryTip = party.getDeliveryTip();
    }
}
