package com.took.delivery_api.service;

import com.took.chat_api.entity.ChatRoom;
import com.took.chat_api.repository.ChatRoomRepository;
import com.took.delivery_api.dto.*;
import com.took.delivery_api.entity.Delivery;
import com.took.delivery_api.repository.DeliveryRepository;
import com.took.user_api.entity.UserEntity;
import com.took.user_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

// 서비스 클래스 정의
@Service
@RequiredArgsConstructor
public class DeliveryService {

    // 리포지토리 주입
    private final DeliveryRepository deliveryRepository;
    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;

    @Value("${distance.threshold}")
    private double distanceThreshold;


    // 배달 생성 메서드
    @Transactional
    public DeliveryCreateResponse createDelivery(DeliveryCreateRequest request) {
        UserEntity user = userRepository.findById(request.getUserSeq()).orElseThrow();
        // 요청 데이터를 기반으로 Delivery 객체 생성
        Delivery delivery = Delivery.builder()
                .user(user) // 사용자 식별자 설정
                .roomSeq(request.getRoomSeq()) // 채팅방 연결
                .storeName(request.getStoreName()) // 가게 이름 설정
                .pickupPlace(request.getPickupPlace()) // 픽업 장소 설정
                .pickupLat(request.getPickupLat()) // 픽업 장소 위도 설정
                .pickupLon(request.getPickupLon()) // 픽업 장소 경도 설정
                .deliveryTip(request.getDeliveryTip()) // 배달 팁 설정
                .deliveryTime(request.getDeliveryTime()) // 배달 시간 설정
                .content(request.getContent()) // 배달 내용 설정
                .count(1) // 초기 카운트 설정
                .status(Delivery.Status.OPEN) // 초기 상태 설정
                .createdAt(LocalDateTime.now()) // 생성 시간 설정
                .finishTime(LocalDateTime.now().plusHours(1)) // 종료 시간 설정
                .build();

        // Delivery 객체를 저장하고 응답 객체 생성
        return new DeliveryCreateResponse(deliveryRepository.save(delivery));
    }

    // 정산 연결
    @Transactional
    public void setParty(DeliverySerPartyRequest request) {
        Delivery delivery = deliveryRepository.findById(request.getDeliverySeq()).orElseThrow();
        delivery.updateParty(request.getPartySeq());
    }

    // 글 수정
    @Transactional
    public void modifyDelivery(DeliveryModifyRequest request) {
        Delivery delivery = deliveryRepository.findById(request.getDeliverySeq()).orElseThrow();
        delivery.updateDelivery(request);
    }

    // 글 삭제
    @Transactional
    public void deleteDelivery(Long deliverySeq) {
        Delivery delivery = deliveryRepository.findById(deliverySeq).orElseThrow();
        ChatRoom chatRoom = chatRoomRepository.findById(delivery.getRoomSeq()).orElseThrow();
        deliveryRepository.deleteById(deliverySeq);
        chatRoomRepository.delete(chatRoom);
    }

    // 공지사항 등록
    @Transactional
    public void createNotice(DeliveryNoticeCreateRequest request) {
        Delivery delivery = deliveryRepository.findById(request.getDeliverySeq()).orElseThrow();
        delivery.updateNotice(request.getNotice());
    }

    // 공지사항 수정
    @Transactional
    public void modifyNotice(DeliveryNoticeCreateRequest request) {
        Delivery delivery = deliveryRepository.findById(request.getDeliverySeq()).orElseThrow();
        delivery.updateNotice(request.getNotice());
    }

    // 공지사항 삭제
    @Transactional
    public void deleteNotice(Long deliverySeq) {
        Delivery delivery = deliveryRepository.findById(deliverySeq).orElseThrow();
        delivery.updateNotice(null);
    }

    // 배달 글 리스트 조회 (거리 기반)
    @Transactional
    public List<DeliverySelectResponse> getList(DeliveryListSelectRequest request) {
        if(request.getLat() == 0 || request.getLon() == 0) {
            return null;
        }
        List<Delivery> deliveryList = deliveryRepository.findAll();
        return deliveryList.stream()
                .map(delivery -> {
                    double distance = calculateDistance(request.getLat(), request.getLon(), delivery.getPickupLat(), delivery.getPickupLon());
                    if (distance <= distanceThreshold) { // 거리 범위를 1000m로 설정
                        return new DeliverySelectResponse(delivery, delivery.getUser());
                    } else {
                        return null;
                    }
                })
                .filter(Objects::nonNull) // null 값 필터링
                .collect(Collectors.toList());
    }

    // 배달 글 상세 조회
    @Transactional
    public DeliverySelectResponse getDetail(Long deliverySeq) {
        Delivery delivery = deliveryRepository.findById(deliverySeq).orElseThrow();
        return new DeliverySelectResponse(delivery, delivery.getUser());
    }

    // 배달 상태 변경
    @Transactional
    public void setStatus(DeliverySetStatusRequest request) {
        Delivery delivery = deliveryRepository.findById(request.getDeliverySeq()).orElseThrow();
        delivery.updateStatus(request.getStatus());
    }

    // 두 지점 간의 거리 계산 (단위: m)
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        } else {
            double theta = lon1 - lon2;
            double dist = Math.sin(Math.toRadians(lat1)) * Math.sin(Math.toRadians(lat2))
                    + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                    * Math.cos(Math.toRadians(theta));
            dist = Math.acos(dist);
            dist = Math.toDegrees(dist);
            dist = dist * 60 * 1.1515 * 1.609344;  // km 단위로 변환
            return (dist * 1000);  // m 단위로 변환
        }
    }

    @Transactional
    public DeliverySelectResponse selectByRoom(Long roomSeq) {
        Delivery delivery = deliveryRepository.findByRoomSeq(roomSeq);
        return new DeliverySelectResponse(delivery, delivery.getUser());
    }
}
