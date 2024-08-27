package com.took.user_api.dto.response.party;

import com.took.user_api.dto.response.ResponseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Schema(description = "모든 결제 응답 DTO")
public class PayAllResponseDto extends ResponseDto {

    private PayAllResponseDto() {
        super();
    }

    @Schema(description = "모든 결제 성공 응답")
    public static ResponseEntity<PayAllResponseDto> success() {
        PayAllResponseDto responseBody = new PayAllResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
}
