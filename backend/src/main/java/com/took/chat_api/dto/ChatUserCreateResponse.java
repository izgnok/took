package com.took.chat_api.dto;

import com.took.chat_api.entity.ChatUser;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 유저 채팅방 입장 응답 DTO
 */
@Data
public class ChatUserCreateResponse {
    @Schema(description = "유저 고유 번호", example = "789")
    private Long chatUserSeq;  // 유저 고유 번호

    @Schema(description = "채팅방 번호", example = "123")
    private Long roomSeq;  // 채팅방 번호

    @Schema(description = "유저 ID", example = "456")
    private Long userSeq;  // 유저 ID

    @Schema(description = "방에 들어간 시간", example = "2023-01-01T12:00:00")
    private LocalDateTime joinTime;  // 방에 들어간 시간

    public ChatUserCreateResponse(ChatUser chatUser) {
        this.chatUserSeq = chatUser.getChatUserSeq();
        this.roomSeq = chatUser.getChatRoom().getRoomSeq();
        this.userSeq = chatUser.getUser().getUserSeq();
        this.joinTime = chatUser.getJoinTime();
    }
}
