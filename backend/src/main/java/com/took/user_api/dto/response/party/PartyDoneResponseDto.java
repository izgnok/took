package com.took.user_api.dto.response.party;

import com.took.user_api.dto.response.ResponseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
@Schema(description = "파티 완료 응답 DTO")
public class PartyDoneResponseDto extends ResponseDto {

    @Schema(description = "파티 완료 상태")
    private boolean status;

    private PartyDoneResponseDto(boolean status) {
        this.status = status;
    }

    @Schema(description = "파티 완료 성공 응답")
    public static ResponseEntity<PartyDoneResponseDto> success(boolean status) {
        PartyDoneResponseDto responseBody = new PartyDoneResponseDto(status);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
}
