package com.example.instagramclone.service;

import com.example.instagramclone.domain.comment.dto.response.CommentResponse;
import com.example.instagramclone.domain.comment.entity.Comment;
import com.example.instagramclone.domain.member.entity.Member;
import com.example.instagramclone.repository.CommentRepository;
import com.example.instagramclone.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final MemberRepository memberRepository;

    // 댓글 작성 처리
    public Map<String, Object> createComment(Long postId, String username, String content) {

        Member foundMember = memberRepository.findByUsername(username)
                .orElseThrow();

        // 새로 작성할 댓글 엔터티 객체
        Comment newComment = Comment.of(
                postId,
                foundMember.getId(),
                content
        );

        commentRepository.insert(newComment);

        // 댓글 작성 시 응답해야할 데이터
        // 방금 생성된 댓글정보(사용자 정보 포함), 이 피드에 달린 댓글의 총 개수
        Comment foundComment = commentRepository.findById(newComment.getId()).orElseThrow();

        return Map.of(
            "comment", CommentResponse.from(foundComment),
                "commentCount", commentRepository.countByPostId(postId)
        );
    }


}