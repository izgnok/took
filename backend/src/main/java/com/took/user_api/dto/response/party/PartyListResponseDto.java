package com.took.user_api.dto.response.party;

import com.took.user_api.dto.response.ResponseDto;
import com.took.user_api.entity.PartyEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Getter
@Schema(description = "파티 목록 응답 DTO")
public class PartyListResponseDto extends ResponseDto {

    @Schema(description = "파티 목록")
    private List<PartyEntity> list;

    private PartyListResponseDto(List<PartyEntity> list) {
        this.list = list;
    }

    @Schema(description = "파티 목록 조회 성공 응답")
    public static ResponseEntity<PartyListResponseDto> success(List<PartyEntity> list) {
        PartyListResponseDto responseBody = new PartyListResponseDto(list);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
}
