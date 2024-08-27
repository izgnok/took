package com.took.user_api.entity;

import com.took.user_api.dto.request.auth.SignUpRequestDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;


@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "user")
@Table(name = "user")
@ToString
public class UserEntity {
  
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userSeq; // 시퀀스를 위한 필드

    @Column(nullable = true, length = 30, unique = true)
    private String userId;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = true, length = 30)
    private String userName;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(nullable = true, length = 20)
    private String phoneNumber;

    @Column(nullable = false, length = 20)
    private String birth;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private LoginStatus loginStatus;

    @Column(nullable = false)
    private Boolean alarm = false;

    @Column(length = 100)
    private String addr;

    @Column
    private Double lat;

    @Column
    private Double lon;

    @Column(nullable = false)
    private Integer imageNo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true, length = 10)
    private Gender gender;

    private Integer simplePassword;

    @Column(nullable = false, length = 10)
    private String role;

    @Column(name="nickname")
    private String nickname;

    public UserEntity(SignUpRequestDto dto) {
        this.userId = dto.getUserId();
        this.password = dto.getPassword();
        this.gender = dto.getGender();
        this.email = dto.getEmail();
        this.userName = dto.getUserName(); // SignUpRequestDto에 userName이 추가되어야 합니다.
        this.phoneNumber = dto.getPhoneNumber(); // SignUpRequestDto에 phoneNumber가 추가되어야 합니다.
        this.birth = dto.getBirth(); // SignUpRequestDto에 birth가 추가되어야 합니다.
        this.createdAt = LocalDateTime.now();
        this.loginStatus = LoginStatus.TOOK; // 기본값 설정
        this.role = "ROLE_USER";
        this.imageNo = (int)(Math.random() * 23) + 1;
        this.alarm = true;
    }

    public UserEntity(String email, String password, String nickname,String userId) {
        this.userId = userId;
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.birth = "20000101"; // 기본값 설정
        this.createdAt = LocalDateTime.now();
        this.loginStatus = LoginStatus.GOOGLE;
        this.role = "ROLE_USER";
        this.imageNo = (int)(Math.random() * 23) + 1;
    }

    public UserEntity(String userId, String email) {
        this.userId = userId;
        this.password = "kakao_oauth_password";
        this.email = email;
        this.userName = ""; // 기본값 설정
        this.phoneNumber = ""; // 기본값 설정
        this.birth = "20000101"; // 기본값 설정
        this.createdAt = LocalDateTime.now();
        this.loginStatus = LoginStatus.KAKAO;
        this.role = "ROLE_USER";
        this.imageNo = (int)(Math.random() * 23) + 1;
    }

    public UserEntity(Double lat,Double lon){
        this.lat = lat;
        this.lon = lon;
    }

    public UserEntity update(String nickname){
        this.nickname = nickname;
        return this;
    }

    public enum LoginStatus {
        KAKAO, TOOK, GOOGLE
    }

    public enum Gender{
      M,F
    }


    public void setAddress(String addr, Double lat, Double lon){
        this.addr = addr;
        this.lat = lat;
        this.lon = lon;
    }
}