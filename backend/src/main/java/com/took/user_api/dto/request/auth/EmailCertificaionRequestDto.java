package com.took.user_api.dto.request.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class EmailCertificaionRequestDto {

    @Schema(description = "사용자 ID", example = "user123")
    @NotBlank
    private String userId;

    @Schema(description = "이메일 주소", example = "user@example.com")
    @Email
    @NotBlank
    private String email;
}
