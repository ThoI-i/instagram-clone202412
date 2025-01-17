package com.example.instagramclone.domain.like.entity;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostLike {

    private Long id;
    private Long postId;
    private Long memberId;
    private LocalDateTime createdAt;

    // 좋아요를 생성할 때 사용할 편의 메서드
    public static PostLike of(Long postId, Long memberId) {
        return PostLike.builder()
                .postId(postId)
                .memberId(memberId)
                .build();
    }
}