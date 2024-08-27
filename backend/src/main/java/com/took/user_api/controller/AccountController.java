package com.took.user_api.controller;

import com.took.user_api.dto.request.account.*;
import com.took.user_api.dto.response.VoidResponseDto;
import com.took.user_api.dto.response.account.*;
import com.took.user_api.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @Operation(summary = "계좌 연결", description = "사용자와 계좌를 연결합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "계좌 연결 성공",
                    content = @Content(schema = @Schema(implementation = AccountLinkResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/link-account")
    public ResponseEntity<? super AccountLinkResponseDto> linkAccount(
            @RequestBody @Valid AccountLinkRequestDto requestBody
    ) {
        return accountService.saveAccount(requestBody);
    }

    @Operation(summary = "계좌 목록 조회", description = "사용자의 계좌 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "계좌 목록 조회 성공",
                    content = @Content(schema = @Schema(implementation = AccountListResponsetDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/account-list")
    public ResponseEntity<? super AccountListResponsetDto> accountList(
            @RequestBody @Valid AccountListRequestDto requestBody
    ) {
        return accountService.accountList(requestBody);
    }

    @Operation(summary = "주계좌 변경", description = "사용자의 주계좌를 변경합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "주계좌 변경 성공",
                    content = @Content(schema = @Schema(implementation = ChangeMainResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/change-main-account")
    public ResponseEntity<? super ChangeMainResponseDto> changeMainAccount(
            @RequestBody @Valid ChangeMainRequestDto requestBody
    ) {
        return accountService.changeMain(requestBody);
    }

    @Operation(summary = "계좌 잔액 조회", description = "특정 계좌의 잔액을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "계좌 잔액 조회 성공",
                    content = @Content(schema = @Schema(implementation = AccountBalanceResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/account-balance")
    public ResponseEntity<? super AccountBalanceResponseDto> accountBalance(
            @RequestBody @Valid AccountSeqRequestDto requestBody
    ) {
        return accountService.balance(requestBody);
    }

    @Operation(summary = "간편 비밀번호 설정", description = "간편 비밀번호를 설정합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "간편 비밀번호 설정 성공",
                    content = @Content(schema = @Schema(implementation = AccountEasyPwdResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/make-easypwd")
    public ResponseEntity<? super AccountEasyPwdResponseDto> makeEasyPwd(
            @RequestBody @Valid AccountEasyPwdRequestDto requestBody
    ) {
        return accountService.updateEasyPwd(requestBody);
    }

    @Operation(summary = "간편 비밀번호 확인", description = "설정된 간편 비밀번호를 확인합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "간편 비밀번호 확인 성공",
                    content = @Content(schema = @Schema(implementation = CheckEasyPwdResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/check-easypwd")
    public ResponseEntity<? super CheckEasyPwdResponseDto> checkEasyPwd(
            @RequestBody @Valid AccountEasyPwdRequestDto requestBody
    ) {
        return accountService.checkEasyPwd(requestBody);
    }

    @Operation(summary = "재결제", description = "미정산된 계좌의 재결제를 처리합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "재결제 성공",
                    content = @Content(schema = @Schema(implementation = VoidResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/re-pay")
    public ResponseEntity<? super VoidResponseDto> rePay(
            @RequestBody @Valid RepayRequestDto requestBody
    ) {
        return accountService.repay(requestBody);
    }

    @Operation(summary = "계좌 삭제", description = "특정 계좌를 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "계좌 삭제 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @DeleteMapping("/account-delete/{accountSeq}")
    public ResponseEntity<String> deleteAccount(
            @PathVariable("accountSeq") Long accountSeq
    ) {
        return accountService.deleteAccount(accountSeq);
    }

    // 사용자 번호를 받아서 주계좌정보 반환
    @Operation(summary = "주계좌 조회", description = "사용자의 주계좌를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "주계좌 조회 성공",
                    content = @Content(schema = @Schema(implementation = MainAccountSelectResponse.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @GetMapping("/main-account/{userSeq}")
    public MainAccountSelectResponse mainAccount(
            @PathVariable("userSeq") Long userSeq
    ) {
        return accountService.getMainAccount(userSeq);
    }

}
