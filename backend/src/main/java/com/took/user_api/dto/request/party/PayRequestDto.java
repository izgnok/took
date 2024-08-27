package com.took.user_api.dto.request.party;

import lombok.Getter;

@Getter
public class PayRequestDto {

    private Long partySeq;
    private Long memberSeq;
    private Long userSeq;
    private Long cost;


}
