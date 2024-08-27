package com.took.user_api.dto.request.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class IdCheckRequestDto {

    @Schema(description = "사용자 ID", example = "user123", required = true)
    @NotBlank
    private String userId;
}
