package com.took.user_api.service;


import com.took.user_api.dto.request.party.*;
import com.took.user_api.dto.response.VoidResponseDto;
import com.took.user_api.dto.response.party.*;
import org.springframework.http.ResponseEntity;

import java.util.List;


public interface PartyService {

     ResponseEntity<? super PartyDetailResponseDto>partyDetail(Long partySeq);
    ResponseEntity<? super MakePartyResponseDto> makeParty(MakePartyRequestDto dto);
    ResponseEntity<?> partyDelete(Long partySeq);
    ResponseEntity<? super VoidResponseDto> insertAllMember(InsertAllMemberRequestDto requestBody);
    ResponseEntity<? super ojResponseDto> onlyjungsanPay(OnlyJungsanRequestDto requestBody);
    ResponseEntity<? super ojResponseDto> deligonguPay(OnlyJungsanRequestDto requestBody);
    void deligonguHostRecieve(Long partySeq,Long userSeq);

    Long makeTaxiParty(MakeTaxiPartyRequest requestBody);

    void finalTaxiParty(FinalTaxiPartyRequest requestBody);

    List<MyPartyListResponseDto> myPartyList(Long userSeq);

    ResponseEntity<? super ojResponseDto> restCostPay(OnlyJungsanRequestDto requestBody);

    List<PayHistoryResponseDto> payHistory(Long userSeq);

    List<NoPayResponseDto> noPayList(Long userSeq);
}
