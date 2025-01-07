package com.example.instagramclone.domain.hashtag.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
public class HashtagSearchResponse {
    private String hashtag;
    private int feedCount;
}