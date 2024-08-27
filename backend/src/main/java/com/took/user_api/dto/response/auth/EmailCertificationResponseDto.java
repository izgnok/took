package com.took.user_api.dto.response.auth;

import com.took.common.ResponseCode;
import com.took.common.ResponseMessage;
import com.took.user_api.dto.response.ResponseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Schema(description = "이메일 인증 응답 DTO")
@Getter
public class EmailCertificationResponseDto extends ResponseDto {

    private EmailCertificationResponseDto(){
        super();
    }

    @Schema(description = "이메일 인증 성공 응답")
    public static ResponseEntity<EmailCertificationResponseDto> success(){
        EmailCertificationResponseDto responseBody = new EmailCertificationResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    @Schema(description = "중복된 ID 응답")
    public static ResponseEntity<ResponseDto> duplicatedId(){
        ResponseDto responseBody = new ResponseDto(ResponseCode.DUPLICATED_ID, ResponseMessage.DUPLICATED_ID);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }

    @Schema(description = "메일 전송 실패 응답")
    public static ResponseEntity<ResponseDto> mailSendFail(){
        ResponseDto responseBody = new ResponseDto(ResponseCode.MAIL_FAIL, ResponseMessage.MAIL_FAIL);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
    }
}
