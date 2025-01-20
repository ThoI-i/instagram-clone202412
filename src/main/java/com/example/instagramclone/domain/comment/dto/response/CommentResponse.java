package com.example.instagramclone.domain.comment.dto.response;

import com.example.instagramclone.domain.comment.entity.Comment;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CommentResponse {

    private Long id;
    private String content;
    private String username;        // 작성자 username
    private String userProfileImage;  // 작성자 프로필 이미지
    private LocalDateTime createdAt;

    public static CommentResponse from(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .username(comment.getMember().getUsername())
                .userProfileImage(comment.getMember().getProfileImageUrl())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}