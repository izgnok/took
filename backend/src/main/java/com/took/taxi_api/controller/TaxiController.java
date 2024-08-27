package com.took.taxi_api.controller;

import com.took.taxi_api.dto.*;
import com.took.taxi_api.service.TaxiGuestService;
import com.took.taxi_api.service.TaxiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/taxi")
@Tag(name = "택시 API", description = "택시 관련 API입니다.")
public class TaxiController {

    private final TaxiService taxiService;  // 택시 서비스
    private final TaxiGuestService taxiGuestService;  // 택시 게스트 서비스

    @Operation(summary = "택시 생성", description = "새로운 택시를 생성합니다.")
    @PostMapping("/create")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "택시 생성 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    ResponseEntity<TaxiSelectResponse> createTaxi(
            @RequestBody @Parameter(description = "택시 생성 요청 데이터", required = true) TaxiCreateRequest request) {
        TaxiSelectResponse response = taxiService.createTaxi(request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "택시 목록 조회", description = "택시 목록을 조회합니다.")
    @PostMapping("/list")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "택시 목록 조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    ResponseEntity<List<TaxiSelectResponse>> listTaxi(
            @RequestBody @Parameter(description = "택시 목록 조회 요청 데이터", required = true) TaxiListSelectRequest request) {
        List<TaxiSelectResponse> taxis = taxiService.listTaxi(request);
        return ResponseEntity.ok(taxis);
    }

    @Operation(summary = "특정 택시 조회", description = "특정 택시를 조회합니다.")
    @GetMapping("/{taxiSeq}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "특정 택시 조회 성공"),
            @ApiResponse(responseCode = "404", description = "택시를 찾을 수 없음")
    })
    ResponseEntity<TaxiSelectResponse> getTaxi(
            @PathVariable @Parameter(description = "택시 식별 번호", required = true) Long taxiSeq) {
        TaxiSelectResponse taxi = taxiService.getTaxi(taxiSeq);
        return ResponseEntity.ok(taxi);
    }

    @Operation(summary = "참가 중인 택시 조회", description = "사용자가 참가 중인 택시를 조회합니다.")
    @GetMapping("/joined/{userSeq}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "참가 중인 택시 조회 성공"),
            @ApiResponse(responseCode = "404", description = "참가 중인 택시를 찾을 수 없음")
    })
    ResponseEntity<TaxiSelectResponse> getJoinedTaxi(
            @PathVariable @Parameter(description = "사용자 식별 번호", required = true) Long userSeq) {
        TaxiSelectResponse taxi = taxiService.getJoinedTaxi(userSeq);
        return ResponseEntity.ok(taxi);
    }

    @Operation(summary = "택시 정보 업데이트", description = "택시 정보를 업데이트합니다.")
    @PutMapping("/set")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "택시 정보 업데이트 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    public ResponseEntity<?> updateTaxi(
            @RequestBody @Parameter(description = "택시 정보 업데이트 요청 데이터", required = true) TaxiSetRequest request) {
        taxiService.setTaxi(request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "택시 상태 변경", description = "택시 상태를 변경합니다.")
    @PutMapping("/status")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "택시 상태 변경 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    public ResponseEntity<?> statusTaxi(
            @RequestBody @Parameter(description = "택시 상태 변경 요청 데이터", required = true) TaxiStatusRequest request) {
        taxiService.statusTaxi(request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "택시 시작", description = "택시를 시작합니다.")
    @PutMapping("/start")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "택시 시작 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    public ResponseEntity<?> startTaxi(
            @RequestBody @Parameter(description = "택시 시작 요청 데이터", required = true) TaxiStartRequest request) {
        taxiService.startTaxi(request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "택시 삭제", description = "택시를 삭제합니다.")
    @DeleteMapping("/delete/{taxiSeq}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "택시 삭제 성공"),
            @ApiResponse(responseCode = "404", description = "택시를 찾을 수 없음")
    })
    ResponseEntity<?> deleteTaxi(
            @PathVariable @Parameter(description = "택시 식별 번호", required = true) Long taxiSeq) {
        taxiService.deleteTaxi(taxiSeq);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "택시 총 결제 금액 저장", description = "택시 총 결제 금액(예상 또는 실제)을 저장합니다.")
    @PutMapping("/setCost")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "택시 총 결제 금액 저장 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    ResponseEntity<?> setCost(
            @RequestBody @Parameter(description = "택시 총 결제 금액 요청 데이터", required = true) TaxiSetCostRequest request) {
        taxiService.setCost(request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "최종 비용 계산", description = "택시의 최종 비용을 계산합니다.")
    @PostMapping("/finalCost")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "최종 비용 계산 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    ResponseEntity<TaxiFinalCostResponse> finalCost(
            @RequestBody @Parameter(description = "택시 최종 비용 요청 데이터", required = true) TaxiFInalCostRequest request) {
        TaxiFinalCostResponse response = taxiService.finalCost(request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "정산방 연결", description = "택시의 정산방을 연결합니다.")
    @PutMapping("/setParty")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "정산방 연결 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    ResponseEntity<?> setParty(
            @RequestBody @Parameter(description = "정산방 연결 요청 데이터", required = true) TaxiSetPartyRequest request) {
        taxiService.setParty(request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "게스트 추가", description = "택시에 게스트를 추가합니다.")
    @PostMapping("/guest/create")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "게스트 추가 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    ResponseEntity<?> joinGuest(
            @RequestBody @Parameter(description = "게스트 추가 요청 데이터", required = true) GuestCreateRequest request) {
        taxiGuestService.joinGuest(request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "게스트 삭제", description = "택시에서 게스트를 삭제합니다.")
    @PostMapping("/guest/delete")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "게스트 삭제 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    ResponseEntity<?> deleteGuest(
            @RequestBody @Parameter(description = "게스트 삭제 요청 데이터", required = true) GuestDeleteRequest request) {
        taxiGuestService.deleteGuest(request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "특정 게스트 조회", description = "특정 게스트를 조회합니다.")
    @GetMapping("/guest/{guestSeq}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "특정 게스트 조회 성공"),
            @ApiResponse(responseCode = "404", description = "게스트를 찾을 수 없음")
    })
    ResponseEntity<GuestSelectResponse> getGuest(
            @PathVariable @Parameter(description = "사용자 식별 번호", required = true) Long guestSeq) {
        GuestSelectResponse guest = taxiGuestService.getGuest(guestSeq);
        return ResponseEntity.ok(guest);
    }

    @Operation(summary = "특정 택시의 모든 게스트 조회", description = "특정 택시의 모든 게스트를 조회합니다.")
    @GetMapping("/guests/{taxiSeq}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "모든 게스트 조회 성공"),
            @ApiResponse(responseCode = "404", description = "택시를 찾을 수 없음")
    })
    ResponseEntity<List<GuestSelectResponse>> getGuests(
            @PathVariable @Parameter(description = "택시 식별 번호", required = true) Long taxiSeq) {
        List<GuestSelectResponse> guests = taxiGuestService.getGuests(taxiSeq);
        return ResponseEntity.ok(guests);
    }

    @Operation(summary = "택시 경로 조회", description = "택시의 경로를 조회합니다.")
    @GetMapping("/path/{taxiSeq}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "택시 경로 조회 성공"),
            @ApiResponse(responseCode = "404", description = "택시를 찾을 수 없음")
    })
    ResponseEntity<List<DestinationListResponse>> getDestinations(
            @PathVariable @Parameter(description = "택시 식별 번호", required = true) Long taxiSeq) {
        List<DestinationListResponse> list = taxiGuestService.getDestinations(taxiSeq);
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "택시파티 목적지 다음 순위 조회", description = "택시파티의 목적지 다음 순위를 조회합니다.")
    @GetMapping("/rank/{taxiSeq}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "택시파티 목적지 다음 순위 조회 성공"),
            @ApiResponse(responseCode = "404", description = "택시를 찾을 수 없음")
    })
    ResponseEntity<?> getRank(
            @PathVariable @Parameter(description = "택시 식별 번호", required = true) Long taxiSeq) {
        int rank = taxiGuestService.getRank(taxiSeq);
        return ResponseEntity.ok(rank);
    }

    @Operation(summary = "탑승 여부 확인", description = "사용자가 탑승 중인지 확인합니다.")
    @GetMapping("/isJoined/{userSeq}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "탑승 여부 확인 성공"),
            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음")
    })
    public ResponseEntity<?> isJoined(
            @PathVariable @Parameter(description = "사용자 식별 번호", required = true) Long userSeq) {
        return ResponseEntity.ok(taxiGuestService.isJoined(userSeq));
    }

    @Operation(summary = "게스트의 목적지 및 비용 설정", description = "게스트의 목적지 및 비용을 설정합니다.")
    @PutMapping("/guest/set/destinationAndCost")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "게스트의 목적지 및 비용 설정 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    public ResponseEntity<?> setDestinationAndCost(
            @RequestBody @Parameter(description = "게스트 목적지 및 비용 설정 요청 데이터", required = true) GuestSetDestinationAndCostRequest request) {
        taxiGuestService.setDestinationAndCost(request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "게스트의 목적지 순위 설정", description = "게스트의 목적지 순위를 설정합니다.")
    @PutMapping("/guest/set/rank")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "게스트의 목적지 순위 설정 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    public ResponseEntity<?> setRank(
            @RequestBody @Parameter(description = "게스트 목적지 순위 설정 요청 데이터", required = true) GuestSetRankRequest request) {
        taxiGuestService.setRank(request);
        return ResponseEntity.noContent().build();
    }


    @Operation(summary = "방에 참가 중인 택시 조회", description = "방에 참가 중인 택시를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "방에 참가 중인 택시 조회 성공"),
            @ApiResponse(responseCode = "404", description = "방에 참가 중인 택시를 찾을 수 없음")
    })
    @GetMapping("/selectByRoom/{roomSeq}")
    ResponseEntity<TaxiSelectResponse> selectByRoom(
            @PathVariable @Parameter(description = "방 식별 번호", required = true) Long roomSeq) {
        TaxiSelectResponse taxi = taxiService.selectByRoom(roomSeq);
        return ResponseEntity.ok(taxi);
    }

}
