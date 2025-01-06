package com.example.instagramclone.repository;

import com.example.instagramclone.domain.hashtag.entity.Hashtag;
import com.example.instagramclone.domain.hashtag.entity.PostHashtag;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface HashtagRepository {

    // 해시태그를 저장하는 기능
    void insertHashtag(Hashtag hashtag);

    // 피드와 해시태그를 연결저장하는 기능
    void insertPostHashtag(PostHashtag postHashtag);

    // 해시태그 하나를 단일조회하는 기능
    Hashtag findByName(String name);
}