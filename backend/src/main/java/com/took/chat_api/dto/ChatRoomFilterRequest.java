package com.took.chat_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

/**
 * 채팅방 필터 요청 DTO
 */
@Data
public class ChatRoomFilterRequest {
    @Schema(description = "카테고리", example = "1")
    private int category;  // 카테고리

    @Schema(description = "사용자 번호 목록", example = "[123, 456, 789]")
    private List<Long> userSeqs;  // 사용자 번호 목록
}
