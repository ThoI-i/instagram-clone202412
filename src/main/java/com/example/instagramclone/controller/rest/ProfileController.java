package com.example.instagramclone.controller.rest;

import com.example.instagramclone.domain.member.dto.response.MeResponse;
import com.example.instagramclone.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profiles")
@Slf4j
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    // 로그인한 유저의 프로필 정보를 갖다주는 API
    @GetMapping("/me")
    public ResponseEntity<MeResponse> getCurrentUser(
            @AuthenticationPrincipal String username
    ) {

        MeResponse responseDto = profileService.getLoggedInUser(username);

        return ResponseEntity.ok().body(responseDto);
    }
}