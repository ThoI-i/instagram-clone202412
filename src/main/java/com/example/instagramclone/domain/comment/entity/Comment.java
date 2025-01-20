package com.example.instagramclone.domain.comment.entity;

import com.example.instagramclone.domain.member.entity.Member;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Builder
public class Comment {

    private Long id;
    private Long postId;
    private Long memberId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 작성자 정보 매핑용  (댓글 조회시 사용)
    private Member member;

    // 댓글 생성 편의 메서드
    public static Comment of(Long postId, Long memberId, String content) {
        return Comment.builder()
                .postId(postId)
                .memberId(memberId)
                .content(content)
                .build();
    }

}