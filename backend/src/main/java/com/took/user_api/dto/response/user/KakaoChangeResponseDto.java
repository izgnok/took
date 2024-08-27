package com.took.user_api.dto.response.user;

import com.took.common.ResponseCode;
import com.took.common.ResponseMessage;
import com.took.user_api.dto.response.ResponseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Schema(description = "카카오 변경 응답 DTO")
public class KakaoChangeResponseDto extends ResponseDto {

  private KakaoChangeResponseDto() {
    super();
  }

  @Schema(description = "카카오 변경 성공 응답")
  public static ResponseEntity<KakaoChangeResponseDto> success() {
    KakaoChangeResponseDto responseBody = new KakaoChangeResponseDto();
    return ResponseEntity.status(HttpStatus.OK).body(responseBody);
  }

  @Schema(description = "중복된 ID 응답")
  public static ResponseEntity<ResponseDto> duplicatedId() {
    ResponseDto responseBody = new ResponseDto(ResponseCode.DUPLICATED_ID, ResponseMessage.DUPLICATED_ID);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
  }

  @Schema(description = "인증 실패 응답")
  public static ResponseEntity<ResponseDto> certificationFail() {
    ResponseDto responseBody = new ResponseDto(ResponseCode.CERTIFICATION_FAIL, ResponseMessage.CERTIFICATION_FAIL);
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
  }
}
