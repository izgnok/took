package com.took.user_api.dto.response.user;

import com.took.user_api.dto.response.ResponseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Getter
@Schema(description = "근처 사용자 응답 DTO")
public class DeliNearUserResponseDto extends ResponseDto {

    @Schema(description = "근처 사용자 목록")
    private List<Long> nearUser;

    private DeliNearUserResponseDto(List<Long> nearUser){
        this.nearUser = nearUser;
    }

    @Schema(description = "근처 사용자 조회 성공 응답")
    public static ResponseEntity<DeliNearUserResponseDto> success(List<Long> nearUser){
        DeliNearUserResponseDto responseBody = new DeliNearUserResponseDto(nearUser);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
}
