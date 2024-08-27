package com.took.chat_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 유저 채팅방 입장 요청 DTO
 */
@Data
public class ChatUserCreateRequest {
    @Schema(description = "채팅방 번호", example = "123")
    private Long roomSeq;  // 채팅방 번호

    @Schema(description = "유저 ID", example = "456")
    private Long userSeq;  // 유저 ID
}
