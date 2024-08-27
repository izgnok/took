package com.took.user_api.dto.request.account;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChangeMainRequestDto {

    @Schema(description = "사용자 식별 번호", example = "123")
    private Long userSeq;

    @Schema(description = "계좌 식별 번호", example = "456")
    private Long accountSeq;
}
