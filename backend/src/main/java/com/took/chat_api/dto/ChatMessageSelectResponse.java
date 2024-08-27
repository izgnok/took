package com.took.chat_api.dto;

import com.took.chat_api.entity.ChatMessage;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 채팅 메시지 조회 응답 DTO
 */
@Data
public class ChatMessageSelectResponse {
    @Schema(description = "메시지 타입 (ENTER, TALK, EXIT, MATCH, MATCH_REQUEST)", example = "TALK")
    private String type;  // 메시지 타입 (ENTER, TALK, EXIT, MATCH, MATCH_REQUEST)

    @Schema(description = "메시지 송신자 ID", example = "456")
    private Long userSeq;  // 메시지 송신자 ID

    @Schema(description = "메시지 내용", example = "안녕하세요!")
    private String message;  // 메시지 내용

    @Schema(description = "메시지 생성 시간", example = "2023-01-01T12:00:00")
    private LocalDateTime createdAt;  // 메시지 생성 시간

    public ChatMessageSelectResponse(ChatMessage chatMessage) {
        this.type = String.valueOf(chatMessage.getType());
        this.userSeq = chatMessage.getUser().getUserSeq();
        this.message = chatMessage.getMessage();
        this.createdAt = chatMessage.getCreatedAt();
    }
}
