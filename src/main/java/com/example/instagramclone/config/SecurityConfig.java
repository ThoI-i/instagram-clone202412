package com.example.instagramclone.config;

import com.example.instagramclone.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity  // 커스텀 시큐리티 설정파일이라는 의미
@RequiredArgsConstructor
public class SecurityConfig {

    // 커스텀 필터 의존
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // 시큐리티 필터체인 빈을 등록
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // 커스텀 보안 설정
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configure(http))
                // 세션 인증을 비활성화
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // 인가 설정
                .authorizeHttpRequests(auth ->
                        auth
                                // '/api/auth'로 시작하는 요청은 인증을 필요로 하지 않음
                                .requestMatchers("/api/auth/**").permitAll()
                                // '/api'로 시작하는 요청은 모두 인증을 필수로 적용
                                .requestMatchers("/api/**").authenticated()
                                // 기타 등등 나머지(jsp, css, js, image...)는 모두 허용
                                .anyRequest().permitAll()
                )
                // 토큰을 검사하는 커스텀 인증필터를 시큐리티에 등록
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                // 시큐리티 기본 인증인가차단의 상태코드는 403으로 지정되어 있음
                // 그런데 403은 인가차단이지 인증차단코드가 아님, 인증차단은 401로 해야 적합함
                .exceptionHandling(ex ->
                        ex.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                )

        ;

        return http.build();
    }
}