package com.took.user_api.dto.response.party;

import com.took.user_api.dto.response.ResponseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@AllArgsConstructor
@Getter
@Schema(description = "결제 목록")
public class PayResponseDto extends ResponseDto {

    private Long userSeq;

    @Schema(description = "개인 결제 성공 응답")
    public static ResponseEntity<PayResponseDto> success(Long userSeq) {
        PayResponseDto responseBody = new PayResponseDto(userSeq);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

}
