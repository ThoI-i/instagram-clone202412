package com.example.instagramclone.domain.hashtag.entity;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostHashtag {
    private Long id;
    private Long postId;
    private Long hashtagId;
    private LocalDateTime createdAt;
}