package com.took.user_api.service;


import com.took.user_api.dto.request.user.*;
import com.took.user_api.dto.response.VoidResponseDto;
import com.took.user_api.dto.response.user.KakaoChangeResponseDto;
import com.took.user_api.dto.response.user.UserInfoResponseDto;
import com.took.user_api.entity.UserEntity;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserService {
    ResponseEntity<? super KakaoChangeResponseDto> kakaoChange(KakaoChangeRequestDto dto);
    void logout(String accessToken,String refreshToken,HttpServletResponse response);
    ResponseEntity<? super UserInfoResponseDto> userInfo(UserSeqRequestDto requestBody);
    List<Long> searchNearUser(Long userSeq, double lat, double lon);
    ResponseEntity<? super VoidResponseDto> changePwd(PwdChangeRequestDto requestBody);
    ResponseEntity<? super VoidResponseDto> changeAlram(UserSeqRequestDto requestBody);
//  Google Oauth 인증 때문에 만듬.
    UserEntity findByEmail(String email);
    
    // 주소 설정
    void setAddress(UserAddressRequestDto requestBody);
}
