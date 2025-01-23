package com.example.instagramclone.domain.member.dto.response;

import com.example.instagramclone.domain.member.entity.Member;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SuggestedMemberResponse {

    private String username;            // 사용자명
    private String name;               // 실명
    private String profileImageUrl;    // 프로필 이미지
    private String suggestionReason;   // 추천 이유

    public static SuggestedMemberResponse of(
            Member member,
            String suggestionReason
    ) {
        return SuggestedMemberResponse.builder()
                .username(member.getUsername())
                .name(member.getName())
                .profileImageUrl(member.getProfileImageUrl())
                .suggestionReason(suggestionReason)
                .build();
    }
}