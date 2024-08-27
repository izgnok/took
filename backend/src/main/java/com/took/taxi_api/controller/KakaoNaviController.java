package com.took.taxi_api.controller;

import com.took.taxi_api.dto.AllExpectCostRequest;
import com.took.taxi_api.dto.AllExpectCostResponse;
import com.took.taxi_api.dto.ExpectCostRequest;
import com.took.taxi_api.dto.ExpectCostResponse;
import com.took.taxi_api.service.KakaoNaviService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/navi")
@Tag(name = "카카오 내비 API", description = "카카오 내비를 사용한 예상 비용 계산 API입니다.")
public class KakaoNaviController {

    private final KakaoNaviService kakaoNaviService;

    @Operation(summary = "예상 비용 계산", description = "출발지와 도착지의 위도와 경도를 기반으로 예상 비용을 계산합니다.")
    @PostMapping("/expect")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "예상 비용 계산 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    public ResponseEntity<ExpectCostResponse> calculateCost(
            @RequestBody @Parameter(description = "예상 비용 계산 요청 데이터", required = true) ExpectCostRequest request) {
        ExpectCostResponse response = kakaoNaviService.calculateCost(request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "모든 사용자의 예상 비용 계산", description = "모든 사용자의 경로와 비용 정보를 기반으로 예상 비용을 계산합니다.")
    @PostMapping("/expect/all")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "모든 사용자의 예상 비용 계산 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    public ResponseEntity<AllExpectCostResponse> calculateAllCost(
            @RequestBody @Parameter(description = "모든 사용자의 예상 비용 계산 요청 데이터", required = true) AllExpectCostRequest request) {
        AllExpectCostResponse response = kakaoNaviService.calculateAllCost(request);
        return ResponseEntity.ok(response);
    }
}
