package com.example.instagramclone.domain.post.dto.response;

import com.example.instagramclone.domain.post.entity.PostImage;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostImageResponse {

    @JsonProperty("image_id")
    private Long id;
    private String imageUrl;
    private int imageOrder;

    // 엔터티를 주면 dto로변환하는 정적 팩토리 메서드
    public static PostImageResponse from(PostImage postImage) {
        return PostImageResponse.builder()
                .id(postImage.getId())
                .imageUrl(postImage.getImageUrl())
                .imageOrder(postImage.getImageOrder())
                .build();
    }
}