package com.took.positionsave_api.controller;

import com.took.positionsave_api.dto.PositionCreateRequest;
import com.took.positionsave_api.dto.PositionSelectResponse;
import com.took.positionsave_api.dto.PositionUserListRequest;
import com.took.positionsave_api.dto.PositionUserListResponse;
import com.took.positionsave_api.service.PositionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/position")
@RequiredArgsConstructor
public class PositionController {

    private final PositionService positionService;  // PositionService 객체를 주입받음

    /**
     * 위치 정보를 저장하는 API 엔드포인트
     * POST /api/position/save
     *
     * @param request 위치 정보를 담은 요청 객체 (PositionCreateRequest)
     * @return HTTP 상태 코드 204 No Content 응답
     */
    @PostMapping("/save")
    @Operation(summary = "위치 정보 저장", description = "위치 정보를 저장합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "위치 정보 저장 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    public ResponseEntity<?> savePosition(
            @Parameter(description = "저장할 위치 정보를 담은 요청 객체")
            @RequestBody PositionCreateRequest request
    ) {
        positionService.savePosition(request);  // PositionService를 통해 위치 정보 저장
        return ResponseEntity.noContent().build();  // HTTP 204 No Content 응답 반환
    }

    /**
     * 특정 사용자의 위치 정보를 조회하는 API 엔드포인트
     * GET /api/position/{userId}
     *
     * @param userSeq 조회할 사용자의 인덱스번호
     * @return HTTP 상태 코드 200 OK와 조회된 위치 정보를 담은 응답 객체 (PositionSelectResponse)
     */
    @GetMapping("/{userSeq}")
    @Operation(summary = "사용자 위치 정보 조회", description = "특정 사용자의 위치 정보를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "위치 정보 조회 성공", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = PositionSelectResponse.class))),
            @ApiResponse(responseCode = "404", description = "사용자 위치 정보 없음")
    })
    public ResponseEntity<PositionSelectResponse> getPosition(
            @Parameter(description = "조회할 사용자의 인덱스번호")
            @PathVariable(name = "userSeq") Long userSeq
    ) {
        PositionSelectResponse position = positionService.getPosition(userSeq);  // PositionService를 통해 위치 정보 조회
        return ResponseEntity.ok(position);  // HTTP 200 OK와 조회된 위치 정보 반환
    }

    /**
     * 근처 사용자 목록을 조회하는 API 엔드포인트
     * POST /api/position/nearby
     *
     * @param request 근처 사용자 조회 요청 객체 (PositionUserListRequest)
     * @return HTTP 상태 코드 200 OK와 근처 사용자 목록을 담은 응답 객체 (List<PositionUserListResponse>)
     */
    @PostMapping("/nearby")
    @Operation(summary = "근처 사용자 목록 조회", description = "주어진 위치를 기준으로 근처 사용자 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "근처 사용자 목록 조회 성공", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = PositionUserListResponse.class, type = "array"))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    public ResponseEntity<List<PositionUserListResponse>> getNearbyUsers(
            @Parameter(description = "근처 사용자 조회 요청 객체")
            @RequestBody PositionUserListRequest request
    ) {
        List<PositionUserListResponse> list = positionService.getNearbyUsers(request);
        return ResponseEntity.ok(list);
    }
}
