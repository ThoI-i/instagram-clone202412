package com.example.instagramclone.repository;

import com.example.instagramclone.domain.hashtag.dto.response.HashtagSearchResponse;
import com.example.instagramclone.domain.hashtag.entity.Hashtag;
import com.example.instagramclone.domain.hashtag.entity.PostHashtag;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface HashtagRepository {

    // 해시태그를 저장하는 기능
    void insertHashtag(Hashtag hashtag);

    // 피드와 해시태그를 연결저장하는 기능
    void insertPostHashtag(PostHashtag postHashtag);

    // 해시태그 하나를 단일조회하는 기능 - 앞으로 모든 단일조회는 Optional로 감싸세요
    Optional<Hashtag> findByName(String name);

    // 해시 태그 추천목록 조회
    List<HashtagSearchResponse> searchHashtagsByKeyword(String keyword);
}