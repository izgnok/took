package com.took.delivery_api.service;

import com.took.delivery_api.dto.*;
import com.took.delivery_api.entity.Delivery;
import com.took.delivery_api.entity.DeliveryGuest;
import com.took.delivery_api.repository.DeliveryGuestRepository;
import com.took.delivery_api.repository.DeliveryRepository;
import com.took.user_api.entity.MemberEntity;
import com.took.user_api.entity.PartyEntity;
import com.took.user_api.entity.UserEntity;
import com.took.user_api.repository.MemberRepository;
import com.took.user_api.repository.PartyRepository;
import com.took.user_api.repository.UserRepository;
import com.took.user_api.service.PartyService;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class DeliveryGuestService {

    private final DeliveryRepository deliveryRepository;
    private final DeliveryGuestRepository deliveryGuestRepository;
    private final UserRepository userRepository;
    private final PartyService partyService;
    private final MemberRepository memberRepository;
    private final PartyRepository partyRepository;


    // 파티 참가
    @Transactional
    public void joinParty(DeliveryGuestCreateRequest request) {
        Delivery delivery = deliveryRepository.findById(request.getDeliverySeq()).orElseThrow();
        UserEntity user = userRepository.findById(request.getUserSeq()).orElseThrow();
        deliveryGuestRepository.save(DeliveryGuest.builder()
                .delivery(delivery)
                .user(user)
                .pickUp(false)
                .build());

        delivery.updateCount(1);
    }

    // 파티 퇴장
    @Transactional
    public void leaveParty(DeliveryGuestDeleteRequest request) {
        deliveryGuestRepository.deleteById(request.getDeliveryGuestSeq());
        Delivery delivery = deliveryRepository.findById(request.getDeliverySeq()).orElseThrow();
        delivery.updateCount(-1);
    }

    // 파티 참가자 리스트
    @Transactional
    public List<DeliveryGuestSelectResponse> getGuestList(Long deliverySeq) {
        Delivery delivery = deliveryRepository.findById(deliverySeq).orElseThrow();
        List<DeliveryGuest> deliveryGuests = deliveryGuestRepository.findAllByDelivery(delivery);
        return deliveryGuests.stream()
                .map(DeliveryGuestSelectResponse::new)
                .toList();
    }

    // 파티 참가자 조회
    @Transactional
    public DeliveryGuestSelectResponse getGuest(Long deliveryGuestSeq) {
        DeliveryGuest deliveryGuest = deliveryGuestRepository.findById(deliveryGuestSeq).orElseThrow();
        return new DeliveryGuestSelectResponse(deliveryGuest);
    }
    
    // 배달 픽업 여부 변경
    @Transactional
    public void setPickUp(Long deliveryGuestSeq) {
        DeliveryGuest deliveryGuest = deliveryGuestRepository.findById(deliveryGuestSeq).orElseThrow();
        deliveryGuest.updatePickUp(true);

        Delivery delivery = deliveryRepository.findById(deliveryGuest.getDelivery().getDeliverySeq()).orElseThrow();
        PartyEntity party = partyRepository.findById(delivery.getPartySeq()).orElseThrow();
        UserEntity user = userRepository.findById(deliveryGuest.getUser().getUserSeq()).orElseThrow();
        MemberEntity member = memberRepository.findByPartyAndUser(party, user);
        member.updateRecieve(true);

        if(!deliveryGuestRepository.existsByDeliveryAndPickUpFalse(delivery)) {
            delivery.updateStatus(String.valueOf(Delivery.Status.DONE));
            partyService.deligonguHostRecieve(delivery.getPartySeq(), delivery.getUser().getUserSeq());
        }
    }

    // 해당 방 참가 여부
    @Transactional
    public boolean isJoin(DeliveryGuestIsJoinRequest request) {
        Delivery delivery = deliveryRepository.findById(request.getDeliverySeq()).orElseThrow();
        UserEntity user = userRepository.findById(request.getUserSeq()).orElseThrow();
        DeliveryGuest deliveryGuest = deliveryGuestRepository.findByDeliveryAndUser(delivery,user);
        return deliveryGuest != null;
    }
    
    // 참가중인 방 목록
    @Transactional
    public List<DeliverySelectResponse> getJoinList(Long userSeq) {
        UserEntity user = userRepository.findById(userSeq).orElseThrow();

        List<DeliveryGuest> deliveryGuests = deliveryGuestRepository.findAllByUser(user);

        // deliveryGuests의 delivery에서 deliverySeq만 뽑아서 리스트로 만들기
        List<Long> deliverySeqs = deliveryGuests.stream()
                .map(deliveryGuest -> deliveryGuest.getDelivery().getDeliverySeq())
                .collect(Collectors.toList());

        List<Delivery> deliveries = deliveryRepository.findByDeliverySeqIn(deliverySeqs);

        return deliveries.stream()
                .map(delivery -> new DeliverySelectResponse(delivery, delivery.getUser()))
                .collect(Collectors.toList());
    }
}
