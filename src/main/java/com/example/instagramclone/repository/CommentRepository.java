package com.example.instagramclone.repository;

import com.example.instagramclone.domain.comment.entity.Comment;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface CommentRepository {

    // 댓글 생성
    void insert(Comment comment);

    // 특정 피드 게시물에 달린 댓글 목록 조회
    List<Comment> findByPostId(Long postId);

    // 단일 댓글 조회 (댓글 작성시 실시간렌더링)
    Optional<Comment> findById(Long id);

    // 특정 피드에 달린 댓글 수 조회
    long countByPostId(Long postId);

}