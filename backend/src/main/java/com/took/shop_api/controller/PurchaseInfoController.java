package com.took.shop_api.controller;

import com.took.shop_api.dto.AddPurchaseInfo;
import com.took.shop_api.dto.PurchaseInfoListResponse;
import com.took.shop_api.dto.PurchaseInfoResponse;
import com.took.shop_api.dto.UpdatePurchaseRequest;
import com.took.shop_api.service.PurchaseInfoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/purchase")
public class PurchaseInfoController {

    private final PurchaseInfoService purchaseInfoService;

    @Operation(summary = "구매 정보 저장", description = "새로운 구매 정보를 저장합니다.")
    @ApiResponse(responseCode = "200", description = "구매 정보가 성공적으로 저장됨")
    @PostMapping("/save")
    public ResponseEntity<?> savePurchaseInfo(@RequestBody @Schema(description = "구매 정보 추가 요청 데이터") AddPurchaseInfo request) {
        purchaseInfoService.savePurchaseInfo(request);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "상점의 모든 구매 정보 조회", description = "상점 ID로 모든 구매 정보를 조회합니다.")
    @ApiResponse(responseCode = "200", description = "구매 정보 목록 조회 성공")
    @GetMapping("/selectAll/{id}")
    public ResponseEntity<?> findByShopSeq(@PathVariable @Schema(description = "상점 ID", example = "1") long id) {
        PurchaseInfoListResponse info = purchaseInfoService.findByShopSeq(id);
        return ResponseEntity.ok()
                .body(info);
    }

    @Operation(summary = "구매 정보 조회", description = "상점 ID와 사용자 ID로 특정 구매 정보를 조회합니다.")
    @ApiResponse(responseCode = "200", description = "구매 정보 조회 성공")
    @GetMapping("/select/{shopSeq}/{userSeq}")
    public ResponseEntity<?> findPurchaseInfo(@PathVariable @Schema(description = "상점 ID", example = "1") long shopSeq,
                                              @PathVariable @Schema(description = "사용자 ID", example = "1") long userSeq) {
        PurchaseInfoResponse purchaseInfo = purchaseInfoService.findById(shopSeq, userSeq);
        return ResponseEntity.ok()
                .body(purchaseInfo);
    }

    @Operation(summary = "구매 정보 삭제", description = "구매 정보 ID로 특정 구매 정보를 삭제합니다.")
    @ApiResponse(responseCode = "200", description = "구매 정보 삭제 성공")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePurchaseInfo(@PathVariable @Schema(description = "구매 정보 ID", example = "1") long id) {
        purchaseInfoService.delete(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "구매 정보 업데이트", description = "구매 정보 ID로 특정 구매 정보를 업데이트합니다.")
    @ApiResponse(responseCode = "200", description = "구매 정보 업데이트 성공")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updatePurchaseInfo(@PathVariable @Schema(description = "구매 정보 ID", example = "1") long id,
                                                @RequestBody @Schema(description = "구매 정보 업데이트 요청 데이터") UpdatePurchaseRequest request) {
        purchaseInfoService.update(id, request);
        return ResponseEntity.ok().build();
    }
}
