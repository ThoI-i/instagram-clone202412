// controller/RouteController.java
package com.example.instagramclone.controller.routes;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@Slf4j
public class RouteController {

    /*
        로그인 여부에 따라 다른 페이지를 라우팅해야 함
        어떻게 로그인 여부를 알 수 있을지... -> 시큐리티에게서 알아와야 함
     */
    @GetMapping("/")
    public String index(
            // 시큐리티에 저장된 인증정보를 가져옴
            @AuthenticationPrincipal String username
    ) {
        log.info("메인페이지에서 인증된 사용자명: {}", username);
        if (username.equals("anonymousUser")) {
            return "auth/login";
        }
        return "index";  // 나중에 로그인 후 복귀할 때 주석해제
    }

    // 회원가입 페이지 열기
    @GetMapping("/signup")
    public String signUp() {
        return "auth/signup";
    }

    // 프로필 페이지 열기
    @GetMapping("/{username}")
    public String profilePage() {
        return "components/profile-page";
    }

}