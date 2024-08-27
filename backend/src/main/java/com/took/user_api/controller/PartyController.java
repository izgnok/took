package com.took.user_api.controller;

import com.took.user_api.dto.request.member.MemberSaveRequestDto;
import com.took.user_api.dto.request.party.*;
import com.took.user_api.dto.response.VoidResponseDto;
import com.took.user_api.dto.response.member.MemberSaveResponseDto;
import com.took.user_api.dto.response.party.*;
import com.took.user_api.service.MemberService;
import com.took.user_api.service.PartyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pay")
@RequiredArgsConstructor
public class PartyController {

    private final PartyService partyService;
    private final MemberService memberService;

    @Operation(summary = "파티 생성", description = "새로운 파티를 생성합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "파티 생성 성공",
                    content = @Content(schema = @Schema(implementation = MakePartyResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/make-party")
    public ResponseEntity<? super MakePartyResponseDto> makeParty(
            @RequestBody @Valid MakePartyRequestDto requestBody
    ) {
        return partyService.makeParty(requestBody);
    }

    @Operation(summary = "멤버 추가", description = "파티에 새로운 멤버를 추가합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "멤버 추가 성공",
                    content = @Content(schema = @Schema(implementation = MemberSaveResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/insert-member")
    public ResponseEntity<? super MemberSaveResponseDto> insertMember(
            @RequestBody @Valid MemberSaveRequestDto requestBody
    ) {
        return memberService.insertMember(requestBody);
    }

    @Operation(summary = "멤버 삭제", description = "파티에 맴버를 제거합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "멤버 추가 성공",
                    content = @Content(schema = @Schema(implementation = MemberSaveResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/delete-member")
    public ResponseEntity<? super MemberSaveResponseDto> deleteMember(
            @RequestBody @Valid MemberSaveRequestDto requestBody
    ) {
        return memberService.deleteMember(requestBody);
    }


    //  알람 보내는 로직 여기에 추가할 것.
    //  결제자도 자기 돈을 입력해야한다.
    @Operation(summary = "맴버 전체 저장 (정산요청)", description = "파티에 존재 하는 모든 맴버를 추가합니다. (정산, 배달, 공구), 멤버 및 요금 확정되고 정산요청시 이거 사용")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "멤버 추가 성공",
                    content = @Content(schema = @Schema(implementation = MemberSaveResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/insert-all-member")
    public ResponseEntity<? super VoidResponseDto> insertAllMember(@RequestBody InsertAllMemberRequestDto requestBody) {
        return partyService.insertAllMember(requestBody);
    }


    @Operation(summary = "오직 정산, 맴버들이 돈 보낼때", description = "참여 맴버가 송금 버튼을 누를 떄 호출됩니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "맴버 결제 성공!",
                    content = @Content(schema = @Schema(implementation = MemberSaveResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/only-jungsan-pay")
    public ResponseEntity<? super ojResponseDto> onlyjungsan(@RequestBody OnlyJungsanRequestDto requestBody){
        return partyService.onlyjungsanPay(requestBody);
    }

    @Operation(summary = "[배달, 공구] 유저가 돈 보낼때", description = "참여 맴버가 확인 버튼을 누를 떄 호출됩니다. 완료시 done에 true 반환")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "맴버 결제 성공!",
                    content = @Content(schema = @Schema(implementation = MemberSaveResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/deli-gongu-pay")
    public ResponseEntity<? super ojResponseDto>deligonguPay(@RequestBody OnlyJungsanRequestDto requestBody){
        return partyService.deligonguPay(requestBody);
    }

    @Operation(summary = "파티 상세 조회", description = "파티 상세 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "파티 상세 조회 성공",
                    content = @Content(schema = @Schema(implementation = PartyDetailResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @GetMapping("/party-detail/{partySeq}")
    public ResponseEntity<? super PartyDetailResponseDto> partyDetail(
            @PathVariable("partySeq") Long partySeq
    ) {
        return partyService.partyDetail(partySeq);
    }

    // 내가 참가 하고있는 파티 목록
    @Operation(summary = "내가 참가하고 있는 파티 목록", description = "내가 참가하고 있는 파티 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "내가 참가하고 있는 파티 목록 조회 성공",
                    content = @Content(schema = @Schema(implementation = MyPartyListResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @GetMapping("/my-party-list/{userSeq}")
    public ResponseEntity<List<MyPartyListResponseDto>> myPartyList(@PathVariable("userSeq") Long userSeq) {
        return ResponseEntity.ok(partyService.myPartyList(userSeq));
    }

    @Operation(summary = "파티 삭제", description = "파티를 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "파티 삭제 성공",
                    content = @Content(schema = @Schema(implementation = PartyDetailResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "잘못된 서버")
    })
    @DeleteMapping("/party-delete/{partySeq}")
    public ResponseEntity<?> partyDelete(@PathVariable("partySeq") Long partySeq) {
        return partyService.partyDelete(partySeq);
    }



    // 택시 정산 파티 생성
    @Operation(summary = "택시 정산 파티 생성(가결제시) 가결제 실패시 -1 반환", description = "택시 정산 파티 생성")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "택시 정산 파티 생성 성공",
                    content = @Content(schema = @Schema(implementation = Long.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/make-taxi-party")
    public ResponseEntity<Long> makeTaxiParty(
            @RequestBody @Valid MakeTaxiPartyRequest requestBody
    ) {
        return ResponseEntity.ok(partyService.makeTaxiParty(requestBody));
    }

    // 택시 정산 실결제
    @Operation(summary = "택시 정산 실결제", description = "택시 정산 실결제")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "택시 정산 실결제 성공",
                    content = @Content(schema = @Schema(implementation = VoidResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/final-taxi-party")
    public ResponseEntity<?> finalTaxiParty(
            @RequestBody @Valid FinalTaxiPartyRequest requestBody
    ) {
        partyService.finalTaxiParty(requestBody);
        return ResponseEntity.noContent().build();
    }

    // 택시 잔돈 정산
    @Operation(summary = "택시 잔돈 정산", description = "택시 잔돈 정산")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "택시 잔돈 정산 성공",
                    content = @Content(schema = @Schema(implementation = VoidResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("rest-cost-pay")
    public ResponseEntity<? super ojResponseDto> restCostPay(
            @RequestBody @Valid OnlyJungsanRequestDto requestBody
    ) {
        return partyService.restCostPay(requestBody);
    }


    // 개인 거래 내역 리스트 조회
    @Operation(summary = "개인 거래 내역 리스트 조회", description = "개인 거래 내역 리스트 조회")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "개인 거래 내역 리스트 조회 성공",
                    content = @Content(schema = @Schema(implementation = PayHistoryResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @GetMapping("/pay-history/{userSeq}")
    public ResponseEntity<List<PayHistoryResponseDto>> payHistory(@PathVariable("userSeq") Long userSeq) {
        return ResponseEntity.ok(partyService.payHistory(userSeq));
    }

    // 미정산 내역 리스트 조회
    @Operation(summary = "미정산 내역 리스트 조회", description = "미정산 내역 리스트 조회")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "미정산 내역 리스트 조회 성공",
                    content = @Content(schema = @Schema(implementation = NoPayResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @GetMapping("/no-pay-list/{userSeq}")
    public ResponseEntity<List<NoPayResponseDto>> noPayList(@PathVariable("userSeq") Long userSeq) {
        return ResponseEntity.ok(partyService.noPayList(userSeq));
    }
}
