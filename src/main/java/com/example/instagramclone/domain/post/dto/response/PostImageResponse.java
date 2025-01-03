package com.example.instagramclone.domain.post.dto.response;

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
}