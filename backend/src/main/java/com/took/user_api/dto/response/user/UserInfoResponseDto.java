package com.took.user_api.dto.response.user;

import com.took.user_api.dto.response.ResponseDto;
import com.took.user_api.entity.UserEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "사용자 정보 응답 DTO")
public class UserInfoResponseDto extends ResponseDto {

    @Schema(description = "사용자 일련번호")
    private Long userSeq;

    @Schema(description = "사용자 ID")
    private String userId;

    @Schema(description = "사용자 이름")
    private String userName;

    @Schema(description = "이메일")
    private String email;

    @Schema(description = "전화번호")
    private String phoneNumber;

    @Schema(description = "생년월일")
    private String birth;

    @Schema(description = "계정 생성 일시")
    private LocalDateTime createdAt;

    @Schema(description = "주소")
    private String addr;

    @Schema(description = "위도")
    private Double lat;

    @Schema(description = "경도")
    private Double lon;

    @Schema(description = "이미지 번호")
    private Integer imageNo;

    @Schema(description = "역할")
    private String role;

    @Schema(description = "닉네임")
    private String nickname;

    @Schema(description = "성별")
    private UserEntity.Gender gender;
    // 정적 팩토리 메서드 추가
    public static UserInfoResponseDto fromEntity(UserEntity user) {
        return new UserInfoResponseDto(
                user.getUserSeq(),
                user.getUserId(),
                user.getUserName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getBirth(),
                user.getCreatedAt(),
                user.getAddr(),
                user.getLat(),
                user.getLon(),
                user.getImageNo(),
                user.getRole(),
                user.getNickname(),
                user.getGender()
        );
    }

    @Schema(description = "사용자 정보 조회 성공 응답")
    public static ResponseEntity<UserInfoResponseDto> success(UserEntity user) {
        UserInfoResponseDto responseBody = UserInfoResponseDto.fromEntity(user);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
}
