package com.took.user_api.dto.response.party;

import com.took.user_api.dto.response.ResponseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
@Schema(description = "파티 생성 응답 DTO")
public class MakePartyResponseDto extends ResponseDto {

    @Schema(description = "파티 시퀀스 ID", example = "12345")
    private Long partySeq;

    @Schema(description = "회원 시퀀스 ID", example = "67890")
    private Long memberSeq;

    private MakePartyResponseDto(Long partySeq, Long memberSeq) {
        this.partySeq = partySeq;
        this.memberSeq = memberSeq;
    }

    @Schema(description = "파티 생성 성공 응답")
    public static ResponseEntity<MakePartyResponseDto> success(Long partySeq, Long memberSeq) {
        MakePartyResponseDto responseBody = new MakePartyResponseDto(partySeq, memberSeq);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
}
