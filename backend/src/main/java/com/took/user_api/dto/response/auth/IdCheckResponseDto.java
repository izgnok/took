package com.took.user_api.dto.response.auth;

import com.took.common.ResponseCode;
import com.took.common.ResponseMessage;
import com.took.user_api.dto.response.ResponseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Schema(description = "ID 체크 응답 DTO")
@Getter
public class IdCheckResponseDto extends ResponseDto {

    private IdCheckResponseDto(){
        super();
    }

    @Schema(description = "ID 체크 성공 응답")
    public static ResponseEntity<IdCheckResponseDto> success(){
        IdCheckResponseDto responseBody = new IdCheckResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    @Schema(description = "중복된 ID 응답")
    public static ResponseEntity<ResponseDto> duplicatedId(){
        ResponseDto responseBody = new ResponseDto(ResponseCode.DUPLICATED_ID, ResponseMessage.DUPLICATED_ID);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }
}
