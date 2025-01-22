package com.example.instagramclone.domain.follow.dto.response;

import com.example.instagramclone.domain.follow.entity.Follow;
import com.example.instagramclone.domain.member.entity.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import static com.example.instagramclone.domain.follow.dto.response.FollowStatus.*;

// 팔로워 팔로잉 목록용 DTO
@Getter
@Builder
@ToString
public class FollowResponse {

    private String username;
    private String name;
    private String profileImageUrl;
    private boolean following; // 현재 로그인한 사용자 기준 이 사람을 팔로우하는 여부

    public static FollowResponse of(Follow follow, boolean isFollowing, FollowStatus type) {
        if (type == FOLLOWER) {
            Member follower = follow.getFollowing();
            return FollowResponse.builder()
                    .username(follower.getUsername())
                    .name(follower.getName())
                    .profileImageUrl(follower.getProfileImageUrl())
                    .following(isFollowing)
                    .build();
        } else {
            Member following = follow.getFollower();
            return FollowResponse.builder()
                    .username(following.getUsername())
                    .name(following.getName())
                    .profileImageUrl(following.getProfileImageUrl())
                    .following(isFollowing)
                    .build();
        }

    }
}