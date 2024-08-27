package com.took.config;

import com.took.filter.JwtAuthenticationFilter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;

@Configurable
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    protected CorsConfigurationSource configurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("https://i11e205.p.ssafy.io");
        configuration.addAllowedOrigin("http://localhost:5174");
        configuration.addAllowedOrigin("http://localhost:5173");
        configuration.addAllowedMethod("GET");    // GET 메서드 허용
        configuration.addAllowedMethod("POST");   // POST 메서드 허용
        configuration.addAllowedMethod("PUT");    // PUT 메서드 허용
        configuration.addAllowedMethod("DELETE"); // DELETE 메서드 허용
        configuration.addAllowedMethod("PATCH");  // PATCH 메서드 허용
        configuration.addAllowedHeader("*");      // 넘어오는 헤더
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    protected SecurityFilterChain configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .cors(cors -> cors.configurationSource(configurationSource()))
                .csrf(CsrfConfigurer::disable)
                .httpBasic(HttpBasicConfigurer::disable)
                .sessionManagement(sessionManagement -> sessionManagement
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                        .maximumSessions(1)
                        .sessionRegistry(sessionRegistry()))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/", "/login", "/signup").permitAll()
                        .requestMatchers("/api/fcm/**").permitAll()
                )
                .authorizeHttpRequests(request -> request
                        .requestMatchers("/", "/api/auth/**", "/api/oauth2/**").permitAll()
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/api/user/**").hasRole("USER")
                        .requestMatchers("/api/account/**").hasRole("USER")
                        .requestMatchers("/api/pay/**").hasRole("USER")
                        .requestMatchers("/api/chat/**").hasRole("USER")
                        .requestMatchers("/api/delivery/**").hasRole("USER")
                        .requestMatchers("/api/noti/**").hasRole("USER")
                        .requestMatchers("/api/position/**").hasRole("USER")
                        .requestMatchers("/api/purchase/**").hasRole("USER")
                        .requestMatchers("/api/ship/**").hasRole("USER")
                        .requestMatchers("/api/shops/**").hasRole("USER")
                        .requestMatchers("/api/sms/**").hasRole("USER")
                        .requestMatchers("/api/navi/**").hasRole("USER")
                        .requestMatchers("/api/taxi/**").hasRole("USER")

                        .anyRequest().authenticated())
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint(new FailedAuthenticationEntryPoint()))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }

    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }
}

class FailedAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.getWriter().write("{\"code\" : \"NP\" , \"message\" : \"No Permission.\"}");
    }
}
