package com.example.instagramclone.domain.member.dto.response;

import com.example.instagramclone.domain.member.entity.Member;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MemberSearchResponse {

    private String username;        // 사용자 계정명
    private String name;           // 실제 이름
    private String profileImageUrl; // 프로필 이미지
    private List<String> commonFollowers;  // 함께 아는 친구들 (공통 팔로워)

    public static MemberSearchResponse of(
            Member member,
            List<String> commonFollowers
    ) {
        return MemberSearchResponse.builder()
                .username(member.getUsername())
                .name(member.getName())
                .profileImageUrl(member.getProfileImageUrl())
                .commonFollowers(commonFollowers)
                .build();
    }
}