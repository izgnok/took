package com.took.chat_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 채팅 메시지 조회 요청 DTO
 */
@Data
public class ChatMessageSelectRequest {
    @Schema(description = "채팅방 번호", example = "123")
    private Long roomSeq;  // 채팅방 번호

    @Schema(description = "유저 ID", example = "456")
    private Long userSeq;  // 유저 ID
}
