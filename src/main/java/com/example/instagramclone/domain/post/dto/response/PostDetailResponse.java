
package com.example.instagramclone.domain.post.dto.response;

import com.example.instagramclone.domain.comment.dto.response.CommentResponse;
import com.example.instagramclone.domain.like.dto.response.LikeStatusResponse;
import com.example.instagramclone.domain.member.dto.response.MeResponse;
import com.example.instagramclone.domain.post.entity.Post;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter @Setter @ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDetailResponse {

    private Long postId;  // 피드 ID
    private String content; // 피드 내용
    private LocalDateTime createdAt; // 피드 작성 시간

    // 회원 사용자이름, 프사
    private MeResponse user;

    // 피드 이미지 목록
    private List<PostImageResponse> images;

    // 좋아요 상태
    private LikeStatusResponse likeStatus;

    // 댓글 목록
    private List<CommentResponse> comments;

    public static PostDetailResponse of(Post post, LikeStatusResponse likeStatus, List<CommentResponse> comments) {

//        List<PostImage> imageEntities = post.getImages();
//        List<PostImageResponse> imageResponses = new ArrayList<>();
//
//        for (PostImage imageEntity : imageEntities) {
//            PostImageResponse dto = PostImageResponse.from(imageEntity);
//            imageResponses.add(dto);
//        }

        return PostDetailResponse.builder()
                .postId(post.getId())
                .content(post.getContent())
                .createdAt(post.getCreatedAt())
                .user(MeResponse.from(post.getMember()))
//                .images(imageResponses)
                .images(post.getImages().stream()
                        .map(PostImageResponse::from)
                        .collect(Collectors.toList()))
                .likeStatus(likeStatus)
                .comments(comments)
                .build();
    }
}
