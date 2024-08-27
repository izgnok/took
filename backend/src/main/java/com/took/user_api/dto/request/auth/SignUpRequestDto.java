package com.took.user_api.dto.request.auth;

import com.took.user_api.entity.UserEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SignUpRequestDto {

  @Schema(description = "사용자 아이디", example = "user123", required = true)
  @NotBlank
  private String userId;

  @Schema(description = "비밀번호", example = "password123", required = true)
  @NotBlank
  private String password;

  @Schema(description = "사용자 이름", example = "홍길동", required = true)
  @NotBlank
  private String userName;

  @Schema(description = "성별", example = "MALE", allowableValues = {"MALE", "FEMALE"})
  private UserEntity.Gender gender;

  @Schema(description = "전화번호", example = "010-1234-5678", required = true)
  @NotBlank
  private String phoneNumber;

  @Schema(description = "생년월일", example = "1990-01-01", required = true)
  @NotBlank
  private String birth;

  @Schema(description = "이메일 주소", example = "example@example.com", required = true)
  @Email
  @NotBlank
  private String email;

  @Schema(description = "인증번호", example = "123456", required = true)
  @NotBlank
  private String certificationNumber;
}
