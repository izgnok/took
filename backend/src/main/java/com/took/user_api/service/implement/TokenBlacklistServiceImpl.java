package com.took.user_api.service.implement;


import com.took.user_api.service.TokenBlacklistService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class TokenBlacklistServiceImpl implements TokenBlacklistService {
    
    private static final String BLACKLIST_PREFIX = "blacklist:";

    private final StringRedisTemplate redisTemplate;

    @Value("${secret-key}")
    private String secretKey;

    @Override
    public void addToken(String token, long duration, TimeUnit unit) {
        redisTemplate.opsForValue().set(BLACKLIST_PREFIX+token,"true",duration,unit);
    }

    @Transactional
    @Override
    public boolean isTokenBlacklisted(String token) {
        return redisTemplate.hasKey(BLACKLIST_PREFIX+token);
    }

    @Transactional
    @Override
    public long getExpiryFromToken(String Token) {
        
        try{
            Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
            Claims claims = Jwts.parserBuilder()
                            .setSigningKey(key)
                            .build()
                            .parseClaimsJws(Token)
                            .getBody();
            Date expiration = claims.getExpiration();
            return expiration.getTime() - System.currentTimeMillis();
        }catch(SignatureException e){
            throw new RuntimeException("토큰 서명 검증 실패");
        }catch(Exception e){
            throw new RuntimeException("토큰 파싱 실패!");
        }

    }
    
    
}
