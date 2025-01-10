package com.example.instagramclone.jwt;


import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

// 인증을 위한 토큰을 생성하여 발급하고
// 전송된 토큰의 위조 및 만료시간을 검사하는 역할
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final JwtProperties jwtProperties;

    // 비밀키를 생성
    private SecretKey key;

    @PostConstruct
    public void init() {
        // Base64로 인코딩된 key를 디코딩 후, HMAC-SHA 알고리즘으로 다시 암호화
        this.key = Keys.hmacShaKeyFor(
                Decoders.BASE64.decode(jwtProperties.getSecretKey())
        );
    }

    // 토큰 발급 로직
    // 액세스 토큰 생성 (사용자가 들고다닐 신분증) : 유효기간이 짧다.
    public String createAccessToken(String username) {
        return createToken(username, jwtProperties.getAccessTokenValidityTime());
    }

    // 리프레시 토큰 생성 (서버가 보관할 신분증을 재발급하기위한 정보) : 유효기간이 비교적 김
    public String createRefreshToken(String username) {
        return createToken(username, jwtProperties.getRefreshTokenValidityTime());
    }

    // 공통 토큰 생성 로직
    private String createToken(String username, long validityTime) {

        // 현재 시간
        Date now = new Date();

        // 만료시간
        Date validity = new Date(now.getTime() + validityTime);

        return Jwts.builder()
                .setIssuer("Instagram clone")  // 발급자 정보
                .setIssuedAt(now) // 발급시간
                .setExpiration(validity) // 만료시간
                .setSubject(username) // 이 토큰을 구별할 유일한 값
                .compact();
    }
}