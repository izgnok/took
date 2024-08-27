package com.took.chat_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 채팅방 생성 요청 DTO
 */
@Data
public class ChatRoomCreateRequest {
    @Schema(description = "채팅방 제목", example = "일반 채팅방")
    private String roomTitle;  // 채팅방 제목

    @Schema(description = "채팅방 작성자 ID", example = "456")
    private Long userSeq; // 채팅방 작성자

    @Schema(description = "채팅방 카테고리", example = "1")
    private int category; // 채팅방 카테고리
}
