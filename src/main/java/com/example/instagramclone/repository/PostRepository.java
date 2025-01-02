package com.example.instagramclone.repository;

import com.example.instagramclone.domain.post.entity.Post;
import com.example.instagramclone.domain.post.entity.PostImage;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PostRepository {

    // 피드 게시물 저장
    void saveFeed(Post post);

    // 피드 이미지 저장
    void saveFeedImage(PostImage postImage);

    // 특정 피드에 첨부된 이미지 목록 조회
    List<PostImage> findImagesByPostId(Long postId);

    // 전체 피드 게시물 목록 조회
    List<Post> findAll();
}