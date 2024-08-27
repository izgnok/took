package com.took.user_api.dto.response.account;

import com.took.user_api.dto.response.ResponseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Schema(description = "이ASY 비밀번호 확인 응답 DTO")
@Getter
public class CheckEasyPwdResponseDto extends ResponseDto {

    @Schema(description = "비밀번호 확인 여부", example = "true")
    private boolean checked;

    private CheckEasyPwdResponseDto(boolean checked){
        this.checked = checked;
    }

    @Schema(description = "비밀번호 확인 성공 응답")
    public static ResponseEntity<CheckEasyPwdResponseDto> success(boolean checked) {
        CheckEasyPwdResponseDto responseBody = new CheckEasyPwdResponseDto(checked);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
}
