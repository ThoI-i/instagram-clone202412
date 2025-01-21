
package com.example.instagramclone.controller.rest;

import com.example.instagramclone.domain.member.dto.response.MeResponse;
import com.example.instagramclone.domain.member.dto.response.ProfileHeaderResponse;
import com.example.instagramclone.domain.post.dto.response.ProfilePostResponse;
import com.example.instagramclone.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

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

    // 사용자 프로필 페이지 헤더 데이터를 전송하는 API
    @GetMapping("/{username}")
    public ResponseEntity<ProfileHeaderResponse> getProfileHeader(
            @PathVariable String username,
            @AuthenticationPrincipal String loginUsername
    ) {

        ProfileHeaderResponse responseData = profileService.getProfileHeader(username, loginUsername);

        return ResponseEntity.ok().body(responseData);
    }

    // 사용자 프로필 페이지 피드 목록 API
    @GetMapping("/{username}/posts")
    public ResponseEntity<List<ProfilePostResponse>> getProfilePosts(
            @PathVariable String username) {

        List<ProfilePostResponse> responseList = profileService.findProfilePosts(username);

        return ResponseEntity.ok().body(responseList);
    }

    // 프로필 사진 업로드 API
    @PutMapping("/profile-image")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal String username,
            @RequestParam MultipartFile profileImage
    ) {
        String imageUrl = profileService.updateProfileImage(profileImage, username);

        return ResponseEntity.ok().body(Map.of(
                "imageUrl", imageUrl,
                "message", "image upload success"
        ));
    }


}
