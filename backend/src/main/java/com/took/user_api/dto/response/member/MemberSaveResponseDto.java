package com.took.user_api.dto.response.member;

import com.took.user_api.dto.response.ResponseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "회원 저장 응답 DTO")
public class MemberSaveResponseDto extends ResponseDto {

    @Schema(description = "회원 시퀀스 ID", example = "12345")
    private Long memberSeq;

    @Schema(description = "회원 저장 성공 응답")
    public static ResponseEntity<MemberSaveResponseDto> success() {
        MemberSaveResponseDto responseBody = new MemberSaveResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    @Schema(description = "회원 저장 성공 응답 (회원 시퀀스 포함)")
    public static ResponseEntity<MemberSaveResponseDto> success(Long memberSeq) {
        MemberSaveResponseDto responseBody = new MemberSaveResponseDto(memberSeq);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
}
