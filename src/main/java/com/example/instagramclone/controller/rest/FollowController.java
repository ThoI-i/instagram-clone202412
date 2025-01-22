package com.example.instagramclone.controller.rest;

import com.example.instagramclone.domain.follow.dto.response.FollowResponse;
import com.example.instagramclone.service.FollowService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static com.example.instagramclone.domain.follow.dto.response.FollowStatus.FOLLOWER;
import static com.example.instagramclone.domain.follow.dto.response.FollowStatus.FOLLOWING;

@RestController
@RequestMapping("/api/follows")
@Slf4j
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    // 팔로우 / 언팔로우 토글 API
    @PostMapping("/{followerName}")
    public ResponseEntity<?> toggleFollow(
            @PathVariable String followerName
            , @AuthenticationPrincipal String followingName
    ) {

        log.info("{} toggled follow status for {}", followingName, followerName);

        Map<String, Object> responseMap = followService.toggleFollow(followingName, followerName);

        return ResponseEntity.ok().body(responseMap);
    }

    // 팔로워 리스트 조회 API
    @GetMapping("/{targetUsername}/followers")
    public ResponseEntity<?> getFollowers(
            @PathVariable String targetUsername
            , @AuthenticationPrincipal String loginUsername
    ) {
        List<FollowResponse> followers
                = followService.getFollows(targetUsername, loginUsername, FOLLOWER);

        return ResponseEntity.ok().body(followers);
    }

    // 팔로잉 리스트 조회 API
    @GetMapping("/{targetUsername}/followings")
    public ResponseEntity<?> getFollowings(
            @PathVariable String targetUsername
            , @AuthenticationPrincipal String loginUsername
    ) {
        List<FollowResponse> followings
                = followService.getFollows(targetUsername, loginUsername, FOLLOWING);

        return ResponseEntity.ok().body(followings);
    }

}