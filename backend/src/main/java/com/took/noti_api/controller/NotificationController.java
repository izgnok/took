package com.took.noti_api.controller;

import com.took.noti_api.dto.Notification;
import com.took.noti_api.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/noti")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Operation(summary = "사용자 알림 구독", description = "주어진 사용자 번호로 알림을 구독합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공적으로 구독됨"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @GetMapping("/subscribe/{userSeq}")
    public SseEmitter subscribe(
            @Parameter(description = "사용자의 고유 번호", example = "12345") @PathVariable Long userSeq) {
        return notificationService.subscribe(userSeq);
    }

    @Operation(summary = "알림 전송", description = "알림을 지정된 사용자에게 전송합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공적으로 알림이 전송됨"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/send")
    public ResponseEntity<?> send(
            @Parameter(description = "전송할 알림 객체") @RequestBody Notification notification) {
        notificationService.sendNotification(notification);
        return ResponseEntity.ok().build();
    }
}
