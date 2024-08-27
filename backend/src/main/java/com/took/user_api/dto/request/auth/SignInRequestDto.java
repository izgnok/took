package com.took.user_api.dto.request.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SignInRequestDto {

    @Schema(description = "사용자 아이디", example = "user123", required = true)
    @NotBlank
    private String userId;

    @Schema(description = "비밀번호", example = "password123", required = true)
    @NotBlank
    private String password;
}
