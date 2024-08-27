package com.took.user_api.dto.response;

import com.took.common.ResponseCode;
import com.took.common.ResponseMessage;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
@AllArgsConstructor
@Schema(description = "API 공통 응답 DTO")
public class ResponseDto {

    @Schema(description = "응답 코드")
    private String code;

    @Schema(description = "응답 메시지")
    private String message;

    // 생성자를 통해 success 값으로 초기화
    public ResponseDto() {
        this.code = ResponseCode.SUCCESS;
        this.message = ResponseMessage.SUCCESS;
    }

    // 데이터베이스 에러 처리
    @Schema(description = "데이터베이스 에러 응답")
    public static ResponseEntity<ResponseDto> databaseError() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.DATABASE_ERROR, ResponseMessage.DATABASE_ERROR);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
    }

    // 유효성 검사 실패 처리
    @Schema(description = "유효성 검사 실패 응답")
    public static ResponseEntity<ResponseDto> validationFail() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.VALIDATION_FAIL, ResponseMessage.VALIDATION_FAIL);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }

    // 잔액 부족 처리
    @Schema(description = "잔액 부족 응답")
    public static ResponseEntity<ResponseDto> nomoney() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.NO_MONEY, ResponseMessage.NO_MONEY);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }
}
