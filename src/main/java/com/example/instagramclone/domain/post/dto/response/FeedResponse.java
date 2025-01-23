package com.example.instagramclone.domain.post.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class FeedResponse {

    private boolean hasNext; // 다음번에 가져올 피드가 있는지 여부
    private List<PostResponse> feedList; // 조회결과가 들어있는 피드목록

    public static FeedResponse of(List<PostResponse> feedList, boolean hasNext) {
        return FeedResponse.builder()
                .feedList(feedList)
                .hasNext(hasNext)
                .build();
    }
}