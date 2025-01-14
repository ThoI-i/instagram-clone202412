package com.example.instagramclone.domain.member.dto.response;

import com.example.instagramclone.domain.member.entity.Member;
import lombok.Builder;
import lombok.Getter;

// 인덱스 페이지의 우측상단 suggestions쪽 사용자 정보 렌더링 JSON
@Getter
@Builder
public class MeResponse {

    private String username;
    private String name;
    private String profileImageUrl;

    public static MeResponse from(Member member) {
        return MeResponse.builder()
                .username(member.getUsername())
                .name(member.getName())
                .profileImageUrl(member.getProfileImageUrl())
                .build();
    }
}