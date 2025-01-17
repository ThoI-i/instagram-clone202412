package com.example.instagramclone.repository;

import com.example.instagramclone.domain.like.entity.PostLike;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Optional;

@Mapper
public interface PostLikeRepository {

    // 좋아요 추가
    void insert(PostLike postLike);

    // 좋아요 삭제
    void delete(@Param("postId") Long postId, @Param("memberId") Long memberId);

    // 좋아요 여부 확인
    Optional<PostLike> findByPostIdAndMemberId(
            @Param("postId") Long postId,
            @Param("memberId") Long memberId
    );

    // 피드 게시물의 총 좋아요 수 조회
    long countByPostId(Long postId);
}