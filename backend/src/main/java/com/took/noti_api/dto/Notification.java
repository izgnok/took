package com.took.noti_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

import java.util.List;

@Getter
public class Notification {

    @Schema(description = "알림 메시지", example = "새로운 알림이 도착했습니다.")
    private String message;

    @Schema(description = "알림을 받을 사용자 ID 목록", example = "[123, 456, 789]")
    private List<Long> list;
}
