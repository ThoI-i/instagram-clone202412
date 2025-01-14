package com.example.instagramclone.domain.post.entity;

import com.example.instagramclone.domain.member.entity.Member;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {
    private Long id;
    private String content;
    private Long memberId;  // 이 피드를 쓴 사용자의 ID
    private int viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<PostImage> images;
    // 회원 객체 포함
    private Member member;
}