package com.took.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSockConfig implements WebSocketMessageBrokerConfigurer {

    // 메시지 브로커 구성 설정
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Simple Broker 활성화: 클라이언트에게 메시지를 전달하는 역할
        config.enableSimpleBroker("/sub");
        // 애플리케이션 목적지 프리픽스 설정: 클라이언트가 서버로 메시지를 보낼 때 사용하는 접두사
        config.setApplicationDestinationPrefixes("/pub");
    }

    // STOMP 엔드포인트 등록
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 웹소켓 엔드포인트 설정: 클라이언트가 웹소켓 서버에 연결할 때 사용하는 URL
        registry.addEndpoint("/ws")
                // 모든 출처 허용: CORS 문제를 방지하기 위해 모든 출처를 허용
                .setAllowedOriginPatterns("*")
                // SockJS 사용: SockJS는 WebSocket을 지원하지 않는 브라우저에서도 WebSocket과 유사한 기능을 제공
                .withSockJS();
    }
}