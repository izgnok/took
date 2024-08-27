package com.took.fcm_api.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Getter
@ToString
@Builder
@RedisHash("FCMToken")
@NoArgsConstructor
@AllArgsConstructor
public class FCMToken {
    @Id
    private String userSeq;  // Redis에서 사용할 Primary Key로 지정된 필드

    private String token;
}
