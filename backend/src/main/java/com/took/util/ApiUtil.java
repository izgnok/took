package com.took.util;

import lombok.Getter;
import org.apache.commons.codec.binary.Hex;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.UUID;

@Component
public class ApiUtil {

    @Getter
    private static String kakaoApiKey;

    private static String smsApiKey;
    private static String smsApiSecret;

    @Value("${kakao.api.key}")
    private String propertyKakaoApiKey;

    @Value("${sms.api.key}")
    private String propertySmsApiKey;

    @Value("${sms.api.secret}")
    private String propertySmsApiSecret;

    @PostConstruct
    private void init() {
        kakaoApiKey = propertyKakaoApiKey;
        smsApiKey = propertySmsApiKey;
        smsApiSecret = propertySmsApiSecret;
    }

    public static String generateSignature() throws Exception {
        String salt = UUID.randomUUID().toString().replaceAll("-", "");
        String date = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toString().split("\\[")[0];

        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(smsApiSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256_HMAC.init(secret_key);
        String signature = new String(Hex.encodeHex(sha256_HMAC.doFinal((date + salt).getBytes(StandardCharsets.UTF_8))));
        return "HMAC-SHA256 ApiKey=" + smsApiKey + ", Date=" + date + ", salt=" + salt + ", signature=" + signature;
    }
}
