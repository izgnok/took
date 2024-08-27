package com.took.noti_api.service;

import com.took.noti_api.dto.Notification;
import com.took.noti_api.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@Service
public class NotificationService {

    private static final Long DEFAULT_TIMEOUT = 60L * 1000 * 60;
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    
    // 알림 등록 메서드
    private SseEmitter createEmitter(Long id) {
        SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);
        notificationRepository.save(id, emitter);

        emitter.onCompletion(() -> notificationRepository.deleteById(id));
        emitter.onTimeout(() -> notificationRepository.deleteById(id));

        return emitter;
    }
    
    // 알림 전송 메서드
    private void sendEvent(long userSeq, Object data) {
        SseEmitter emitter = notificationRepository.get(userSeq);
        
        // 알림 설정이 된 Id이면 보냄
        if (emitter != null) {
            try {
                // sendId에서 알림 이벤트 발생
                emitter.send(SseEmitter.event().id(String.valueOf(userSeq)).name("알림").data(data));
            } catch (IOException exception) {
                notificationRepository.deleteById(userSeq);
                emitter.completeWithError(exception);
            }
        }
    }
    
    // 알림 설정
    public SseEmitter subscribe(Long userSeq) {
        return createEmitter(userSeq);
    }

    // 알림 보내기
    public void sendNotification(Notification notification) {
        String message = notification.getMessage();
        for (Long userSeq : notification.getList()){
            sendEvent(userSeq, message);
        }
    }

}
