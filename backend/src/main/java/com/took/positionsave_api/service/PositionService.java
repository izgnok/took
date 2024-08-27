package com.took.positionsave_api.service;

import com.took.positionsave_api.dto.PositionCreateRequest;
import com.took.positionsave_api.dto.PositionSelectResponse;
import com.took.positionsave_api.dto.PositionUserListRequest;
import com.took.positionsave_api.dto.PositionUserListResponse;
import com.took.positionsave_api.entity.Position;
import com.took.positionsave_api.repository.PositionRepository;
import com.took.user_api.entity.UserEntity;
import com.took.user_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PositionService {

    private final PositionRepository positionRepository;
    private final UserRepository userRepository;

    @Value("${distance.threshold}")
    private double distanceThreshold;

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
     * 위치 정보를 저장하는 메서드
     *
     * @param request 위치 정보를 담은 요청 객체 (PositionCreateRequest)
     */
    public void savePosition(PositionCreateRequest request) {
        // Position 객체 생성
        Position position = Position.builder()
                .userSeq(String.valueOf(request.getUserSeq()))  // request에서 userId 가져옴
                .lat(request.getLat())        // request에서 위도 가져옴
                .lon(request.getLon())        // request에서 경도 가져옴
                .expiration(30L)            // TTL 값 설정 (30초)
                .build();

        positionRepository.save(position);  // Position 저장
    }

    /**
     * 특정 사용자의 위치 정보를 조회하는 메서드
     *
     * @param userSeq 조회할 사용자의 인덱스번호
     * @return 조회된 위치 정보를 담은 응답 객체 (PositionSelectResponse)
     */
    public PositionSelectResponse getPosition(Long userSeq) {
        Position position = positionRepository.findByUserSeq(String.valueOf(userSeq)).orElse(null);  // PositionRepository를 통해 userId로 위치 정보 조회
        if (position == null) {
            return null;  // 위치 정보가 없을 경우, null 반환 (또는 NotFoundException throw 또는 적절히 처리)
        }
        return new PositionSelectResponse(position);  // 조회된 위치 정보를 PositionSelectResponse 객체로 변환하여 반환
    }

    /**
     * 일정 거리 이내의 유저 리스트를 반환하는 메서드
     *
     * @param request 현재 유저의 위치 정보를 담은 요청 객체 (PositionUserListRequest)
     * @return 일정 거리 이내의 유저 리스트 (PositionUserListResponse)
     */
    public List<PositionUserListResponse> getNearbyUsers(PositionUserListRequest request) {
        if(request.getLat() == 0 || request.getLon() == 0) {
            return null;
        }
        List<Position> allUsers = (List<Position>) positionRepository.findAll();

        return allUsers.stream()
                .filter(Objects::nonNull)
                .map(user -> {
                    // userSeq가 null인지 확인
                    if (user.getUserSeq() != null && !user.getUserSeq().trim().isEmpty()) {
                        double distance = calculateDistance(
                                request.getLat(), request.getLon(),
                                user.getLat(), user.getLon());
                        if (distance <= distanceThreshold) { // 거리 범위를 1000m로 설정
                            PositionUserListResponse response = new PositionUserListResponse();
                            // userSeq를 Long으로 변환
                            response.setUserSeq(Long.valueOf(user.getUserSeq()));
                            response.setDistance((int) distance); // 거리 차이를 미터 단위로 설정

                            // userSeq로 userName과 imageNo를 userRepository에서 찾음
                            UserEntity userDetails = userRepository.findById(Long.valueOf(user.getUserSeq())).orElse(null);
                            if (userDetails != null) {
                                response.setUserName(userDetails.getUserName());
                                response.setImageNo(userDetails.getImageNo());
                            }
                            return response;
                        }
                    }
                    return null; // userSeq가 null인 경우 또는 거리가 1000m를 초과하는 경우
                })
                .filter(Objects::nonNull) // null 값 필터링
                .collect(Collectors.toList());
    }
}