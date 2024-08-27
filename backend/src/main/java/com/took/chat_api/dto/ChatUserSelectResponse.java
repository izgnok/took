package com.took.chat_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

/**
 * 유저 조회 응답 DTO
 */
@Data
@Builder
public class ChatUserSelectResponse {

    @Schema(description = "유저 ID", example = "456")
    private Long userSeq;

    @Schema(description = "유저 이름", example = "홍길동")
    private String userName;

    @Schema(description = "이미지 번호", example = "12")
    private int imageNo;
}
