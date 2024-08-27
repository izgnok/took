package com.took.positionsave_api.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

@Getter
@ToString
@Builder
@RedisHash("Position")
@NoArgsConstructor
@AllArgsConstructor
public class Position {

    @Id
    private String userSeq;  // Redis에서 사용할 Primary Key로 지정된 필드

    private double lat;     // 위치의 위도 정보를 저장하는 필드
    private double lon;     // 위치의 경도 정보를 저장하는 필드

    @TimeToLive
    private Long expiration; // TTL 값을 동적으로 설정
}