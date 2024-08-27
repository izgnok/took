package com.took.user_api.dto.response.auth;

import com.took.user_api.dto.response.ResponseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Schema(description = "인증 확인 응답 DTO")
@Getter
public class CheckCertificationResponseDto extends ResponseDto {

  private CheckCertificationResponseDto() {
    super();
  }

  @Schema(description = "인증 확인 성공 응답")
  public static ResponseEntity<CheckCertificationResponseDto> success() {
    CheckCertificationResponseDto responseBody = new CheckCertificationResponseDto();
    return ResponseEntity.status(HttpStatus.OK).body(responseBody);
  }

  @Schema(description = "인증 실패 응답")
  public static ResponseEntity<ResponseDto> certificationFail() {
    ResponseDto responseBody = new ResponseDto();
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
  }
}
