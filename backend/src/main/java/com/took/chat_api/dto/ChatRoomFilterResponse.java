package com.took.chat_api.dto;

import com.took.chat_api.entity.ChatRoom;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 채팅방 필터 응답 DTO
 */
@Data
public class ChatRoomFilterResponse {
    @Schema(description = "채팅방 고유 번호", example = "123")
    private Long roomSeq;  // 채팅방 고유 번호

    @Schema(description = "채팅방 제목", example = "일반 채팅방")
    private String roomTitle;  // 채팅방 제목

    @Schema(description = "채팅방 작성자 ID", example = "456")
    private Long userSeq; // 채팅방 작성자

    @Schema(description = "채팅방 생성 시간", example = "2023-01-01T12:00:00")
    private LocalDateTime createdAt; // 채팅방 만들어진 시간

    @Schema(description = "채팅방 카테고리", example = "1")
    private int category; // 채팅방 카테고리

    @Schema(description = "채팅방 활성화 여부", example = "true")
    private boolean status;

    public ChatRoomFilterResponse(ChatRoom chatRoom) {
        this.roomSeq = chatRoom.getRoomSeq();
        this.roomTitle = chatRoom.getRoomTitle();
        this.userSeq = chatRoom.getUser().getUserSeq();
        this.createdAt = chatRoom.getCreatedAt();
        this.category = chatRoom.getCategory();
        this.status = chatRoom.isStatus();
    }
}
