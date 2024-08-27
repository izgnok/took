package com.took.shop_api.service;

import com.took.chat_api.entity.ChatRoom;
import com.took.chat_api.repository.ChatRoomRepository;
import com.took.shop_api.dto.*;
import com.took.shop_api.entity.Shop;
import com.took.shop_api.entity.ShopGuest;
import com.took.shop_api.repository.ShopGuestRepository;
import com.took.shop_api.repository.ShopRepository;
import com.took.user_api.entity.MemberEntity;
import com.took.user_api.entity.PartyEntity;
import com.took.user_api.entity.UserEntity;
import com.took.user_api.repository.MemberRepository;
import com.took.user_api.repository.PartyRepository;
import com.took.user_api.repository.UserRepository;
import com.took.user_api.service.PartyService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ShopService {

    private final ShopRepository shopRepository;
    private final ShopGuestRepository shopGuestRepository;
    private final UserRepository userRepository;
    private final PartyService partyService;
    private final PartyRepository partyRepository;
    private final MemberRepository memberRepository;
    private final ChatRoomRepository chatRoomRepository;

    @Value("${distance.threshold}")
    private double distanceThreshold;

    @Transactional
    public AddShopResponseDto save(AddShopRequest request) {
        UserEntity user = userRepository.findById(request.getUserSeq()).orElseThrow();
        Shop shop = Shop.builder().user(user)
                .roomSeq(request.getRoomSeq())
                .title(request.getTitle())
                .content(request.getContent())
                .item(request.getItem())
                .site(request.getSite())
                .place(request.getPlace())
                .maxCount(request.getMaxCount())
                .lat(request.getLat())
                .lon(request.getLon())
                .build();
        shopRepository.save(shop);

        ShopGuest shopGuest = ShopGuest.builder().shop(shop).user(user).build();
        shopGuestRepository.save(shopGuest);

        return new AddShopResponseDto(shop);
    }

    @Transactional
    public List<ShopResponse> findShopsByIds(List<Long> id) {
        List<UserEntity> users = userRepository.findAllById(id);
        List<ShopResponse> shops = shopRepository.findByUserInAndStatus(users, Shop.statusType.OPEN)
                .stream()
                .map(shop -> {
                    // Shop 객체에서 직접 UserEntity 정보 가져오기
                    UserEntity user = shop.getUser();
                    return new ShopResponse(shop, user);
                })
                .collect(Collectors.toList());
        return shops;
    }

    @Transactional
    public ShopResponse findById(Long id) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("not found : " + id));
        UserEntity user = userRepository.findById(shop.getUser().getUserSeq()).orElseThrow();

        shop.updateHit(1);

        return new ShopResponse(shop, user);
    }

    @Transactional
    public void delete(Long id) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("not found : " + id));
        ChatRoom chatRoom = chatRoomRepository.findById(shop.getRoomSeq()).orElseThrow();
        shopRepository.deleteById(id);
        chatRoomRepository.delete(chatRoom);
    }

    @Transactional
    public void update(Long id, UpdateShopRequest request) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("not found : " + id));
        shop.update(request.getTitle(), request.getContent(), request.getItem(), request.getSite(), request.getPlace(), request.getMaxCount());
        if (shop.getMaxCount() <= shop.getCount()) {
            shop.updateStatus(Shop.statusType.IN_PROGRESS);
        } else {
            shop.updateStatus(Shop.statusType.OPEN);
        }
    }

    @Transactional
    public Shop updateStatus(Long id, UpdateStatusShopRequest request) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("not found : " + id));
        shop.updateStatus(request.getStatus());
        return shop;
    }

    @Transactional
    public boolean userEnterShop(AddShopGuest request) {
        Shop shop = shopRepository.findById(request.getShopSeq()).orElseThrow();
        UserEntity user = userRepository.findById(request.getUserSeq()).orElseThrow();
        ShopGuest shopGuest = shopGuestRepository.findByShopAndUser(shop, user);
        if (shopGuest == null) {
            if (shop.getMaxCount() > shop.getCount()) {
                shop.updateCount(1);
                shopGuest = ShopGuest.builder().
                        shop(shop).
                        user(user).
                        pickUp(false).
                        build();
                shopGuestRepository.save(shopGuest);

                if (shop.getCount() == shop.getMaxCount()) {
                    shop.updateStatus(Shop.statusType.IN_PROGRESS);
                }
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    }

    @Transactional
    public void exit(Long shopSeq, Long userSeq) {
        Shop shop = shopRepository.findById(shopSeq).orElseThrow();
        UserEntity user = userRepository.findById(userSeq).orElseThrow();
        shopGuestRepository.deleteByShopAndUser(shop, user);

        shop.updateCount(-1);
        shop.updateStatus(Shop.statusType.OPEN);
    }

    @Transactional
    public void pickUp(Long shopSeq, Long userSeq) {
        Shop shop = shopRepository.findById(shopSeq)
                .orElseThrow(() -> new IllegalArgumentException("not found : " + shopSeq));

        UserEntity user = userRepository.findById(userSeq).orElseThrow();
        ShopGuest shopGuest = shopGuestRepository.findByShopAndUser(shop, user);
        shopGuest.updatePickUp(true);

        PartyEntity party = partyRepository.findById(shop.getPartySeq()).orElseThrow();
        MemberEntity member = memberRepository.findByPartyAndUser(party, user);
        member.updateRecieve(true);

        if (!shopGuestRepository.existsByShopAndPickUpFalse(shop)) {
            shop.updateStatus(Shop.statusType.COMPLETED);
            partyService.deligonguHostRecieve(shop.getPartySeq(), shop.getUser().getUserSeq());
        }

    }

    @Transactional
    public boolean pickUpCheck(Long shopSeq) {
        Shop shop = shopRepository.findById(shopSeq).orElseThrow();
        List<ShopGuest> list = shopGuestRepository.findAllByShop(shop);
        for (ShopGuest shopGuest : list) {
            if (!shopGuest.isPickUp()) {
                return false;
            }
        }
        return true;
    }

    @Transactional
    public boolean findGuestsById(long userSeq, long shopSeq) {
        UserEntity user = userRepository.findById(userSeq).orElseThrow();
        Shop shop = shopRepository.findById(shopSeq).orElseThrow();
        ShopGuest shopGuest = shopGuestRepository.findByShopAndUser(shop, user);
        return shopGuest == null;
    }

    @Transactional
    public ShopResponse findShopByRoom(Long roomSeq) {
        Shop shop = shopRepository.findByRoomSeq(roomSeq)
                .orElseThrow(() -> new IllegalArgumentException("not found : " + roomSeq));
        UserEntity user = userRepository.findById(shop.getUser().getUserSeq()).orElseThrow();
        shop.updateHit(1);
        return new ShopResponse(shop, user);
    }


    @Transactional
    public List<ShopResponse> findShopsByUserId(Long id) {
        UserEntity user = userRepository.findById(id).orElseThrow();
        if(user.getLat() == 0 && user.getLon() == 0) {
            return null;
        }

        List<Shop> shops = shopRepository.findAll();
        return shops.stream()
                .map(shop -> {
                    double distance = calculateDistance(user.getLat(), user.getLon(), shop.getLat(), shop.getLon());
                    if (distance <= distanceThreshold) { // 거리 범위를 1000m로 설정
                        return new ShopResponse(shop, shop.getUser());
                    } else {
                        return null;
                    }
                })
                .filter(Objects::nonNull) // null 값 필터링
                .collect(Collectors.toList());
    }

    @Transactional
    public void setParty(ShopSetPartyRequest request) {
        Shop shop = shopRepository.findById(request.getShopSeq()).orElseThrow();
        shop.updateParty(request.getPartySeq());
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


}
