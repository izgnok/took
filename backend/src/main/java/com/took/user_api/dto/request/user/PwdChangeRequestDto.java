package com.took.user_api.dto.request.user;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class PwdChangeRequestDto {

    @Schema(description = "사용자 시퀀스 (예: 1)", example = "1")
    private Long userSeq;

    @Schema(description = "현재 비밀번호", example = "currentPassword123")
    private String nowPwd;

    @Schema(description = "새 비밀번호", example = "newPassword456")
    private String newPwd;
}
