package com.took.user_api.dto.request.account;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AccountListRequestDto {

    @Schema(description = "사용자 식별 번호", example = "1")
    private Long userSeq;
}
