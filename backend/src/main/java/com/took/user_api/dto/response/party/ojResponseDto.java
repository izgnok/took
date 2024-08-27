package com.took.user_api.dto.response.party;

import com.took.user_api.dto.response.ResponseDto;
import com.took.user_api.entity.MemberEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Getter
@AllArgsConstructor
public class ojResponseDto extends ResponseDto {

    private boolean done;

    @Schema(description = "정산 관련 응답")
    public static ResponseEntity<ojResponseDto> success(boolean done) {
        ojResponseDto responseBody = new ojResponseDto(done);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
}
