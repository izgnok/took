package com.took.delivery_api.controller;

import com.took.delivery_api.dto.*;
import com.took.delivery_api.service.DeliveryGuestService;
import com.took.delivery_api.service.DeliveryService;
import com.took.fcm_api.dto.MessageRequest;
import com.took.fcm_api.service.FCMService;
import com.took.user_api.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// REST 컨트롤러 정의
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/delivery")
@Tag(name = "DeliveryController", description = "배달 관련 API")
public class DeliveryController {

    // 서비스 클래스 주입
    private final DeliveryService deliveryService;
    private final DeliveryGuestService deliveryGuestService;
    private final FCMService fcmservice;
    private final UserService userService;

    @Operation(summary = "배달 생성 요청", description = "새로운 배달을 생성합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "배달 생성 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/create")
    ResponseEntity<DeliveryCreateResponse> createDelivery(
            @RequestBody @Parameter(description = "배달 생성 요청 정보", required = true) DeliveryCreateRequest request) {
        DeliveryCreateResponse response = deliveryService.createDelivery(request);
        // 알림 생성
        List<Long> userSeqs = userService.searchNearUser(request.getUserSeq(), request.getPickupLat(), request.getPickupLon());
        if(userSeqs != null && !userSeqs.isEmpty()) {
            fcmservice.sendMessage(
                    MessageRequest.builder()
                            .title("같이 배달 시켜먹을래요?")
                            .body("근처에 배달 시킬 사람이 있어요!")
                            .userSeqList(userSeqs)
                            .build()
            );
        }
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "정산 연결", description = "배달과 파티를 연결합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "정산 연결 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PutMapping("/setParty")
    ResponseEntity<?> setParty(
            @RequestBody @Parameter(description = "정산 연결 요청 정보", required = true) DeliverySerPartyRequest request) {
        deliveryService.setParty(request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "배달 글 수정", description = "배달 글을 수정합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "배달 글 수정 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PutMapping("/modify")
    ResponseEntity<?> modifyDelivery(
            @RequestBody @Parameter(description = "배달 글 수정 요청 정보", required = true) DeliveryModifyRequest request) {
        deliveryService.modifyDelivery(request);
        // 알림 생성
        List<Long> userSeqs = userService.searchNearUser(request.getUserSeq(), request.getPickupLat(), request.getPickupLon());
        if(userSeqs != null && !userSeqs.isEmpty()) {
            fcmservice.sendMessage(
                    MessageRequest.builder()
                            .title("같이 배달 시켜먹을래요?")
                            .body("근처에 배달 시킬 사람이 있어요!")
                            .userSeqList(userSeqs)
                            .build()
            );
        }
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "배달 글 삭제", description = "배달 글을 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "배달 글 삭제 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "404", description = "배달 글을 찾을 수 없음")
    })
    @DeleteMapping("/delete/{deliverySeq}")
    ResponseEntity<?> deleteDelivery(
            @PathVariable @Parameter(description = "삭제할 배달 글의 고유 번호", required = true) Long deliverySeq) {
        deliveryService.deleteDelivery(deliverySeq);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "공지사항 등록", description = "공지사항을 등록합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "공지사항 등록 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PutMapping("/notice/create")
    ResponseEntity<?> createNotice(
            @RequestBody @Parameter(description = "공지사항 등록 요청 정보", required = true) DeliveryNoticeCreateRequest request) {
        deliveryService.createNotice(request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "공지사항 수정", description = "공지사항을 수정합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "공지사항 수정 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PutMapping("/notice/modify")
    ResponseEntity<?> modifyNotice(
            @RequestBody @Parameter(description = "공지사항 수정 요청 정보", required = true) DeliveryNoticeCreateRequest request) {
        deliveryService.modifyNotice(request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "공지사항 삭제", description = "공지사항을 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "공지사항 삭제 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "404", description = "공지사항을 찾을 수 없음")
    })
    @DeleteMapping("/notice/delete/{deliverySeq}")
    ResponseEntity<?> deleteNotice(
            @PathVariable @Parameter(description = "삭제할 공지사항의 고유 번호", required = true) Long deliverySeq) {
        deliveryService.deleteNotice(deliverySeq);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "배달 글 목록 조회", description = "배달 글 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "배달 글 목록 조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/list")
    ResponseEntity<List<DeliverySelectResponse>> getList(
            @RequestBody @Parameter(description = "배달 글 목록 조회 요청 정보", required = true) DeliveryListSelectRequest request) {
        List<DeliverySelectResponse> response = deliveryService.getList(request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "배달 글 상세 조회", description = "배달 글의 상세 정보를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "배달 글 상세 조회 성공"),
            @ApiResponse(responseCode = "404", description = "배달 글을 찾을 수 없음")
    })
    @GetMapping("/{deliverySeq}")
    ResponseEntity<DeliverySelectResponse> getDetail(
            @PathVariable @Parameter(description = "조회할 배달 글의 고유 번호", required = true) Long deliverySeq) {
        DeliverySelectResponse response = deliveryService.getDetail(deliverySeq);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "배달 상태 변경", description = "배달 상태를 변경합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "배달 상태 변경 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PutMapping("/setStatus")
    ResponseEntity<?> setStatus(
            @RequestBody @Parameter(description = "배달 상태 변경 요청 정보", required = true) DeliverySetStatusRequest request) {
        deliveryService.setStatus(request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "배달 파티 참가", description = "배달 파티에 참가합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "배달 파티 참가 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/join")
    ResponseEntity<?> joinParty(
            @RequestBody @Parameter(description = "배달 파티 참가 요청 정보", required = true) DeliveryGuestCreateRequest request) {
        deliveryGuestService.joinParty(request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "배달 파티 퇴장", description = "배달 파티에서 퇴장합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "배달 파티 퇴장 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/leave")
    ResponseEntity<?> leaveParty(
            @RequestBody @Parameter(description = "배달 파티 퇴장 요청 정보", required = true) DeliveryGuestDeleteRequest request) {
        deliveryGuestService.leaveParty(request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "배달 파티 참가자 리스트 조회", description = "배달 파티 참가자 리스트를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "배달 파티 참가자 리스트 조회 성공"),
            @ApiResponse(responseCode = "404", description = "배달 파티를 찾을 수 없음")
    })
    @GetMapping("/guest/list/{deliverySeq}")
    ResponseEntity<List<DeliveryGuestSelectResponse>> getGuestList(
            @PathVariable @Parameter(description = "조회할 배달 글의 고유 번호", required = true) Long deliverySeq) {
        List<DeliveryGuestSelectResponse> response = deliveryGuestService.getGuestList(deliverySeq);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "배달 파티 참가자 조회", description = "배달 파티 참가자를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "배달 파티 참가자 조회 성공"),
            @ApiResponse(responseCode = "404", description = "배달 파티 참가자를 찾을 수 없음")
    })
    @GetMapping("/guest/{deliveryGuestSeq}")
    ResponseEntity<DeliveryGuestSelectResponse> getGuest(
            @PathVariable @Parameter(description = "조회할 배달 파티 참가자의 고유 번호", required = true) Long deliveryGuestSeq) {
        DeliveryGuestSelectResponse response = deliveryGuestService.getGuest(deliveryGuestSeq);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "배달 픽업 여부 변경", description = "배달 파티 참가자의 픽업 여부를 변경합니다. 모든 파티원이 픽업 완료라면, 배달 상태를 DONE으로 바꾸고, 중간계좌 정산 및 완료 알림 전송")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "픽업 여부 변경 성공"),
            @ApiResponse(responseCode = "404", description = "배달 파티 참가자를 찾을 수 없음")
    })
    @GetMapping("/guest/setPickUp/{deliveryGuestSeq}")
    ResponseEntity<?> setPickUp(
            @PathVariable @Parameter(description = "픽업 여부를 변경할 배달 파티 참가자의 고유 번호", required = true) Long deliveryGuestSeq) {
        deliveryGuestService.setPickUp(deliveryGuestSeq);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "참가 중인 방 리스트 조회", description = "사용자가 참가 중인 배달 방 리스트를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "참가 중인 방 리스트 조회 성공"),
            @ApiResponse(responseCode = "404", description = "참가 중인 방을 찾을 수 없음")
    })
    @GetMapping("list/{userSeq}")
    ResponseEntity<List<DeliverySelectResponse>> getJoinList(
            @PathVariable @Parameter(description = "조회할 사용자의 고유 번호", required = true) Long userSeq) {
        List<DeliverySelectResponse> response = deliveryGuestService.getJoinList(userSeq);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "해당 방의 참가 여부 조회", description = "사용자가 특정 배달 방에 참가 중인지 여부를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "참가 여부 조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/guest/isJoin")
    ResponseEntity<Boolean> isJoin(
            @RequestBody @Parameter(description = "참가 여부 조회 요청 정보", required = true) DeliveryGuestIsJoinRequest request) {
        boolean response = deliveryGuestService.isJoin(request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "해당 채팅방 번호의 파티 조회", description = "해당 채팅방과 연결되어있는 파티를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @GetMapping("/selectByRoom/{roomSeq}")
    ResponseEntity<DeliverySelectResponse> selectByRoom(
            @PathVariable @Parameter(description = "조회할 채팅방의 고유 번호", required = true) Long roomSeq) {
        DeliverySelectResponse response = deliveryService.selectByRoom(roomSeq);
        return ResponseEntity.ok(response);
    }
}
