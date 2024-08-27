package com.took.sms_api.service;

import com.took.sms_api.entity.Identity;
import com.took.sms_api.repository.IdentityRepository;
import com.took.util.ApiUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.security.SecureRandom;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class SmsService {

    private final IdentityRepository identityRepository;

    /**
     * 6자리의 랜덤 인증 코드를 생성합니다.
     *
     * @return 6자리 인증 코드
     */
    public int generateVerificationCode() {
        SecureRandom random = new SecureRandom();
        return 100000 + random.nextInt(900000); // 100000부터 999999 사이의 랜덤 숫자를 생성합니다.
    }


    /**
     * 주어진 전화번호로 인증 코드를 SMS로 전송합니다.
     *
     * @param phoneNumber      SMS를 받을 전화번호
     * @param verificationCode 전송할 인증 코드
     */
    public void sendSms(String phoneNumber, int verificationCode) {
        // CoolSMS API URL
        String url = "https://api.coolsms.co.kr/messages/v4/send";
        // 요청 본문 생성
        String body = String.format("{\"message\":{\"to\":\"%s\",\"from\":\"01087245334\",\"text\":\"휴대폰 인증 (%s)\"}}", phoneNumber, verificationCode);

        try {
            // 시그니처 생성
            String signatureHeader = ApiUtil.generateSignature();

            // HttpHeaders 생성 및 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON); // 요청의 Content-Type을 JSON으로 설정
            headers.set("Authorization", signatureHeader); // Authorization 헤더에 시그니처 추가

            // HttpEntity 생성
            HttpEntity<String> entity = new HttpEntity<>(body, headers);

            // RestTemplate을 사용하여 POST 요청을 보내고 응답을 받음
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            // 응답 상태 코드가 OK가 아닌 경우 예외 발생
            if (response.getStatusCode() != HttpStatus.OK) {
                throw new RuntimeException("SMS 전송 실패: " + response.getStatusCode());
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("SMS 전송 중 오류 발생", e);
        }
    }

    /**
     * 전화번호에 해당하는 사용자 정보(Identity)를 생성하거나 업데이트합니다.
     * 생성한 후 SMS로 인증 코드를 전송합니다.
     *
     * @param phoneNumber 사용자 전화번호
     */
    public void createOrUpdateIdentity(String phoneNumber) {
        int code = generateVerificationCode(); // 인증 코드 생성
        Long expiration = 180L; // 유효 기간을 3분(180초)으로 설정

        // 새로운 Identity 객체 생성 및 저장
        Identity identity = Identity.builder()
                .phoneNumber(phoneNumber)
                .code(code)
                .expiration(expiration)
                .build();
        identityRepository.save(identity);

        sendSms(phoneNumber, code); // SMS 전송
    }

    /**
     * 사용자로부터 입력 받은 인증 코드가 저장된 코드와 일치하는지 확인합니다.
     *
     * @param phoneNumber 사용자 전화번호
     * @param code        사용자 입력 인증 코드
     * @return 인증 코드가 일치하면 true, 일치하지 않으면 false
     */
    public boolean verifyCode(String phoneNumber, int code) {
        Optional<Identity> identityOpt = identityRepository.findById(phoneNumber); // 전화번호로 Identity 조회
        if (identityOpt.isPresent()) {
            Identity identity = identityOpt.get();
            if(identity.getCode() == code) {
                identityRepository.delete(identity);
                return true;
            }
        }
        return false; // Identity가 없으면 false 반환
    }
}
