package com.example.instagramclone.domain.post.dto.response;

import com.example.instagramclone.domain.post.entity.Post;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/*
    {
        "feed_id": 27,
        "content" : "ddfsadfa",
        "writer" : "dsfasdf",
        "images" : [
            {
                "image_id": 32,
                "imageUrl": "/uploads/dfajsdkfs-dsfjaksdfsafsfa-fdsafd.jpg",
                "imageOrder": 1
            },
            {
                "image_id": 33,
                "imageUrl": "/uploads/dfajsdkfs-dsfjaksdfsafsfa-fdsafd.jpg",
                "imageOrder": 2
            }
        ]
    }
 */
@Getter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostResponse {

    @JsonProperty("feed_id")
    private Long id;
    private String content;
    private String username;
    private String profileImageUrl;
    private List<PostImageResponse> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PostResponse from(Post feed) {
        return PostResponse.builder()
                .id(feed.getId())
                .content(feed.getContent())
                .username(feed.getMember().getUsername())
                .profileImageUrl(feed.getMember().getProfileImageUrl())
                .images(
                        feed.getImages()
                                .stream()
                                .map(PostImageResponse::from)
                                .collect(Collectors.toList())
                )
                .createdAt(feed.getCreatedAt())
                .updatedAt(feed.getUpdatedAt())
                .build();
    }
}