package com.example.instagramclone.domain.member.dto.response;

import com.example.instagramclone.domain.follow.dto.response.FollowStatusResponse;
import com.example.instagramclone.domain.member.entity.Member;
import lombok.Builder;
import lombok.Getter;

/*
    프로필 페이지 상단에 렌더링할 데이터들을 JSON으로 변환하는 클래스
    ( 프로필 사진, 사용자 이름, 이름, 피드 게시물 수 )
 */
@Getter
@Builder
public class ProfileHeaderResponse {

    private String profileImageUrl;
    private String username;
    private String name;
    private long feedCount;  // 총 피드 게시물 수
    private FollowStatusResponse followStatus; // 팔로우 관련 정보

    // 정적 팩토리 메서드
    public static ProfileHeaderResponse of(Member member, long feedCount, FollowStatusResponse followStatus) {
        return ProfileHeaderResponse.builder()
                .profileImageUrl(member.getProfileImageUrl())
                .username(member.getUsername())
                .name(member.getName())
                .feedCount(feedCount)
                .followStatus(followStatus)
                .build();
    }
}