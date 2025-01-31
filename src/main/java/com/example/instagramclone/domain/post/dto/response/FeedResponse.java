package com.example.instagramclone.domain.post.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class FeedResponse<T> {

    private boolean hasNext; // 다음번에 가져올 피드가 있는지 여부
    private List<T> feedList; // 조회결과가 들어있는 피드목록

    public static <T> FeedResponse<T> of(List<T> feedList, boolean hasNext) {
        return new FeedResponse<>(hasNext, feedList);
    }
}