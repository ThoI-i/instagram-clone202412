package com.example.instagramclone.domain.post.dto.response;

import lombok.*;

// 프로필페이지에 3열 피드 레이아웃 렌더링을 위한 데이터
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfilePostResponse {

    private Long id; // 피드 상세보기를 위한 id값
    private String mainThumbnail; // 피드 대표 이미지
    private long likeCount; // 좋아요 수
    private long commentCount; // 댓글 수
}