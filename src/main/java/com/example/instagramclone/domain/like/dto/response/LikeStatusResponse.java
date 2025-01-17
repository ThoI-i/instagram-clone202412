package com.example.instagramclone.domain.like.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LikeStatusResponse {

    private boolean liked; // 좋아요 여부 true : 좋아요 누른거, false: 취소한거
    private long likeCount; // 해당 피드의 총 좋아요 수

    public static LikeStatusResponse of(boolean liked, long likeCount) {
        return LikeStatusResponse.builder()
                .liked(liked)
                .likeCount(likeCount)
                .build();
    }
}