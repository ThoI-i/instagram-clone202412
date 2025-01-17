package com.example.instagramclone.controller.rest;

import com.example.instagramclone.domain.like.dto.response.LikeStatusResponse;
import com.example.instagramclone.service.PostLikeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Slf4j
public class PostLikeController {

    private final PostLikeService postLikeService;

    // 좋아요 토글 API
    @PostMapping("/{postId}/likes")
    public ResponseEntity<?> toggleLike(
            @PathVariable Long postId,
            @AuthenticationPrincipal String username
    ) {
        // 좋아요 토글 수행
        LikeStatusResponse likeStatusResponse = postLikeService.toggleLike(postId, username);

        return ResponseEntity.ok().body(likeStatusResponse);
    }
}