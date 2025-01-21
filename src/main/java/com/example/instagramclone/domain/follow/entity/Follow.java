package com.example.instagramclone.domain.follow.entity;

import com.example.instagramclone.domain.member.entity.Member;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Follow {

    private Long id;
    private Long followerId; // 팔로우를 받는 사용자
    private Long followingId; // 팔로우를 건 사용자
    private LocalDateTime createdAt;

    // 회원정보 매핑용
    private Member follower; // 팔로우를 받은 사람 정보 조회시 사용
    private Member following; // 팔로우를 건 사람 정보 조회시 사용
}