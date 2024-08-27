package com.took.user_api.controller;

import com.took.user_api.dto.request.user.KakaoChangeRequestDto;
import com.took.user_api.dto.request.user.PwdChangeRequestDto;
import com.took.user_api.dto.request.user.UserAddressRequestDto;
import com.took.user_api.dto.request.user.UserSeqRequestDto;
import com.took.user_api.dto.response.VoidResponseDto;
import com.took.user_api.dto.response.user.KakaoChangeResponseDto;
import com.took.user_api.dto.response.user.UserInfoResponseDto;
import com.took.user_api.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserContoller {

    private final UserService userService;

    @Operation(summary = "카카오 계정 변경", description = "사용자의 카카오 계정을 변경합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "카카오 계정 변경 성공",
                    content = @Content(schema = @Schema(implementation = KakaoChangeResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/kakao-change")
    public ResponseEntity<? super KakaoChangeResponseDto> kakaoChange(
            @RequestBody @Valid KakaoChangeRequestDto requestBody
    ){
        return userService.kakaoChange(requestBody);
    }

    @Operation(summary = "로그아웃", description = "사용자를 로그아웃 시킵니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그아웃 성공",
                    content = @Content(schema = @Schema(type = "string"))),
            @ApiResponse(responseCode = "400", description = "잘못된 토큰")
    })
    @PostMapping("/sign-out")
    public ResponseEntity<?> logout(
            @RequestHeader("Authorization") String authorizationHeader,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String accessToken = authorizationHeader.split(" ")[1];
        String refreshToken = null;

        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (accessToken != null && refreshToken != null) {
            userService.logout(accessToken, refreshToken, response);
            return ResponseEntity.ok("Logged out successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid token");
        }
    }

    @Operation(summary = "사용자 정보 조회", description = "사용자의 정보를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "사용자 정보 조회 성공",
                    content = @Content(schema = @Schema(implementation = UserInfoResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/info")
    public ResponseEntity<? super UserInfoResponseDto> userInfo(
            @RequestBody @Valid UserSeqRequestDto requestBody
    ) {
        return userService.userInfo(requestBody);
    }

    @Operation(summary = "비밀번호 변경", description = "사용자의 비밀번호를 변경합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "비밀번호 변경 성공",
                    content = @Content(schema = @Schema(implementation = VoidResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/chang-pwd")
    public ResponseEntity<? super VoidResponseDto> changePassword(
            @RequestBody @Valid PwdChangeRequestDto requestBody
    ) {
        return userService.changePwd(requestBody);
    }

    @Operation(summary = "알람 변경", description = "사용자의 알람 설정을 변경합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "알람 변경 성공",
                    content = @Content(schema = @Schema(implementation = VoidResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/change-alram")
    public ResponseEntity<? super VoidResponseDto> changeAlram(
            @RequestBody @Valid UserSeqRequestDto requestBody
    ) {
        return userService.changeAlram(requestBody);
    }



    @Operation(summary = "주소 설정", description = "사용자의 주소를 설정합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "주소 설정 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PutMapping("/setAddress")
    public ResponseEntity<?> setAddress(
            @RequestBody @Valid UserAddressRequestDto requestBody
    ) {
        userService.setAddress(requestBody);
        return ResponseEntity.noContent().build();
    }
}
