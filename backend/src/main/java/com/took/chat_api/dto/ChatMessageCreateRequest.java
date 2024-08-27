package com.took.chat_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

/**
 * 채팅 메시지 생성 요청 DTO
 */
@Data
@Builder
public class ChatMessageCreateRequest {
    @Schema(description = "메시지 타입 (ENTER, TALK, EXIT, MATCH, MATCH_REQUEST)", example = "TALK")
    private String type;  // 메시지 타입 (ENTER, TALK, EXIT, MATCH, MATCH_REQUEST)

    @Schema(description = "채팅방 번호", example = "123")
    private Long roomSeq;  // 채팅방 번호

    @Schema(description = "메시지 송신자 ID", example = "456")
    private Long userSeq;  // 메시지 송신자

    @Schema(description = "메시지 내용", example = "안녕하세요!")
    private String message;  // 메시지 내용
}
