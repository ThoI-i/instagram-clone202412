package com.example.instagramclone.jwt;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter @Setter
@Configuration
@ConfigurationProperties(prefix = "jwt")
// application.yml에서 jwt관련 프로퍼티 값을 읽어오는 클래스
public class JwtProperties {

//    @Value("${jwt.secret-key}")
    private String secretKey;
//    @Value("${jwt.access-token-validity-time}")
    private long accessTokenValidityTime;
//    @Value("${jwt.refresh-token-validity-time}")
    private long refreshTokenValidityTime;
}
