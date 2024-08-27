package com.took.sms_api.entity;


import lombok.*;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;
import org.springframework.data.redis.core.index.Indexed;
import org.springframework.data.annotation.Id;



@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RedisHash("Identity")
public class Identity {

    @Id
    private String phoneNumber;

    private int code;

    @TimeToLive
    private Long expiration; // 유효 기간을 초 단위로 설정
}


