package com.took.user_api.dto.response.party;

import com.took.user_api.dto.response.ResponseDto;
import com.took.user_api.entity.MemberEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Getter
@Schema(description = "파티 상세 응답 DTO")
public class PartyDetailResponseDto extends ResponseDto {

    @Schema(description = "파티 상세 멤버 리스트")
    private List<MemberEntity> partyDetailList;

    private PartyDetailResponseDto(List<MemberEntity> partyDetailList) {
        this.partyDetailList = partyDetailList;
    }

    @Schema(description = "파티 상세 성공 응답")
    public static ResponseEntity<PartyDetailResponseDto> success(List<MemberEntity> partyDetailList) {
        PartyDetailResponseDto responseBody = new PartyDetailResponseDto(partyDetailList);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
}
