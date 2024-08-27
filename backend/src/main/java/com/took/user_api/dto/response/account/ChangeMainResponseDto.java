package com.took.user_api.dto.response.account;

import com.took.user_api.dto.response.ResponseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Schema(description = "메인 계좌 변경 응답 DTO")
@Getter
public class ChangeMainResponseDto extends ResponseDto {

    private ChangeMainResponseDto() {
        super();
    }

    @Schema(description = "메인 계좌 변경 성공 응답")
    public static ResponseEntity<ChangeMainResponseDto> success() {
        ChangeMainResponseDto responseBody = new ChangeMainResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
}
