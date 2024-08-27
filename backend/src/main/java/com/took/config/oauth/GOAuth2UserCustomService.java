package com.took.config.oauth;

import com.took.user_api.entity.UserEntity;
import com.took.user_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@RequiredArgsConstructor
@Service
public class GOAuth2UserCustomService extends DefaultOAuth2UserService {

    private static final Logger logger = LoggerFactory.getLogger(GOAuth2UserCustomService.class);
    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User user = super.loadUser(userRequest); // 요청을 바탕으로 유저 정보를 담은 객체 반환
        logger.info("loadUser 메서드 호출됨: {}", user.getAttributes());
        saveOrUpdate(user);
        return user;
    }

    private UserEntity saveOrUpdate(OAuth2User oAuth2User) {
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String userId = (String) attributes.get("email");

        UserEntity user = userRepository.findByEmail(email)
                .map(entity -> entity.update(name))
                .orElseGet(() -> new UserEntity(email, "default_password", name,userId));

        return userRepository.save(user);
    }
}
