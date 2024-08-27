package com.took.user_api.dto.request.party;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class hostPayRequestDto {

    private Long memberSeq;
    private Long userSeq;
    private Long total_cost;
}
