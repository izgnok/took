package com.took.taxi_api.service;

import com.took.taxi_api.dto.AllExpectCostRequest;
import com.took.taxi_api.dto.AllExpectCostResponse;
import com.took.taxi_api.dto.ExpectCostRequest;
import com.took.taxi_api.dto.ExpectCostResponse;
import com.took.util.ApiUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service // 이 클래스가 서비스 레이어의 빈으로 등록됨을 나타냅니다.
@RequiredArgsConstructor // Lombok을 사용하여 final 필드를 매개변수로 가지는 생성자를 자동으로 생성합니다.
public class KakaoNaviService {

    private final RestTemplate restTemplate; // RestTemplate을 사용하여 외부 API 호출을 처리합니다.

    private static final String URL = "https://apis-navi.kakaomobility.com/v1/waypoints/directions";

    /**
     * 예상 비용을 계산합니다.
     * @param request 예상 비용 계산을 위한 요청 데이터 (출발지와 도착지의 위도와 경도)
     * @return 예상 비용 응답 데이터 (택시 비용 + 톨 비용)
     */
    public ExpectCostResponse calculateCost(ExpectCostRequest request) {
        String kakaoApiKey = ApiUtil.getKakaoApiKey();
        HttpHeaders headers = createHeaders(kakaoApiKey);
        Map<String, Object> kakaoRequest = createKakaoRequest(request.getStartLon(), request.getStartLat(), request.getEndLon(), request.getEndLat(), new ArrayList<>());

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(kakaoRequest, headers);
        ResponseEntity<Map> response = restTemplate.exchange(URL, HttpMethod.POST, entity, Map.class);

        Long totalCost = extractTotalCost(response.getBody());
        return new ExpectCostResponse(totalCost);
    }

    /**
     * 모든 사용자의 예상 비용을 계산합니다.
     * @param request 경로와 사용자들의 비용 정보가 담긴 요청 데이터
     * @return 사용자들의 비용 정보가 담긴 응답 데이터
     */
    public AllExpectCostResponse calculateAllCost(AllExpectCostRequest request) {
        String kakaoApiKey = ApiUtil.getKakaoApiKey();
        HttpHeaders headers = createHeaders(kakaoApiKey);

        List<Map<String, Object>> waypoints = new ArrayList<>();
        for (int i = 1; i < request.getLocations().size() - 1; i++) {
            waypoints.add(createWaypoint(request.getLocations().get(i).getLon(), request.getLocations().get(i).getLat()));
        }

        Map<String, Object> kakaoRequest = createKakaoRequest(
                request.getLocations().get(0).getLon(),
                request.getLocations().get(0).getLat(),
                request.getLocations().get(request.getLocations().size() - 1).getLon(),
                request.getLocations().get(request.getLocations().size() - 1).getLat(),
                waypoints
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(kakaoRequest, headers);
        ResponseEntity<Map> response = restTemplate.exchange(URL, HttpMethod.POST, entity, Map.class);

        Long totalCost = extractTotalCost(response.getBody());
        int distance = extractDistance(response.getBody());
        int duration = extractDuration(response.getBody());
        return distributeCost(request.getUsers(), totalCost, distance, duration);
    }

    /**
     * 사용자들의 비용을 분배합니다.
     * @param users 사용자 정보 리스트
     * @param totalCost 총 비용
     * @param distance 총 거리
     * @param duration 총 시간
     * @return 분배된 비용 정보가 담긴 응답 데이터
     */
    private AllExpectCostResponse distributeCost(List<AllExpectCostRequest.User> users, Long totalCost, int distance, int duration) {
        AllExpectCostResponse response = new AllExpectCostResponse();
        List<AllExpectCostResponse.User> userCostList = new ArrayList<>();

        long totalUserCost = users.stream().mapToLong(AllExpectCostRequest.User::getCost).sum();
    
        // 예상 비용 비율별 , 결제 예상 비용 계산
        for (AllExpectCostRequest.User user : users) {
            Long userCost = user.getCost();
            Long proportionateCost = Math.round(((double) userCost / totalUserCost) * totalCost);

            AllExpectCostResponse.User userCostResponse = new AllExpectCostResponse.User();
            userCostResponse.setUserSeq(user.getUserSeq());
            userCostResponse.setCost(proportionateCost);
            userCostList.add(userCostResponse);
        }

        response.setAllCost(totalCost);
        response.setDistance(distance / 1000.0);
        response.setDuration(duration / 60);
        response.setUsers(userCostList);
        return response;
    }

    /**
     * 응답 데이터에서 총 비용을 추출합니다.
     * @param responseBody 카카오 네비게이션 API의 응답 데이터
     * @return 총 비용 (택시 비용 + 톨 비용)
     */
    private Long extractTotalCost(Map<String, Object> responseBody) {
        Map<String, Object> route = ((List<Map<String, Object>>) responseBody.get("routes")).get(0);
        Map<String, Object> summary = (Map<String, Object>) route.get("summary");
        Map<String, Object> fare = (Map<String, Object>) summary.get("fare");

        int taxiCost = (int) fare.get("taxi");
        int tollCost = (int) fare.get("toll");

        return (long) taxiCost + (long) tollCost;
    }

    /**
     * 응답 데이터에서 총 거리를 추출합니다.
     * @param responseBody 카카오 네비게이션 API의 응답 데이터
     * @return 총 거리 (미터 단위)
     */
    private int extractDistance(Map<String, Object> responseBody) {
        Map<String, Object> route = ((List<Map<String, Object>>) responseBody.get("routes")).get(0);
        Map<String, Object> summary = (Map<String, Object>) route.get("summary");

        return (Integer) summary.get("distance");
    }

    /**
     * 응답 데이터에서 총 시간을 추출합니다.
     * @param responseBody 카카오 네비게이션 API의 응답 데이터
     * @return 총 시간 (초 단위)
     */
    private int extractDuration(Map<String, Object> responseBody) {
        Map<String, Object> route = ((List<Map<String, Object>>) responseBody.get("routes")).get(0);
        Map<String, Object> summary = (Map<String, Object>) route.get("summary");

        return (Integer) summary.get("duration");
    }

    /**
     * HTTP 헤더를 생성합니다.
     * @return 설정된 HTTP 헤더
     */
    private HttpHeaders createHeaders(String kakaoApiKey) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + kakaoApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    /**
     * 카카오 네비게이션 API 요청 데이터를 생성합니다.
     * @param startLon 출발지 경도
     * @param startLat 출발지 위도
     * @param endLon 도착지 경도
     * @param endLat 도착지 위도
     * @param waypoints 경유지 리스트
     * @return 생성된 요청 데이터
     */
    private Map<String, Object> createKakaoRequest(double startLon, double startLat, double endLon, double endLat, List<Map<String, Object>> waypoints) {
        Map<String, Object> origin = new HashMap<>();
        origin.put("x", String.valueOf(startLon));
        origin.put("y", String.valueOf(startLat));

        Map<String, Object> destination = new HashMap<>();
        destination.put("x", String.valueOf(endLon));
        destination.put("y", String.valueOf(endLat));

        Map<String, Object> kakaoRequest = new HashMap<>();
        kakaoRequest.put("origin", origin);
        kakaoRequest.put("destination", destination);
        kakaoRequest.put("waypoints", waypoints);
        kakaoRequest.put("summary", true);
        kakaoRequest.put("alternatives", true);
        return kakaoRequest;
    }

    /**
     * 경유지를 생성합니다.
     * @param lon 경유지 경도
     * @param lat 경유지 위도
     * @return 생성된 경유지
     */
    private Map<String, Object> createWaypoint(double lon, double lat) {
        Map<String, Object> waypoint = new HashMap<>();
        waypoint.put("x", String.valueOf(lon));
        waypoint.put("y", String.valueOf(lat));
        return waypoint;
    }
}
