package com.took.shop_api.controller;

import com.took.shop_api.dto.AddShipRequest;
import com.took.shop_api.dto.ShipResponse;
import com.took.shop_api.dto.UpdateShipRequest;
import com.took.shop_api.entity.ShipInfo;
import com.took.shop_api.service.ShipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ship")
public class ShipInfoController {

    private final ShipService shipService;

    @Operation(summary = "선박 생성", description = "새로운 선박을 생성합니다.")
    @ApiResponse(responseCode = "201", description = "선박이 성공적으로 생성됨")
    @PostMapping("/create")
    public ResponseEntity<?> addShip(@RequestBody @Schema(description = "선박 생성 요청 데이터") AddShipRequest request) {
        ShipInfo ship = shipService.save(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ship);
    }

    @Operation(summary = "선박 조회", description = "선박 ID로 선박 정보를 조회합니다.")
    @ApiResponse(responseCode = "200", description = "선박 조회 성공")
    @GetMapping("/select/{id}")
    public ResponseEntity<?> findShip(@PathVariable @Schema(description = "선박 ID", example = "1") long id) {
        ShipInfo ship = shipService.findByShopSeq(id);
        return ResponseEntity.ok()
                .body(new ShipResponse(ship));
    }

    @Operation(summary = "선박 삭제", description = "선박 ID로 선박을 삭제합니다.")
    @ApiResponse(responseCode = "200", description = "선박 삭제 성공")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteShip(@PathVariable @Schema(description = "선박 ID", example = "1") long id) {
        shipService.delete(id);
        return ResponseEntity.ok()
                .build();
    }

    @Operation(summary = "선박 업데이트", description = "선박 ID로 선박 정보를 업데이트합니다.")
    @ApiResponse(responseCode = "200", description = "선박 정보 업데이트 성공")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateShip(@PathVariable @Schema(description = "선박 ID", example = "1") long id,
                                        @RequestBody @Schema(description = "선박 업데이트 요청 데이터") UpdateShipRequest request) {
        ShipInfo ship = shipService.update(id, request);
        return ResponseEntity.ok()
                .body(ship);
    }
}
