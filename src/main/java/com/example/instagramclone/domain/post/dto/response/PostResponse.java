package com.example.instagramclone.domain.post.dto.response;

import com.example.instagramclone.domain.post.entity.PostImage;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

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
    private String writer;
    private List<PostImageResponse> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}