package com.example.instagramclone.domain.follow.dto.response;

import lombok.Builder;
import lombok.Getter;

// 팔로우 관련 상태 정보
@Getter
@Builder
public class FollowStatusResponse {

    private boolean following; // 팔로잉 여부
    private long followerCount; // 팔로워 수
    private long followingCount; // 팔로잉 수

    public static FollowStatusResponse of(boolean following, long followerCount, long followingCount) {
        return FollowStatusResponse.builder()
                .following(following)
                .followerCount(followerCount)
                .followingCount(followingCount)
                .build();
    }
}