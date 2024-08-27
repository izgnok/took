package com.took.shop_api.controller;

import com.took.fcm_api.dto.MessageRequest;
import com.took.fcm_api.service.FCMService;
import com.took.shop_api.dto.*;
import com.took.shop_api.entity.Shop;
import com.took.shop_api.service.ShopService;
import com.took.user_api.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/shops")
public class ShopController {

    private final ShopService shopService;
    private final UserService userService;
    private final FCMService fcmService;

    @Operation(summary = "상점 생성", description = "새로운 상점을 생성합니다.")
    @ApiResponse(responseCode = "201", description = "상점이 성공적으로 생성됨")
    @PostMapping("/create")
    public ResponseEntity<AddShopResponseDto> addShop(@RequestBody @Schema(description = "상점 생성 요청 데이터") AddShopRequest request) {
        AddShopResponseDto saveShop = shopService.save(request);
        // 알림 생성
        List<Long> userSeqs = userService.searchNearUser(request.getUserSeq(), request.getLat(), request.getLon());
        if(userSeqs != null && !userSeqs.isEmpty()) {
            fcmService.sendMessage(
                    MessageRequest.builder()
                            .title("같이 주문해요!")
                            .body("공동 구매 모집 글이 올라왔어요!")
                            .userSeqList(userSeqs)
                            .build()
            );
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(saveShop);
    }

    @Operation(summary = "상점 목록 조회", description = "상점 ID 리스트로 상점 목록을 조회합니다.")
    @ApiResponse(responseCode = "200", description = "상점 목록 조회 성공")
    @PostMapping("/selectAll")
    public ResponseEntity<List<ShopResponse>> findShopsByIds(@RequestBody @Schema(description = "상점 ID 리스트") List<Long> id) {
        return ResponseEntity.ok()
                .body(shopService.findShopsByIds(id));
    }

    @Operation(summary = "상점 조회", description = "상점 ID로 상점을 조회합니다.")
    @ApiResponse(responseCode = "200", description = "상점 조회 성공")
    @GetMapping("/select/{id}")
    public ResponseEntity<?> findShop(@PathVariable @Schema(description = "상점 ID", example = "1") long id) {
        return ResponseEntity.ok()
                .body(shopService.findById(id));
    }

    @Operation(summary = "상점 삭제", description = "상점 ID로 상점을 삭제합니다.")
    @ApiResponse(responseCode = "200", description = "상점 삭제 성공")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteShop(@PathVariable @Schema(description = "상점 ID", example = "1") long id) {
        shopService.delete(id);
        return ResponseEntity.ok()
                .build();
    }

    @Operation(summary = "상점 업데이트", description = "상점 ID로 상점 정보를 업데이트합니다.")
    @ApiResponse(responseCode = "200", description = "상점 정보 업데이트 성공")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateShop(@PathVariable @Schema(description = "상점 ID", example = "1") long id,
                                           @RequestBody @Schema(description = "상점 업데이트 요청 데이터") UpdateShopRequest request) {
        shopService.update(id, request);
        // 알림 생성
        List<Long> userSeqs = userService.searchNearUser(request.getUserSeq(), request.getLat(), request.getLon());
        if(userSeqs != null && !userSeqs.isEmpty()) {
            fcmService.sendMessage(
                    MessageRequest.builder()
                            .title("같이 주문해요!")
                            .body("공동 구매 모집 글이 올라왔어요!")
                            .userSeqList(userSeqs)
                            .build()
            );
        }
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "상점 상태 업데이트", description = "상점 ID로 상점 상태를 업데이트합니다.")
    @ApiResponse(responseCode = "200", description = "상점 상태 업데이트 성공")
    @PutMapping("/update/status/{id}")
    public ResponseEntity<Shop> updateStatus(@PathVariable @Schema(description = "상점 ID", example = "1") long id,
                                             @RequestBody @Schema(description = "상점 상태 업데이트 요청 데이터") UpdateStatusShopRequest request) {
        Shop updateStatusShop = shopService.updateStatus(id, request);
        return ResponseEntity.ok()
                .body(updateStatusShop);
    }

    @Operation(summary = "상점에 사용자 추가", description = "상점에 사용자를 추가합니다.")
    @ApiResponse(responseCode = "200", description = "사용자가 상점에 성공적으로 추가됨")
    @PostMapping("/enter")
    public ResponseEntity<?> userEnterShop(@RequestBody @Schema(description = "상점 게스트 추가 요청 데이터") AddShopGuest request) {
        return ResponseEntity.ok(shopService.userEnterShop(request));
    }

    @Operation(summary = "상점에서 사용자 삭제", description = "상점에서 사용자를 삭제합니다.")
    @ApiResponse(responseCode = "200", description = "사용자가 상점에서 성공적으로 삭제됨")
    @DeleteMapping("/exit/{shopSeq}/{userSeq}")
    public ResponseEntity<?> userExitShop(@PathVariable @Schema(description = "상점 ID", example = "1") long shopSeq,
                                          @PathVariable @Schema(description = "사용자 ID", example = "2") long userSeq) {
        shopService.exit(shopSeq, userSeq);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "사용자 픽업", description = "상점에서 사용자를 픽업합니다.")
    @ApiResponse(responseCode = "200", description = "사용자가 성공적으로 픽업됨")
    @PutMapping("/pickUp/{shopSeq}/{userSeq}")
    public ResponseEntity<?> userPickUp(@PathVariable @Schema(description = "상점 ID", example = "1") long shopSeq,
                                        @PathVariable @Schema(description = "사용자 ID", example = "2") long userSeq) {
        shopService.pickUp(shopSeq, userSeq);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "픽업 상태 확인", description = "상점의 픽업 상태를 확인합니다.")
    @ApiResponse(responseCode = "200", description = "픽업 상태 확인 성공")
    @GetMapping("/pickUpCheck/{shopSeq}")
    public ResponseEntity<?> pickUpCheck(@PathVariable @Schema(description = "상점 ID", example = "1") long shopSeq) {
        boolean check = shopService.pickUpCheck(shopSeq);
        return ResponseEntity.ok(check);
    }

    @Operation(summary = "상점에 게스트 참여 중인지 확인", description = "상점에 게스트가 참여 중인지 확인합니다.")
    @ApiResponse(responseCode = "200", description = "게스트가 참여중인지 확인 성공")
    @GetMapping("/guestCheck/{shopSeq}/{userSeq}")
    public ResponseEntity<?> findGuestsById(@PathVariable @Schema(description = "상점 ID", example = "1") long shopSeq, @PathVariable @Schema(description = "사용자 ID", example = "1") long userSeq) {
        return ResponseEntity.ok()
                .body(shopService.findGuestsById(userSeq, shopSeq));
    }

    @Operation(summary = "상점 조회", description = "채팅 ID로 상점을 조회합니다.")
    @ApiResponse(responseCode = "200", description = "상점 조회 성공")
    @GetMapping("/selectByRoom/{roomSeq}")
    public ResponseEntity<ShopResponse> selectByRoom(@PathVariable @Schema(description = "채팅 ID", example = "1") long roomSeq) {
        return ResponseEntity.ok()
                .body(shopService.findShopByRoom(roomSeq));
    }

    @Operation(summary = "상점 목록 조회", description = "유저 ID로 상점 목록을 조회합니다.")
    @ApiResponse(responseCode = "200", description = "상점 목록 조회 성공")
    @GetMapping("/selectAll/{id}")
    public ResponseEntity<List<ShopResponse>> findShopsByUserId(@PathVariable @Schema(description = "상점 ID 리스트") long id) {
        return ResponseEntity.ok()
                .body(shopService.findShopsByUserId(id));
    }

    @Operation(summary = "정산방 연결", description = "상점의 정산방을 연결합니다.")
    @PutMapping("/setParty")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "정산방 연결 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    ResponseEntity<?> setParty(
            @RequestBody @Parameter(description = "정산방 연결 요청 데이터", required = true) ShopSetPartyRequest request) {
        shopService.setParty(request);
        return ResponseEntity.noContent().build();
    }
}
