package com.example.instagramclone.domain.post.entity;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostImage {
    private Long id;
    private Long postId;
    private String imageUrl;
    private int imageOrder;
    private LocalDateTime createdAt;
}