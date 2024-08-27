package com.took.fcm_api.service;

import com.google.firebase.messaging.*;
import com.took.fcm_api.dto.AlarmRequest;
import com.took.fcm_api.dto.AlarmResponse;
import com.took.fcm_api.dto.FCMTokenRequest;
import com.took.fcm_api.dto.MessageRequest;
import com.took.fcm_api.entity.Alarm;
import com.took.fcm_api.entity.FCMToken;
import com.took.fcm_api.repository.AlarmRepository;
import com.took.fcm_api.repository.FCMRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class FCMService {
    private final FCMRepository fcmRepository;
    private final AlarmRepository alarmRepository;

    public void saveToken(FCMTokenRequest request) {
        FCMToken fcmToken = FCMToken.builder()
                .userSeq(String.valueOf(request.getUserSeq()))  // request에서 userId 가져옴
                .token(request.getToken())
                .build();
        FCMToken test = fcmRepository.save(fcmToken);
    }

    public String getToken(long userSeq) {
        FCMToken fcmToken = fcmRepository.findByUserSeq(String.valueOf(userSeq)).orElse(null);
        if (fcmToken == null) {
            return null;
        }
        return fcmToken.getToken();
    }

    public List<String> getTokens(List<Long> userSeqList) {
        List<String> tokens = new ArrayList<>();
        for (Long userSeq : userSeqList) {
            FCMToken fcmToken = fcmRepository.findByUserSeq(String.valueOf(userSeq)).orElse(null);
            if (fcmToken != null) {
                tokens.add(fcmToken.getToken());
            }
        }
        return tokens;
    }
    public List<AlarmResponse> alarmList(long userSeq) {

        List<AlarmResponse> alarms = alarmRepository.findByUserSeq(userSeq)
                .stream()
                .map(AlarmResponse::new)
                .collect(Collectors.toList());
        return alarms;
    }
    // 정산 메서드
    public void sendNotification(AlarmRequest request) {
        Alarm alarm = Alarm.builder().title(request.getTitle())
                .body(request.getBody())
                .sender(request.getSender())
                .userSeq(request.getUserSeq())
                .partySeq(request.getPartySeq())
                .category(request.getCategory())
                .url1(request.getUrl1())
                .url2(request.getUrl2())
                .preCost(request.getPreCost())
                .actualCost(request.getActualCost())
                .differenceCost(request.getDifferenceCost())
                .deliveryCost(request.getDeliveryCost())
                .orderCost(request.getOrderCost())
                .cost(request.getCost())
                .createAt(LocalDateTime.now())
                .status(false)
                .build();

        String token = getToken(request.getUserSeq());
        if(token == null || token.isEmpty()) {
            return;
        }
        alarmRepository.save(alarm);
        Notification notification = Notification.builder()
                .setTitle(request.getTitle())
                .setBody(request.getBody())
                .build();
        Message message = Message.builder()
                .setToken(getToken(request.getUserSeq()))
                .setNotification(notification)
                .build();
        try {
            FirebaseMessaging.getInstance().send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendMessage(MessageRequest request) {
        Notification notification = Notification.builder()
                .setTitle(request.getTitle())
                .setBody(request.getBody())
                .build();

        // 각 토큰에 대해 메시지를 생성하고 멀티캐스트 메시지로 설정
        List<String > tokens = getTokens(request.getUserSeqList());
        if(tokens == null || tokens.isEmpty()) {
            return;
        }
        MulticastMessage message = MulticastMessage.builder()
                .addAllTokens(getTokens(request.getUserSeqList()))
                .setNotification(notification)
                .build();
        try {
            FirebaseMessaging.getInstance().sendMulticast(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
