package com.took.filter;


import com.took.provider.JwtProvider;
import com.took.user_api.entity.UserEntity;
import com.took.user_api.repository.UserRepository;
import com.took.user_api.service.TokenBlacklistService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


// 이 필터에서 Jwtprovidder을 사용해 준다.
@Component
@RequiredArgsConstructor  // 필수 요소에 대한 생성자 생성 | 필터로 만들기 위해서는 해당 필터를 상속하여 메서드를 재정의 해주어야한다.
public class JwtAuthenticationFilter extends OncePerRequestFilter{

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;
    private final TokenBlacklistService tokenBlacklistService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {


        // 특정 경로에 대해 필터를 무시합니다.
        String path = request.getRequestURI();
        if (path.startsWith("/api/fcm/")) {
            filterChain.doFilter(request, response);
            return;
        }

//        System.out.println("필터에 진입합니다.");
//        System.out.println("요청 path 출력: " + request.getRequestURI());
//        System.out.println("요청의 인증 방법을 출력합니다: " + request.getAuthType());
//        System.out.println("요청의 전송 방법을 출력합니다: " + request.getMethod());

        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer")) {
//            System.out.println("헤더가 없습니다. 다음으로 넘어갑니다.");
//            System.out.println("request: " + request.getRequestURI() + " response: " + response);
            filterChain.doFilter(request, response);
//            System.out.println("필터 체인 이후 로깅 추가 - 헤더 없음");
            return;
        }

        String token = header.substring(7);
//        System.out.println("토큰: " + token);


        if (tokenBlacklistService.isTokenBlacklisted(token)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "중복된 토큰입니다.");
            return;
        }

//        System.out.println("블랙박스를 빠져 나옵니다.");

        try {
            token = parseVearerToken(request);
            if (token == null) {
//                System.out.println("토큰이 없기에 넘어갑니다.");
                filterChain.doFilter(request, response);
//                System.out.println("필터 체인 이후 로깅 추가 - 토큰 없음");
                return;
            }

            String userId = jwtProvider.validate(token);
//            System.out.println("유효한 사용자 ID: " + userId);

            if (userId == null) {
                filterChain.doFilter(request, response);
//                System.out.println("필터 체인 이후 로깅 추가 - 유효하지 않은 사용자 ID");
                return;
            }

            UserEntity userEntity = userRepository.findByUserId(userId);
            String role = userEntity.getRole();

            List<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority(role));

            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            AbstractAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(userId, null, authorities);
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            securityContext.setAuthentication(authenticationToken);
            SecurityContextHolder.setContext(securityContext);

        } catch (Exception exception) {
//            System.out.println("필터에서 에러를 출력합니다.");
            exception.printStackTrace();
        }

        filterChain.doFilter(request, response);
//        System.out.println("필터 체인 이후 로깅 추가 - 정상 처리");
    }



//    request로 부터 bear token 값을 가져와 줘야 한다.
//    jwtpriver의 validation을 통해 검사해줘야한다.
    

    private String parseVearerToken(HttpServletRequest request){

        String authorization = request.getHeader("Authorization");
        boolean hasAuhorization = StringUtils.hasText(authorization);

        if(!hasAuhorization) return null;

        boolean isBearer = authorization.startsWith("Bearer");

        if(!isBearer) return null;

        String token = authorization.substring(7);

        return token;
    }
}