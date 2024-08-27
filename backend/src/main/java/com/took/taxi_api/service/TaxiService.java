package com.took.taxi_api.service;

import com.took.taxi_api.dto.*;
import com.took.taxi_api.entity.Taxi;
import com.took.taxi_api.entity.TaxiGuest;
import com.took.taxi_api.repository.TaxiGuestRepository;
import com.took.taxi_api.repository.TaxiRepository;
import com.took.user_api.entity.UserEntity;
import com.took.user_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service  // 이 클래스가 서비스 레이어의 빈으로 등록됨을 나타냅니다.
@RequiredArgsConstructor  // Lombok을 사용하여 모든 final 필드를 매개변수로 가지는 생성자를 자동으로 생성합니다.
public class TaxiService {

    private final TaxiRepository taxiRepository;  // TaxiRepository를 통해 데이터베이스 작업을 처리합니다.
    private final TaxiGuestRepository taxiGuestRepository;
    private final UserRepository userRepository;

    @Value("${distance.threshold}")
    private double distanceThreshold;


    /**
     * 새로운 Taxi 엔티티를 생성하고 데이터베이스에 저장합니다.
     *
     * @param request TaxiCreateRequest 객체로, 택시 생성에 필요한 정보를 담고 있습니다.
     */
    @Transactional
    public TaxiSelectResponse createTaxi(TaxiCreateRequest request) {
        UserEntity user = userRepository.findById(request.getUserSeq()).orElseThrow();
        // Taxi 엔티티를 빌더 패턴을 사용하여 생성합니다.
        Taxi taxi = Taxi.builder()
                .gender(request.isGender())  // 성별 여부 설정
                .count(0)  // 현재 인원 수를 0로 설정
                .max(request.getMax() + 1)  // 최대 인원 수 설정
                .status(Taxi.Status.OPEN)  // 상태를 OPEN으로 설정
                .createdAt(LocalDateTime.now())  // 생성 일시를 현재 시간으로 설정
                .finishTime(LocalDateTime.now().plusHours(1))  // 종료 일시에 현재 시간에서 1시간을 더한 값으로 설정
                .master(request.getUserSeq())  // 결제자 설정
                .roomSeq(request.getRoomSeq())  // 채팅방 참조 설정
                .user(user)  // 작성자 설정
                .writeLat(request.getLat())  // 작성한 위도 설정
                .writeLon(request.getLon())  // 작성한 경도 설정
                .build();
        // 생성된 Taxi 엔티티를 데이터베이스에 저장합니다.
        Taxi response = taxiRepository.save(taxi);
        return new TaxiSelectResponse(response);
    }

    /**
     * 특정 사용자들의 택시 목록을 조회합니다.
     *
     * @param request TaxiListSelectRequest 객체로, 택시 목록 조회에 필요한 정보를 담고 있습니다.
     * @return 사용자들의 택시 목록
     */
    @Transactional
    public List<TaxiSelectResponse> listTaxi(TaxiListSelectRequest request) {
        if(request.getLat() == 0 || request.getLon() == 0) {
            return null;
        }
        List<Taxi> taxis = taxiRepository.findAll();
        return taxis.stream()
                .map(taxi -> {
                    double distance = calculateDistance(taxi.getWriteLat(), taxi.getWriteLon(), request.getLat(), request.getLon());
                    if (distance <= distanceThreshold) { // 거리 범위를 1000m로 설정
                        return new TaxiSelectResponse(taxi);
                    } else {
                        return null;
                    }
                })
                .filter(Objects::nonNull) // null 값 필터링
                .collect(Collectors.toList());
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

    /**
     * 특정 택시를 삭제합니다.
     *
     * @param taxiSeq 삭제할 택시의 번호
     */
    @Transactional
    public void deleteTaxi(Long taxiSeq) {
        taxiRepository.deleteById(taxiSeq);
    }

    /**
     * 특정 택시의 정보를 조회합니다.
     *
     * @param taxiSeq 조회할 택시의 번호
     * @return 조회된 택시의 정보
     */
    @Transactional
    public TaxiSelectResponse getTaxi(Long taxiSeq) {
        Taxi taxi = taxiRepository.findById(taxiSeq).orElseThrow();
        return new TaxiSelectResponse(taxi);
    }

    /**
     * 택시 정보를 업데이트합니다.
     *
     * @param request TaxiSetRequest 객체로, 택시 정보 업데이트에 필요한 정보를 담고 있습니다.
     */
    @Transactional
    public void setTaxi(TaxiSetRequest request) {
        Taxi taxi = taxiRepository.findById(request.getTaxiSeq()).orElseThrow();
        taxi.updateTaxi(request.getMaster(), request.getMax(), request.isGender());
        if (taxi.getMax() <= taxi.getCount()) {
            taxi.updateStatus(Taxi.Status.FILLED);
        } else {
            taxi.updateStatus(Taxi.Status.OPEN);
        }
    }

    /**
     * 택시의 상태를 업데이트합니다.
     *
     * @param request TaxiStatusRequest 객체로, 택시 상태 업데이트에 필요한 정보를 담고 있습니다.
     */
    @Transactional
    public void statusTaxi(TaxiStatusRequest request) {
        Taxi taxi = taxiRepository.findById(request.getTaxiSeq()).orElseThrow();
        taxi.updateStatus(Taxi.Status.valueOf(request.getStatus()));
    }

    /**
     * 택시 출발 정보를 설정합니다.
     *
     * @param request TaxiStartRequest 객체로, 택시 출발 정보 설정에 필요한 정보를 담고 있습니다.
     */
    @Transactional
    public void startTaxi(TaxiStartRequest request) {
        Taxi taxi = taxiRepository.findById(request.getTaxiSeq()).orElseThrow();
        taxi.updateStart(request.getStartLat(), request.getStartLon());
    }

    @Transactional
    /*
      택시의 예상or실제 비용을 설정합니다.
      @param request TaxiSetCostRequest 객체로, 택시 비용 설정에 필요한 정보를 담고 있습니다.
     */
    public void setCost(TaxiSetCostRequest request) {
        Taxi taxi = taxiRepository.findById(request.getTaxiSeq()).orElseThrow();
        taxi.updateCost(request.getCost());
    }


    /**
     * 최종 결제 비용을 계산하고 사용자별로 분배합니다.
     *
     * @param request TaxiFinalCostRequest 객체로, 최종 결제 비용 계산에 필요한 정보를 담고 있습니다.
     * @return 사용자별 최종 결제 비용 응답 데이터
     */
    @Transactional
    public TaxiFinalCostResponse finalCost(TaxiFInalCostRequest request) {
        Taxi taxi = taxiRepository.findById(request.getTaxiSeq()).orElseThrow();
        taxi.updateCost(request.getAllCost());

        TaxiFinalCostResponse response = new TaxiFinalCostResponse();
        List<TaxiFinalCostResponse.User> userList = new ArrayList<>();
        long totalUserCost = request.getUsers().stream().mapToLong(TaxiFInalCostRequest.User::getCost).sum();

        // 결제 비용 계산
        for (TaxiFInalCostRequest.User user : request.getUsers()) {
            Long userCost = user.getCost();
            Long proportionateCost = Math.round(((double) userCost / totalUserCost) * request.getAllCost());

            TaxiFinalCostResponse.User userCostResponse = new TaxiFinalCostResponse.User();
            userCostResponse.setUserSeq(user.getUserSeq());
            userCostResponse.setCost(proportionateCost);
            userList.add(userCostResponse);
        }

        response.setUsers(userList);
        return response;
    }

    // 정산방 연결
    @Transactional
    public void setParty(TaxiSetPartyRequest request) {
        Taxi taxi = taxiRepository.findById(request.getTaxiSeq()).orElseThrow();
        taxi.updateParty(request.getPartySeq());
    }

    // 참가중인 택시방
    @Transactional
    public TaxiSelectResponse getJoinedTaxi(Long userSeq) {
        UserEntity user = userRepository.findById(userSeq).orElseThrow();
        TaxiGuest guest = taxiGuestRepository.findByUser(user);
        Taxi taxi = taxiRepository.findById(guest.getTaxi().getTaxiSeq()).orElseThrow();
        return new TaxiSelectResponse(taxi);
    }

    // 해당 채팅방의 택시 정보
    @Transactional
    public TaxiSelectResponse selectByRoom(Long roomSeq) {
        Taxi taxi = taxiRepository.findByRoomSeq(roomSeq);
        return new TaxiSelectResponse(taxi);
    }
}
