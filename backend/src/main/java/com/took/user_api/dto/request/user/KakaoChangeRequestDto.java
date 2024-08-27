package com.took.user_api.dto.request.user;

import com.took.user_api.entity.UserEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class KakaoChangeRequestDto {

  @Schema(description = "사용자 시퀀스 (예: 1)", example = "1")
  private Long userSeq;

  @Schema(description = "사용자 ID", example = "user123")
  private String userId;

  @Schema(description = "사용자 이름", example = "홍길동")
  private String userName;

  @Schema(description = "성별 (예: MALE, FEMALE)", example = "MALE")
  private UserEntity.Gender gender;

  @NotBlank
  @Schema(description = "전화번호", example = "010-1234-5678", required = true)
  private String phoneNumber;
}
